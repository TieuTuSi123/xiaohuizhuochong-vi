import {JOBS, FOODS, WELFARE} from './life-model.js';
import {FOOD_CARE} from './care-model.js';
import {DEFAULT_SKIN} from './skin-model.js';
import {createSheet, leave} from './sheet.js';
import {icon} from './icons.js';

// Sổ tay đời sống: Ví tiền gia đình dùng chung cho tất cả nhân vật, việc làm thêm, ăn uống và đổi trang phục tính riêng cho từng nhân vật.
// skins là cầu nối đổi trang phục từ index.js cung cấp (list / equippedId / buy / equip, xem skin-model.js); skinArt(nhân vật, trang phục, tư thế) lấy ảnh của bộ trang phục tương ứng để xem trước.
export function createLifeWindow(host, {model, skins, characters, currentId, art, skinArt, nameOf, onOpen, onClose, onChange, onEvent, onOpenMall, blocked, onStopTask, onOpenDatabase, returnFocus}) {
  const doc = host.document, listeners = [];
  let destroyed = false, selected = 'jobs', who = currentId(), cancelConfirmed = false, recordsKey = '', sceneKey = '', sceneUrl = '', menuKey = '', closetKey = '';
  const node = (tag, text, name) => { const element = doc.createElement(tag); if (text !== undefined) element.textContent = text; if (name) element.className = name; return element; };
  const button = (text, name, iconName) => { const element = node('button',undefined,name); element.type = 'button'; if (iconName) element.append(icon(doc,iconName)); element.append(node('span',text)); return element; };
  const listen = (target,type,callback) => { target.addEventListener(type,callback); listeners.push(()=>target.removeEventListener(type,callback)); };
  const byId = id => characters.find(item => item.id === id) || characters[0];
  const root = node('section',undefined,'erii-life'); root.id = 'erii-database-pet-life'; root.hidden = true;
  root.setAttribute('role','dialog'); root.setAttribute('aria-label','Sổ tay đời sống');
  const grip = node('div',undefined,'pet-grip'); grip.setAttribute('aria-hidden','true');
  const header = node('header',undefined,'erii-life__header');
  const heading = node('div'); heading.append(node('span','Sổ tay đời sống','erii-life__eyebrow'),node('h2','Hôm nay, cũng phải sống thật tốt nhé.'));
  const close = node('button','×','erii-life__close'); close.type = 'button'; close.setAttribute('aria-label','Đóng sổ tay đời sống'); header.append(heading,close);
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
  const balance = node('strong','0'); balance.setAttribute('aria-label','Số dư vàng');
  const stats = node('span');
  const welfare = button(`Nhận trợ cấp +${WELFARE.amount}`,'erii-life__welfare','coin');
  welfare.title = `Khi ví có dưới ${WELFARE.below} vàng, mỗi ngày có thể nhận một lần`;
  wallet.append(icon(doc,'coin','erii-life__coin'),node('span','Ví gia đình'),balance,node('span','vàng'),welfare,stats);
  const ticketRow = node('div',undefined,'erii-life__ticket-balance'), ticketBalance = node('strong','0');
  ticketBalance.setAttribute('aria-label','Số dư vé hoa');
  ticketRow.append(node('span','Vé hoa'),ticketBalance,node('span','vé · Dùng để đổi trang phục'));
  wallet.insertBefore(ticketRow,stats);
  const taskBar = node('div',undefined,'erii-life__task'); taskBar.hidden = true;
  const taskText = node('span'), taskOpen = button('Mở cơ sở dữ liệu'), taskStop = button('Dừng nhiệm vụ');
  taskStop.setAttribute('aria-label','Dừng nhiệm vụ CSDL (Sổ tay đời sống)'); taskBar.append(taskText,taskOpen,taskStop);
  const scroll = node('div',undefined,'erii-life__scroll');
  const scene = node('div',undefined,'erii-life__scene');
  const illustration = node('img'); illustration.draggable = false;
  const sceneText = node('div',undefined,'erii-life__scene-text');
  const activityTitle = node('h3'), activityLine = node('p');
  const progress = node('progress'); progress.max = 1; progress.setAttribute('aria-label','Tiến độ hoạt động đời sống hiện tại');
  const countdown = node('span',undefined,'erii-life__countdown');
  const activityActions = node('div',undefined,'erii-life__activity-actions');
  const claim = button('Nhận tiền lương','erii-life__primary','coin'), cancel = button('Tan ca sớm'); activityActions.append(claim,cancel);
  sceneText.append(activityTitle,activityLine,progress,countdown,activityActions); scene.append(illustration,sceneText);
  const tabs = node('div',undefined,'erii-life__tabs'); tabs.setAttribute('role','tablist'); tabs.setAttribute('aria-label','Trang sổ tay đời sống');
  const panels = {}, tabButtons = {};
  for (const [id,text,iconName] of [['jobs','Đi làm thêm','briefcase'],['food','Ăn món ngon','bowl'],['skins','Đổi trang phục','shirt'],['journal','Sổ chi tiêu','book']]) {
    const control = button(text,undefined,iconName); control.id = `erii-life-tab-${id}`; control.dataset.tab = id;
    control.setAttribute('role','tab'); control.setAttribute('aria-controls',`erii-life-panel-${id}`); tabs.append(control); tabButtons[id] = control;
    const panel = node('div',undefined,`erii-life__panel erii-life__panel--${id}`); panel.id = `erii-life-panel-${id}`;
    panel.setAttribute('role','tabpanel'); panel.setAttribute('aria-labelledby',control.id); panels[id] = panel;
  }
  const jobButtons = [], foodButtons = [], jobImages = [], foodImages = [];
  for (const job of JOBS) {
    const card = node('article',undefined,'erii-life__job'); const image = node('img'); image.alt = ''; image.loading = 'lazy'; image.dataset.pose = job.image; jobImages.push(image);
    const description = node('div'); description.append(node('h4',job.name),node('p',job.task),node('span',`${job.duration/60000} phút · +${job.reward} vàng`,'erii-life__job-reward'));
    const start = button('Đi làm thêm','erii-life__primary'); start.dataset.job = job.id;
    card.append(image,description,start); panels.jobs.append(card); jobButtons.push(start);
  }
  panels.jobs.append(node('p','Sau khi một công việc kết thúc, nhận lương rồi hãy chọn công việc tiếp theo. Đóng sổ tay hoặc làm mới trang thì thời gian đã bắt đầu vẫn tiếp tục đếm. Mỗi nhân vật có thể đồng thời đi những nơi khác nhau.','erii-life__note'));
  const menu = node('div',undefined,'erii-life__menu');
  for (const food of FOODS) {
    const card = node('article',undefined,'erii-life__food'); const symbol = node('img',undefined,'erii-life__food-image'); symbol.loading = 'lazy'; symbol.dataset.pose = food.image; foodImages.push(symbol);
    const buy = button(`Mua ${food.name}`); buy.dataset.food = food.id;
    card.append(symbol,node('h4',food.name),node('p',`${food.price} vàng · No bụng +${FOOD_CARE[food.id][0]}`),buy); menu.append(card); foodButtons.push(buy);
  }
  panels.food.append(menu,node('p','Mua xong là vào bữa, ăn xong sau 8–12 giây, ăn xong độ no bụng sẽ tăng. Không có hình phạt đói bụng, khi nào muốn mời ai ăn thì quay lại.','erii-life__note'));
  const closet = node('div',undefined,'erii-life__closet'), closetNote = node('p','','erii-life__note');
  const wardrobeHead = node('div',undefined,'erii-life__wardrobe-head');
  const wardrobeIntro = node('div'); wardrobeIntro.append(node('h4','Tủ đồ của tôi'),node('p','Quần áo đã sở hữu, mặc vào tại đây.'));
  const openMall = button('Đến Cửa hàng mua sắm','erii-life__primary','shop');
  wardrobeHead.append(wardrobeIntro,openMall); panels.skins.append(wardrobeHead,closet,closetNote);
  const totals = node('p',undefined,'erii-life__totals'), records = node('ol',undefined,'erii-life__records'); panels.journal.append(totals,records);
  scroll.append(scene,tabs,...Object.values(panels));
  const status = node('p','','erii-life__status'); status.setAttribute('role','status'); status.setAttribute('aria-live','polite');
  root.append(grip,header,people,wallet,taskBar,scroll,status); doc.body.append(root);
  const sheet = createSheet(host, root, {grip, drag:[header], desktop:() => ({width:520, height:740}), onDismiss:() => hide()});
  function say(text) { status.textContent = text; }
  function select(id) {
    selected = id; root.dataset.tab = id;
    for (const key of Object.keys(panels)) { panels[key].hidden = key !== id; tabButtons[key].setAttribute('aria-selected',String(key === id)); tabButtons[key].tabIndex = key === id ? 0 : -1; }
  }
  const skinOf = person => skins?.equippedId(person) || DEFAULT_SKIN;
  // Tủ đồ chỉ hiển thị trang phục mặc định và trang phục đã sở hữu; quy đổi và mua sắm tập trung ở Cửa hàng.
  function renderCloset(view, character, name) {
    const entries = skins ? skins.list(who, {coins: view.coins, tickets: view.tickets}).filter(entry => entry.owned) : [];
    const key = JSON.stringify([who, entries.map(entry => [entry.id, entry.equipped])]);
    if (key === closetKey) return;
    closetKey = key; closet.replaceChildren();
    for (const entry of entries) {
      const card = node('article',undefined,'erii-life__skin'); card.dataset.skin = entry.id;
      card.dataset.state = entry.equipped ? 'equipped' : 'owned';
      const tag = node('span', entry.equipped ? 'Đang dùng' : 'Đã sở hữu', 'erii-life__skin-tag');
      const image = node('img',undefined,'erii-life__skin-image'); image.loading = 'lazy'; image.draggable = false;
      const url = skinArt?.(character, entry.id === DEFAULT_SKIN ? null : entry.skin, 'idle') || null;
      image.hidden = !url; if (url) image.src = url; image.alt = `${entry.skin.name} của ${name}`;
      const availability = node('p','Có thể thay miễn phí bất cứ lúc nào.','erii-life__skin-shortage');
      const control = button(entry.equipped ? 'Đang mặc' : 'Mặc vào', !entry.equipped ? 'erii-life__primary' : undefined, 'sparkle');
      control.dataset.skin = entry.id; control.dataset.act = 'equip';
      control.disabled = entry.equipped;
      control.title = entry.equipped ? `${name} hiện đang mặc bộ này` : `Cho ${name} mặc ${entry.skin.name}`;
      control.setAttribute('aria-label', `${control.querySelector('span:last-child').textContent}：${entry.skin.name}`);
      card.append(tag,image,node('h4',entry.skin.name),node('p',entry.skin.description || ''),availability,control); closet.append(card);
    }
    closetNote.textContent = entries.length > 1
      ? 'Trang phục đã nhận được lưu theo từng nhân vật. Mặc vào hoặc đổi về trang phục mặc định đều miễn phí.'
      : who === 'zero' ? 'Hiện tại chỉ có trang phục mặc định. Hãy đến Cửa hàng chọn Zero, nhập mật ngữ để mở khóa trang phục Hoàng Nữ.' : 'Hiện tại chỉ có trang phục mặc định. Nhấn "Đến Cửa hàng mua sắm" để xem các trang phục mới của Erii.';
  }
  function stateText(view) {
    if (view.ready) return 'Đã tan ca';
    if (view.active?.kind === 'job') { const s = Math.ceil(view.remaining/1000); return `${view.item.name} ${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`; }
    if (view.active) return `Đang ăn ${view.item.name}`;
    return 'Ở nhà';
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
      control.title = url ? '' : 'Không đọc được ảnh của nhân vật này, tạm thời chưa thể sắp xếp';
    }
    balance.textContent = String(view.coins); stats.textContent = `Đã cùng làm thêm ${view.jobs} lần · Ăn uống ${view.meals} lần`;
    ticketBalance.textContent = String(view.tickets);
    welfare.hidden = !view.welfare;
    const key = `${who}:${skinOf(who)}:${active ? `${active.uid}:${view.ready}` : 'idle'}`;
    // Ảnh minh họa đối chiếu lại địa chỉ mỗi lần: Sau khi đổi trang phục, index.js sẽ lấy lại ảnh, ở đây cũng đổi theo mà không cần đợi trạng thái khác thay đổi.
    const url = active ? art(character, view.item.image) : art(character, 'idle');
    if (url && url !== sceneUrl) { sceneUrl = url; illustration.src = url; }
    if (key !== sceneKey) {
      sceneKey = key; cancelConfirmed = false;
      illustration.alt = active ? `${name} ${active.kind === 'food' ? 'ăn' : 'ở'} ${view.item.name} ${active.kind === 'job' ? 'làm thêm' : ''}` : `Tranh minh họa đời sống của ${name}`;
      activityTitle.textContent = view.ready ? 'Tan ca rồi, tiền lương đang đợi bạn nhận.' : active?.kind === 'job' ? `Phụ tá nhỏ của ${view.item.name}` : active?.kind === 'food' ? `Đến giờ ăn rồi · ${view.item.name}` : `${name} đang ở nhà, kiếm chút tiền trước rồi ăn món mình thích nhé.`;
      activityLine.textContent = view.ready ? 'Hôm nay đã chăm chỉ hoàn thành một công việc, tiền vàng nhận được có thể mua đồ ăn ngon rồi.' : active ? view.item.line : '“Tích góp từng chút một, cũng gom được niềm vui nho nhỏ cho hôm nay.”';
    }
    const imagesKey = `${who}:${skinOf(who)}`;
    if (imagesKey !== menuKey) {
      menuKey = imagesKey;
      for (const image of [...jobImages, ...foodImages]) { const url = art(character, image.dataset.pose); image.hidden = !url; if (url) image.src = url; }
      for (const [index,food] of FOODS.entries()) foodImages[index].alt = `${name} ăn ${food.name}`;
    }
    progress.hidden = !active; progress.value = view.progress;
    countdown.hidden = !active;
    const seconds = Math.ceil(view.remaining / 1000);
    countdown.textContent = view.ready ? `Đang chờ nhận ${view.item.reward} vàng` : active?.kind === 'job' ? `Còn ${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')} nữa sẽ tan ca` : active ? `Ăn từ từ · Còn ${seconds} giây` : '';
    claim.hidden = !view.ready; claim.querySelector('span:last-child').textContent = `Nhận ${view.item?.reward || 0} vàng`;
    claim.setAttribute('aria-label','Nhận tiền lương'); cancel.hidden = !active || active.kind !== 'job' || view.ready;
    cancel.querySelector('span').textContent = cancelConfirmed ? 'Xác nhận tan ca (Không có lương)' : 'Tan ca sớm';
    activityActions.hidden = claim.hidden && cancel.hidden;
    for (const control of jobButtons) { control.disabled = Boolean(active) || busy; control.setAttribute('aria-label',`Cho ${name} đi làm thêm ở ${JOBS.find(job => job.id === control.dataset.job).name}`); }
    for (const control of foodButtons) {
      const food = FOODS.find(item => item.id === control.dataset.food);
      control.disabled = Boolean(active) || busy || view.coins < food.price;
      control.title = active ? `${name} đang bận` : busy ? 'Đợi nhiệm vụ CSDL kết thúc rồi hãy ăn' : view.coins < food.price ? `Còn thiếu ${food.price - view.coins} vàng` : `Mời ${name} ăn ${food.name}`;
    }
    const journalKey = JSON.stringify(view.journal);
    if (journalKey !== recordsKey) {
      recordsKey = journalKey; records.replaceChildren();
      if (!view.journal.length) records.append(node('li','Tiền lương đầu tiên và bữa ăn đầu tiên đều sẽ được ghi lại ở đây.'));
      for (const entry of view.journal) {
        const row = node('li'); row.dataset.kind = entry.kind;
        const date = new Date(entry.at), time = node('time',date.toLocaleString('vi-VN',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false})); time.dateTime = date.toISOString();
        const family = !entry.who && ['welfare','exchange'].includes(entry.kind);
        const tag = node('b', family ? 'Gia đình' : nameOf(byId(entry.who || 'erii')), 'erii-life__who'); tag.dataset.character = family ? '' : entry.who || 'erii';
        row.append(time,tag,node('span',entry.text)); records.append(row);
      }
    }
    renderCloset(view, character, name);
    totals.textContent = `Tích lũy nhận ${view.earned} vàng · Đã chi ${view.spent} vàng\nĐổi được ${view.ticketsEarned} vé hoa · Đã chi ${view.ticketsSpent} vé hoa`;
    root.dataset.activity = active?.kind || 'idle'; root.dataset.ready = String(view.ready); root.dataset.coins = String(view.coins);
  }
  function action(callback, message, event) {
    if (destroyed) return;
    const result = callback();
    if (!result) { say('Hãy hoàn thành hoạt động hiện tại và đảm bảo đủ vàng.'); render(); return; }
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
    leave(host, root, () => { const regain=root.contains(doc.activeElement)||doc.activeElement===doc.body;root.hidden = true; say(''); onClose?.(); if(regain)returnFocus?.(); onChange?.(); });
  }
  listen(close,'click',hide);
  listen(people,'click',event => { const control = event.target.closest?.('button[data-who]'); if (control && !control.disabled) { who = control.dataset.who; say(''); render(); } });
  listen(claim,'click',()=>action(()=>model.claim(who),'Đã nhận lương rồi, có thể đi chọn món ăn mình thích.',{type:'wage'}));
  listen(cancel,'click',()=> { if (!cancelConfirmed) {cancelConfirmed = true; render(); say('Bấm thêm lần nữa để tan ca sớm, lần này sẽ không nhận được vàng.');} else action(()=>model.cancelJob(who),'Hôm nay nghỉ ngơi trước, không bị trừ vàng.'); });
  listen(welfare,'click',()=> { const amount = model.claimWelfare(); if (!amount) { say('Hôm nay đã nhận rồi, hoặc ví tiền vẫn còn đủ.'); render(); return; } say(`Đã nhận ${amount} vàng trợ cấp. Tiêu tiết kiệm nhé.`); render(); onChange?.(); onEvent?.('welfare', who, {amount}); });
  listen(openMall,'click',()=>onOpenMall?.(who));
  listen(tabs,'click',event=> {const control = event.target.closest?.('button[data-tab]'); if (control) select(control.dataset.tab);});
  listen(tabs,'keydown',event=> {
    const keys = Object.keys(tabButtons), index = keys.indexOf(selected);
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault(); const next = event.key === 'Home' ? 0 : event.key === 'End' ? keys.length-1 : (index+(event.key === 'ArrowRight' ? 1 : -1)+keys.length)%keys.length;
    select(keys[next]); tabButtons[keys[next]].focus();
  });
  // Mua trang phục và đổi đồ không chiếm dụng hoạt động, không đụng tới CSDL, nên lúc CSDL đang bận vẫn có thể thao tác.
  function changeSkin(control) {
    const id = control.dataset.skin, name = nameOf(byId(who));
    if (!skins.equip(who, id)) { say('Hiện tại không thể đổi sang bộ này.'); render(); return; }
    onEvent?.('skin', who, {id, action:'equipped'});
    say(id === DEFAULT_SKIN ? `${name} đã đổi về dáng vẻ thường ngày.` : `${name} đã mặc lên bộ trang phục mới.`); render(); onChange?.();
  }
  listen(scroll,'click',event=> {
    const control = event.target.closest?.('button[data-job],button[data-food],button[data-skin]'); if (!control || control.disabled) return;
    if (control.dataset.skin) { if (skins) changeSkin(control); return; }
    if (blocked?.()) {say('CSDL đang xử lý nhiệm vụ, đợi xong rồi hãy bắt đầu.'); return;}
    const name = nameOf(byId(who));
    if (control.dataset.job) action(()=>model.startJob(control.dataset.job, who),`${name} đã đi giúp việc rồi. Khi về nhớ nhận lương nhé.`,{type:'job',detail:{id:control.dataset.job}});
    if (control.dataset.food) action(()=>model.buyFood(control.dataset.food, who),`Đã mua xong rồi, để ${name} ăn từ từ nhé.`,{type:'food',detail:{id:control.dataset.food}});
  });
  listen(taskStop,'click',()=>onStopTask?.(taskStop.dataset.taskId));
  listen(taskOpen,'click',()=>onOpenDatabase?.());
  listen(root,'keydown',event=> {if (event.key === 'Escape') {event.stopPropagation(); hide();}});
  select(selected); render();
  return {open, close:hide, render, get visible(){return !root.hidden;},
    setCharacter(id) { if (root.hidden) who = id; render(); },
    get tab() { return selected; },
    coinAnchor() { const rect = balance.getBoundingClientRect(); return {x:rect.left + rect.width / 2, y:rect.top + rect.height / 2}; },
    setTask(task) {taskBar.hidden = !task; if (!task) return; taskText.textContent = task.text; taskStop.dataset.taskId = task.id || ''; taskStop.hidden = !task.canStop; taskStop.disabled = task.pending; taskStop.querySelector('span').textContent = task.pending ? 'Đang dừng…' : 'Dừng nhiệm vụ';},
    destroy() {if (destroyed) return; destroyed = true; sheet.destroy(); for(const remove of listeners) remove(); root.remove();},
  };
}