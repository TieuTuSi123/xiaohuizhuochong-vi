import { CompanionModel } from './model.js';
import { createDatabaseObserver } from './database-observer.js';
import { readBounds, fromRatio, toRatio, constrain } from './position.js';
import { createMotion } from './motion.js';

const ID = 'erii-database-pet';
const defaults = { enabled: true, idleActions: true, hideOriginal: true, size: 88, side: 'right', position: null };
const poses = ['idle', 'received', 'writing', 'complete', 'error', 'tea', 'reading', 'origami', 'duck', 'stretch', 'rest', 'gift', 'lifted', 'land', 'wave', 'peek'];
const labels = { idle: '等你下一条记录', received: '收到新任务', writing: '认真整理记录', complete: '完成啦',
  error: '这条记录需要检查', tea: '喝一口茶', reading: '翻翻小书', origami: '折一只纸鹤', duck: '陪小黄鸭玩',
  stretch: '伸个懒腰', rest: '靠着小枕头休息', gift: '收到一朵花',
  lifted: '轻轻拎起来', land: '坐稳啦', wave: '向你打招呼', peek: '抱着小本子探头' };
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
  let hasDecodedPose = false;
  let lastNotebookVersion = '';
  let terminalUntil = 0;
  let previousHistory = 0;
  let settingsMount = null;
  let settingsControls = null;
  let point = null;
  let dragging = null;
  let dragFrame = null;
  let layoutFrame = null;
  let bounds = null;
  let inputElement = null;
  let geometryDirty = true;
  let holdTimer = null;
  let longPressed = false;
  let suppressClick = false;
  let hoverUntil = 0;
  let landingUntil = 0;
  let swapVersion = 0;
  let shownSprite = 0;
  const loaded = new Map();
  const localActions = [];
  const root = el(doc, 'div', undefined, 'erii-companion');
  root.id = `${ID}-root`;
  root.dataset.version = '0.5.0';
  root.dataset.pose = 'idle';
  root.style.transition = 'none';
  // Panels are siblings: a transformed ancestor would change their fixed coordinates.
  const overlay = el(doc, 'div', undefined, 'erii-companion erii-companion--ui');
  overlay.id = `${ID}-ui`;
  const portrait = el(doc, 'button', undefined, 'erii-companion__portrait');
  portrait.type = 'button';
  portrait.setAttribute('aria-label', '绘梨衣：单击、连点或长按互动，拖动移动；右键查看任务');
  portrait.setAttribute('aria-expanded', 'false');
  portrait.title = '轻点互动 · 连点有不同反应 · 拖动移动 · 右键看小本子';
  const sway = el(doc, 'span', undefined, 'erii-companion__sway');
  const breath = el(doc, 'span', undefined, 'erii-companion__breath');
  const stage = el(doc, 'span', undefined, 'erii-companion__stage');
  const sprites = [0, 1].map(index => {
    const sprite = el(doc, 'img', undefined, 'erii-companion__sprite');
    sprite.alt = ''; sprite.draggable = false; sprite.src = imageUrls.idle;
    sprite.dataset.visible = String(index === 0);
    stage.append(sprite);
    return sprite;
  });
  breath.append(stage); sway.append(breath); portrait.append(sway);
  const motion = createMotion(stage, host);
  function loadAsset(pose) {
    if (!loaded.has(pose)) loaded.set(pose, new Promise(resolve => {
      const image = new host.Image();
      image.onload = () => { image.decode?.().catch(() => {}).finally(() => resolve(true)) || resolve(true); };
      image.onerror = () => { loaded.delete(pose); resolve(false); };
      image.src = imageUrls[pose];
    }));
    return loaded.get(pose);
  }
  async function showPose(pose) {
    const version = ++swapVersion;
    const ok = await loadAsset(pose);
    if (destroyed || version !== swapVersion) return;
    if (!ok) { assetFailed = true; update(); return; }
    const next = shownSprite === 0 ? 1 : 0;
    sprites[next].src = imageUrls[pose];
    try { await sprites[next].decode?.(); } catch { /* preloaded image remains usable */ }
    if (destroyed || version !== swapVersion) return;
    root.dataset.pose = pose;
    motion.play(pose);
    sprites[next].dataset.visible = 'true';
    sprites[shownSprite].dataset.visible = 'false';
    shownSprite = next;
    hasDecodedPose = true; assetFailed = false;
    update();
  }
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
  const help = el(doc, 'p', '单击挥手 · 双击抱鸭 · 连点躲一躲 · 长按小憩 · 拖动移动', 'erii-companion__help');
  const leisureControls = el(doc, 'div', undefined, 'erii-companion__controls');
  for (const [pose, caption] of [['tea', '喝茶'], ['reading', '看书'], ['origami', '折纸'], ['duck', '抱小鸭'], ['stretch', '伸懒腰'], ['rest', '小憩']]) {
    const button = el(doc, 'button', caption);
    button.type = 'button'; button.dataset.action = pose;
    leisureControls.append(button); localActions.push(button);
  }
  const flower = el(doc, 'button', '送她一朵花');
  flower.type = 'button';
  const reposition = el(doc, 'button', '换一边坐');
  reposition.type = 'button';
  const reset = el(doc, 'button', '回到默认位置');
  reset.type = 'button';
  controls.append(flower, reposition, reset);
  notebook.append(header, connection, taskList, historyTitle, historyList, help, leisureControls, controls);
  root.append(portrait);
  overlay.append(message, notebook);
  doc.body.append(root, overlay);

  function listen(target, name, handler, options) {
    target.addEventListener(name, handler, options);
    subscriptions.push(() => target.removeEventListener(name, handler, options));
  }
  function save() {
    store[ID] = { ...(store[ID] || {}), ...settings };
    context.saveSettingsDebounced?.();
    update();
    position();
    settingsControls?.sync();
  }
  function rememberPosition() {
    settings.position = toRatio(point, bounds);
    save();
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
    const version = JSON.stringify([snapshot.tasks, model.history, snapshot.busy, snapshot.connected,
      snapshot.activityKnown, root.dataset.source, assetFailed]);
    if (version === lastNotebookVersion) return;
    lastNotebookVersion = version;
    connection.textContent = assetFailed ? '动作素材加载失败，请更新扩展后刷新页面' :
      snapshot.connected ? snapshot.busy ? '数据库正在处理任务' : snapshot.activityKnown === false ? '已连接数据库 · 等待任务通知' : '已连接数据库 · 现在空闲' :
      root.dataset.source === 'unsupported-view' ? '当前数据库界面版本暂不兼容，请反馈版本' : '等待原数据库加载；保持原数据库脚本启用即可';
    {
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
    flower.disabled = snapshot.busy;
    for (const button of localActions) button.disabled = snapshot.busy;
    flower.title = snapshot.busy ? '等她整理完记录再送花' : '送花只影响桌宠，不改数据库任务';
    if (!notebook.hidden) scheduleLayout();
  }
  function applyPoint(next) {
    point = next;
    const dpr = host.devicePixelRatio || 1;
    const x = Math.round(point.x * dpr) / dpr;
    const y = Math.round(point.y * dpr) / dpr;
    root.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }
  function scheduleLayout(refreshGeometry = false) {
    geometryDirty ||= refreshGeometry;
    if (destroyed || layoutFrame !== null) return;
    layoutFrame = host.requestAnimationFrame(() => {
      layoutFrame = null;
      if (geometryDirty) position();
      else if (!dragging?.moved) placePanels();
    });
  }
  function watchInput() {
    const next = doc.getElementById('send_form');
    if (next === inputElement) return;
    if (inputElement) geometryObserver?.unobserve(inputElement);
    inputElement = next;
    if (inputElement) geometryObserver?.observe(inputElement);
    scheduleLayout(true);
  }
  const geometryObserver = typeof host.ResizeObserver === 'function'
    ? new host.ResizeObserver(() => scheduleLayout(true)) : null;
  const panelObserver = typeof host.ResizeObserver === 'function'
    ? new host.ResizeObserver(() => scheduleLayout()) : null;
  panelObserver?.observe(notebook); panelObserver?.observe(message);
  function position() {
    if (destroyed) return;
    bounds = readBounds(host, doc, settings.size);
    geometryDirty = false;
    const { width, height, size } = bounds;
    applyPoint(dragging?.moved ? constrain(dragging.pending, bounds) : fromRatio(settings.position, bounds, settings.side));
    root.style.setProperty('--erii-size', `${size}px`);
    overlay.style.setProperty('--erii-page-width', `${Math.max(160, Math.min(310, width - 24))}px`);
    overlay.style.setProperty('--erii-page-height', `${Math.max(120, Math.min(420, height - 32))}px`);
    if (!dragging?.moved) placePanels();
  }
  function placePanels() {
    if (destroyed || !bounds || !point || dragging?.moved) return;
    const { width, height, size, left: offsetLeft, top: offsetTop } = bounds;
    const { x, y } = point;
    root.dataset.side = x < offsetLeft + width / 2 ? 'left' : 'right';
    function placePanel(panel, cap) {
      panel.style.maxHeight = `${Math.min(cap, height - 24)}px`;
      const pw = panel.offsetWidth;
      let ph = panel.offsetHeight;
      const above = y - offsetTop - 12, below = offsetTop + height - y - size - 12;
      let px = x + size / 2 - pw / 2, py;
      if (above >= ph + 10) py = y - ph - 10;
      else if (below >= ph + 10) py = y + size + 10;
      else if (x - offsetLeft - 12 >= pw + 10) { px = x - pw - 10; py = y + size / 2 - ph / 2; }
      else if (offsetLeft + width - x - size - 12 >= pw + 10) { px = x + size + 10; py = y + size / 2 - ph / 2; }
      else {
        // In narrow views scroll the notebook instead of placing it over her face.
        const upwards = above >= below;
        panel.style.maxHeight = `${Math.max(48, (upwards ? above : below) - 10)}px`;
        ph = panel.offsetHeight;
        py = upwards ? y - ph - 10 : y + size + 10;
      }
      panel.style.left = `${Math.min(Math.max(offsetLeft + 12, px), offsetLeft + width - pw - 12)}px`;
      panel.style.top = `${Math.min(Math.max(offsetTop + 12, py), offsetTop + height - ph - 12)}px`;
    }
    if (!notebook.hidden) placePanel(notebook, 420);
    if (!message.hidden) placePanel(message, 130);
  }
  function update() {
    if (destroyed) return;
    if (settings.enabled === false && dragging) cancelDrag();
    root.hidden = settings.enabled === false;
    overlay.hidden = root.hidden;
    const snapshot = model.snapshot;
    const pose = dragging?.moved ? 'lifted' : Date.now() < landingUntil ? 'land' : model.pose();
    if (pose !== lastPose) {
      lastPose = pose;
      showPose(pose);
      portrait.title = `${labels[pose] || labels.idle} · 轻点互动 · 拖动移动 · 右键看小本子`;
    }
    root.dataset.interaction = model.lastInteraction;
    const replace = settings.enabled !== false && settings.hideOriginal && snapshot.connected && hasDecodedPose && !assetFailed;
    if (doc.body.hasAttribute('data-erii-replace-database-pet') !== Boolean(replace))
      doc.body.toggleAttribute('data-erii-replace-database-pet', Boolean(replace));
    const wasHidden = message.hidden;
    message.hidden = Boolean(dragging?.moved) || notebook.hidden === false || snapshot.silent || !snapshot.connected || Date.now() >= terminalUntil || !model.history.length || !settings.enabled;
    let changed = wasHidden !== message.hidden;
    if (!message.hidden) {
      const newest = model.history[0];
      message.dataset.kind = newest.kind;
      if (message.textContent !== newest.text) { message.textContent = newest.text; changed = true; }
    }
    updateNotebook();
    if (changed && !dragging?.moved) scheduleLayout();
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
    const resetSetting = el(doc, 'button', '重置桌宠位置'); resetSetting.type = 'button';
    settingsMount.append(resetSetting); listen(resetSetting, 'click', resetPosition);
    const openBook = el(doc, 'button', '查看任务小本子'); openBook.type = 'button';
    openBook.setAttribute('aria-controls', notebook.id);
    settingsMount.append(openBook);
    listen(openBook, 'click', () => setNotebook(true));
    settingsMount.append(el(doc, 'p', '轻点或连点小绘可互动，按住不动让她放松；右键或这里打开小本子。聚焦小绘后，Shift+Enter 也可查看任务。'));
    settingsControls = { sync() { for (const [key, input] of fields) input.checked = settings[key] === true; range.value = String(settings.size); } };
    target.append(settingsMount);
  }

  function resetPosition() { cancelDrag(); settings.position = null; landingUntil = Date.now() + 1000; save(); }
  function clearHold() { if (holdTimer !== null) host.clearTimeout(holdTimer); holdTimer = null; }
  // The hot path writes only the pet transform and sway. No panel rendering or layout reads.
  function flushDrag() {
    dragFrame = null;
    if (!dragging?.moved || destroyed) return;
    applyPoint(constrain(dragging.pending, bounds));
    root.style.setProperty('--erii-tilt', `${dragging.tilt || 0}deg`);
  }
  function cancelDrag() {
    clearHold();
    model.endComfort();
    if (dragFrame !== null) host.cancelAnimationFrame(dragFrame);
    dragFrame = null;
    const pointerId = dragging?.id;
    dragging = null;
    longPressed = false;
    root.dataset.dragging = 'false'; root.style.setProperty('--erii-tilt', '0deg');
    try { if (pointerId !== undefined && portrait.hasPointerCapture(pointerId)) portrait.releasePointerCapture(pointerId); } catch { /* capture already released */ }
  }
  function finishDrag(event, cancelled = false) {
    if (!dragging) return;
    if (event && event.pointerId !== dragging.id) return;
    const moved = dragging.moved;
    if (cancelled) {
      suppressClick = Boolean(moved || longPressed);
      model.endComfort();
      cancelDrag(); update(); position();
      return;
    }
    if (moved) {
      // Pointer-up can arrive before the scheduled frame. Never drop its final coordinate.
      if (event && !cancelled) dragging.pending = {
        x: dragging.origin.x + event.clientX - dragging.startX,
        y: dragging.origin.y + event.clientY - dragging.startY,
      };
      if (dragFrame !== null) host.cancelAnimationFrame(dragFrame);
      flushDrag();
      const finalPoint = constrain(point, bounds, true);
      settings.position = toRatio(finalPoint, bounds);
      suppressClick = true;
      landingUntil = Date.now() + 1100;
    }
    const held = longPressed;
    cancelDrag();
    if (moved) save();
    else if (held) { model.endComfort(); suppressClick = true; update(); }
    else { suppressClick = true; interactTap(); }
  }
  function interactTap() {
    if (settings.enabled === false || destroyed) return;
    landingUntil = 0;
    model.tap(); update();
  }
  listen(portrait, 'pointerdown', event => {
    if (event.button !== 0 || event.isPrimary === false || dragging) return;
    position(); suppressClick = false; longPressed = false;
    const rendered = root.getBoundingClientRect();
    point = constrain({ x: rendered.x, y: rendered.y }, bounds);
    dragging = { id: event.pointerId, startX: event.clientX, startY: event.clientY, origin: { ...point }, pending: { ...point }, moved: false, lastX: event.clientX, tilt: 0 };
    try { portrait.setPointerCapture(event.pointerId); } catch { /* keyboard/synthetic test may have no live pointer */ }
    holdTimer = host.setTimeout(() => {
      holdTimer = null;
      if (!dragging || dragging.moved) return;
      longPressed = true; suppressClick = true; landingUntil = 0;
      model.startComfort(); update();
    }, 550);
  });
  listen(portrait, 'pointermove', event => {
    if (event.pointerId !== dragging?.id) return;
    const dx = event.clientX - dragging.startX, dy = event.clientY - dragging.startY;
    if (!dragging.moved && Math.hypot(dx, dy) < (event.pointerType === 'touch' ? 8 : 6)) return;
    if (!dragging.moved) {
      dragging.moved = true; clearHold(); model.interruptLocal();
      notebook.hidden = true; portrait.setAttribute('aria-expanded', 'false');
      root.dataset.dragging = 'true';
      update();
    }
    event.preventDefault();
    dragging.pending = { x: dragging.origin.x + dx, y: dragging.origin.y + dy };
    dragging.tilt = Math.max(-8, Math.min(8, (event.clientX - dragging.lastX) * .3));
    dragging.lastX = event.clientX;
    if (dragFrame === null) dragFrame = host.requestAnimationFrame(flushDrag);
  });
  listen(portrait, 'pointerup', event => finishDrag(event));
  listen(portrait, 'pointercancel', event => finishDrag(event, true));
  listen(portrait, 'lostpointercapture', event => finishDrag(event, true));
  listen(host, 'blur', () => finishDrag(null, true));
  listen(portrait, 'pointerenter', event => {
    if (event.pointerType === 'mouse' && !dragging && model.pose() === 'idle' && Date.now() > hoverUntil) {
      hoverUntil = Date.now() + 12000; model.leisure('peek'); update();
    }
  });
  listen(portrait, 'click', event => {
    if (suppressClick && event.detail !== 0) { suppressClick = false; event.preventDefault(); return; }
    suppressClick = false; interactTap();
  });
  listen(portrait, 'contextmenu', event => {
    event.preventDefault();
    if (dragging?.moved || longPressed || event.pointerType === 'touch') return;
    setNotebook(true);
  });
  listen(portrait, 'keydown', event => {
    if (event.key === 'Enter' && event.shiftKey) { event.preventDefault(); setNotebook(true); return; }
    if (event.key === 'Home') { event.preventDefault(); resetPosition(); return; }
    const delta = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key];
    if (!delta) return;
    event.preventDefault(); position();
    const step = event.shiftKey ? 28 : 10;
    point = constrain({ x: point.x + delta[0] * step, y: point.y + delta[1] * step }, bounds);
    rememberPosition();
  });
  listen(close, 'click', () => setNotebook(false));
  listen(reset, 'click', resetPosition);
  listen(flower, 'click', () => { model.gift(); update(); });
  listen(reposition, 'click', () => { settings.side = root.dataset.side === 'left' ? 'right' : 'left'; settings.position = null; landingUntil = Date.now() + 1300; save(); });
  for (const button of localActions) listen(button, 'click', () => {
    if (model.leisure(button.dataset.action)) { setNotebook(false); update(); }
  });
  listen(doc, 'keydown', event => {
    if (event.key !== 'Escape') return;
    if (dragging) finishDrag(null, true);
    if (!notebook.hidden) setNotebook(false);
  });
  listen(host, 'resize', () => scheduleLayout(true));
  if (host.visualViewport) {
    listen(host.visualViewport, 'resize', () => scheduleLayout(true));
    listen(host.visualViewport, 'scroll', () => scheduleLayout(true));
  }
  const frame = host.setInterval(() => { if (!doc.hidden) update(); }, 250);
  timers.add(frame);
  const detection = host.setInterval(() => { connect(); mountSettings(); watchInput(); }, 1500);
  timers.add(detection);
  function scheduleLeisure() {
    const timer = host.setTimeout(() => {
      timers.delete(timer);
      if (destroyed) return;
      if (!doc.hidden && settings.enabled && settings.idleActions && !dragging && notebook.hidden && model.pose() === 'idle') {
        const choices = ['tea', 'reading', 'origami', 'duck', 'stretch', 'rest'];
        model.leisure(choices[Math.floor(Math.random() * choices.length)]);
        update();
      }
      scheduleLeisure();
    }, 12000 + Math.random() * 8000);
    timers.add(timer);
  }
  for (const pose of poses) loadAsset(pose);
  connect(); mountSettings(); watchInput(); update(); position(); scheduleLeisure();
  // Establish the saved location before enabling movement easing (no fly-in from 0,0).
  root.getBoundingClientRect();
  root.style.transition = '';
  return {
    model,
    refresh: update,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      swapVersion++; cancelDrag(); motion.destroy(); loaded.clear();
      if (layoutFrame !== null) host.cancelAnimationFrame(layoutFrame);
      geometryObserver?.disconnect(); panelObserver?.disconnect();
      unsubscribe?.();
      dataSource?.destroy();
      for (const remove of subscriptions) remove();
      for (const timer of timers) { host.clearInterval(timer); host.clearTimeout(timer); }
      timers.clear();
      root.remove(); overlay.remove(); settingsMount?.remove();
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
    window.addEventListener('pagehide', onPageHide);
  } else if (attempt < 100) bootTimer = setTimeout(() => bootstrap(attempt + 1), 200);
  else console.warn('[绘梨衣桌宠] 酒馆设置接口尚未就绪，重新启用插件可重试。');
}
export function onActivate() { stopped = false; if (!active && bootTimer === null) bootTimer = setTimeout(() => bootstrap(), 0); }
export function onEnable() { onActivate(); }
function onPageHide(event) { if (!event.persisted) onDisable(); }
export function onDisable() {
  stopped = true;
  clearTimeout(bootTimer); bootTimer = null;
  active?.destroy(); active = null;
  window.removeEventListener('pagehide', onPageHide);
}
export function onClean() { onDisable(); }

// 1.14–1.16 load the entry module without an activate hook. Newer hosts also
// invoke onActivate; its guards keep both routes on the same single instance.
if (typeof window !== 'undefined' && typeof window.SillyTavern?.getContext === 'function') onActivate();
