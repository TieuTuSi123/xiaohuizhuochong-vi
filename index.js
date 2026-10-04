import { CompanionModel } from './model.js';
import { createDatabaseObserver } from './database-observer.js';
import { readBounds, fromRatio, toRatio, constrain, dockEdge } from './position.js';
import { createMotion } from './motion.js';
import { StoryCarousel } from './stories.js';
import { createChatWindow } from './chat-window.js';
import { LifeModel } from './life-model.js';
import { createLifeWindow } from './life-window.js';

const ID = 'erii-database-pet';
const defaults = { enabled: true, idleActions: true, edgePeeks: true, healingStories: true, hideOriginal: true, taskDetails: false, size: 88, side: 'right', position: null };
const poses = ['idle', 'received', 'writing', 'complete', 'error', 'tea', 'reading', 'origami', 'duck', 'stretch', 'rest', 'gift', 'lifted', 'land', 'wave', 'peek'];
const labels = { idle: '等你下一条记录', received: '收到新任务', writing: '认真整理记录', complete: '完成啦',
  error: '这条记录需要检查', tea: '喝一口茶', reading: '翻翻小书', origami: '折一只纸鹤', duck: '陪小黄鸭玩',
  stretch: '伸个懒腰', rest: '靠着小枕头休息', gift: '收到一朵花',
  lifted: '轻轻拎起来', land: '坐稳啦', wave: '向你打招呼', peek: '抱着小本子探头' };
const imageUrls = Object.fromEntries(poses.map(pose => [pose, new URL(`assets/${pose}.webp`, import.meta.url).href]));
const edgeAssets = { left: 'edge-left-v2', right: 'edge-right-v2', bottom: 'edge-bottom', top: 'edge-bottom' };
for (const [edge, asset] of Object.entries(edgeAssets))
  imageUrls[`edge-${edge}`] = new URL(`assets/${asset}.webp`, import.meta.url).href;
for (const name of ['work-bookshop','work-bakery','work-florist','eat-pudding','eat-riceball','eat-omurice','eat-ramen']) {
  imageUrls[name] = new URL(`assets/life/${name}.webp`, import.meta.url).href;
  labels[name] = name.startsWith('eat-') ? '慢慢吃一顿饭' : '认真做好今天的小工作';
}
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
  const storyteller = new StoryCarousel();
  let chat = null;
  let life = null;
  let lifeNotice = null;
  const lifeModel = new LifeModel(settings.life, {persist:value => {
    settings.life = value; store[ID] = { ...(store[ID] || {}), ...settings }; context.saveSettingsDebounced?.();
  }});
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
  let mobileBookTimer = null;
  let longPressed = false;
  let mobileBookOpened = false;
  let suppressClick = false;
  let hoverUntil = 0;
  let landingUntil = 0;
  let swapVersion = 0;
  let shownSprite = 0;
  let taskStopBusy = false;
  let stopFeedback = null;
  let failedEdge = null;
  const loaded = new Map();
  const localActions = [];
  const root = el(doc, 'div', undefined, 'erii-companion');
  root.id = `${ID}-root`;
  root.dataset.version = '0.7.1';
  root.dataset.pose = 'idle';
  root.style.transition = 'none';
  // Panels are siblings: a transformed ancestor would change their fixed coordinates.
  const overlay = el(doc, 'div', undefined, 'erii-companion erii-companion--ui');
  overlay.id = `${ID}-ui`;
  const portrait = el(doc, 'button', undefined, 'erii-companion__portrait');
  portrait.type = 'button';
  portrait.setAttribute('aria-label', '绘梨衣：单击、连点或长按互动；手机长按打开小本子，电脑右键查看任务');
  portrait.setAttribute('aria-expanded', 'false');
  portrait.title = '轻点互动 · 连点有不同反应 · 手机长按打开小本子 · 拖动移动 · 电脑右键看小本子';
  const sway = el(doc, 'span', undefined, 'erii-companion__sway');
  const edgeFrame = el(doc, 'span', undefined, 'erii-companion__edge-frame');
  const breath = el(doc, 'span', undefined, 'erii-companion__breath');
  const stage = el(doc, 'span', undefined, 'erii-companion__stage');
  const sprites = [0, 1].map(index => {
    const sprite = el(doc, 'img', undefined, 'erii-companion__sprite');
    sprite.alt = ''; sprite.draggable = false; sprite.src = imageUrls.idle;
    sprite.dataset.visible = String(index === 0);
    stage.append(sprite);
    return sprite;
  });
  breath.append(stage); sway.append(breath); edgeFrame.append(sway); portrait.append(edgeFrame);
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
    if (!ok) {
      if (pose.startsWith('edge-')) { failedEdge = pose; lastPose = ''; }
      else assetFailed = true;
      update(); return;
    }
    const next = shownSprite === 0 ? 1 : 0;
    sprites[next].src = imageUrls[pose];
    try { await sprites[next].decode?.(); } catch { /* preloaded image remains usable */ }
    if (destroyed || version !== swapVersion) return;
    root.dataset.pose = pose;
    root.dataset.edge = pose.startsWith('edge-') ? pose.slice(5) : '';
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
  const messageText = el(doc, 'span', undefined, 'erii-companion__message-text');
  const messageStop = el(doc, 'button', '停止', 'erii-companion__message-action');
  messageStop.type = 'button';
  messageStop.hidden = true;
  messageStop.setAttribute('aria-label', '停止数据库任务');
  message.append(messageText, messageStop);
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
  const help = el(doc, 'p', '单击挥手 · 双击抱鸭 · 连点躲一躲 · 长按小憩 · 拖动移动 · 电脑右键开关小本子', 'erii-companion__help');
  const leisureControls = el(doc, 'div', undefined, 'erii-companion__controls');
  for (const [pose, caption] of [['tea', '喝茶'], ['reading', '看书'], ['origami', '折纸'], ['duck', '抱小鸭'], ['stretch', '伸懒腰'], ['rest', '小憩']]) {
    const button = el(doc, 'button', caption);
    button.type = 'button'; button.dataset.action = pose;
    leisureControls.append(button); localActions.push(button);
  }
  const flower = el(doc, 'button', '送她一朵花');
  flower.type = 'button';
  leisureControls.append(flower);
  const databaseOpen = el(doc, 'button', '打开数据库本体', 'erii-companion__database-open');
  databaseOpen.type = 'button';
  databaseOpen.setAttribute('aria-label', '打开数据库本体');
  const storyOpen = el(doc, 'button', '听一个小故事', 'erii-companion__story-open');
  storyOpen.type = 'button';
  const chatOpen = el(doc, 'button', '和小绘聊天', 'erii-companion__story-open');
  chatOpen.type = 'button'; chatOpen.setAttribute('aria-controls', `${ID}-chat`);
  const lifeOpen = el(doc, 'button', '生活手帐', 'erii-companion__story-open');
  lifeOpen.type = 'button'; lifeOpen.setAttribute('aria-controls', `${ID}-life`);
  notebook.append(header, databaseOpen, chatOpen, lifeOpen, connection, taskList, historyTitle, historyList, help, leisureControls, storyOpen);
  const lifeBubble = el(doc, 'div', undefined, 'erii-companion__life-bubble');
  lifeBubble.hidden = true; lifeBubble.setAttribute('aria-label', '小绘的生活进度');
  const lifeText = el(doc, 'span', undefined, 'erii-companion__life-text');
  const lifeClaim = el(doc, 'button', '领工资', 'erii-companion__life-claim'); lifeClaim.type = 'button';
  lifeClaim.setAttribute('aria-label', '领取工资（桌宠气泡）'); lifeBubble.append(lifeText, lifeClaim);
  const storyBubble = el(doc, 'section', undefined, 'erii-companion__story');
  storyBubble.hidden = true;
  storyBubble.setAttribute('aria-label', '小绘的治愈小故事');
  const storyHeading = el(doc, 'div', undefined, 'erii-companion__story-heading');
  const storyTitle = el(doc, 'strong');
  const storyClose = el(doc, 'button', '×', 'erii-companion__story-close');
  storyClose.type = 'button'; storyClose.setAttribute('aria-label', '收起小故事');
  storyHeading.append(storyTitle, storyClose);
  const storyText = el(doc, 'p');
  // Update only when a new story starts, rather than announcing every sample.
  storyText.setAttribute('aria-live', 'polite');
  const storyNext = el(doc, 'button', '换一篇', 'erii-companion__story-next');
  storyNext.type = 'button';
  const storyFoot = el(doc, 'div', undefined, 'erii-companion__story-foot');
  storyFoot.append(el(doc, 'span', '每 30 秒换一篇'), storyNext);
  storyBubble.append(storyHeading, storyText, storyFoot);
  root.append(portrait);
  overlay.append(message, notebook, storyBubble, lifeBubble);
  doc.body.append(root, overlay);

  function listen(target, name, handler, options) {
    target.addEventListener(name, handler, options);
    subscriptions.push(() => target.removeEventListener(name, handler, options));
  }
  function save() {
    store[ID] = { ...(store[ID] || {}), ...settings };
    context.saveSettingsDebounced?.();
    position();
    settingsControls?.sync();
  }
  function rememberPosition() {
    settings.position = toRatio(point, bounds);
    save();
  }
  function setNotebook(open) {
    if (open) { chat?.close(); life?.close(); storyteller.dismiss(); }
    notebook.hidden = !open;
    if (open) overlay.hidden = false;
    portrait.setAttribute('aria-expanded', String(open));
    if (open) { updateNotebook(); close.focus({ preventScroll: true }); }
    else (settings.enabled === false ? settingsMount?.querySelector('button[aria-controls]') : portrait)?.focus({ preventScroll: true });
    position();
  }
  function openDatabaseApp() {
    setNotebook(false);
    const menuItem = doc.getElementById('acu-v2-menu-item')
      || doc.getElementById('shujuku_v120-menu-item')
      || [...doc.querySelectorAll('#extensionsMenu .list-group-item')].find(item =>
        item.querySelector('.fa-database') && /数据库/.test(item.textContent || ''));
    if (menuItem instanceof host.HTMLElement) {
      menuItem.click();
      return true;
    }
    setNotebook(true);
    connection.textContent = '未找到数据库入口，请先启用数据库扩展';
    return false;
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
      snapshot.activityKnown, root.dataset.source, assetFailed, settings.enabled]);
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
    flower.disabled = snapshot.busy || settings.enabled === false;
    storyOpen.disabled = snapshot.busy || settings.enabled === false;
    for (const button of localActions) button.disabled = snapshot.busy || settings.enabled === false;
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
  panelObserver?.observe(notebook); panelObserver?.observe(message); panelObserver?.observe(storyBubble); panelObserver?.observe(lifeBubble);
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
    update();
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
    if (!storyBubble.hidden) placePanel(storyBubble, 300);
    if (!lifeBubble.hidden) placePanel(lifeBubble, 130);
  }
  function storyBlocked() {
    return settings.enabled === false || doc.hidden || model.snapshot.silent || model.snapshot.busy
      || Date.now() < terminalUntil || !model.canInteract() || !notebook.hidden || chat?.visible || life?.visible
      || Boolean(lifeModel.state.active) || lifeNotice?.until > Date.now() || Boolean(dragging);
  }
  function tellStory() {
    // Close the notebook first, so the bubble has room to sit beside her.
    if (!model.canInteract() || model.snapshot.silent || settings.enabled === false) return;
    setNotebook(false);
    if (storyBlocked()) return;
    storyteller.show(); update();
  }
  function currentTask() {
    // Cached carousel observations are notebook records, never stop targets.
    return model.snapshot.tasks.find(task => task.id === model.snapshot.activeTaskId && task.busy) || null;
  }
  function update() {
    if (destroyed) return;
    if (settings.enabled === false && dragging) cancelDrag();
    root.hidden = settings.enabled === false;
    overlay.hidden = root.hidden && notebook.hidden;
    const snapshot = model.snapshot;
    const now = Date.now();
    if (lifeModel.tick()) lifeNotice = {text:'吃完啦。今天也好好照顾自己了。',until:now+6000};
    const activity = lifeModel.view();
    const localPose = model.pose();
    const canPeek = settings.enabled && settings.edgePeeks && !dragging
      && notebook.hidden && !chat?.busy && !activity.active && !life?.visible && localPose === 'idle' && !snapshot.busy && !doc.hidden;
    const edge = canPeek ? dockEdge(point, bounds) : null;
    const edgePose = edge && `edge-${edge}`;
    const pose = dragging?.moved ? 'lifted' : edgePose && edgePose !== failedEdge ? edgePose
      : now < landingUntil ? 'land' : chat?.busy && localPose === 'idle' && model.canInteract() ? 'writing'
      : localPose !== 'idle' ? localPose : activity.active && !snapshot.busy && !snapshot.silent
        ? activity.ready ? 'complete' : activity.item.image : localPose;
    if (pose !== lastPose) {
      lastPose = pose;
      showPose(pose);
      portrait.title = `${labels[pose] || labels.idle} · 轻点互动 · 拖动移动 · 右键看小本子`;
    }
    root.dataset.interaction = model.lastInteraction;
    const replace = settings.enabled !== false && settings.hideOriginal && snapshot.connected && hasDecodedPose && !assetFailed;
    if (doc.body.hasAttribute('data-erii-replace-database-pet') !== Boolean(replace))
      doc.body.toggleAttribute('data-erii-replace-database-pet', Boolean(replace));
    const activeTask = currentTask();
    const hasTaskMessage = snapshot.busy;
    const hasNoticeMessage = Boolean(model.history.length && Date.now() < terminalUntil);
    const newest = model.history[0];
    const failureNotice = hasNoticeMessage && ['error', 'warning'].includes(newest.kind);
    const feedback = stopFeedback?.until > now && snapshot.busy
      && (!snapshot.activeTaskId || stopFeedback.taskId === snapshot.activeTaskId) ? stopFeedback : null;
    const taskDisplay = activeTask ? settings.taskDetails
      ? [activeTask.feature || '数据库任务', activeTask.detail].filter(Boolean).join('\n')
      : `正在${activeTask.feature || '处理任务'}…` : '数据库正在处理任务，等待进度同步…';
    const wasHidden = message.hidden;
    message.hidden = Boolean(dragging?.moved) || notebook.hidden === false || snapshot.silent || !snapshot.connected || (!hasTaskMessage && !hasNoticeMessage) || !settings.enabled;
    let changed = wasHidden !== message.hidden;
    if (!message.hidden) {
      const text = feedback ? feedback.text : failureNotice ? newest.text : hasTaskMessage
        ? taskDisplay : newest.text;
      message.dataset.kind = feedback ? feedback.kind : failureNotice ? newest.kind : hasTaskMessage ? activeTask?.kind || 'info' : newest.kind;
      if (messageText.textContent !== text) { messageText.textContent = text; changed = true; }
      const canStop = Boolean(hasTaskMessage && activeTask?.action?.run);
      messageStop.hidden = !canStop;
      messageStop.dataset.taskId = activeTask?.id || '';
      messageStop.disabled = taskStopBusy;
      messageStop.textContent = taskStopBusy ? '停止中…' : (activeTask?.action?.label || '停止');
    }
    const panelTask = snapshot.connected && !snapshot.silent && (hasTaskMessage || hasNoticeMessage) ? {
      text: feedback ? feedback.text : failureNotice ? newest.text : hasTaskMessage
        ? taskDisplay : newest.text,
      id: activeTask?.id, kind: feedback ? feedback.kind : failureNotice ? newest.kind : '',
      canStop: Boolean(hasTaskMessage && activeTask?.action?.run), pending: taskStopBusy,
    } : null;
    chat?.setTask(panelTask); life?.setTask(panelTask); life?.render();
    const hadLifeBubble = !lifeBubble.hidden;
    lifeBubble.hidden = !settings.enabled || snapshot.silent || hasTaskMessage || hasNoticeMessage || Boolean(dragging)
      || !notebook.hidden || chat?.visible || life?.visible || (!activity.active && !(lifeNotice?.until > now));
    if (!lifeBubble.hidden) {
      const seconds = Math.ceil(activity.remaining / 1000);
      const text = activity.ready ? `下班啦，${activity.item.reward} 金币等你来领。`
        : activity.active?.kind === 'job' ? `小绘在${activity.item.name}帮忙 · ${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')} 后下班`
        : activity.active ? `小绘在吃${activity.item.name} · 还有 ${seconds} 秒` : lifeNotice.text;
      if (lifeText.textContent !== text) {lifeText.textContent = text; changed = true;}
      lifeClaim.hidden = !activity.ready;
    }
    changed ||= hadLifeBubble !== !lifeBubble.hidden;
    updateNotebook();
    const beforeStory = storyBubble.hidden;
    storyteller.tick({ blocked: storyBlocked(), automatic: settings.healingStories === true && localPose === 'idle' });
    const story = storyteller.current;
    storyBubble.hidden = !story;
    if (story && storyTitle.textContent !== story.title) {
      storyTitle.textContent = story.title; storyText.textContent = story.text;
      storyBubble.scrollTop = 0; changed = true;
    }
    changed ||= beforeStory !== storyBubble.hidden;
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
    for (const [key, label] of [['enabled', '显示绘梨衣'], ['idleActions', '空闲时做小动作'], ['hideOriginal', '隐藏数据库原桌宠和原气泡'], ['edgePeeks', '拖到边缘后探头'], ['healingStories', '空闲时讲治愈小故事']]) {
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
    const taskRow = el(doc, 'label');
    const taskMode = el(doc, 'select'); taskMode.setAttribute('aria-label', '任务内容显示');
    for (const [value, caption] of [['brief', '简略版'], ['full', '完整版（真实工作内容）']]) {
      const option = el(doc, 'option', caption); option.value = value; taskMode.append(option);
    }
    taskMode.value = settings.taskDetails ? 'full' : 'brief';
    taskRow.append(el(doc, 'span', '任务内容显示'), taskMode); settingsMount.append(taskRow);
    listen(taskMode, 'change', () => { settings.taskDetails = taskMode.value === 'full'; save(); });
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
    const chatSetting = el(doc, 'button', '和小绘聊天'); chatSetting.type = 'button';
    chatSetting.setAttribute('aria-controls', `${ID}-chat`);
    settingsMount.append(chatSetting); listen(chatSetting, 'click', () => chat?.open());
    const lifeSetting = el(doc, 'button', '生活手帐'); lifeSetting.type = 'button';
    lifeSetting.setAttribute('aria-controls', `${ID}-life`); settingsMount.append(lifeSetting); listen(lifeSetting, 'click', () => life?.open());
    settingsMount.append(el(doc, 'p', '轻点或连点小绘可互动；普通长按让她放松，手机长按约 1.4 秒打开小本子。电脑可右键打开，或使用这里的按钮。'));
    settingsControls = { sync() { for (const [key, input] of fields) input.checked = settings[key] === true; range.value = String(settings.size); taskMode.value = settings.taskDetails ? 'full' : 'brief'; } };
    target.append(settingsMount);
  }

  function resetPosition() { cancelDrag(); model.interruptLocal(); settings.position = null; landingUntil = 0; save(); }
  function clearHold() {
    if (holdTimer !== null) host.clearTimeout(holdTimer);
    if (mobileBookTimer !== null) host.clearTimeout(mobileBookTimer);
    holdTimer = null; mobileBookTimer = null;
  }
  async function stopDatabaseTask(displayedId) {
    if (taskStopBusy) return;
    dataSource?.refresh();
    const task = currentTask();
    if (!task?.action?.run || task.id !== displayedId) {
      stopFeedback = { taskId: task?.id || '', text: '任务提示已更新，请确认后再停止。', kind: 'warning', until: Date.now() + 8000 };
      update(); return;
    }
    taskStopBusy = true; stopFeedback = null; update();
    try { await task.action.run(); }
    catch { stopFeedback = { taskId: task.id, text: '停止任务失败，请重试或打开数据库面板。', kind: 'error', until: Date.now() + 8000 }; }
    finally { taskStopBusy = false; dataSource?.refresh(); update(); }
  }
  listen(messageStop, 'click', event => {
    event.stopPropagation();
    if (!message.hidden && !messageStop.hidden) stopDatabaseTask(messageStop.dataset.taskId);
  });
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
    longPressed = false; mobileBookOpened = false;
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
    landingUntil = 0; storyteller.dismiss();
    model.tap(); update();
  }
  listen(portrait, 'pointerdown', event => {
    if (event.button !== 0 || event.isPrimary === false || dragging) return;
    position(); suppressClick = false; longPressed = false; mobileBookOpened = false;
    const rendered = root.getBoundingClientRect();
    point = constrain({ x: rendered.x, y: rendered.y }, bounds);
    dragging = { id: event.pointerId, startX: event.clientX, startY: event.clientY, origin: { ...point }, pending: { ...point }, moved: false, lastX: event.clientX, tilt: 0 };
    storyteller.dismiss(); update();
    try { portrait.setPointerCapture(event.pointerId); } catch { /* keyboard/synthetic test may have no live pointer */ }
    holdTimer = host.setTimeout(() => {
      holdTimer = null;
      if (!dragging || dragging.moved) return;
      longPressed = true; suppressClick = true; landingUntil = 0;
      model.startComfort(); update();
    }, 550);
    if (event.pointerType === 'touch') {
      mobileBookTimer = host.setTimeout(() => {
        mobileBookTimer = null;
        if (!dragging || dragging.moved) return;
        mobileBookOpened = true; longPressed = true; suppressClick = true;
        model.endComfort(); setNotebook(true); update();
      }, 1400);
    }
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
    if (event.pointerType === 'mouse' && !dragging && model.pose() === 'idle' && Date.now() > hoverUntil
      && !(settings.edgePeeks && dockEdge(point, bounds))) {
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
    setNotebook(notebook.hidden);
  });
  listen(portrait, 'keydown', event => {
    if (event.key === 'Enter' && event.shiftKey) { event.preventDefault(); setNotebook(true); return; }
    if (event.key === 'Home') { event.preventDefault(); resetPosition(); return; }
    const delta = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key];
    if (!delta) return;
    event.preventDefault(); position();
    model.interruptLocal(); landingUntil = 0;
    const step = event.shiftKey ? 28 : 10;
    point = constrain({ x: point.x + delta[0] * step, y: point.y + delta[1] * step }, bounds);
    rememberPosition();
  });
  listen(close, 'click', () => setNotebook(false));
  listen(flower, 'click', () => { model.gift(); update(); });
  listen(databaseOpen, 'click', openDatabaseApp);
  listen(storyOpen, 'click', tellStory);
  listen(storyNext, 'click', () => {
    if (storyBlocked()) return;
    storyteller.show(); update();
    if (storyBubble.matches(':hover')) storyteller.pause('hover');
    if (storyBubble.contains(doc.activeElement)) storyteller.pause('focus');
  });
  listen(storyClose, 'click', () => { storyteller.dismiss(); update(); portrait.focus({ preventScroll: true }); });
  listen(storyBubble, 'pointerenter', () => storyteller.pause('hover'));
  listen(storyBubble, 'pointerleave', () => storyteller.resume('hover'));
  listen(storyBubble, 'focusin', () => storyteller.pause('focus'));
  listen(storyBubble, 'focusout', event => {
    if (!storyBubble.contains(event.relatedTarget)) storyteller.resume('focus');
  });
  // On a phone, touching the text freezes expiry until it is deliberately closed.
  listen(storyBubble, 'pointerdown', event => { if (event.pointerType === 'touch') storyteller.pause('touch'); });
  for (const button of localActions) listen(button, 'click', () => {
    if (model.leisure(button.dataset.action)) { setNotebook(false); update(); }
  });
  listen(doc, 'keydown', event => {
    if (event.key !== 'Escape') return;
    if (life?.visible) { life.close(); return; }
    if (chat?.visible) { chat.close(); return; }
    if (dragging) finishDrag(null, true);
    if (!notebook.hidden) setNotebook(false);
    if (!storyBubble.hidden) { storyteller.dismiss(); update(); }
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
      if (!doc.hidden && settings.enabled && settings.idleActions && !dragging && notebook.hidden && !chat?.visible && !life?.visible && !lifeModel.state.active && !storyteller.current && model.pose() === 'idle' && !root.dataset.edge) {
        if (Math.random() < 0.28) { model.tap(); }
        else {
          const choices = ['tea', 'reading', 'origami', 'duck', 'stretch', 'rest', 'peek', 'wave'];
          model.leisure(choices[Math.floor(Math.random() * choices.length)]);
        }
        update();
      }
      scheduleLeisure();
    }, 12000 + Math.random() * 8000);
    timers.add(timer);
  }
  chat = createChatWindow(host, {
    getContext: () => host.SillyTavern?.getContext?.() || context,
    saved: settings.chat || {},
    persist: value => { settings.chat = value; store[ID] = { ...(store[ID] || {}), ...settings }; context.saveSettingsDebounced?.(); },
    onOpen: () => { life?.close(); setNotebook(false); storyteller.dismiss(); },
    onState: () => { if (point) update(); },
    onReply: () => { if (model.canInteract()) model.leisure('wave'); },
    onStopTask: stopDatabaseTask,
    returnFocus: () => (settings.enabled === false ? settingsMount?.querySelector('button[aria-controls]') : portrait)?.focus({ preventScroll: true }),
  });
  listen(chatOpen, 'click', () => chat.open());
  life = createLifeWindow(host, {
    model:lifeModel,
    onOpen:() => {chat?.close(); setNotebook(false); storyteller.dismiss();},
    onChange:() => {if (point) update();},
    blocked:() => model.snapshot.busy || chat?.busy,
    onStopTask:stopDatabaseTask,
    returnFocus:() => (settings.enabled === false ? settingsMount?.querySelector('button[aria-controls]') : portrait)?.focus({preventScroll:true}),
  });
  listen(lifeOpen, 'click', () => life.open());
  listen(lifeClaim, 'click', () => {if (lifeModel.claim()) {lifeNotice = {text:'工资收好啦，去挑点喜欢的饭吧。',until:Date.now()+6000}; update();}});
  for (const pose of Object.keys(imageUrls)) loadAsset(pose);
  connect(); mountSettings(); watchInput(); position(); scheduleLeisure();
  // Establish the saved location before enabling movement easing (no fly-in from 0,0).
  root.getBoundingClientRect();
  root.style.transition = '';
  return {
    model,
    chat,
    life,
    lifeModel,
    refresh: update,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      chat.destroy();
      life.destroy();
      storyteller.dismiss();
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






