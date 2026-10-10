import {JOBS, FOODS, WELFARE} from './life-model.js';
import {FOOD_CARE} from './care-model.js';
import {createSheet, leave} from './sheet.js';
import {icon} from './icons.js';

// Sổ tay sinh hoạt: Ví tiền dùng chung cho tất cả các nhân vật trong nhà, còn việc đi làm và ăn uống thì tính riêng cho từng nhân vật.
export function createLifeWindow(host, {model, characters, currentId, art, nameOf, onOpen, onClose, onChange, onEvent, blocked, onStopTask, onOpenDatabase, returnFocus}) {
  const doc = host.document, listeners = [];
  let destroyed = false, selected = 'jobs', who = currentId(), cancelConfirmed = false, recordsKey = '', sceneKey = '', menuKey = '';
  const node = (tag, text, name) => { const element = doc.createElement(tag); if (text !== undefined) element.textContent = text; if (name) element.className = name; return element; };
  const button = (text, name, iconName) => { const element = node('button',undefined,name); element.type = 'button'; if (iconName) element.append(icon(doc,iconName)); element.append(node('span',text)); return element; };
  const listen = (target,type,callback) => { target.addEventListener(type,callback); listeners.push(()=>target.removeEventListener(type,callback)); };
  const byId = id => characters.find(item => item.id === id) || characters[0];
  const root = node('section',undefined,'erii-life'); root.id = 'erii-database-pet-life'; root.hidden = true;
  root.setAttribute('role','dialog'); root.setAttribute('aria-label','Sổ tay sinh hoạt');
  const grip = node('div',undefined,'pet-grip'); grip.setAttribute('aria-hidden','true');
  const header = node('header',undefined,'erii-life__header');
  const heading = node('div'); heading.append(node('span','Sổ tay sinh hoạt','erii-life__eyebrow'),node('h2','Hôm nay, cũng hãy sống thật tốt nhé.'));
  const close = node('button','×','erii-life__close'); close.type = 'button'; close.setAttribute('aria-label','Đóng sổ tay sinh hoạt'); header.append(heading,close);
  const people = node('div',undefined,'erii-life__people'); people.setAttribute('role','tablist'); people.setAttribute('aria-label','Để ai đi');
  const personButtons = {};
  for (const character of characters) {
    const control = node('button',undefined,'erii-life__person'); control.type = 'button'; control.dataset.who = character.id; control.dataset.character = character.id;
    control.setAttribute('role','tab');
    const face = node('img'); face.alt = ''; face.draggable = false;
    control.append(face,node('span','','erii-life__person-name'),node('small','','erii-life__person-state'));
    people.append(control); personButtons[character.id] = control;
  }
  const wallet = node('div',undefined,'erii-life__wallet');
  const balance = node('strong','0'); balance.setAttribute('aria-label','Số dư tiền vàng');
  const stats = node('span');
  const welfare = button(`Nhận trợ cấp +${WELFARE.amount}`,'erii-life__welfare','coin');
  welfare.title = `Khi ví tiền ít hơn ${WELFARE.below} tiền vàng, mỗi ngày có thể nhận một lần`;
  wallet.append(icon(doc,'coin','erii-life__coin'),node('span','Ví tiền chung ở nhà'),balance,node('span','tiền vàng'),welfare,stats);
  const taskBar = node('div',undefined,'erii-life__task'); taskBar.hidden = true;
  const taskText = node('span'), taskOpen = button('Mở cơ sở dữ liệu'), taskStop = button('Dừng nhiệm vụ');
  taskStop.setAttribute('aria-label','Dừng nhiệm vụ cơ sở dữ liệu (Sổ tay sinh hoạt)'); taskBar.append(taskText,taskOpen,taskStop);
  const scroll = node('div',undefined,'erii-life__scroll');
  const scene = node('div',undefined,'erii-life__scene');
  const illustration = node('img'); illustration.draggable = false;
  const sceneText = node('div',undefined,'erii-life__scene-text');
  const activityTitle = node('h3'), activityLine = node('p');
  const progress = node('progress'); progress.max = 1; progress.setAttribute('aria-label','Tiến độ hoạt động sinh hoạt hiện tại');
  const countdown = node('span',undefined,'erii-life__countdown');
  const activityActions = node('div',undefined,'erii-life__activity-actions');
  const claim = button('Nhận tiền lương','erii-life__primary','coin'), cancel = button('Tan làm sớm'); activityActions.append(claim,cancel);
  sceneText.append(activityTitle,activityLine,progress,countdown,activityActions); scene.append(illustration,sceneText);
  const tabs = node('div',undefined,'erii-life__tabs'); tabs.setAttribute('role','tablist'); tabs.setAttribute('aria-label','Trang sổ tay sinh hoạt');
  const panels = {}, tabButtons = {};
  for (const [id,text,iconName] of [['jobs','Đi làm','briefcase'],['food','Ăn chút đồ ngon','bowl'],['journal','Sổ tay nhỏ','book']]) {
    const control = button(text,undefined,iconName); control.id = `erii-life-tab-${id}`; control.dataset.tab = id;
    control.setAttribute('role','tab'); control.setAttribute('aria-controls',`erii-life-panel-${id}`); tabs.append(control); tabButtons[id] = control;
    const panel = node('div',undefined,`erii-life__panel erii-life__panel--${id}`); panel.id = `erii-life-panel-${id}`;
    panel.setAttribute('role','tabpanel'); panel.setAttribute('aria-labelledby',control.id); panels[id] = panel;
  }
  const jobButtons = [], foodButtons = [], jobImages = [], foodImages = [];
  for (const job of JOBS) {
    const card = node('article',undefined,'erii-life__job'); const image = node('img'); image.alt = ''; image.loading = 'lazy'; image.dataset.pose = job.image; jobImages.push(image);
    const description = node('div'); description.append(node('h4',job.name),node('p',job.task),node('span',`${job.duration/60000} phút · +${job.reward} tiền vàng`,'erii-life__job-reward'));
    const start = button('Đi làm','erii-life__primary'); start.dataset.job = job.id;
    card.append(image,description,start); panels.jobs.append(card); jobButtons.push(start);
  }
  panels.jobs.append(node('p','Sau khi hoàn thành một công việc thì nhận lương, rồi mới chọn việc tiếp theo. Đóng sổ tay hoặc làm mới trang, bộ đếm thời gian đã bắt đầu vẫn sẽ tiếp tục. Mỗi nhân vật có thể đi đến những nơi khác nhau cùng một lúc.','erii-life__note'));
  const menu = node('div',undefined,'erii-life__menu');
  for (const food of FOODS) {
    const card = node('article',undefined,'erii-life__food'); const symbol = node('img',undefined,'erii-life__food-image'); symbol.loading = 'lazy'; symbol.dataset.pose = food.image; foodImages.push(symbol);
    const buy = button(`Mua ${food.name}`); buy.dataset.food = food.id;
    card.append(symbol,node('h4',food.name),node('p',`${food.price} tiền vàng · Độ no +${FOOD_CARE[food.id][0]}`),buy); menu.append(card); foodButtons.push(buy);
  }
  panels.food.append(menu,node('p','Mua xong là ăn ngay, 8～12 giây sau sẽ ăn xong, ăn xong độ no sẽ tăng. Không có hình phạt nếu bị đói, khi nào muốn mời ai ăn thì cứ đến.','erii-life__note'));
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
    if (view.ready) return 'Đã tan làm';
    if (view.active?.kind === 'job') { const s = Math.ceil(view.remaining/1000); return `${view.item.name} ${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`; }
    if (view.active) return `Đang ăn ${view.item.name}`;
    return 'Ở nhà';
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
      control.title = url ? '' : 'Không đọc được ảnh của nhân vật này, tạm thời không thể sắp xếp công việc';
    }
    balance.textContent = String(view.coins); stats.textContent = `Đã cùng nhau đi làm ${view.jobs} lần · Ăn cơm ${view.meals} lần`;
    welfare.hidden = !view.welfare;
    const key = `${who}:${active ? `${active.uid}:${view.ready}` : 'idle'}`;
    if (key !== sceneKey) {
      sceneKey = key; cancelConfirmed = false;
      const url = active ? art(character, view.item.image) : art(character, 'idle');
      if (url) illustration.src = url;
      illustration.alt = active ? `${name} ${active.kind === 'food' ? 'đang ăn' : 'đang làm việc tại'} ${view.item.name}` : `Ảnh minh họa sinh hoạt của ${name}`;
      activityTitle.textContent = view.ready ? 'Đã tan làm, tiền lương đang chờ bạn đến nhận.' : active?.kind === 'job' ? `Phụ việc tại ${view.item.name}` : active?.kind === 'food' ? `Đến giờ ăn rồi · ${view.item.name}` : `${name} đang ở nhà, đi kiếm chút tiền trước, rồi ăn đồ mình thích sau.`;
      activityLine.textContent = view.ready ? 'Hôm nay đã chăm chỉ hoàn thành công việc, tiền vàng nhận được có thể mua chút đồ ngon.' : active ? view.item.line : '“Từng chút từng chút một, cũng có thể tích cóp được niềm vui nhỏ của ngày hôm nay.”';
    }
    const imagesKey = who;
    if (imagesKey !== menuKey) {
      menuKey = imagesKey;
      for (const image of [...jobImages, ...foodImages]) { const url = art(character, image.dataset.pose); image.hidden = !url; if (url) image.src = url; }
      for (const [index,food] of FOODS.entries()) foodImages[index].alt = `${name} ăn ${food.name}`;
    }
    progress.hidden = !active; progress.value = view.progress;
    countdown.hidden = !active;
    const seconds = Math.ceil(view.remaining / 1000);
    countdown.textContent = view.ready ? `Đợi nhận ${view.item.reward} tiền vàng` : active?.kind === 'job' ? `Còn ${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')} nữa là tan làm` : active ? `Ăn từ từ thôi · Còn ${seconds} giây` : '';
    claim.hidden = !view.ready; claim.querySelector('span:last-child').textContent = `Nhận ${view.item?.reward || 0} tiền vàng`;
    claim.setAttribute('aria-label','Nhận tiền lương'); cancel.hidden = !active || active.kind !== 'job' || view.ready;
    cancel.querySelector('span').textContent = cancelConfirmed ? 'Xác nhận tan làm (Không có lương)' : 'Tan làm sớm';
    activityActions.hidden = claim.hidden && cancel.hidden;
    for (const control of jobButtons) { control.disabled = Boolean(active) || busy; control.setAttribute('aria-label',`Để ${name} đi làm việc tại ${JOBS.find(job => job.id === control.dataset.job).name}`); }
    for (const control of foodButtons) {
      const food = FOODS.find(item => item.id === control.dataset.food);
      control.disabled = Boolean(active) || busy || view.coins < food.price;
      control.title = active ? `${name} đang bận` : busy ? 'Đợi nhiệm vụ cơ sở dữ liệu kết thúc rồi mới ăn' : view.coins < food.price ? `Còn thiếu ${food.price - view.coins} tiền vàng` : `Mời ${name} ăn ${food.name}`;
    }
    const journalKey = JSON.stringify(view.journal);
    if (journalKey !== recordsKey) {
      recordsKey = journalKey; records.replaceChildren();
      if (!view.journal.length) records.append(node('li','Khoản lương đầu tiên và bữa ăn đầu tiên, đều sẽ được ghi lại ở đây.'));
      for (const entry of view.journal) {
        const row = node('li'); row.dataset.kind = entry.kind;
        const date = new Date(entry.at), time = node('time',date.toLocaleString('vi-VN',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false})); time.dateTime = date.toISOString();
        const tag = node('b', entry.who || entry.kind !== 'welfare' ? nameOf(byId(entry.who || 'erii')) : 'Ở nhà', 'erii-life__who'); tag.dataset.character = entry.who || (entry.kind === 'welfare' ? '' : 'erii');
        row.append(time,tag,node('span',entry.text)); records.append(row);
      }
    }
    totals.textContent = `Tích lũy nhận được ${view.earned} tiền vàng · Mua đồ ăn hết ${view.spent} tiền vàng`;
    root.dataset.activity = active?.kind || 'idle'; root.dataset.ready = String(view.ready); root.dataset.coins = String(view.coins);
  }
  function action(callback, message, event) {
    if (destroyed) return;
    const result = callback();
    if (!result) { say('Hãy hoàn thành hoạt động hiện tại trước, và đảm bảo đủ tiền vàng.'); render(); return; }
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
  listen(claim,'click',()=>action(()=>model.claim(who),'Đã nhận lương xong, có thể đi chọn một phần đồ ăn yêu thích.',{type:'wage'}));
  listen(cancel,'click',()=> { if (!cancelConfirmed) {cancelConfirmed = true; render(); say('Nhấp "Tan làm sớm" thêm lần nữa, lần này sẽ không nhận được tiền vàng.');} else action(()=>model.cancelJob(who),'Hôm nay nghỉ ngơi trước, không bị trừ tiền vàng.'); });
  listen(welfare,'click',()=> { const amount = model.claimWelfare(); if (!amount) { say('Hôm nay đã nhận rồi, hoặc ví tiền vẫn còn đủ dùng.'); render(); return; } say(`Nhận được ${amount} tiền vàng trợ cấp cơ bản. Tiêu tiết kiệm một chút nhé.`); render(); onChange?.(); onEvent?.('welfare', who, {amount}); });
  listen(tabs,'click',event=> {const control = event.target.closest?.('button[data-tab]'); if (control) select(control.dataset.tab);});
  listen(tabs,'keydown',event=> {
    const keys = Object.keys(tabButtons), index = keys.indexOf(selected);
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault(); const next = event.key === 'Home' ? 0 : event.key === 'End' ? keys.length-1 : (index+(event.key === 'ArrowRight' ? 1 : -1)+keys.length)%keys.length;
    select(keys[next]); tabButtons[keys[next]].focus();
  });
  listen(scroll,'click',event=> {
    const control = event.target.closest?.('button[data-job],button[data-food]'); if (!control || control.disabled) return;
    if (blocked?.()) {say('Cơ sở dữ liệu đang xử lý nhiệm vụ, hãy đợi nó kết thúc rồi mới bắt đầu.'); return;}
    const name = nameOf(byId(who));
    if (control.dataset.job) action(()=>model.startJob(control.dataset.job, who),`${name} đã đi phụ việc rồi. Sau khi về, nhớ nhận tiền lương nhé.`,{type:'job',detail:{id:control.dataset.job}});
    if (control.dataset.food) action(()=>model.buyFood(control.dataset.food, who),`Đã mua xong, để ${name} từ từ ăn.`,{type:'food',detail:{id:control.dataset.food}});
  });
  listen(taskStop,'click',()=>onStopTask?.(taskStop.dataset.taskId));
  listen(taskOpen,'click',()=>onOpenDatabase?.());
  listen(root,'keydown',event=> {if (event.key === 'Escape') {event.stopPropagation(); hide();}});
  select(selected); render();
  return {open, close:hide, render, get visible(){return !root.hidden;},
    setCharacter(id) { if (root.hidden) who = id; render(); },
    coinAnchor() { const rect = balance.getBoundingClientRect(); return {x:rect.left + rect.width / 2, y:rect.top + rect.height / 2}; },
    setTask(task) {taskBar.hidden = !task; if (!task) return; taskText.textContent = task.text; taskStop.dataset.taskId = task.id || ''; taskStop.hidden = !task.canStop; taskStop.disabled = task.pending; taskStop.querySelector('span').textContent = task.pending ? 'Đang dừng…' : 'Dừng nhiệm vụ';},
    destroy() {if (destroyed) return; destroyed = true; sheet.destroy(); for(const remove of listeners) remove(); root.remove();},
  };
}
