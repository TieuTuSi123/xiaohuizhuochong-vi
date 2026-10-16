import {FLOWER_EXCHANGE_RATE} from './life-model.js';
import {DEFAULT_SKIN} from './skin-model.js';
import {createSheet, viewport} from './sheet.js';
import {icon} from './icons.js';

// 商场使用原钱包和皮肤目录；只购买，不自动穿上。当前上架的是绘梨衣的衣服。
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
  const headings = node('div'), title = node('h2','商场'); title.id = 'erii-mall-heading';
  headings.append(node('span','给她挑一件新衣服','erii-mall__eyebrow'),title);
  const close = button('×','erii-mall__close'); close.setAttribute('aria-label','关闭商场'); header.append(headings,close);
  const wallet = node('div',undefined,'erii-mall__wallet');
  const coinBalance = node('strong','0'), ticketBalance = node('strong','0');
  coinBalance.setAttribute('aria-label','商场金币余额'); ticketBalance.setAttribute('aria-label','商场花票余额');
  const coins = node('div'); coins.append(icon(doc,'coin'),node('span','金币'),coinBalance);
  const tickets = node('div'); tickets.append(icon(doc,'flower'),node('span','花票'),ticketBalance);
  wallet.append(coins,tickets);
  const taskBar = node('div',undefined,'erii-mall__task'); taskBar.hidden = true;
  const taskText = node('span'), taskStop = button('停止任务'), taskOpen = button('打开数据库');
  taskStop.setAttribute('aria-label','停止数据库任务（商场）'); taskBar.append(taskText,taskOpen,taskStop);
  const scroll = node('div',undefined,'erii-mall__scroll');
  const nav = node('nav',undefined,'erii-mall__nav'); nav.setAttribute('aria-label','商场快捷入口');
  const work = button('去打工攒金币',undefined,'briefcase'), wardrobe = button('我的衣柜',undefined,'shirt'); nav.append(work,wardrobe);
  const catalog = node('div',undefined,'erii-mall__catalog'); catalog.setAttribute('aria-label','已上架服装');
  const people=node('div',undefined,'erii-mall__people');people.setAttribute('role','group');people.setAttribute('aria-label','选择服装角色');
  for(const person of characters){if(!skins.list(person.id).some(entry=>entry.id!==DEFAULT_SKIN))continue;const control=button(nameOf(person));control.dataset.who=person.id;people.append(control);}
  const product = node('article',undefined,'erii-mall__product');
  const plate = node('div',undefined,'erii-mall__plate'), badge = node('span','','erii-mall__badge');
  const image = node('img'); image.draggable = false; image.decoding = 'async'; plate.append(badge,image);
  const copy = node('div',undefined,'erii-mall__copy'), productName = node('h3'), description = node('p'), scope = node('p','','erii-mall__scope');
  const priceTag = node('div',undefined,'erii-mall__price'), price = node('strong'), unit = node('span'); priceTag.append(price,unit);
  const poses = node('div',undefined,'erii-mall__poses'); poses.setAttribute('role','group'); poses.setAttribute('aria-label','服装动作预览');
  for (const [pose,label] of [['idle','坐着'],['wave','挥手'],['duck','抱鸭'],['eat-pudding','吃布丁']]) { const control = button(label); control.dataset.pose = pose; poses.append(control); }
  const ownershipNote=node('p','获得后可以一直穿，随时换回默认装扮。','erii-mall__note');
  copy.append(scope,productName,description,priceTag,ownershipNote,poses);
  product.append(plate,copy);
  const exchange = node('form',undefined,'erii-mall__exchange'); exchange.setAttribute('aria-label','商场花票兑换');
  const exchangeHead = node('div',undefined,'erii-mall__exchange-head'); exchangeHead.append(node('h3','花票兑换'),node('span',`1 金币 = ${FLOWER_EXCHANGE_RATE} 张花票`));
  const controls = node('div',undefined,'erii-mall__exchange-controls'), label = node('label','使用金币');
  const input = node('input'); input.id = 'erii-mall-exchange-coins'; input.type = 'number'; input.inputMode = 'numeric'; input.min = '1'; input.step = '1'; input.value = '1'; label.htmlFor = input.id;
  const exchangeButton = button('兑换花票','erii-mall__primary'); exchangeButton.type = 'submit'; controls.append(label,input,exchangeButton);
  const output = node('output','','erii-mall__exchange-preview'); output.htmlFor = input.id;
  const fill = button('填入购衣所需金币','erii-mall__fill'), exchangeHint = node('p','','erii-mall__note');
  exchange.append(exchangeHead,controls,output,fill,exchangeHint);
  const unlock=node('form',undefined,'erii-mall__unlock');unlock.hidden=true;unlock.setAttribute('aria-label','零的服装密语解锁');
  const phraseLabel=node('label','写下你们的密语'),phraseInput=node('textarea');phraseInput.rows=3;phraseInput.maxLength=200;phraseInput.setAttribute('aria-label','服装解锁密语');phraseLabel.append(phraseInput);
  const unlockButton=button('确认密语并解锁','erii-mall__primary');unlockButton.type='submit';
  unlock.append(node('h3','约定的密语'),phraseLabel,node('p','不需要金币或花票。解锁后去零的衣柜换上。','erii-mall__note'),unlockButton);
  scroll.append(nav,people,catalog,product,exchange,unlock);
  const footer = node('footer',undefined,'erii-mall__footer'), affordability = node('p','','erii-mall__affordability');
  const exchangeLink = button('去兑换花票','erii-mall__exchange-link');
  const purchaseHelp = node('div',undefined,'erii-mall__purchase-help'); purchaseHelp.append(affordability,exchangeLink);
  const buy = button('购买衣服','erii-mall__buy','shirt');
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
    output.textContent = !valid ? '请输入正整数金币。' : `可得 ${gained} 张花票${amount > view.coins ? ' · 金币不足' : over ? ' · 花票超过上限' : ''}`;
    const need = entry && !entry.owned && entry.currency === 'tickets' ? Math.ceil(Math.max(0,entry.price-view.tickets)/FLOWER_EXCHANGE_RATE) : 0;
    fill.hidden = !entry || entry.owned || entry.currency !== 'tickets'; fill.disabled = !need; fill.dataset.coins = String(need);
    exchangeHint.textContent = need ? `这件衣服还需 ${Math.max(0,entry.price-view.tickets)} 张花票，可用 ${need} 金币换够。` : '兑换后剩余花票会保留；花票不能换回金币。';
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
    // 当前只有一件。以后目录增加服装时，直接在这里选择，不展示虚构的待上架商品。
    const catalogKey = list.map(item=>item.id).join('|');
    if (catalog.dataset.key !== catalogKey) {
      catalog.dataset.key = catalogKey; catalog.replaceChildren();
      if (!list.length) catalog.append(node('p','暂时没有上架的服装。'));
      for (const item of list) { const choice = button(item.skin.name); choice.dataset.skin = item.id; catalog.append(choice); }
    }
    for (const choice of catalog.querySelectorAll('button')) choice.setAttribute('aria-pressed',String(choice.dataset.skin===selectedId));
    if (entry) {
      const currencyUnit = entry.currency === 'tickets' ? '张花票' : '金币';
      product.dataset.skin = entry.id; product.dataset.owned = String(entry.owned);
      badge.textContent = entry.owned ? '已拥有' : phrase ? '密语解锁' : `${nameOf(who)}的新衣服`;
      productName.textContent = entry.skin.name; description.textContent = entry.skin.description;
      scope.textContent = `给${nameOf(who)}穿 · ${Object.keys(entry.skin.assets?.poses || {}).length} 张动作配图`;
      price.textContent = phrase ? '密语' : String(entry.price); unit.textContent = phrase ? '专属解锁 · 不扣货币' : currencyUnit;
      const url = skinArt(who,entry.skin,previewPose);
      if (url !== imageUrl) {imageUrl = url; image.hidden = !url; if (url) image.src = url;}
      image.alt = `${nameOf(who)}穿${entry.skin.name}的动作预览`;
      for(const control of poses.children)if(control.dataset.pose==='duck')control.querySelector('span').textContent=who.id==='zero'?'抱天鹅':'抱鸭';
      for (const control of poses.children) control.setAttribute('aria-pressed',String(control.dataset.pose===previewPose));
      const shortage = Math.max(0,entry.price-entry.balance);
      affordability.textContent = entry.owned ? '已经获得，去衣柜即可免费换上。' : phrase ? '写下约定的密语，即可永久解锁。' : shortage ? `还差 ${shortage} ${currencyUnit}${entry.currency==='tickets' ? ` · 兑换需 ${Math.ceil(shortage/FLOWER_EXCHANGE_RATE)} 金币` : ''}` : '余额够了，可以购买这件衣服。';
      buy.querySelector('span:last-child').textContent = entry.owned ? '去衣柜换上' : phrase ? '去输入密语' : `购买衣服 · ${entry.price} ${currencyUnit}`;
      buy.setAttribute('aria-label',entry.owned ? '去衣柜换上' : phrase ? '去输入密语' : `购买${entry.skin.name}`);
      buy.dataset.owned = String(entry.owned);
    } else {affordability.textContent = '以后有新衣服会在这里显示。';}
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
  listen(fill,'click',()=>{input.value=fill.dataset.coins; updateExchange(model.view(who.id),current()); say(`已填入 ${input.value} 金币；点击“兑换花票”才扣款。`); input.focus({preventScroll:true});});
  listen(exchange,'submit',event=>{
    event.preventDefault(); if (destroyed || root.hidden) return;
    const result=model.exchangeTickets(input.valueAsNumber);
    say(result ? `已兑换 ${result.tickets} 张花票。` : '兑换失败，请确认金币足够、数量为正整数且花票未超上限。');
    render(); if (result) onChange?.();
  });
  listen(buy,'click',()=>{
    if (destroyed || root.hidden) return;
    const entry=current(); if (!entry) return;
    if (entry.owned) {goWardrobe(); return;}
    if(entry.skin.unlock){unlock.scrollIntoView({block:'start'});phraseInput.focus({preventScroll:true});return;}
    const result=skins.buy(who.id,entry.id);
    if (!result.ok) {say(result.reason==='tickets' ? '花票不够，先兑换或去打工。' : result.reason==='coins' ? '金币不够，先去打工。' : '这件衣服现在买不了。'); render(); return;}
    onEvent?.('skin',who.id,{id:entry.id,action:'bought',name:result.skin.name});
    say(`买到了「${result.skin.name}」！点“去衣柜换上”试试。`); render(); onChange?.();
  });
  listen(unlock,'submit',event=>{
    event.preventDefault();if(destroyed || root.hidden)return;const entry=current();if(!entry?.skin.unlock || entry.owned)return;
    const result=skins.unlock(who.id,entry.id,phraseInput.value);
    if(!result.ok){say(result.reason==='phrase'?'密语还没有对上，请检查文字和标点。':'现在无法解锁这套装扮。');return;}
    phraseInput.value='';onEvent?.('skin',who.id,{id:entry.id,action:'unlocked',name:result.skin.name});
    say(`「${result.skin.name}」已解锁，没有扣除金币或花票。去衣柜换上吧。`);render();onChange?.();
  });
  listen(taskStop,'click',()=>onStopTask?.(taskStop.dataset.taskId)); listen(taskOpen,'click',()=>onOpenDatabase?.());
  listen(image,'error',()=>{say('服装预览图没有加载，请检查扩展的图片文件。');});
  listen(root,'keydown',event=>{if(event.key==='Escape'){event.stopPropagation();hide();}});
  return {open,close:hide,render,get visible(){return !root.hidden;},
    setTask(task){if(destroyed)return;taskBar.hidden=!task;if(!task)return;taskText.textContent=task.text;taskStop.dataset.taskId=task.id||'';taskStop.hidden=!task.canStop;taskStop.disabled=task.pending;taskStop.querySelector('span').textContent=task.pending?'停止中…':'停止任务';},
    destroy(){if(destroyed)return;destroyed=true;sheet.destroy();for(const remove of listeners)remove();root.remove();},
  };
}
