import {JOBS, FOODS, WELFARE, FLOWER_EXCHANGE_RATE} from './life-model.js';
import {FOOD_CARE} from './care-model.js';
import {DEFAULT_SKIN} from './skin-model.js';
import {createSheet, leave} from './sheet.js';
import {icon} from './icons.js';

// Sổ tay cuộc sống: Ví tiền gia đình dùng chung cho mọi nhân vật; làm thêm, ăn uống và thay trang phục được tính riêng theo từng nhân vật.
// skins là cầu nối thay trang phục do index.js cung cấp (list / equippedId / buy / equip, xem skin-model.js); skinArt(nhân vật, skin, tư thế) lấy ảnh của bộ skin tương ứng để xem trước.
export function createLifeWindow(host, {model, skins, characters, currentId, art, skinArt, nameOf, onOpen, onClose, onChange, onEvent, blocked, onStopTask, onOpenDatabase, returnFocus}) {
  const doc = host.document, listeners = [];
  let destroyed = false, selected = 'jobs', who = currentId(), cancelConfirmed = false, recordsKey = '', sceneKey = '', sceneUrl = '', menuKey = '', closetKey = '';
  const node = (tag, text, name) => { const element = doc.createElement(tag); if (text !== undefined) element.textContent = text; if (name) element.className = name; return element; };
  const button = (text, name, iconName) => { const element = node('button',undefined,name); element.type = 'button'; if (iconName) element.append(icon(doc,iconName)); element.append(node('span',text)); return element; };
  const listen = (target,type,callback) => { target.addEventListener(type,callback); listeners.push(()=>target.removeEventListener(type,callback)); };
  const byId = id => characters.find(item => item.id === id) || characters[0];
  const root = node('section',undefined,'erii-life'); root.id = 'erii-database-pet-life'; root.hidden = true;
  root.setAttribute('role','dialog'); root.setAttribute('aria-label','Sổ tay cuộc sống');
  const grip = node('div',undefined,'pet-grip'); grip.setAttribute('aria-hidden','true');
  const header = node('header',undefined,'erii-life__header');
  const heading = node('div'); heading.append(node('span','Sổ tay cuộc sống','erii-life__eyebrow'),node('h2','Hôm nay cũng sống thật tốt nhé.'));
  const close = node('button','×','erii-life__close'); close.type = 'button'; close.setAttribute('aria-label','Đóng sổ tay cuộc sống'); header.append(heading,close);
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
  const balance = node('strong','0'); balance.setAttribute('aria-label','Số dư xu vàng');
  const stats = node('span');
  const welfare = button(`Nhận trợ cấp +${WELFARE.amount}`,'erii-life__welfare','coin');
  welfare.title = `Khi ví tiền còn dưới ${WELFARE.below} xu vàng, mỗi ngày có thể nhận một lần`;
  wallet.append(icon(doc,'coin','erii-life__coin'),node('span','Ví tiền gia đình'),balance,node('span','xu vàng'),welfare,stats);
  const ticketRow = node('div',undefined,'erii-life__ticket-balance'), ticketBalance = node('strong','0');
  ticketBalance.setAttribute('aria-label','Số dư vé hoa');
  ticketRow.append(node('span','Vé hoa'),ticketBalance,node('span','vé · Dùng để đổi trang phục'));
  wallet.insertBefore(ticketRow,stats);
  const taskBar = node('div',undefined,'erii-life__task'); taskBar.hidden = true;
  const taskText = node('span'), taskOpen = button('Mở cơ sở dữ liệu'), taskStop = button('Dừng tác vụ');
  taskStop.setAttribute('aria-label','Dừng tác vụ cơ sở dữ liệu (sổ tay cuộc sống)'); taskBar.append(taskText,taskOpen,taskStop);
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
  const tabs = node('div',undefined,'erii-life__tabs'); tabs.setAttribute('role','tablist'); tabs.setAttribute('aria-label','Trang sổ tay cuộc sống');
  const panels = {}, tabButtons = {};
  for (const [id,text,iconName] of [['jobs','Đi làm thêm','briefcase'],['food','Ăn món ngon','bowl'],['skins','Trang phục','shirt'],['journal','Sổ cái nhỏ','book']]) {
    const control = button(text,undefined,iconName); control.id = `erii-life-tab-${id}`; control.dataset.tab = id;
    control.setAttribute('role','tab'); control.setAttribute('aria-controls',`erii-life-panel-${id}`); tabs.append(control); tabButtons[id] = control;
    const panel = node('div',undefined,`erii-life__panel erii-life__panel--${id}`); panel.id = `erii-life-panel-${id}`;
    panel.setAttribute('role','tabpanel'); panel.setAttribute('aria-labelledby',control.id); panels[id] = panel;
  }
  const jobButtons = [], foodButtons = [], jobImages = [], foodImages = [];
  for (const job of JOBS) {
    const card = node('article',undefined,'erii-life__job'); const image = node('img'); image.alt = ''; image.loading = 'lazy'; image.dataset.pose = job.image; jobImages.push(image);
    const description = node('div'); description.append(node('h4',job.name),node('p',job.task),node('span',`${job.duration/60000} phút · +${job.reward} xu vàng`,'erii-life__job-reward'));
    const start = button('Đi làm thêm','erii-life__primary'); start.dataset.job = job.id;
    card.append(image,description,start); panels.jobs.append(card); jobButtons.push(start);
  }
  panels.jobs.append(node('p','Sau khi một công việc kết thúc hãy nhận lương rồi mới chọn việc tiếp theo. Đóng sổ tay hoặc làm mới trang thì bộ đếm giờ đã bắt đầu vẫn tiếp tục chạy. Mỗi nhân vật có thể đến những địa điểm khác nhau cùng lúc.','erii-life__note'));
  const menu = node('div',undefined,'erii-life__menu');
  for (const food of FOODS) {
    const card = node('article',undefined,'erii-life__food'); const symbol = node('img',undefined,'erii-life__food-image'); symbol.loading = 'lazy'; symbol.dataset.pose = food.image; foodImages.push(symbol);
    const buy = button(`Mua ${food.name}`); buy.dataset.food = food.id;
    card.append(symbol,node('h4',food.name),node('p',`${food.price} xu vàng · Độ no +${FOOD_CARE[food.id][0]}`),buy); menu.append(card); foodButtons.push(buy);
  }
  panels.food.append(menu,node('p','Mua xong là dùng bữa ngay, ăn xong sau 8～12 giây, khi ăn xong độ no sẽ tăng. Không có hình phạt khi đói bụng, khi nào muốn mời ai ăn thì hãy ghé qua nhé.','erii-life__note'));
  const closet = node('div',undefined,'erii-life__closet'), closetNote = node('p','','erii-life__note');
  const exchange = node('form',undefined,'erii-life__exchange'); exchange.setAttribute('aria-label','Đổi vé hoa');
  const exchangeHeading = node('div',undefined,'erii-life__exchange-heading');
  exchangeHeading.append(node('h4','Đổi vé hoa'),node('span',`1 xu vàng = ${FLOWER_EXCHANGE_RATE} vé hoa`));
  const exchangeControls = node('div',undefined,'erii-life__exchange-controls');
  const exchangeLabel = node('label','Dùng xu vàng');
  const exchangeInput = node('input'); exchangeInput.id = 'erii-life-exchange-coins'; exchangeInput.type = 'number';
  exchangeInput.min = '1'; exchangeInput.step = '1'; exchangeInput.value = '1'; exchangeInput.inputMode = 'numeric';
  exchangeLabel.htmlFor = exchangeInput.id;
  const exchangeButton = button('Đổi vé hoa','erii-life__primary'); exchangeButton.type = 'submit';
  const exchangePreview = node('output',undefined,'erii-life__exchange-preview'); exchangePreview.htmlFor = exchangeInput.id;
  const exchangeFill = button('Điền số xu vàng cần để mua trang phục','erii-life__exchange-fill');
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
  // Trang trang phục: Trang phục mặc định luôn ở ô đầu tiên; skin đã mua bấm trực tiếp "Mặc vào", chưa mua sẽ hiển thị giá, không đủ tiền thì vô hiệu hóa nút và ghi rõ còn thiếu bao nhiêu.
  function renderCloset(view, character, name) {
    const entries = skins ? skins.list(who, {coins: view.coins, tickets: view.tickets}) : [];
    const key = JSON.stringify([who, view.coins, view.tickets, entries.map(entry => [entry.id, entry.owned, entry.equipped, entry.affordable])]);
    if (key === closetKey) return;
    closetKey = key; closet.replaceChildren();
    for (const entry of entries) {
      const card = node('article',undefined,'erii-life__skin'); card.dataset.skin = entry.id;
      card.dataset.state = entry.equipped ? 'equipped' : entry.owned ? 'owned' : entry.affordable ? 'open' : 'locked';
      const unit = entry.currency === 'tickets' ? 'vé hoa' : 'xu vàng', cost = `${entry.price} ${unit}`;
      const tag = node('span', entry.equipped ? 'Đang dùng' : entry.owned ? 'Đã sở hữu' : entry.price ? cost : 'Miễn phí', 'erii-life__skin-tag');
      const image = node('img',undefined,'erii-life__skin-image'); image.loading = 'lazy'; image.draggable = false;
      const url = skinArt?.(character, entry.id === DEFAULT_SKIN ? null : entry.skin, 'idle') || null;
      image.hidden = !url; if (url) image.src = url; image.alt = `${entry.skin.name} của ${name}`;
      const shortage = Math.max(0, entry.price - entry.balance);
      const availability = node('p', entry.owned ? 'Mua rồi có thể thay đổi tùy thích.' : !shortage ? 'Số dư đã đủ, có thể mua ngay.' : `Còn thiếu ${shortage} ${unit}`, 'erii-life__skin-shortage');
      const control = button(entry.equipped ? 'Đang mặc' : entry.owned ? 'Mặc vào' : entry.price ? `Mua · ${cost}` : 'Nhận miễn phí', entry.owned && !entry.equipped ? 'erii-life__primary' : undefined, entry.owned ? 'sparkle' : 'coin');
      control.dataset.skin = entry.id; control.dataset.act = entry.owned ? 'equip' : 'buy';
      control.disabled = entry.equipped || !entry.affordable;
      control.title = entry.equipped ? `${name} hiện đang mặc bộ này` : entry.owned ? `Cho ${name} đổi sang ${entry.skin.name}` : entry.affordable ? `Dùng ${cost} mua ${entry.skin.name}` : `Còn thiếu ${shortage} ${unit}`;
      control.setAttribute('aria-label', `${control.querySelector('span:last-child').textContent}: ${entry.skin.name}`);
      card.append(tag,image,node('h4',entry.skin.name),node('p',entry.skin.description || ''),availability,control); closet.append(card);
    }
    closetNote.textContent = entries.length > 1
      ? 'Hãy làm thêm kiếm xu vàng trước, sau đó đổi sang vé hoa thủ công để mua trang phục. Đồ đã mua được lưu riêng theo từng nhân vật, có thể tự do thay đổi hoặc quay về trang phục mặc định. Vé hoa còn dư sau khi đổi sẽ được giữ nguyên, không thể đổi ngược lại xu vàng.'
      : 'Nhân vật này tạm thời chưa có skin nào được mở bán; xu vàng và vé hoa dùng chung trong gia đình, trang phục đã mua được lưu theo từng nhân vật.';
  }
  function updateExchange(view = model.view(who)) {
    const coins = exchangeInput.valueAsNumber, tickets = coins * FLOWER_EXCHANGE_RATE;
    const valid = Number.isSafeInteger(coins) && coins > 0;
    exchangeButton.disabled = !valid || coins > view.coins || view.tickets + tickets > 1000000000;
    exchangePreview.textContent = valid ? `Nhận được ${tickets} vé hoa${coins > view.coins ? ' · Xu vàng không đủ' : ''}` : 'Vui lòng nhập số nguyên dương xu vàng';
    const entry = skins?.list(who, {coins:view.coins, tickets:view.tickets}).find(item => !item.owned && item.currency === 'tickets');
    const needed = entry ? Math.ceil(Math.max(0, entry.price - view.tickets) / FLOWER_EXCHANGE_RATE) : 0;
    exchangeFill.hidden = !entry; exchangeFill.disabled = !needed;
    exchangeFill.dataset.coins = String(needed);
    exchangeHint.textContent = needed ? `Mua「${entry.skin.name}」cần thêm ${Math.max(0,entry.price - view.tickets)} vé hoa, cần đổi ${needed} xu vàng.` : entry ? 'Vé hoa đã đủ, có thể mua trực tiếp.' : 'Vé hoa có thể tích lũy để mua trang phục. Nhập số lượng và đổi thủ công, hệ thống không tự động trừ xu vàng.';
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
      control.title = url ? '' : 'Không tìm thấy ảnh của nhân vật này, tạm thời không thể phân công';
    }
    balance.textContent = String(view.coins); stats.textContent = `Cùng làm thêm ${view.jobs} lần · Dùng bữa ${view.meals} lần`;
    ticketBalance.textContent = String(view.tickets); updateExchange(view);
    welfare.hidden = !view.welfare;
    const key = `${who}:${skinOf(who)}:${active ? `${active.uid}:${view.ready}` : 'idle'}`;
    // Mỗi lần render đều so sánh lại địa chỉ ảnh: Sau khi thay đồ index.js sẽ lấy lại ảnh mới, tại đây đổi theo mà không cần chờ trạng thái khác thay đổi.
    const url = active ? art(character, view.item.image) : art(character, 'idle');
    if (url && url !== sceneUrl) { sceneUrl = url; illustration.src = url; }
    if (key !== sceneKey) {
      sceneKey = key; cancelConfirmed = false;
      illustration.alt = active ? `${name} ${active.kind === 'food' ? 'ăn' : 'làm thêm tại'} ${view.item.name}` : `Hình minh họa sinh hoạt của ${name}`;
      activityTitle.textContent = view.ready ? 'Tan làm rồi, tiền lương đợi bạn nhận.' : active?.kind === 'job' ? `Phụ tá nhỏ của ${view.item.name}` : active?.kind === 'food' ? `Dùng bữa thôi · ${view.item.name}` : `${name} đang ở nhà, chăm chỉ kiếm một chút rồi thưởng thức món mình thích nhé.`;
      activityLine.textContent = view.ready ? 'Hôm nay đã hoàn thành thật tốt một công việc, dùng xu vàng nhận được để mua đồ ăn ngon nào.' : active ? view.item.line : '“Từng chút từng chút một, cũng gom góp nên niềm vui bé nhỏ hôm nay.”';
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
    countdown.textContent = view.ready ? `Chờ nhận ${view.item.reward} xu vàng` : active?.kind === 'job' ? `Còn ${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')} là tan làm` : active ? `Ăn từ từ nhé · Còn ${seconds} giây` : '';
    claim.hidden = !view.ready; claim.querySelector('span:last-child').textContent = `Nhận ${view.item?.reward || 0} xu vàng`;
    claim.setAttribute('aria-label','Nhận tiền lương'); cancel.hidden = !active || active.kind !== 'job' || view.ready;
    cancel.querySelector('span').textContent = cancelConfirmed ? 'Xác nhận tan làm (không có lương)' : 'Tan làm sớm';
    activityActions.hidden = claim.hidden && cancel.hidden;
    for (const control of jobButtons) { control.disabled = Boolean(active) || busy; control.setAttribute('aria-label',`Cho ${name} đi làm thêm tại ${JOBS.find(job => job.id === control.dataset.job).name}`); }
    for (const control of foodButtons) {
      const food = FOODS.find(item => item.id === control.dataset.food);
      control.disabled = Boolean(active) || busy || view.coins < food.price;
      control.title = active ? `${name} đang bận` : busy ? 'Chờ nhiệm vụ cơ sở dữ liệu kết thúc rồi hãy dùng bữa' : view.coins < food.price ? `Còn thiếu ${food.price - view.coins} xu vàng` : `Mời ${name} ăn ${food.name}`;
    }
    const journalKey = JSON.stringify(view.journal);
    if (journalKey !== recordsKey) {
      recordsKey = journalKey; records.replaceChildren();
      if (!view.journal.length) records.append(node('li','Khoản lương đầu tiên và bữa ăn đầu tiên sẽ được ghi lại ở đây.'));
      for (const entry of view.journal) {
        const row = node('li'); row.dataset.kind = entry.kind;
        const date = new Date(entry.at), time = node('time',date.toLocaleString('vi-VN',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false})); time.dateTime = date.toISOString();
        const family = !entry.who && ['welfare','exchange'].includes(entry.kind);
        const tag = node('b', family ? 'Gia đình' : nameOf(byId(entry.who || 'erii')), 'erii-life__who'); tag.dataset.character = family ? '' : entry.who || 'erii';
        row.append(time,tag,node('span',entry.text)); records.append(row);
      }
    }
    renderCloset(view, character, name);
    totals.textContent = `Tích lũy nhận ${view.earned} xu vàng · Đã tiêu ${view.spent} xu vàng\nĐổi được ${view.ticketsEarned} vé hoa · Đã dùng ${view.ticketsSpent} vé hoa`;
    root.dataset.activity = active?.kind || 'idle'; root.dataset.ready = String(view.ready); root.dataset.coins = String(view.coins);
  }
  function action(callback, message, event) {
    if (destroyed) return;
    const result = callback();
    if (!result) { say('Hãy hoàn thành hoạt động hiện tại và kiểm tra đủ xu vàng.'); render(); return; }
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
  listen(claim,'click',()=>action(()=>model.claim(who),'Đã nhận tiền lương, có thể chọn một món ngon mình thích rồi.',{type:'wage'}));
  listen(cancel,'click',()=> { if (!cancelConfirmed) {cancelConfirmed = true; render(); say('Nhấn tan làm sớm lần nữa sẽ không nhận được xu vàng lần này.');} else action(()=>model.cancelJob(who),'Hôm nay nghỉ ngơi trước, không bị trừ xu vàng.'); });
  listen(welfare,'click',()=> { const amount = model.claimWelfare(); if (!amount) { say('Hôm nay đã nhận rồi, hoặc ví tiền vẫn còn đủ dùng.'); render(); return; } say(`Đã nhận ${amount} xu vàng trợ cấp. Hãy chi tiêu tiết kiệm nhé.`); render(); onChange?.(); onEvent?.('welfare', who, {amount}); });
  listen(exchangeInput,'input',()=>updateExchange());
  listen(exchangeFill,'click',()=> { exchangeInput.value = exchangeFill.dataset.coins; updateExchange(); say(`Đã điền ${exchangeInput.value} xu vàng, bấm "Đổi vé hoa" mới tiến hành trừ tiền.`); exchangeInput.focus({preventScroll:true}); });
  listen(exchange,'submit',event=> {
    event.preventDefault(); if (destroyed) return;
    const result = model.exchangeTickets(exchangeInput.valueAsNumber);
    if (!result) { say('Đổi thất bại: Vui lòng nhập số nguyên dương, xác nhận đủ xu vàng và vé hoa chưa vượt giới hạn.'); render(); return; }
    say(`Đã dùng ${result.coins} xu vàng đổi lấy ${result.tickets} vé hoa.`); render(); onChange?.();
  });
  listen(tabs,'click',event=> {const control = event.target.closest?.('button[data-tab]'); if (control) select(control.dataset.tab);});
  listen(tabs,'keydown',event=> {
    const keys = Object.keys(tabButtons), index = keys.indexOf(selected);
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault(); const next = event.key === 'Home' ? 0 : event.key === 'End' ? keys.length-1 : (index+(event.key === 'ArrowRight' ? 1 : -1)+keys.length)%keys.length;
    select(keys[next]); tabButtons[keys[next]].focus();
  });
  // Mua skin và thay trang phục không chiếm hoạt động, không chạm vào cơ sở dữ liệu nên khi cơ sở dữ liệu bận vẫn thao tác được.
  function changeSkin(control) {
    const id = control.dataset.skin, name = nameOf(byId(who));
    if (control.dataset.act === 'buy') {
      const result = skins.buy(who, id);
      if (!result.ok) {
        say(result.reason === 'tickets' ? 'Chưa đủ vé hoa, hãy dùng xu vàng làm thêm để đổi vé hoa nhé.' : result.reason === 'coins' ? 'Chưa đủ xu vàng, hãy đi làm thêm trước nhé.' : result.reason === 'owned' ? 'Đã mua rồi, chỉ cần mặc vào là được.' : 'Bộ trang phục này hiện chưa thể mua.');
        render(); return;
      }
      // Báo cho index.js trước (sẽ lấy lại ảnh mới, cho pet nói chuyện), sau đó mới vẽ lại bên này: ảnh minh họa và thumbnail sẽ lấy ngay ảnh mới.
      onEvent?.('skin', who, {id, action:'bought', name:result.skin.name});
      say(`Đã mua xong「${result.skin.name}」, hãy cho ${name} mặc thử xem.`); render(); onChange?.(); return;
    }
    if (!skins.equip(who, id)) { say('Hiện không thể đổi sang bộ này.'); render(); return; }
    onEvent?.('skin', who, {id, action:'equipped'});
    say(id === DEFAULT_SKIN ? `${name} đã thay lại trang phục thường ngày.` : `${name} đã khoác lên bộ trang phục mới.`); render(); onChange?.();
  }
  listen(scroll,'click',event=> {
    const control = event.target.closest?.('button[data-job],button[data-food],button[data-skin]'); if (!control || control.disabled) return;
    if (control.dataset.skin) { if (skins) changeSkin(control); return; }
    if (blocked?.()) {say('Cơ sở dữ liệu đang xử lý nhiệm vụ, vui lòng đợi hoàn thành rồi hãy bắt đầu.'); return;}
    const name = nameOf(byId(who));
    if (control.dataset.job) action(()=>model.startJob(control.dataset.job, who),`${name} đi phụ việc đây. Khi về nhớ nhận tiền lương nhé.`,{type:'job',detail:{id:control.dataset.job}});
    if (control.dataset.food) action(()=>model.buyFood(control.dataset.food, who),`Mua xong rồi, để ${name} ăn từ từ nhé.`,{type:'food',detail:{id:control.dataset.food}});
  });
  listen(taskStop,'click',()=>onStopTask?.(taskStop.dataset.taskId));
  listen(taskOpen,'click',()=>onOpenDatabase?.());
  listen(root,'keydown',event=> {if (event.key === 'Escape') {event.stopPropagation(); hide();}});
  select(selected); render();
  return {open, close:hide, render, get visible(){return !root.hidden;},
    setCharacter(id) { if (root.hidden) who = id; render(); },
    get tab() { return selected; },
    coinAnchor() { const rect = balance.getBoundingClientRect(); return {x:rect.left + rect.width / 2, y:rect.top + rect.height / 2}; },
    setTask(task) {taskBar.hidden = !task; if (!task) return; taskText.textContent = task.text; taskStop.dataset.taskId = task.id || ''; taskStop.hidden = !task.canStop; taskStop.disabled = task.pending; taskStop.querySelector('span').textContent = task.pending ? 'Đang dừng…' : 'Dừng tác vụ';},
    destroy() {if (destroyed) return; destroyed = true; sheet.destroy(); for(const remove of listeners) remove(); root.remove();},
  };
}