import {FLOWER_EXCHANGE_RATE} from './life-model.js';
import {DEFAULT_SKIN} from './skin-model.js';
import {createSheet, viewport} from './sheet.js';
import {icon} from './icons.js';

// Cửa hàng sử dụng ví và danh mục trang phục ban đầu; chỉ mua, không tự động mặc vào. Hiện tại đang bày bán quần áo của Erii.
export function createMallWindow(host, {model, skins, character, characters = [character], currentId = () => character.id, skinArt, nameOf, onOpen, onClose,
  onChange, onEvent, onWardrobe, onWork, onStopTask, onOpenDatabase, returnFocus}) {
  const doc = host.document, listeners = [];
  let who=character;
  let destroyed = false, selectedId = '', previewPose = 'idle', imageUrl = '';
  const node = (tag, text, className) => { const e = doc.createElement(tag); if (text !== undefined) e.textContent = text; if (className) e.className = className; return e; };
  const button = (text, className, glyph) => { const e = node('button',undefined,className); e.type = 'button'; if (glyph) e.append(icon(doc,glyph)); e.append(node('span',text)); return e; };
  const listen = (target,type,fn) => { target.addEventListener(type,fn); listeners.push(()=>target.removeEventListener(type,fn)); };
  const root = node('section',undefined,'erii-mall'); root.id = 'erii-database-pet-mall'; root.hidden = true;
  root.setAttribute('role','dialog'); root.setAttribute('aria-labelledby','erii-mall-heading');
  const grip = node('div',undefined,'pet-grip'); grip.setAttribute('aria-hidden','true');
  const header = node('header',undefined,'erii-mall__header');
  const headings = node('div'), title = node('h2','Cửa hàng'); title.id = 'erii-mall-heading';
  headings.append(node('span','Chọn cho cô ấy một bộ trang phục mới','erii-mall__eyebrow'),title);
  const close = button('×','erii-mall__close'); close.setAttribute('aria-label','Đóng cửa hàng'); header.append(headings,close);
  const wallet = node('div',undefined,'erii-mall__wallet');
  const coinBalance = node('strong','0'), ticketBalance = node('strong','0');
  coinBalance.setAttribute('aria-label','Số dư vàng cửa hàng'); ticketBalance.setAttribute('aria-label','Số dư vé hoa cửa hàng');
  const coins = node('div'); coins.append(icon(doc,'coin'),node('span','Vàng'),coinBalance);
  const tickets = node('div'); tickets.append(icon(doc,'flower'),node('span','Vé hoa'),ticketBalance);
  wallet.append(coins,tickets);
  const taskBar = node('div',undefined,'erii-mall__task'); taskBar.hidden = true;
  const taskText = node('span'), taskStop = button('Dừng nhiệm vụ'), taskOpen = button('Mở cơ sở dữ liệu');
  taskStop.setAttribute('aria-label','Dừng nhiệm vụ CSDL (Cửa hàng)'); taskBar.append(taskText,taskOpen,taskStop);
  const scroll = node('div',undefined,'erii-mall__scroll');
  const nav = node('nav',undefined,'erii-mall__nav'); nav.setAttribute('aria-label','Lối vào nhanh cửa hàng');
  const work = button('Đi làm thêm tích lũy vàng',undefined,'briefcase'), wardrobe = button('Tủ đồ của tôi',undefined,'shirt'); nav.append(work,wardrobe);
  const catalog = node('div',undefined,'erii-mall__catalog'); catalog.setAttribute('aria-label','Trang phục đang mở bán');
  const people=node('div',undefined,'erii-mall__people');people.setAttribute('role','group');people.setAttribute('aria-label','Chọn nhân vật');
  for(const person of characters){if(!skins.list(person.id).some(entry=>entry.id!==DEFAULT_SKIN))continue;const control=button(nameOf(person));control.dataset.who=person.id;people.append(control);}
  const product = node('article',undefined,'erii-mall__product');
  const plate = node('div',undefined,'erii-mall__plate'), badge = node('span','','erii-mall__badge');
  const image = node('img'); image.draggable = false; image.decoding = 'async'; plate.append(badge,image);
  const copy = node('div',undefined,'erii-mall__copy'), productName = node('h3'), description = node('p'), scope = node('p','','erii-mall__scope');
  const priceTag = node('div',undefined,'erii-mall__price'), price = node('strong'), unit = node('span'); priceTag.append(price,unit);
  const poses = node('div',undefined,'erii-mall__poses'); poses.setAttribute('role','group'); poses.setAttribute('aria-label','Xem trước động tác trang phục');
  for (const [pose,label] of [['idle','Ngồi'],['wave','Vẫy tay'],['duck','Ôm vịt'],['eat-pudding','Ăn pudding']]) { const control = button(label); control.dataset.pose = pose; poses.append(control); }
  const ownershipNote=node('p','Sau khi nhận được có thể mặc vĩnh viễn, đổi về trang phục mặc định bất cứ lúc nào.','erii-mall__note');
  copy.append(scope,productName,description,priceTag,ownershipNote,poses);
  product.append(plate,copy);
  const exchange = node('form',undefined,'erii-mall__exchange'); exchange.setAttribute('aria-label','Đổi vé hoa cửa hàng');
  const exchangeHead = node('div',undefined,'erii-mall__exchange-head'); exchangeHead.append(node('h3','Đổi vé hoa'),node('span',`1 Vàng = ${FLOWER_EXCHANGE_RATE} Vé hoa`));
  const controls = node('div',undefined,'erii-mall__exchange-controls'), label = node('label','Dùng vàng');
  const input = node('input'); input.id = 'erii-mall-exchange-coins'; input.type = 'number'; input.inputMode = 'numeric'; input.min = '1'; input.step = '1'; input.value = '1'; label.htmlFor = input.id;
  const exchangeButton = button('Đổi vé hoa','erii-mall__primary'); exchangeButton.type = 'submit'; controls.append(label,input,exchangeButton);
  const output = node('output','','erii-mall__exchange-preview'); output.htmlFor = input.id;
  const fill = button('Điền số vàng cần để mua áo','erii-mall__fill'), exchangeHint = node('p','','erii-mall__note');
  exchange.append(exchangeHead,controls,output,fill,exchangeHint);
  const unlock=node('form',undefined,'erii-mall__unlock');unlock.hidden=true;unlock.setAttribute('aria-label','Mở khóa trang phục Zero bằng mật ngữ');
  const phraseLabel=node('label','Viết ra mật ngữ hẹn ước của hai bạn'),phraseInput=node('textarea');phraseInput.rows=3;phraseInput.maxLength=200;phraseInput.setAttribute('aria-label','Mật ngữ mở khóa trang phục');phraseLabel.append(phraseInput);
  const unlockButton=button('Xác nhận mật ngữ và mở khóa','erii-mall__primary');unlockButton.type='submit';
  unlock.append(node('h3','Mật ngữ hẹn ước'),phraseLabel,node('p','Không cần vàng hay vé hoa. Sau khi mở khóa hãy đến tủ đồ của Zero để mặc vào.','erii-mall__note'),unlockButton);
  scroll.append(nav,people,catalog,product,exchange,unlock);
  const footer = node('footer',undefined,'erii-mall__footer'), affordability = node('p','','erii-mall__affordability');
  const exchangeLink = button('Đến đổi vé hoa','erii-mall__exchange-link');
  const purchaseHelp = node('div',undefined,'erii-mall__purchase-help'); purchaseHelp.append(affordability,exchangeLink);
  const buy = button('Mua trang phục','erii-mall__buy','shirt');
  const status = node('p','','erii-mall__status'); status.setAttribute('role','status'); status.setAttribute('aria-live','polite');
  footer.append(purchaseHelp,buy,status); root.append(grip,header,wallet,taskBar,scroll,footer); doc.body.append(root);
  const sheet = createSheet(host,root,{grip,drag:[header],desktop:()=>({width:560,height:750}),onDismiss:()=>hide()});
  const entries = view => skins.list(who.id,{coins:view.coins,tickets:view.tickets}).filter(entry=>entry.id !== DEFAULT_SKIN);
  const current = () => entries(model.view(who.id)).find(entry=>entry.id===selectedId);
  const say = text => {status.textContent = text;};
  function updateExchange(view, entry) {
    const amount = input.valueAsNumber, gained = amount * FLOWER_EXCHANGE_RATE;
    const valid = Number.isSafeInteger(amount) && amount > 0, over = view.tickets + gained > 1000000000;
    exchangeButton.disabled = !valid || amount > view.coins || over;
    output.textContent = !valid ? 'Vui lòng nhập số vàng là số nguyên dương.' : `Nhận được ${gained} vé hoa${amount > view.coins ? ' · Không đủ vàng' : over ? ' · Vượt quá giới hạn vé hoa' : ''}`;
    const need = entry && !entry.owned && entry.currency === 'tickets' ? Math.ceil(Math.max(0,entry.price-view.tickets)/FLOWER_EXCHANGE_RATE) : 0;
    fill.hidden = !entry || entry.owned || entry.currency !== 'tickets'; fill.disabled = !need; fill.dataset.coins = String(need);
    exchangeHint.textContent = need ? `Bộ trang phục này còn cần ${Math.max(0,entry.price-view.tickets)} vé hoa, có thể dùng ${need} vàng để đổi đủ.` : 'Sau khi đổi, vé hoa còn dư sẽ được giữ lại; vé hoa không thể đổi ngược lại thành vàng.';
  }
  function render() {
    if (destroyed || root.hidden) return;
    root.dataset.compact = String(viewport(host).height < 480);
    const view = model.view(who.id), list = entries(view);
    root.dataset.character=who.id;
    for(const control of people.children)control.setAttribute('aria-pressed',String(control.dataset.who===who.id));
    if (!list.some(entry=>entry.id===selectedId)) { selectedId = list[0]?.id || ''; previewPose = 'idle'; }
    const entry = list.find(item=>item.id===selectedId);
    coinBalance.textContent = String(view.coins); ticketBalance.textContent = String(view.tickets);
    const phrase=entry?.skin.unlock?.type==='phrase';
    product.hidden = !entry; buy.disabled = !entry || (!phrase && !entry.affordable); catalog.hidden = list.length === 1;
    exchange.hidden=Boolean(phrase);unlock.hidden=!phrase || entry.owned;
    exchangeLink.hidden = !entry || entry.owned || entry.currency !== 'tickets' || entry.affordable;
    // Hiện tại chỉ có một bộ. Sau này khi danh mục thêm trang phục, trực tiếp chọn tại đây, không hiển thị các món hàng sắp ra mắt hư cấu.
    const catalogKey = list.map(item=>item.id).join('|');
    if (catalog.dataset.key !== catalogKey) {
      catalog.dataset.key = catalogKey; catalog.replaceChildren();
      if (!list.length) catalog.append(node('p','Tạm thời chưa có trang phục nào mở bán.'));
      for (const item of list) { const choice = button(item.skin.name); choice.dataset.skin = item.id; catalog.append(choice); }
    }
    for (const choice of catalog.querySelectorAll('button')) choice.setAttribute('aria-pressed',String(choice.dataset.skin===selectedId));
    if (entry) {
      const currencyUnit = entry.currency === 'tickets' ? 'vé hoa' : 'vàng';
      product.dataset.skin = entry.id; product.dataset.owned = String(entry.owned);
      badge.textContent = entry.owned ? 'Đã sở hữu' : phrase ? 'Mở khóa bằng mật ngữ' : `Trang phục mới của ${nameOf(who)}`;
      productName.textContent = entry.skin.name; description.textContent = entry.skin.description;
      scope.textContent = `Dành cho ${nameOf(who)} · ${Object.keys(entry.skin.assets?.poses || {}).length} ảnh động tác đi kèm`;
      price.textContent = phrase ? 'Mật ngữ' : String(entry.price); unit.textContent = phrase ? 'Mở khóa độc quyền · Không trừ tiền' : currencyUnit;
      const url = skinArt(who,entry.skin,previewPose);
      if (url !== imageUrl) {imageUrl = url; image.hidden = !url; if (url) image.src = url;}
      image.alt = `Xem trước động tác ${nameOf(who)} mặc ${entry.skin.name}`;
      for(const control of poses.children)if(control.dataset.pose==='duck')control.querySelector('span').textContent=who.id==='zero'?'Ôm thiên nga':'Ôm vịt';
      for (const control of poses.children) control.setAttribute('aria-pressed',String(control.dataset.pose===previewPose));
      const shortage = Math.max(0,entry.price-entry.balance);
      affordability.textContent = entry.owned ? 'Đã nhận được, hãy đến tủ đồ để thay miễn phí.' : phrase ? 'Viết ra mật ngữ hẹn ước để mở khóa vĩnh viễn.' : shortage ? `Còn thiếu ${shortage} ${currencyUnit}${entry.currency==='tickets' ? ` · Đổi cần ${Math.ceil(shortage/FLOWER_EXCHANGE_RATE)} vàng` : ''}` : 'Số dư đã đủ, có thể mua trang phục này.';
      buy.querySelector('span:last-child').textContent = entry.owned ? 'Đến tủ đồ mặc vào' : phrase ? 'Đi nhập mật ngữ' : `Mua trang phục · ${entry.price} ${currencyUnit}`;
      buy.setAttribute('aria-label',entry.owned ? 'Đến tủ đồ mặc vào' : phrase ? 'Đi nhập mật ngữ' : `Mua ${entry.skin.name}`);
      buy.dataset.owned = String(entry.owned);
    } else {affordability.textContent = 'Trang phục mới sau này sẽ hiển thị ở đây.';}
    updateExchange(view,entry);
  }
  function open(id = currentId()) {
    if (destroyed) return;
    who=characters.find(item=>item.id===id && skins.list(item.id).some(entry=>entry.id!==DEFAULT_SKIN)) || characters.find(item=>skins.list(item.id).some(entry=>entry.id!==DEFAULT_SKIN)) || character;
    phraseInput.value='';
    onOpen?.(); root.hidden = false; say(''); scroll.scrollTop = 0; render(); sheet.layout(); close.focus({preventScroll:true}); onChange?.();
  }
  function hide(focus = true) {
    if (destroyed || root.hidden) return;
    root.hidden = true; say(''); onClose?.(); if (focus) returnFocus?.();
  }
  function goWardrobe() {hide(false); onWardrobe?.(who.id);}
  listen(close,'click',()=>hide());
  listen(wardrobe,'click',goWardrobe);
  listen(work,'click',()=>{hide(false); onWork?.(who.id);});
  listen(people,'click',event=>{const control=event.target.closest?.('button[data-who]');if(!control)return;who=characters.find(item=>item.id===control.dataset.who)||who;selectedId='';phraseInput.value='';say('');render();});
  listen(poses,'click',event=>{const control=event.target.closest?.('button[data-pose]'); if (control) {previewPose=control.dataset.pose; render();}});
  listen(catalog,'click',event=>{const control=event.target.closest?.('button[data-skin]'); if (control) {selectedId=control.dataset.skin; previewPose='idle'; say(''); render();}});
  listen(input,'input',()=>updateExchange(model.view(who.id),current()));
  listen(exchangeLink,'click',()=>{exchange.scrollIntoView({block:'start',behavior:'auto'}); fill.focus({preventScroll:true});});
  listen(fill,'click',()=>{input.value=fill.dataset.coins; updateExchange(model.view(who.id),current()); say(`Đã điền ${input.value} vàng; nhấn "Đổi vé hoa" mới bị trừ tiền.`); input.focus({preventScroll:true});});
  listen(exchange,'submit',event=>{
    event.preventDefault(); if (destroyed || root.hidden) return;
    const result=model.exchangeTickets(input.valueAsNumber);
    say(result ? `Đã đổi thành công ${result.tickets} vé hoa.` : 'Đổi thất bại, vui lòng đảm bảo đủ vàng, số lượng là số nguyên dương và không vượt quá giới hạn vé hoa.');
    render(); if (result) onChange?.();
  });
  listen(buy,'click',()=>{
    if (destroyed || root.hidden) return;
    const entry=current(); if (!entry) return;
    if (entry.owned) {goWardrobe(); return;}
    if(entry.skin.unlock){unlock.scrollIntoView({block:'start'});phraseInput.focus({preventScroll:true});return;}
    const result=skins.buy(who.id,entry.id);
    if (!result.ok) {say(result.reason==='tickets' ? 'Không đủ vé hoa, hãy đổi trước hoặc đi làm thêm.' : result.reason==='coins' ? 'Không đủ vàng, hãy đi làm thêm trước.' : 'Hiện tại chưa thể mua bộ này.'); render(); return;}
    onEvent?.('skin',who.id,{id:entry.id,action:'bought',name:result.skin.name});
    say(`Đã mua được「${result.skin.name}」! Nhấn "Đến tủ đồ mặc vào" để thử nhé.`); render(); onChange?.();
  });
  listen(unlock,'submit',event=>{
    event.preventDefault();if(destroyed || root.hidden)return;const entry=current();if(!entry?.skin.unlock || entry.owned)return;
    const result=skins.unlock(who.id,entry.id,phraseInput.value);
    if(!result.ok){say(result.reason==='phrase'?'Mật ngữ chưa chính xác, vui lòng kiểm tra lại câu chữ và dấu câu.':'Hiện tại không thể mở khóa trang phục này.');return;}
    phraseInput.value='';onEvent?.('skin',who.id,{id:entry.id,action:'unlocked',name:result.skin.name});
    say(`Đã mở khóa「${result.skin.name}」, không bị trừ vàng hay vé hoa. Hãy đến tủ đồ để mặc vào nhé.`);render();onChange?.();
  });
  listen(taskStop,'click',()=>onStopTask?.(taskStop.dataset.taskId)); listen(taskOpen,'click',()=>onOpenDatabase?.());
  listen(image,'error',()=>{say('Không tải được ảnh xem trước trang phục, vui lòng kiểm tra file hình ảnh của tiện ích.');});
  listen(root,'keydown',event=>{if(event.key==='Escape'){event.stopPropagation();hide();}});
  return {open,close:hide,render,get visible(){return !root.hidden;},
    setTask(task){if(destroyed)return;taskBar.hidden=!task;if(!task)return;taskText.textContent=task.text;taskStop.dataset.taskId=task.id||'';taskStop.hidden=!task.canStop;taskStop.disabled=task.pending;taskStop.querySelector('span').textContent=task.pending?'Đang dừng…':'Dừng nhiệm vụ';},
    destroy(){if(destroyed)return;destroyed=true;sheet.destroy();for(const remove of listeners)remove();root.remove();},
  };
}