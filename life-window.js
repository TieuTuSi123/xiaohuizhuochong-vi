import {JOBS, FOODS, WELFARE, FLOWER_EXCHANGE_RATE} from './life-model.js';
import {FOOD_CARE} from './care-model.js';
import {DEFAULT_SKIN} from './skin-model.js';
import {createSheet, leave} from './sheet.js';
import {icon} from './icons.js';

// 生活手帐：家里的钱包所有角色共用，打工、吃饭和换装按角色各算各的。
// skins 是 index.js 给的换装桥（list / equippedId / buy / equip，见 skin-model.js）；skinArt(角色, 皮肤, 姿势) 取某一套皮肤的图做预览。
export function createLifeWindow(host, {model, skins, characters, currentId, art, skinArt, nameOf, onOpen, onClose, onChange, onEvent, blocked, onStopTask, onOpenDatabase, returnFocus}) {
  const doc = host.document, listeners = [];
  let destroyed = false, selected = 'jobs', who = currentId(), cancelConfirmed = false, recordsKey = '', sceneKey = '', sceneUrl = '', menuKey = '', closetKey = '';
  const node = (tag, text, name) => { const element = doc.createElement(tag); if (text !== undefined) element.textContent = text; if (name) element.className = name; return element; };
  const button = (text, name, iconName) => { const element = node('button',undefined,name); element.type = 'button'; if (iconName) element.append(icon(doc,iconName)); element.append(node('span',text)); return element; };
  const listen = (target,type,callback) => { target.addEventListener(type,callback); listeners.push(()=>target.removeEventListener(type,callback)); };
  const byId = id => characters.find(item => item.id === id) || characters[0];
  const root = node('section',undefined,'erii-life'); root.id = 'erii-database-pet-life'; root.hidden = true;
  root.setAttribute('role','dialog'); root.setAttribute('aria-label','生活手帐');
  const grip = node('div',undefined,'pet-grip'); grip.setAttribute('aria-hidden','true');
  const header = node('header',undefined,'erii-life__header');
  const heading = node('div'); heading.append(node('span','生活手帐','erii-life__eyebrow'),node('h2','今天，也好好生活。'));
  const close = node('button','×','erii-life__close'); close.type = 'button'; close.setAttribute('aria-label','关闭生活手帐'); header.append(heading,close);
  const people = node('div',undefined,'erii-life__people'); people.setAttribute('role','tablist'); people.setAttribute('aria-label','让谁去');
  const personButtons = {};
  for (const character of characters) {
    const control = node('button',undefined,'erii-life__person'); control.type = 'button'; control.dataset.who = character.id; control.dataset.character = character.id;
    control.setAttribute('role','tab');
    const face = node('img'); face.alt = ''; face.draggable = false;
    control.append(face,node('span','','erii-life__person-name'),node('small','','erii-life__person-state'));
    people.append(control); personButtons[character.id] = control;
  }
  const wallet = node('div',undefined,'erii-life__wallet');
  const balance = node('strong','0'); balance.setAttribute('aria-label','金币余额');
  const stats = node('span');
  const welfare = button(`领低保 +${WELFARE.amount}`,'erii-life__welfare','coin');
  welfare.title = `钱包少于 ${WELFARE.below} 金币时，每天可以领一次`;
  wallet.append(icon(doc,'coin','erii-life__coin'),node('span','家里的钱包'),balance,node('span','金币'),welfare,stats);
  const ticketRow = node('div',undefined,'erii-life__ticket-balance'), ticketBalance = node('strong','0');
  ticketBalance.setAttribute('aria-label','花票余额');
  ticketRow.append(node('span','花票'),ticketBalance,node('span','张 · 用于换装'));
  wallet.insertBefore(ticketRow,stats);
  const taskBar = node('div',undefined,'erii-life__task'); taskBar.hidden = true;
  const taskText = node('span'), taskOpen = button('打开数据库'), taskStop = button('停止任务');
  taskStop.setAttribute('aria-label','停止数据库任务（生活手帐）'); taskBar.append(taskText,taskOpen,taskStop);
  const scroll = node('div',undefined,'erii-life__scroll');
  const scene = node('div',undefined,'erii-life__scene');
  const illustration = node('img'); illustration.draggable = false;
  const sceneText = node('div',undefined,'erii-life__scene-text');
  const activityTitle = node('h3'), activityLine = node('p');
  const progress = node('progress'); progress.max = 1; progress.setAttribute('aria-label','当前生活活动进度');
  const countdown = node('span',undefined,'erii-life__countdown');
  const activityActions = node('div',undefined,'erii-life__activity-actions');
  const claim = button('领取工资','erii-life__primary','coin'), cancel = button('提前下班'); activityActions.append(claim,cancel);
  sceneText.append(activityTitle,activityLine,progress,countdown,activityActions); scene.append(illustration,sceneText);
  const tabs = node('div',undefined,'erii-life__tabs'); tabs.setAttribute('role','tablist'); tabs.setAttribute('aria-label','生活手帐页面');
  const panels = {}, tabButtons = {};
  for (const [id,text,iconName] of [['jobs','去打工','briefcase'],['food','吃点好的','bowl'],['skins','换装','shirt'],['journal','小账本','book']]) {
    const control = button(text,undefined,iconName); control.id = `erii-life-tab-${id}`; control.dataset.tab = id;
    control.setAttribute('role','tab'); control.setAttribute('aria-controls',`erii-life-panel-${id}`); tabs.append(control); tabButtons[id] = control;
    const panel = node('div',undefined,`erii-life__panel erii-life__panel--${id}`); panel.id = `erii-life-panel-${id}`;
    panel.setAttribute('role','tabpanel'); panel.setAttribute('aria-labelledby',control.id); panels[id] = panel;
  }
  const jobButtons = [], foodButtons = [], jobImages = [], foodImages = [];
  for (const job of JOBS) {
    const card = node('article',undefined,'erii-life__job'); const image = node('img'); image.alt = ''; image.loading = 'lazy'; image.dataset.pose = job.image; jobImages.push(image);
    const description = node('div'); description.append(node('h4',job.name),node('p',job.task),node('span',`${job.duration/60000} 分钟 · +${job.reward} 金币`,'erii-life__job-reward'));
    const start = button('去打工','erii-life__primary'); start.dataset.job = job.id;
    card.append(image,description,start); panels.jobs.append(card); jobButtons.push(start);
  }
  panels.jobs.append(node('p','一份工作结束后领工资，再选下一份。关掉手帐或刷新，已开始的计时也会继续。每个角色可以同时去不同的地方。','erii-life__note'));
  const menu = node('div',undefined,'erii-life__menu');
  for (const food of FOODS) {
    const card = node('article',undefined,'erii-life__food'); const symbol = node('img',undefined,'erii-life__food-image'); symbol.loading = 'lazy'; symbol.dataset.pose = food.image; foodImages.push(symbol);
    const buy = button(`买${food.name}`); buy.dataset.food = food.id;
    card.append(symbol,node('h4',food.name),node('p',`${food.price} 金币 · 饱腹 +${FOOD_CARE[food.id][0]}`),buy); menu.append(card); foodButtons.push(buy);
  }
  panels.food.append(menu,node('p','买好就开饭，8～12 秒后吃完，吃完饱腹会涨。没有饿肚子惩罚，想请谁吃的时候再来。','erii-life__note'));
  const closet = node('div',undefined,'erii-life__closet'), closetNote = node('p','','erii-life__note');
  const exchange = node('form',undefined,'erii-life__exchange'); exchange.setAttribute('aria-label','花票兑换');
  const exchangeHeading = node('div',undefined,'erii-life__exchange-heading');
  exchangeHeading.append(node('h4','花票兑换'),node('span',`1 金币 = ${FLOWER_EXCHANGE_RATE} 张花票`));
  const exchangeControls = node('div',undefined,'erii-life__exchange-controls');
  const exchangeLabel = node('label','使用金币');
  const exchangeInput = node('input'); exchangeInput.id = 'erii-life-exchange-coins'; exchangeInput.type = 'number';
  exchangeInput.min = '1'; exchangeInput.step = '1'; exchangeInput.value = '1'; exchangeInput.inputMode = 'numeric';
  exchangeLabel.htmlFor = exchangeInput.id;
  const exchangeButton = button('兑换花票','erii-life__primary'); exchangeButton.type = 'submit';
  const exchangePreview = node('output',undefined,'erii-life__exchange-preview'); exchangePreview.htmlFor = exchangeInput.id;
  const exchangeFill = button('填入购衣所需金币','erii-life__exchange-fill');
  const exchangeHint = node('p','','erii-life__note');
  exchangeControls.append(exchangeLabel,exchangeInput,exchangeButton); exchange.append(exchangeHeading,exchangeControls,exchangePreview,exchangeFill,exchangeHint);
  panels.skins.append(exchange,closet,closetNote);
  const totals = node('p',undefined,'erii-life__totals'), records = node('ol',undefined,'erii-life__records'); panels.journal.append(totals,records);
  scroll.append(scene,tabs,...Object.values(panels));
  const status = node('p','','erii-life__status'); status.setAttribute('role','status'); status.setAttribute('aria-live','polite');
  root.append(grip,header,people,wallet,taskBar,scroll,status); doc.body.append(root);
  const sheet = createSheet(host, root, {grip, drag:[header], desktop:() => ({width:520, height:740}), onDismiss:() => hide()});
  function say(text) { status.textContent = text; }
  function select(id) {
    selected = id;
    for (const key of Object.keys(panels)) { panels[key].hidden = key !== id; tabButtons[key].setAttribute('aria-selected',String(key === id)); tabButtons[key].tabIndex = key === id ? 0 : -1; }
  }
  const skinOf = person => skins?.equippedId(person) || DEFAULT_SKIN;
  // 换装页：默认装扮永远在第一张；买过的直接“换上”，没买的显示价格，钱不够时按钮禁用并写明还差多少。
  function renderCloset(view, character, name) {
    const entries = skins ? skins.list(who, {coins: view.coins, tickets: view.tickets}) : [];
    const key = JSON.stringify([who, view.coins, view.tickets, entries.map(entry => [entry.id, entry.owned, entry.equipped, entry.affordable])]);
    if (key === closetKey) return;
    closetKey = key; closet.replaceChildren();
    for (const entry of entries) {
      const card = node('article',undefined,'erii-life__skin'); card.dataset.skin = entry.id;
      card.dataset.state = entry.equipped ? 'equipped' : entry.owned ? 'owned' : entry.affordable ? 'open' : 'locked';
      const unit = entry.currency === 'tickets' ? '张花票' : '金币', cost = `${entry.price} ${unit}`;
      const tag = node('span', entry.equipped ? '使用中' : entry.owned ? '已拥有' : entry.price ? cost : '免费', 'erii-life__skin-tag');
      const image = node('img',undefined,'erii-life__skin-image'); image.loading = 'lazy'; image.draggable = false;
      const url = skinArt?.(character, entry.id === DEFAULT_SKIN ? null : entry.skin, 'idle') || null;
      image.hidden = !url; if (url) image.src = url; image.alt = `${name}的${entry.skin.name}`;
      const shortage = Math.max(0, entry.price - entry.balance);
      const availability = node('p', entry.owned ? '买过后可反复换上。' : !shortage ? '余额够了，可以买下。' : `还差 ${shortage} ${unit}`, 'erii-life__skin-shortage');
      const control = button(entry.equipped ? '正在穿着' : entry.owned ? '换上' : entry.price ? `买下 · ${cost}` : '免费领取', entry.owned && !entry.equipped ? 'erii-life__primary' : undefined, entry.owned ? 'sparkle' : 'coin');
      control.dataset.skin = entry.id; control.dataset.act = entry.owned ? 'equip' : 'buy';
      control.disabled = entry.equipped || !entry.affordable;
      control.title = entry.equipped ? `${name}现在就穿着这套` : entry.owned ? `让${name}换上${entry.skin.name}` : entry.affordable ? `花 ${cost}买下${entry.skin.name}` : `还差 ${shortage} ${unit}`;
      control.setAttribute('aria-label', `${control.querySelector('span:last-child').textContent}：${entry.skin.name}`);
      card.append(tag,image,node('h4',entry.skin.name),node('p',entry.skin.description || ''),availability,control); closet.append(card);
    }
    closetNote.textContent = entries.length > 1
      ? '先打工领金币，再手动兑换花票、买下服装。买过的按角色各自拥有，可以反复换上，也可以换回默认装扮。兑换后剩余花票保留，不能换回金币。'
      : '这个角色暂时没有上架的皮肤；家里的金币和花票共用，已经买到的服装按角色保存。';
  }
  function updateExchange(view = model.view(who)) {
    const coins = exchangeInput.valueAsNumber, tickets = coins * FLOWER_EXCHANGE_RATE;
    const valid = Number.isSafeInteger(coins) && coins > 0;
    exchangeButton.disabled = !valid || coins > view.coins || view.tickets + tickets > 1000000000;
    exchangePreview.textContent = valid ? `可得 ${tickets} 张花票${coins > view.coins ? ' · 金币不足' : ''}` : '请输入正整数金币';
    const entry = skins?.list(who, {coins:view.coins, tickets:view.tickets}).find(item => !item.owned && item.currency === 'tickets');
    const needed = entry ? Math.ceil(Math.max(0, entry.price - view.tickets) / FLOWER_EXCHANGE_RATE) : 0;
    exchangeFill.hidden = !entry; exchangeFill.disabled = !needed;
    exchangeFill.dataset.coins = String(needed);
    exchangeHint.textContent = needed ? `买下「${entry.skin.name}」还需 ${Math.max(0,entry.price - view.tickets)} 张花票，兑换需 ${needed} 金币。` : entry ? '花票已经够了，可直接购买。' : '花票可留着购买服装。输入数量后手动兑换，不会自动扣金币。';
  }
  function stateText(view) {
    if (view.ready) return '下班了';
    if (view.active?.kind === 'job') { const s = Math.ceil(view.remaining/1000); return `${view.item.name} ${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`; }
    if (view.active) return `在吃${view.item.name}`;
    return '在家';
  }
  function render() {
    if (destroyed) return;
    const view = model.view(who), busy = blocked?.() === true, active = view.active, character = byId(who), name = nameOf(character);
    root.dataset.character = who; root.dataset.current = currentId(); root.dataset.skin = skinOf(who);
    for (const item of characters) {
      const control = personButtons[item.id], itemView = model.view(item.id);
      const face = control.querySelector('img'), url = art(item,'idle');
      face.hidden = !url; if (url && face.src !== url) face.src = url;
      control.querySelector('.erii-life__person-name').textContent = nameOf(item);
      control.querySelector('.erii-life__person-state').textContent = stateText(itemView);
      control.setAttribute('aria-selected',String(item.id === who)); control.tabIndex = item.id === who ? 0 : -1;
      control.dataset.ready = String(itemView.ready);
      control.disabled = !url;
      control.title = url ? '' : '读不到这个角色的图，暂时不能安排';
    }
    balance.textContent = String(view.coins); stats.textContent = `一起打工 ${view.jobs} 次 · 吃饭 ${view.meals} 次`;
    ticketBalance.textContent = String(view.tickets); updateExchange(view);
    welfare.hidden = !view.welfare;
    const key = `${who}:${skinOf(who)}:${active ? `${active.uid}:${view.ready}` : 'idle'}`;
    // 插图每次都比对一次地址：换装后 index.js 会重新取图，这里跟着换，不用等别的状态变化。
    const url = active ? art(character, view.item.image) : art(character, 'idle');
    if (url && url !== sceneUrl) { sceneUrl = url; illustration.src = url; }
    if (key !== sceneKey) {
      sceneKey = key; cancelConfirmed = false;
      illustration.alt = active ? `${name}${active.kind === 'food' ? '吃' : '在'}${view.item.name}${active.kind === 'job' ? '打工' : ''}` : `${name}的生活插图`;
      activityTitle.textContent = view.ready ? '下班啦，工资等你来领。' : active?.kind === 'job' ? `${view.item.name}的小帮手` : active?.kind === 'food' ? `开饭啦 · ${view.item.name}` : `${name}在家，先赚一点，再吃点喜欢的。`;
      activityLine.textContent = view.ready ? '今天认真完成了一份工作，领到的金币可以买点好吃的。' : active ? view.item.line : '“一点一点，也能攒出今天的小快乐。”';
    }
    const imagesKey = `${who}:${skinOf(who)}`;
    if (imagesKey !== menuKey) {
      menuKey = imagesKey;
      for (const image of [...jobImages, ...foodImages]) { const url = art(character, image.dataset.pose); image.hidden = !url; if (url) image.src = url; }
      for (const [index,food] of FOODS.entries()) foodImages[index].alt = `${name}吃${food.name}`;
    }
    progress.hidden = !active; progress.value = view.progress;
    countdown.hidden = !active;
    const seconds = Math.ceil(view.remaining / 1000);
    countdown.textContent = view.ready ? `待领取 ${view.item.reward} 金币` : active?.kind === 'job' ? `还有 ${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')} 下班` : active ? `慢慢吃 · 还有 ${seconds} 秒` : '';
    claim.hidden = !view.ready; claim.querySelector('span:last-child').textContent = `领取 ${view.item?.reward || 0} 金币`;
    claim.setAttribute('aria-label','领取工资'); cancel.hidden = !active || active.kind !== 'job' || view.ready;
    cancel.querySelector('span').textContent = cancelConfirmed ? '确认下班（没有工资）' : '提前下班';
    activityActions.hidden = claim.hidden && cancel.hidden;
    for (const control of jobButtons) { control.disabled = Boolean(active) || busy; control.setAttribute('aria-label',`让${name}去${JOBS.find(job => job.id === control.dataset.job).name}打工`); }
    for (const control of foodButtons) {
      const food = FOODS.find(item => item.id === control.dataset.food);
      control.disabled = Boolean(active) || busy || view.coins < food.price;
      control.title = active ? `${name}正在忙` : busy ? '等数据库任务结束后再开饭' : view.coins < food.price ? `还差 ${food.price - view.coins} 金币` : `请${name}吃${food.name}`;
    }
    const journalKey = JSON.stringify(view.journal);
    if (journalKey !== recordsKey) {
      recordsKey = journalKey; records.replaceChildren();
      if (!view.journal.length) records.append(node('li','第一份工资和第一顿饭，都会记在这里。'));
      for (const entry of view.journal) {
        const row = node('li'); row.dataset.kind = entry.kind;
        const date = new Date(entry.at), time = node('time',date.toLocaleString('zh-CN',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false})); time.dateTime = date.toISOString();
        const family = !entry.who && ['welfare','exchange'].includes(entry.kind);
        const tag = node('b', family ? '家里' : nameOf(byId(entry.who || 'erii')), 'erii-life__who'); tag.dataset.character = family ? '' : entry.who || 'erii';
        row.append(time,tag,node('span',entry.text)); records.append(row);
      }
    }
    renderCloset(view, character, name);
    totals.textContent = `累计领到 ${view.earned} 金币 · 花了 ${view.spent} 金币\n兑换得到 ${view.ticketsEarned} 张花票 · 花了 ${view.ticketsSpent} 张花票`;
    root.dataset.activity = active?.kind || 'idle'; root.dataset.ready = String(view.ready); root.dataset.coins = String(view.coins);
  }
  function action(callback, message, event) {
    if (destroyed) return;
    const result = callback();
    if (!result) { say('先完成当前活动，并确认金币足够。'); render(); return; }
    say(message); render(); onChange?.(); if (event) onEvent?.(event.type, who, typeof result === 'object' ? result : event.detail || {});
  }
  function open(person = currentId(), tab = '') {
    if (destroyed) return;
    onOpen?.(); who = person; if (panels[tab]) selected = tab;
    root.hidden = false; root.classList.remove('is-leaving'); select(selected); sceneKey = ''; menuKey = ''; closetKey = ''; render(); sheet.layout(); close.focus({preventScroll:true}); onChange?.();
  }
  function hide() {
    if (destroyed || root.hidden) return;
    cancelConfirmed = false;
    leave(host, root, () => { root.hidden = true; say(''); onClose?.(); returnFocus?.(); onChange?.(); });
  }
  listen(close,'click',hide);
  listen(people,'click',event => { const control = event.target.closest?.('button[data-who]'); if (control && !control.disabled) { who = control.dataset.who; say(''); render(); } });
  listen(claim,'click',()=>action(()=>model.claim(who),'工资收好啦，可以去挑一份喜欢的饭。',{type:'wage'}));
  listen(cancel,'click',()=> { if (!cancelConfirmed) {cancelConfirmed = true; render(); say('再点一次提前下班，这次不会获得金币。');} else action(()=>model.cancelJob(who),'今天先休息，没有扣金币。'); });
  listen(welfare,'click',()=> { const amount = model.claimWelfare(); if (!amount) { say('今天已经领过了，或者钱包还够用。'); render(); return; } say(`领到 ${amount} 金币的低保。省着点花。`); render(); onChange?.(); onEvent?.('welfare', who, {amount}); });
  listen(exchangeInput,'input',()=>updateExchange());
  listen(exchangeFill,'click',()=> { exchangeInput.value = exchangeFill.dataset.coins; updateExchange(); say(`已填入 ${exchangeInput.value} 金币，点“兑换花票”后才会扣款。`); exchangeInput.focus({preventScroll:true}); });
  listen(exchange,'submit',event=> {
    event.preventDefault(); if (destroyed) return;
    const result = model.exchangeTickets(exchangeInput.valueAsNumber);
    if (!result) { say('兑换失败：请输入正整数，确认金币足够且花票未达到上限。'); render(); return; }
    say(`已用 ${result.coins} 金币兑换 ${result.tickets} 张花票。`); render(); onChange?.();
  });
  listen(tabs,'click',event=> {const control = event.target.closest?.('button[data-tab]'); if (control) select(control.dataset.tab);});
  listen(tabs,'keydown',event=> {
    const keys = Object.keys(tabButtons), index = keys.indexOf(selected);
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault(); const next = event.key === 'Home' ? 0 : event.key === 'End' ? keys.length-1 : (index+(event.key === 'ArrowRight' ? 1 : -1)+keys.length)%keys.length;
    select(keys[next]); tabButtons[keys[next]].focus();
  });
  // 买皮肤和换装不占用活动、不碰数据库，所以数据库忙的时候也可以做。
  function changeSkin(control) {
    const id = control.dataset.skin, name = nameOf(byId(who));
    if (control.dataset.act === 'buy') {
      const result = skins.buy(who, id);
      if (!result.ok) {
        say(result.reason === 'tickets' ? '花票还不够，先用打工的金币兑换花票吧。' : result.reason === 'coins' ? '金币还不够，先去打一份工吧。' : result.reason === 'owned' ? '已经买过了，直接换上就好。' : '这套皮肤现在买不了。');
        render(); return;
      }
      // 先通知 index.js（它会重新取图、让桌宠说话），再画这边：这样插图和缩略图拿到的已经是新图。
      onEvent?.('skin', who, {id, action:'bought', name:result.skin.name});
      say(`买好了「${result.skin.name}」，让${name}换上试试。`); render(); onChange?.(); return;
    }
    if (!skins.equip(who, id)) { say('现在换不了这套。'); render(); return; }
    onEvent?.('skin', who, {id, action:'equipped'});
    say(id === DEFAULT_SKIN ? `${name}换回了平时的样子。` : `${name}换上了新装扮。`); render(); onChange?.();
  }
  listen(scroll,'click',event=> {
    const control = event.target.closest?.('button[data-job],button[data-food],button[data-skin]'); if (!control || control.disabled) return;
    if (control.dataset.skin) { if (skins) changeSkin(control); return; }
    if (blocked?.()) {say('数据库正在处理任务，等它结束后再开始。'); return;}
    const name = nameOf(byId(who));
    if (control.dataset.job) action(()=>model.startJob(control.dataset.job, who),`${name}去帮忙啦。回来后，记得领取工资。`,{type:'job',detail:{id:control.dataset.job}});
    if (control.dataset.food) action(()=>model.buyFood(control.dataset.food, who),`买好啦，让${name}慢慢吃。`,{type:'food',detail:{id:control.dataset.food}});
  });
  listen(taskStop,'click',()=>onStopTask?.(taskStop.dataset.taskId));
  listen(taskOpen,'click',()=>onOpenDatabase?.());
  listen(root,'keydown',event=> {if (event.key === 'Escape') {event.stopPropagation(); hide();}});
  select(selected); render();
  return {open, close:hide, render, get visible(){return !root.hidden;},
    setCharacter(id) { if (root.hidden) who = id; render(); },
    get tab() { return selected; },
    coinAnchor() { const rect = balance.getBoundingClientRect(); return {x:rect.left + rect.width / 2, y:rect.top + rect.height / 2}; },
    setTask(task) {taskBar.hidden = !task; if (!task) return; taskText.textContent = task.text; taskStop.dataset.taskId = task.id || ''; taskStop.hidden = !task.canStop; taskStop.disabled = task.pending; taskStop.querySelector('span').textContent = task.pending ? '停止中…' : '停止任务';},
    destroy() {if (destroyed) return; destroyed = true; sheet.destroy(); for(const remove of listeners) remove(); root.remove();},
  };
}
