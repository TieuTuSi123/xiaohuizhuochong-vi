import {JOBS, FOODS} from './life-model.js';

export function createLifeWindow(host, {model, onOpen, onClose, onChange, blocked, onStopTask, returnFocus}) {
  const doc = host.document, listeners = [];
  let destroyed = false, selected = 'jobs', cancelConfirmed = false, lastActivity = null;
  const node = (tag, text, name) => { const element = doc.createElement(tag); if (text !== undefined) element.textContent = text; if (name) element.className = name; return element; };
  const button = (text, name) => { const element = node('button',text,name); element.type = 'button'; return element; };
  const listen = (target,type,callback) => { target.addEventListener(type,callback); listeners.push(()=>target.removeEventListener(type,callback)); };
  const imageURL = name => new URL(`assets/life/${name}.webp`,import.meta.url).href;
  const root = node('section',undefined,'erii-life'); root.id = 'erii-database-pet-life'; root.hidden = true;
  root.setAttribute('role','dialog'); root.setAttribute('aria-label','小绘的生活手帐');
  const header = node('header',undefined,'erii-life__header');
  const heading = node('div'); heading.append(node('span','小绘的生活手帐','erii-life__eyebrow'),node('h2','今天，也好好生活。'));
  const close = button('×','erii-life__close'); close.setAttribute('aria-label','关闭生活手帐'); header.append(heading,close);
  const wallet = node('div',undefined,'erii-life__wallet');
  const balance = node('strong','0'); balance.setAttribute('aria-label','金币余额');
  const stats = node('span'); wallet.append(node('span','小绘的钱包'),balance,node('span','金币'),stats);
  const taskBar = node('div',undefined,'erii-life__task'); taskBar.hidden = true;
  const taskText = node('span'), taskStop = button('停止任务'); taskStop.setAttribute('aria-label','停止数据库任务（生活手帐）'); taskBar.append(taskText,taskStop);
  const scroll = node('div',undefined,'erii-life__scroll');
  const scene = node('div',undefined,'erii-life__scene');
  const illustration = node('img'); illustration.alt = '小绘的生活插图'; illustration.draggable = false;
  const sceneText = node('div',undefined,'erii-life__scene-text');
  const activityTitle = node('h3'), activityLine = node('p');
  const progress = node('progress'); progress.max = 1; progress.setAttribute('aria-label','当前生活活动进度');
  const countdown = node('span',undefined,'erii-life__countdown');
  const activityActions = node('div',undefined,'erii-life__activity-actions');
  const claim = button('领取工资','erii-life__primary'), cancel = button('提前下班'); activityActions.append(claim,cancel);
  sceneText.append(activityTitle,activityLine,progress,countdown,activityActions); scene.append(illustration,sceneText);
  const tabs = node('div',undefined,'erii-life__tabs'); tabs.setAttribute('role','tablist'); tabs.setAttribute('aria-label','生活手帐页面');
  const panels = {}, tabButtons = {};
  for (const [id,text] of [['jobs','去打工'],['food','吃点好的'],['journal','小账本']]) {
    const control = button(text); control.id = `erii-life-tab-${id}`; control.dataset.tab = id;
    control.setAttribute('role','tab'); control.setAttribute('aria-controls',`erii-life-panel-${id}`); tabs.append(control); tabButtons[id] = control;
    const panel = node('div',undefined,`erii-life__panel erii-life__panel--${id}`); panel.id = `erii-life-panel-${id}`;
    panel.setAttribute('role','tabpanel'); panel.setAttribute('aria-labelledby',control.id); panels[id] = panel;
  }
  const jobButtons = [], foodButtons = [];
  for (const job of JOBS) {
    const card = node('article',undefined,'erii-life__job'); const image = node('img'); image.src = imageURL(job.image); image.alt = ''; image.loading = 'lazy';
    const description = node('div'); description.append(node('h4',job.name),node('p',job.task),node('span',`${job.duration/60000} 分钟 · +${job.reward} 金币`,'erii-life__job-reward'));
    const start = button('去打工','erii-life__primary'); start.setAttribute('aria-label',`去${job.name}打工`); start.dataset.job = job.id;
    card.append(image,description,start); panels.jobs.append(card); jobButtons.push(start);
  }
  panels.jobs.append(node('p','一份工作结束后领工资，再选下一份。关掉手帐或刷新，已开始的计时也会继续。','erii-life__note'));
  const menu = node('div',undefined,'erii-life__menu');
  for (const food of FOODS) {
    const card = node('article',undefined,'erii-life__food'); const symbol = node('img',undefined,'erii-life__food-image'); symbol.src = imageURL(food.image); symbol.alt = `小绘吃${food.name}`; symbol.loading = 'lazy';
    const buy = button(`买${food.name}`); buy.dataset.food = food.id;
    card.append(symbol,node('h4',food.name),node('p',`${food.price} 金币`),buy); menu.append(card); foodButtons.push(buy);
  }
  panels.food.append(menu,node('p','买好就开饭，8～12 秒后吃完。没有饿肚子惩罚，想请她吃的时候再来。','erii-life__note'));
  const totals = node('p',undefined,'erii-life__totals'), records = node('ol',undefined,'erii-life__records'); panels.journal.append(totals,records);
  scroll.append(scene,tabs,...Object.values(panels));
  const status = node('p','','erii-life__status'); status.setAttribute('role','status'); status.setAttribute('aria-live','polite');
  root.append(header,wallet,taskBar,scroll,status); doc.body.append(root);
  let recordsKey = '', sceneKey = '';
  function say(text) { status.textContent = text; }
  function select(id) {
    selected = id;
    for (const key of Object.keys(panels)) { panels[key].hidden = key !== id; tabButtons[key].setAttribute('aria-selected',String(key === id)); tabButtons[key].tabIndex = key === id ? 0 : -1; }
  }
  function render() {
    if (destroyed) return;
    const view = model.view(), busy = blocked?.() === true, active = view.active;
    if (lastActivity?.kind === 'food' && !active) say('吃完啦。今天也好好照顾自己了。');
    balance.textContent = String(view.coins); stats.textContent = `已打工 ${view.jobs} 次 · 吃饭 ${view.meals} 次`;
    const key = active ? `${active.uid}:${view.ready}` : 'idle';
    if (key !== sceneKey) {
      sceneKey = key; cancelConfirmed = false;
      illustration.src = active ? imageURL(view.item.image) : new URL('assets/idle.webp',import.meta.url).href;
      illustration.alt = active ? `小绘${active.kind === 'food' ? '吃' : '在'}${view.item.name}${active.kind === 'job' ? '打工' : ''}` : '小绘的生活插图';
      activityTitle.textContent = view.ready ? '下班啦，工资等你来领。' : active?.kind === 'job' ? `${view.item.name}的小帮手` : active?.kind === 'food' ? `开饭啦 · ${view.item.name}` : '先赚一点，再吃点喜欢的。';
      activityLine.textContent = view.ready ? `今天认真完成了一份工作，领到的金币可以买点好吃的。` : active ? view.item.line : '“一点一点，也能攒出今天的小快乐。”';
    }
    progress.hidden = !active; progress.value = view.progress;
    countdown.hidden = !active;
    const seconds = Math.ceil(view.remaining / 1000);
    countdown.textContent = view.ready ? `待领取 ${view.item.reward} 金币` : active?.kind === 'job' ? `还有 ${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')} 下班` : active ? `慢慢吃 · 还有 ${seconds} 秒` : '';
    claim.hidden = !view.ready; claim.textContent = `领取 ${view.item?.reward || 0} 金币`;
    claim.setAttribute('aria-label','领取工资'); cancel.hidden = !active || active.kind !== 'job' || view.ready;
    cancel.textContent = cancelConfirmed ? '确认下班（没有工资）' : '提前下班';
    activityActions.hidden = claim.hidden && cancel.hidden;
    for (const control of jobButtons) control.disabled = Boolean(active) || busy;
    for (const control of foodButtons) {
      const food = FOODS.find(item => item.id === control.dataset.food);
      control.disabled = Boolean(active) || busy || view.coins < food.price;
      control.title = active ? '先完成当前活动' : busy ? '等数据库任务结束后再开饭' : view.coins < food.price ? `还差 ${food.price - view.coins} 金币` : '';
    }
    const journalKey = JSON.stringify(view.journal);
    if (journalKey !== recordsKey) {
      recordsKey = journalKey; records.replaceChildren();
      if (!view.journal.length) records.append(node('li','第一份工资和第一顿饭，都会记在这里。'));
      for (const entry of view.journal) {
        const row = node('li'); row.dataset.kind = entry.kind;
        const date = new Date(entry.at), time = node('time',date.toLocaleString('zh-CN',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false})); time.dateTime = date.toISOString();
        row.append(time,node('span',entry.text)); records.append(row);
      }
    }
    totals.textContent = `累计领到 ${view.earned} 金币 · 买饭花了 ${view.spent} 金币`;
    root.dataset.activity = active?.kind || 'idle'; root.dataset.ready = String(view.ready); root.dataset.coins = String(view.coins);
    lastActivity = active;
  }
  function action(callback, message) { if (destroyed) return; if (!callback()) { say('先完成当前活动，并确认金币足够。'); render(); return; } say(message); render(); onChange?.(); }
  function layout() {
    if (destroyed || root.hidden) return;
    const viewport = host.visualViewport, width = viewport?.width || host.innerWidth, height = viewport?.height || host.innerHeight;
    const left = viewport?.offsetLeft || 0, top = viewport?.offsetTop || 0;
    const w = Math.min(500,Math.max(160,width - 20)), h = Math.min(720,Math.max(180,height - 20));
    root.style.width = `${w}px`; root.style.height = `${h}px`;
    root.style.left = `${left+(width-w)/2}px`; root.style.top = `${top+(height-h)/2}px`;
  }
  function open() { if (destroyed) return; onOpen?.(); root.hidden = false; select(selected); render(); layout(); close.focus({preventScroll:true}); onChange?.(); }
  function hide() { if (destroyed) return; root.hidden = true; cancelConfirmed = false; say(''); onClose?.(); returnFocus?.(); onChange?.(); }
  listen(close,'click',hide); listen(claim,'click',()=>action(()=>model.claim(),'工资收好啦，可以去挑一份喜欢的饭。'));
  listen(cancel,'click',()=> { if (!cancelConfirmed) {cancelConfirmed = true; render(); say('再点一次提前下班，这次不会获得金币。');} else action(()=>model.cancelJob(),'今天先休息，没有扣金币。'); });
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
    if (control.dataset.job) action(()=>model.startJob(control.dataset.job),'小绘去帮忙啦。回来后，记得领取她的工资。');
    if (control.dataset.food) action(()=>model.buyFood(control.dataset.food),'买好啦，让小绘慢慢吃。');
  });
  listen(taskStop,'click',()=>onStopTask?.(taskStop.dataset.taskId));
  listen(root,'keydown',event=> {if (event.key === 'Escape') {event.stopPropagation(); hide();}});
  listen(host,'resize',layout);
  if (host.visualViewport) {listen(host.visualViewport,'resize',layout);listen(host.visualViewport,'scroll',layout);}
  select(selected); render();
  return {open, close:hide, render, get visible(){return !root.hidden;},
    setTask(task) {taskBar.hidden = !task; if (!task) return; taskText.textContent = task.text; taskStop.dataset.taskId = task.id || ''; taskStop.hidden = !task.canStop; taskStop.disabled = task.pending; taskStop.textContent = task.pending ? '停止中…' : '停止任务';},
    destroy() {if (destroyed) return; destroyed = true; for(const remove of listeners) remove(); root.remove();},
  };
}
