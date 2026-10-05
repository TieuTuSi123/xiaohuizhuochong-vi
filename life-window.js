import {JOBS, FOODS, WELFARE} from './life-model.js';
import {FOOD_CARE} from './care-model.js';
import {createSheet, leave} from './sheet.js';
import {icon} from './icons.js';

// 生活手帐：家里的钱包所有角色共用，打工和吃饭按角色各算各的。
export function createLifeWindow(host, {model, characters, currentId, art, nameOf, onOpen, onClose, onChange, onEvent, blocked, onStopTask, onOpenDatabase, returnFocus}) {
  const doc = host.document, listeners = [];
  let destroyed = false, selected = 'jobs', who = currentId(), cancelConfirmed = false, recordsKey = '', sceneKey = '', menuKey = '';
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
  for (const [id,text,iconName] of [['jobs','去打工','briefcase'],['food','吃点好的','bowl'],['journal','小账本','book']]) {
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
  function stateText(view) {
    if (view.ready) return '下班了';
    if (view.active?.kind === 'job') { const s = Math.ceil(view.remaining/1000); return `${view.item.name} ${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`; }
    if (view.active) return `在吃${view.item.name}`;
    return '在家';
  }
  function render() {
    if (destroyed) return;
    const view = model.view(who), busy = blocked?.() === true, active = view.active, character = byId(who), name = nameOf(character);
    root.dataset.character = who; root.dataset.current = currentId();
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
    welfare.hidden = !view.welfare;
    const key = `${who}:${active ? `${active.uid}:${view.ready}` : 'idle'}`;
    if (key !== sceneKey) {
      sceneKey = key; cancelConfirmed = false;
      const url = active ? art(character, view.item.image) : art(character, 'idle');
      if (url) illustration.src = url;
      illustration.alt = active ? `${name}${active.kind === 'food' ? '吃' : '在'}${view.item.name}${active.kind === 'job' ? '打工' : ''}` : `${name}的生活插图`;
      activityTitle.textContent = view.ready ? '下班啦，工资等你来领。' : active?.kind === 'job' ? `${view.item.name}的小帮手` : active?.kind === 'food' ? `开饭啦 · ${view.item.name}` : `${name}在家，先赚一点，再吃点喜欢的。`;
      activityLine.textContent = view.ready ? '今天认真完成了一份工作，领到的金币可以买点好吃的。' : active ? view.item.line : '“一点一点，也能攒出今天的小快乐。”';
    }
    const imagesKey = who;
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
        const tag = node('b', entry.who || entry.kind !== 'welfare' ? nameOf(byId(entry.who || 'erii')) : '家里', 'erii-life__who'); tag.dataset.character = entry.who || (entry.kind === 'welfare' ? '' : 'erii');
        row.append(time,tag,node('span',entry.text)); records.append(row);
      }
    }
    totals.textContent = `累计领到 ${view.earned} 金币 · 买饭花了 ${view.spent} 金币`;
    root.dataset.activity = active?.kind || 'idle'; root.dataset.ready = String(view.ready); root.dataset.coins = String(view.coins);
  }
  function action(callback, message, event) {
    if (destroyed) return;
    const result = callback();
    if (!result) { say('先完成当前活动，并确认金币足够。'); render(); return; }
    say(message); render(); onChange?.(); if (event) onEvent?.(event.type, who, typeof result === 'object' ? result : event.detail || {});
  }
  function open(person = currentId()) {
    if (destroyed) return;
    onOpen?.(); who = person; root.hidden = false; root.classList.remove('is-leaving'); select(selected); sceneKey = ''; menuKey = ''; render(); sheet.layout(); close.focus({preventScroll:true}); onChange?.();
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
  listen(tabs,'click',event=> {const control = event.target.closest?.('button[data-tab]'); if (control) select(control.dataset.tab);});
  listen(tabs,'keydown',event=> {
    const keys = Object.keys(tabButtons), index = keys.indexOf(selected);
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault(); const next = event.key === 'Home' ? 0 : event.key === 'End' ? keys.length-1 : (index+(event.key === 'ArrowRight' ? 1 : -1)+keys.length)%keys.length;
    select(keys[next]); tabButtons[keys[next]].focus();
  });
  listen(scroll,'click',event=> {
    const control = event.target.closest?.('button[data-job],button[data-food]'); if (!control || control.disabled) return;
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
    coinAnchor() { const rect = balance.getBoundingClientRect(); return {x:rect.left + rect.width / 2, y:rect.top + rect.height / 2}; },
    setTask(task) {taskBar.hidden = !task; if (!task) return; taskText.textContent = task.text; taskStop.dataset.taskId = task.id || ''; taskStop.hidden = !task.canStop; taskStop.disabled = task.pending; taskStop.querySelector('span').textContent = task.pending ? '停止中…' : '停止任务';},
    destroy() {if (destroyed) return; destroyed = true; sheet.destroy(); for(const remove of listeners) remove(); root.remove();},
  };
}
