import { CompanionModel } from './model.js';
import { createDatabaseObserver } from './database-observer.js';

const ID = 'erii-database-pet';
const defaults = { enabled: true, idleActions: true, hideOriginal: true, size: 88, side: 'right' };
const poses = ['idle', 'received', 'writing', 'complete', 'error', 'tea', 'reading', 'origami', 'duck', 'stretch', 'rest', 'gift'];
const labels = { idle: '等你下一条记录', received: '收到新任务', writing: '认真整理记录', complete: '完成啦',
  error: '这条记录需要检查', tea: '喝一口茶', reading: '翻翻小书', origami: '折一只纸鹤', duck: '陪小黄鸭玩',
  stretch: '伸个懒腰', rest: '靠着小枕头休息', gift: '收到一朵花' };
const imageUrls = Object.fromEntries(poses.map(pose => [pose, new URL(`assets/${pose}.webp`, import.meta.url).href]));
let active = null;
let bootTimer = null;
let stopped = true;

const el = (doc, tag, text, className) => {
  const node = doc.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
};

export function createCompanion(host, context) {
  const doc = host.document;
  const store = context.extensionSettings;
  const settings = { ...defaults, ...(store[ID] || {}) };
  settings.size = Math.min(112, Math.max(56, Number(settings.size) || 88));
  settings.side = settings.side === 'left' ? 'left' : 'right';
  const model = new CompanionModel();
  const subscriptions = [];
  const timers = new Set();
  let dataSource = null;
  let unsubscribe = null;
  let lastPose = '';
  let destroyed = false;
  let assetFailed = false;
  let lastNotebookVersion = '';
  let terminalUntil = 0;
  let previousHistory = 0;
  let settingsMount = null;
  let settingsControls = null;
  const root = el(doc, 'div', undefined, 'erii-companion');
  root.id = `${ID}-root`;
  root.dataset.pose = 'idle';
  const portrait = el(doc, 'button', undefined, 'erii-companion__portrait');
  portrait.type = 'button';
  portrait.title = '打开绘梨衣的小本子';
  portrait.setAttribute('aria-label', '绘梨衣：查看数据库任务');
  portrait.setAttribute('aria-expanded', 'false');
  const sprite = el(doc, 'img', undefined, 'erii-companion__sprite');
  sprite.alt = '';
  sprite.draggable = false;
  sprite.src = imageUrls.idle;
  portrait.append(sprite);
  const message = el(doc, 'div', undefined, 'erii-companion__message');
  message.hidden = true;
  message.setAttribute('role', 'status');
  message.setAttribute('aria-live', 'polite');
  const notebook = el(doc, 'section', undefined, 'erii-companion__notebook');
  notebook.id = `${ID}-notebook`;
  notebook.hidden = true;
  notebook.setAttribute('aria-label', '绘梨衣的小本子');
  portrait.setAttribute('aria-controls', notebook.id);
  const header = el(doc, 'div', undefined, 'erii-companion__header');
  const title = el(doc, 'strong', '绘梨衣的小本子');
  const close = el(doc, 'button', '×', 'erii-companion__close');
  close.type = 'button';
  close.setAttribute('aria-label', '收起小本子');
  header.append(title, close);
  const connection = el(doc, 'p', '等待数据库数据接口', 'erii-companion__connection');
  const taskList = el(doc, 'div', undefined, 'erii-companion__tasks');
  const historyTitle = el(doc, 'h4', '最近的记录');
  const historyList = el(doc, 'div', undefined, 'erii-companion__history');
  const controls = el(doc, 'div', undefined, 'erii-companion__controls');
  const flower = el(doc, 'button', '送她一朵花');
  flower.type = 'button';
  const reposition = el(doc, 'button', '换一边坐');
  reposition.type = 'button';
  controls.append(flower, reposition);
  notebook.append(header, connection, taskList, historyTitle, historyList, controls);
  root.append(message, portrait, notebook);
  doc.body.append(root);

  function listen(target, name, handler, options) {
    target.addEventListener(name, handler, options);
    subscriptions.push(() => target.removeEventListener(name, handler, options));
  }
  function save() {
    store[ID] = { ...(store[ID] || {}), ...settings };
    context.saveSettingsDebounced?.();
    update();
    settingsControls?.sync();
  }
  function setNotebook(open) {
    notebook.hidden = !open;
    portrait.setAttribute('aria-expanded', String(open));
    if (open) { updateNotebook(); close.focus({ preventScroll: true }); }
    else portrait.focus({ preventScroll: true });
    position();
  }
  function accept(snapshot) {
    if (!model.ingest(snapshot)) return;
    if (model.history.length && model.history[0]?.id !== previousHistory) {
      previousHistory = model.history[0].id;
      terminalUntil = Date.now() + 4500;
    }
    update();
  }
  function connect() {
    if (dataSource) return;
    dataSource = createDatabaseObserver(host);
    unsubscribe = dataSource.subscribe(accept);
  }
  function updateNotebook() {
    const snapshot = model.snapshot;
    root.dataset.source = dataSource?.getSnapshot().source || 'waiting';
    connection.textContent = assetFailed ? '动作素材加载失败，请重新解压插件' :
      snapshot.connected ? snapshot.busy ? '数据库正在处理任务' : snapshot.activityKnown === false ? '已连接数据库 · 等待任务通知' : '已连接数据库 · 现在空闲' :
      root.dataset.source === 'unsupported-view' ? '当前数据库界面版本暂不兼容，请反馈版本' : '等待原数据库加载；保持原数据库脚本启用即可';
    const version = JSON.stringify([snapshot.tasks, model.history, snapshot.busy, snapshot.connected]);
    if (version !== lastNotebookVersion) {
      lastNotebookVersion = version;
      taskList.replaceChildren();
      if (!snapshot.tasks.length) taskList.append(el(doc, 'p', snapshot.connected ? snapshot.busy ? '任务已经开始，进度将随数据库提示同步。' : '等待下一条数据库任务提示。' : '尚未收到任务数据。'));
      for (const task of snapshot.tasks) {
        const card = el(doc, 'article', undefined, 'erii-companion__task');
        card.dataset.kind = task.kind;
        card.append(el(doc, 'strong', task.feature || '数据库任务'), el(doc, 'p', task.detail || (task.busy ? '处理中…' : '等待处理')));
        taskList.append(card);
      }
      historyList.replaceChildren();
      if (!model.history.length) historyList.append(el(doc, 'p', '新通知会记在这里。'));
      for (const record of model.history.slice(0, 6)) {
        const card = el(doc, 'article', undefined, 'erii-companion__record');
        card.dataset.kind = record.kind;
        if (record.title) card.append(el(doc, 'strong', record.title));
        card.append(el(doc, 'p', record.text));
        historyList.append(card);
      }
    }
    flower.disabled = snapshot.busy || !snapshot.connected || snapshot.activityKnown === false;
    flower.title = snapshot.busy ? '等她整理完记录再送花' : '送花只影响桌宠，不改数据库任务';
  }
  function position() {
    const viewport = host.visualViewport;
    const width = viewport?.width || host.innerWidth;
    const height = viewport?.height || host.innerHeight;
    const size = width <= 640 ? Math.min(settings.size, 72) : settings.size;
    const offsetLeft = viewport?.offsetLeft || 0;
    const offsetTop = viewport?.offsetTop || 0;
    const send = doc.getElementById('send_form');
    const sendRect = send?.getBoundingClientRect();
    const overlapsInput = sendRect && sendRect.bottom >= offsetTop + height - 4 && sendRect.top < offsetTop + height;
    const bottomGap = overlapsInput ? Math.min(height / 2, offsetTop + height - sendRect.top + 12) : 24;
    const x = settings.side === 'left' ? 12 : Math.max(8, width - size - 12);
    const y = Math.max(8, height - size - bottomGap);
    root.style.left = `${offsetLeft + x}px`;
    root.style.top = `${offsetTop + y}px`;
    root.style.setProperty('--erii-size', `${size}px`);
    root.style.setProperty('--erii-page-width', `${Math.max(160, Math.min(310, width - 24))}px`);
    root.style.setProperty('--erii-page-height', `${Math.max(120, Math.min(420, height - 32))}px`);
    root.dataset.side = settings.side;
    if (!notebook.hidden) {
      const nw = notebook.offsetWidth;
      const nh = notebook.offsetHeight;
      notebook.style.left = `${Math.min(Math.max(offsetLeft + 12, offsetLeft + x + size / 2 - nw / 2), offsetLeft + width - nw - 12)}px`;
      notebook.style.top = `${Math.min(Math.max(offsetTop + 12, offsetTop + y - nh - 10), offsetTop + height - nh - 12)}px`;
    }
    if (!message.hidden) {
      const mw = message.offsetWidth;
      const mh = message.offsetHeight;
      message.style.left = `${Math.min(Math.max(offsetLeft + 12, offsetLeft + x + size / 2 - mw / 2), offsetLeft + width - mw - 12)}px`;
      message.style.top = `${Math.max(offsetTop + 12, offsetTop + y - mh - 10)}px`;
    }
  }
  function update() {
    if (destroyed) return;
    root.hidden = settings.enabled === false;
    const snapshot = model.snapshot;
    const pose = model.pose();
    if (pose !== lastPose) {
      lastPose = pose;
      root.dataset.pose = pose;
      sprite.src = imageUrls[pose] || imageUrls.idle;
      portrait.title = `${labels[pose] || labels.idle} · 点击查看小本子`;
    }
    const replace = settings.enabled !== false && settings.hideOriginal && snapshot.connected;
    doc.body.toggleAttribute('data-erii-replace-database-pet', Boolean(replace));
    message.hidden = notebook.hidden === false || snapshot.silent || !snapshot.connected || Date.now() >= terminalUntil || !model.history.length || !settings.enabled;
    if (!message.hidden) {
      const newest = model.history[0];
      message.dataset.kind = newest.kind;
      message.textContent = newest.text;
    }
    updateNotebook();
    position();
  }
  function mountSettings() {
    if (settingsMount?.isConnected) return;
    const target = doc.getElementById('extensions_settings2') || doc.getElementById('extensions_settings');
    if (!target) return;
    settingsMount = el(doc, 'details', undefined, 'erii-companion-settings');
    settingsMount.id = `${ID}-settings`;
    settingsMount.append(el(doc, 'summary', '绘梨衣 · 数据库桌宠'));
    const fields = [];
    for (const [key, label] of [['enabled', '显示绘梨衣'], ['idleActions', '空闲时做小动作'], ['hideOriginal', '隐藏数据库原桌宠和原气泡']]) {
      const row = el(doc, 'label');
      const input = el(doc, 'input');
      input.type = 'checkbox';
      input.checked = settings[key] === true;
      row.append(input, el(doc, 'span', label));
      settingsMount.append(row);
      listen(input, 'change', () => { settings[key] = input.checked; save(); });
      fields.push([key, input]);
    }
    const sizeRow = el(doc, 'label', '桌宠大小');
    const range = el(doc, 'input');
    range.type = 'range'; range.min = '56'; range.max = '112'; range.step = '4'; range.value = String(settings.size);
    sizeRow.append(range);
    settingsMount.append(sizeRow);
    listen(range, 'input', () => { settings.size = Number(range.value); save(); });
    settingsControls = { sync() { for (const [key, input] of fields) input.checked = settings[key] === true; range.value = String(settings.size); } };
    target.append(settingsMount);
  }

  listen(portrait, 'click', () => setNotebook(notebook.hidden));
  listen(close, 'click', () => setNotebook(false));
  listen(flower, 'click', () => { model.gift(); update(); });
  listen(reposition, 'click', () => { settings.side = settings.side === 'left' ? 'right' : 'left'; save(); });
  listen(sprite, 'error', () => {
    assetFailed = true;
    if (!sprite.src.endsWith('/idle.webp')) sprite.src = imageUrls.idle;
    updateNotebook();
  });
  listen(doc, 'keydown', event => { if (event.key === 'Escape' && !notebook.hidden) setNotebook(false); });
  listen(host, 'resize', position);
  if (host.visualViewport) { listen(host.visualViewport, 'resize', position); listen(host.visualViewport, 'scroll', position); }
  const frame = host.setInterval(() => { if (!doc.hidden) update(); }, 250);
  timers.add(frame);
  const detection = host.setInterval(() => { connect(); mountSettings(); }, 1500);
  timers.add(detection);
  function scheduleLeisure() {
    const timer = host.setTimeout(() => {
      timers.delete(timer);
      if (destroyed) return;
      if (!doc.hidden && settings.enabled && settings.idleActions) {
        const choices = ['tea', 'reading', 'origami', 'duck', 'stretch', 'rest'];
        model.leisure(choices[Math.floor(Math.random() * choices.length)]);
        update();
      }
      scheduleLeisure();
    }, 26000 + Math.random() * 14000);
    timers.add(timer);
  }
  connect(); mountSettings(); update(); scheduleLeisure();
  return {
    model,
    refresh: update,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      unsubscribe?.();
      dataSource?.destroy();
      for (const remove of subscriptions) remove();
      for (const timer of timers) { host.clearInterval(timer); host.clearTimeout(timer); }
      timers.clear();
      root.remove(); settingsMount?.remove();
      doc.body.removeAttribute('data-erii-replace-database-pet');
    },
  };
}

function bootstrap(attempt = 0) {
  bootTimer = null;
  if (stopped || active) return;
  let context;
  try { context = window.SillyTavern?.getContext?.(); } catch { /* host starting */ }
  if (context?.extensionSettings && typeof context.saveSettingsDebounced === 'function') {
    active = createCompanion(window, context);
    window.addEventListener('pagehide', onDisable, { once: true });
  } else if (attempt < 100) bootTimer = setTimeout(() => bootstrap(attempt + 1), 200);
  else console.warn('[绘梨衣桌宠] 酒馆设置接口尚未就绪，重新启用插件可重试。');
}
export function onActivate() { stopped = false; if (!active && bootTimer === null) bootTimer = setTimeout(() => bootstrap(), 0); }
export function onEnable() { onActivate(); }
export function onDisable() {
  stopped = true;
  clearTimeout(bootTimer); bootTimer = null;
  active?.destroy(); active = null;
  window.removeEventListener('pagehide', onDisable);
}
export function onClean() { onDisable(); }
