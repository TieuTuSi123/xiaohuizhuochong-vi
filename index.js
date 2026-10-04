import { CompanionModel } from './model.js';
import { createDatabaseObserver, readDeskPetImages } from './database-observer.js';
import { readBounds, fromRatio, toRatio, constrain, dockEdge } from './position.js';
import { createMotion } from './motion.js';
import { StoryCarousel } from './stories.js';
import { createChatWindow } from './chat-window.js';
import { LifeModel } from './life-model.js';
import { createLifeWindow } from './life-window.js';
import { CHARACTERS, CHARACTER_IDS, DEFAULT_CHARACTER, resolveCharacter, imageUrls, usesDatabaseArt, poseLabel } from './characters.js';
import { CareModel, MOOD_NAMES, dayKey } from './care-model.js';
import { createLinePicker, taskKind, timeOfDay } from './lines.js';
import { createNotebook } from './notebook.js';
import { createPetHouse } from './pet-house.js';
import { createEffects, resolveTier } from './effects.js';
import { openDatabasePage, pageForNotice } from './database-shortcuts.js';
import { createSheet } from './sheet.js';
import { icon } from './icons.js';

const ID = 'erii-database-pet';
const VERSION = '0.8.0';
const defaults = { enabled: true, idleActions: true, edgePeeks: true, healingStories: true, hideOriginal: true, taskDetails: false, size: 88, side: 'right', position: null,
  character: DEFAULT_CHARACTER, taskTalk: true, needs: true, effects: 'auto' };
const CHAT_CONNECTION = ['mode', 'url', 'model', 'maxTokens', 'rememberKey', 'replyStyle', 'nickname'];
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
  const firstCareRun = !store[ID]?.care;
  const settings = { ...defaults, ...(store[ID] || {}) };
  settings.size = Math.min(112, Math.max(56, Number(settings.size) || 88));
  settings.side = settings.side === 'left' ? 'left' : 'right';
  if (!CHARACTER_IDS.includes(settings.character)) settings.character = DEFAULT_CHARACTER;
  if (!['auto', 'off', 'simple', 'fancy'].includes(settings.effects)) settings.effects = 'auto';
  if (!settings.chats || typeof settings.chats !== 'object') settings.chats = {};
  let character = resolveCharacter(settings.character);
  let databaseArt = null;
  let artCheckedAt = 0;
  let images = imageUrls(character);
  const model = new CompanionModel();
  const storyteller = new StoryCarousel();
  const picker = createLinePicker();
  const persistStore = () => { store[ID] = { ...(store[ID] || {}), ...settings }; context.saveSettingsDebounced?.(); };
  const care = new CareModel(settings.care, { persist: value => { settings.care = value; persistStore(); }, needsEnabled: () => settings.needs !== false });
  let chat = null;
  let life = null;
  let house = null;
  const lifeModel = new LifeModel(settings.life, {persist:value => { settings.life = value; persistStore(); }});
  if (firstCareRun) {
    // 老用户升级：按已有的聊天、打工、吃饭记录给小绘折算初始亲密度，最多到「熟悉」档。
    const history = Array.isArray(settings.chat?.history) ? settings.chat.history : [];
    const stamps = [...history.map(item => Date.parse(item?.at)), ...lifeModel.state.journal.map(item => item.at)].filter(Number.isFinite);
    care.seed('erii', { chats: history.filter(item => item?.role === 'assistant').length, jobs: lifeModel.state.jobs, meals: lifeModel.state.meals,
      earliest: stamps.length ? Math.min(...stamps) : 0 });
  }
  const subscriptions = [];
  const timers = new Set();
  const fxTier = () => resolveTier(settings.effects, host);
  const effects = createEffects(host, { tier: fxTier });
  let dataSource = null;
  let unsubscribe = null;
  let lastPose = '';
  let destroyed = false;
  let assetFailed = false;
  let hasDecodedPose = false;
  let yielded = false;
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
  let speech = null;
  let taskTalk = { key: '', text: '', at: 0, kind: 'other' };
  let lastNoticeId = '';
  let lastTaskKind = 'other';
  let taskSeenAt = 0;
  let worriedUntil = 0;
  let switching = false;
  let bornAt = Date.now();
  let nextChatter = Date.now() + 240000 + Math.random() * 120000;
  let connectionNote = null;
  const readyNotified = new Set();
  const loaded = new Map();
  const root = el(doc, 'div', undefined, 'erii-companion');
  root.id = `${ID}-root`;
  root.dataset.version = VERSION;
  root.dataset.pose = 'idle';
  root.style.transition = 'none';
  // Panels are siblings: a transformed ancestor would change their fixed coordinates.
  const overlay = el(doc, 'div', undefined, 'erii-companion erii-companion--ui');
  overlay.id = `${ID}-ui`;
  const portrait = el(doc, 'button', undefined, 'erii-companion__portrait');
  portrait.type = 'button';
  portrait.setAttribute('aria-expanded', 'false');
  const sway = el(doc, 'span', undefined, 'erii-companion__sway');
  const edgeFrame = el(doc, 'span', undefined, 'erii-companion__edge-frame');
  const breath = el(doc, 'span', undefined, 'erii-companion__breath');
  const stage = el(doc, 'span', undefined, 'erii-companion__stage');
  const sprites = [0, 1].map(index => {
    const sprite = el(doc, 'img', undefined, 'erii-companion__sprite');
    sprite.alt = ''; sprite.draggable = false; if (images.idle) sprite.src = images.idle;
    sprite.dataset.visible = String(index === 0);
    stage.append(sprite);
    return sprite;
  });
  breath.append(stage); sway.append(breath); edgeFrame.append(sway); portrait.append(edgeFrame);
  const motion = createMotion(stage, host);
  function loadAsset(pose) {
    if (!loaded.has(pose)) loaded.set(pose, new Promise(resolve => {
      const url = images[pose];
      if (!url) { loaded.delete(pose); resolve(false); return; }
      const image = new host.Image();
      image.onload = () => { image.decode?.().catch(() => {}).finally(() => resolve(true)) || resolve(true); };
      image.onerror = () => { loaded.delete(pose); resolve(false); };
      image.src = url;
    }));
    return loaded.get(pose);
  }
  async function showPose(pose) {
    const version = ++swapVersion;
    const ok = await loadAsset(pose);
    if (destroyed || version !== swapVersion) return;
    if (!ok) {
      if (pose.startsWith('edge-')) { failedEdge = pose; lastPose = ''; }
      else if (!yielded) assetFailed = true;
      update(); return;
    }
    const next = shownSprite === 0 ? 1 : 0;
    sprites[next].src = images[pose];
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
  const messageName = el(doc, 'span', '', 'erii-bubble__name');
  const messageLine = el(doc, 'p', '', 'erii-bubble__line');
  const messageText = el(doc, 'span', undefined, 'erii-companion__message-text');
  const messageActions = el(doc, 'div', undefined, 'erii-bubble__actions');
  const messageStop = el(doc, 'button', '停止', 'erii-companion__message-action');
  messageStop.type = 'button';
  messageStop.hidden = true;
  messageStop.setAttribute('aria-label', '停止数据库任务');
  const messageLook = el(doc, 'button', undefined, 'erii-companion__message-action erii-bubble__look');
  messageLook.type = 'button'; messageLook.hidden = true;
  messageLook.append(icon(doc, 'look'), el(doc, 'span', '去看看'));
  messageActions.append(messageStop, messageLook);
  message.append(messageName, messageLine, messageText, messageActions);
  const notebook = createNotebook(doc, { id: ID, actions: {
    close: () => setNotebook(false), shortcut: page => openPage(page), leisure: pose => { if (model.leisure(pose)) { setNotebook(false); update(); } },
    gift: () => giveGift(), clean: () => cleanCharacter(character.id), story: () => tellStory(),
    chat: () => chat?.open(), life: () => life?.open(), house: () => house?.open(),
  } });
  const notebookRoot = notebook.root;
  portrait.setAttribute('aria-controls', notebookRoot.id);
  const notebookSheet = createSheet(host, notebookRoot, { grip: notebook.grip, drag: [notebook.head], onDismiss: () => setNotebook(false) });
  const lifeBubble = el(doc, 'div', undefined, 'erii-companion__life-bubble');
  lifeBubble.hidden = true;
  const lifeText = el(doc, 'span', undefined, 'erii-companion__life-text');
  const lifeClaim = el(doc, 'button', '领工资', 'erii-companion__life-claim'); lifeClaim.type = 'button';
  lifeClaim.setAttribute('aria-label', '领取工资（桌宠气泡）'); lifeBubble.append(lifeText, lifeClaim);
  const storyBubble = el(doc, 'section', undefined, 'erii-companion__story');
  storyBubble.hidden = true;
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
  overlay.append(message, notebookRoot, storyBubble, lifeBubble);
  doc.body.append(root, overlay);

  function listen(target, name, handler, options) {
    target.addEventListener(name, handler, options);
    subscriptions.push(() => target.removeEventListener(name, handler, options));
  }
  function save() {
    persistStore();
    position();
    settingsControls?.sync();
  }
  function rememberPosition() {
    settings.position = toRatio(point, bounds);
    save();
  }
  const nameOf = item => care.state(item.id).nickname || item.name;
  const moodExtra = id => ({ worriedUntil: id === character.id ? worriedUntil : 0 });
  function userName() {
    const saved = character.id === DEFAULT_CHARACTER ? settings.chat : settings.chats[character.id];
    const name = String(saved?.nickname || host.SillyTavern?.getContext?.()?.name1 || context.name1 || '').trim();
    return /^(user|you)$/i.test(name) ? '' : name.slice(0, 40);
  }
  function line(path) {
    const view = care.view(character.id, moodExtra(character.id));
    return picker.pick(character, path, { tier: view.tier, mood: view.mood, me: nameOf(character), user: userName() });
  }
  function speak(text, ms = 4200, force = false) {
    if (!text || settings.enabled === false || yielded) return;
    if (!force && (storyteller.current || dragging?.moved)) return;
    speech = { text, until: Date.now() + ms };
    update();
  }
  const say = (path, ms, force) => speak(line(path), ms, force);
  function petCenter() {
    const rect = root.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height * .35 };
  }
  function sparkle(kind, count) {
    const { x, y } = petCenter();
    effects.burst(kind || character.theme.particle, x, y, character.theme.colors, count);
  }
  function celebrate(tier) {
    if (!tier) return;
    speak(character.lines.care.tierUp[tier] || '', 5600, true);
    effects.shower('confetti', [...character.theme.colors, '#e8c66a']);
    house?.render();
  }
  function readArt(force = false) {
    if (!force && Date.now() - artCheckedAt < 2000) return databaseArt;
    artCheckedAt = Date.now();
    databaseArt = readDeskPetImages(doc);
    return databaseArt;
  }
  function artFor(item) {
    if (item.id === character.id) return images;
    return imageUrls(item, usesDatabaseArt(item) ? readArt() : null);
  }
  function setNotebook(open) {
    if (open) { chat?.close(); life?.close(); house?.close(); storyteller.dismiss(); }
    notebookRoot.hidden = !open;
    if (open) overlay.hidden = false;
    portrait.setAttribute('aria-expanded', String(open));
    if (open) { renderNotebook(); notebookSheet.layout(); notebook.close.focus({ preventScroll: true }); }
    else (settings.enabled === false || yielded ? settingsMount?.querySelector('button[aria-controls]') : portrait)?.focus({ preventScroll: true });
    position();
  }
  async function openPage(page) {
    setNotebook(false);
    const result = await openDatabasePage(host, page);
    if (destroyed) return;
    if (!result.ok) { connectionNote = { text: result.reason, until: Date.now() + 8000 }; setNotebook(true); return; }
    if (result.reason) speak(result.reason, 5000, true);
  }
  function accept(snapshot) {
    if (!model.ingest(snapshot)) return;
    if (model.history.length && model.history[0]?.id !== previousHistory) {
      previousHistory = model.history[0].id;
      // 出错时多留一会儿，给用户点“去看看”的时间。
      terminalUntil = Date.now() + (['error', 'warning'].includes(model.history[0].kind) ? 9000 : 4500);
    }
    update();
  }
  function connect() {
    if (dataSource) return;
    dataSource = createDatabaseObserver(host);
    unsubscribe = dataSource.subscribe(accept);
  }
  function connectionText(snapshot) {
    if (connectionNote?.until > Date.now()) return connectionNote.text;
    if (yielded) return `${character.fullName}的图要从数据库读取。请保持数据库运行并开启它自带的桌宠；读到之前由数据库原桌宠陪你。`;
    return assetFailed ? '动作素材加载失败，请更新扩展后刷新页面' :
      snapshot.connected ? snapshot.busy ? '数据库正在处理任务' : snapshot.activityKnown === false ? '已连接数据库 · 等待任务通知' : '已连接数据库 · 现在空闲' :
      root.dataset.source === 'unsupported-view' ? '当前数据库界面版本暂不兼容，请反馈版本' : '等待原数据库加载；保持原数据库脚本启用即可';
  }
  function renderNotebook() {
    if (notebookRoot.hidden) return;
    const snapshot = model.snapshot;
    const view = care.view(character.id, moodExtra(character.id));
    notebook.render({
      title: care.state(character.id).nickname ? `${care.state(character.id).nickname}的小本子` : character.notebookTitle,
      care: { ...view, honor: character.titles[view.tier], moodName: MOOD_NAMES[view.mood] },
      needsEnabled: settings.needs !== false, connection: connectionText(snapshot), connected: snapshot.connected,
      tasks: snapshot.tasks, history: model.history, busy: snapshot.busy, enabled: settings.enabled !== false,
    });
    scheduleLayout();
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
  panelObserver?.observe(notebookRoot); panelObserver?.observe(message); panelObserver?.observe(storyBubble); panelObserver?.observe(lifeBubble);
  function position() {
    if (destroyed) return;
    bounds = readBounds(host, doc, settings.size);
    geometryDirty = false;
    const { width, height, size } = bounds;
    applyPoint(dragging?.moved ? constrain(dragging.pending, bounds) : fromRatio(settings.position, bounds, settings.side));
    root.style.setProperty('--erii-size', `${size}px`);
    overlay.style.setProperty('--erii-page-width', `${Math.max(160, Math.min(330, width - 24))}px`);
    overlay.style.setProperty('--erii-page-height', `${Math.max(120, Math.min(460, height - 32))}px`);
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
      const left = Math.min(Math.max(offsetLeft + 12, px), offsetLeft + width - pw - 12);
      const top = Math.min(Math.max(offsetTop + 12, py), offsetTop + height - ph - 12);
      panel.style.left = `${left}px`;
      panel.style.top = `${top}px`;
      // 气泡尾巴指向桌宠。
      panel.style.setProperty('--tail-x', `${Math.min(pw - 18, Math.max(18, x + size / 2 - left))}px`);
      panel.dataset.place = top + ph <= y + 4 ? 'above' : top >= y + size - 4 ? 'below' : 'side';
    }
    if (!notebookRoot.hidden) { if (notebookSheet.isSheet()) notebookSheet.layout(); else placePanel(notebookRoot, 460); }
    if (!message.hidden) placePanel(message, 150);
    if (!storyBubble.hidden) placePanel(storyBubble, 300);
    if (!lifeBubble.hidden) placePanel(lifeBubble, 130);
  }
  function storyBlocked() {
    return settings.enabled === false || yielded || doc.hidden || model.snapshot.silent || model.snapshot.busy
      || Date.now() < terminalUntil || !model.canInteract() || !notebookRoot.hidden || chat?.visible || life?.visible || house?.visible
      || Boolean(lifeModel.activity(character.id)) || Boolean(dragging);
  }
  function tellStory() {
    // Close the notebook first, so the bubble has room to sit beside her.
    if (!model.canInteract() || model.snapshot.silent || settings.enabled === false) return;
    setNotebook(false);
    if (storyBlocked()) return;
    speech = null;
    storyteller.show(); update();
  }
  function currentTask() {
    // Cached carousel observations are notebook records, never stop targets.
    return model.snapshot.tasks.find(task => task.id === model.snapshot.activeTaskId && task.busy) || null;
  }
  // 任务台词：接到任务说一句，处理中约每 15 秒换一句，完成、出错、被停止各说一句。
  function followTask(snapshot, activeTask, now) {
    const newest = model.history[0];
    if (newest && newest.id !== lastNoticeId) {
      const fresh = Boolean(lastNoticeId) || now - bornAt > 3000;
      lastNoticeId = newest.id;
      if (fresh && Date.now() < terminalUntil) {
        if (newest.kind === 'success' && now - taskSeenAt < 60000) {
          const result = care.taskDone(character.id);
          taskTalk = { key: `notice:${newest.id}`, text: settings.taskTalk ? line(`task.success.${lastTaskKind}`) : '', at: now, kind: lastTaskKind };
          if (result.tierUp) celebrate(result.tierUp);
        } else if (newest.kind === 'error' || newest.kind === 'warning') {
          worriedUntil = now + 300000;
          taskTalk = { key: `notice:${newest.id}`, text: settings.taskTalk ? line('task.error.any') : '', at: now, kind: lastTaskKind };
        }
      }
    }
    if (!snapshot.busy) return;
    taskSeenAt = now;
    const key = activeTask ? `task:${activeTask.id}` : 'task:busy';
    if (taskTalk.key !== key) {
      lastTaskKind = taskKind(activeTask?.feature);
      taskTalk = { key, text: settings.taskTalk ? line(`task.received.${lastTaskKind}`) : '', at: now, kind: lastTaskKind, phase: 'received' };
    } else if (settings.taskTalk && now - taskTalk.at > (taskTalk.phase === 'received' ? 6000 : 15000)) {
      taskTalk = { ...taskTalk, text: line(`task.working.${taskTalk.kind}`), at: now, phase: 'working' };
    }
  }
  function statusOf(id) {
    const view = lifeModel.view(id);
    const doing = view.ready ? '下班了，等你领工资' : view.active?.kind === 'job' ? `在${view.item.name}打工` : view.active ? `在吃${view.item.name}` : '';
    if (id === character.id) return doing ? `陪伴中 · ${doing}` : '正在陪你';
    return doing || '在家休息';
  }
  function lifeFocus() {
    const own = lifeModel.view(character.id);
    if (own.active) return own;
    for (const id of CHARACTER_IDS) {
      if (id === character.id) continue;
      const view = lifeModel.view(id);
      if (view.ready) return view;
    }
    return null;
  }
  function greetIfDue(now) {
    if (switching || settings.enabled === false || yielded || doc.hidden || now - bornAt < 1500 || !model.canInteract()
      || model.snapshot.busy || care.state(character.id).lastSeen === dayKey(now)) return;
    const result = care.greet(character.id);
    if (!result) return;
    say(result.first ? 'greet.first' : result.back ? 'greet.back' : `greet.${timeOfDay(new Date(now))}`, 5600, true);
    sparkle(null, 10);
    if (result.tierUp) host.setTimeout(() => celebrate(result.tierUp), 1800);
  }
  function update() {
    if (destroyed) return;
    if (settings.enabled === false && dragging) cancelDrag();
    if (usesDatabaseArt(character)) {
      const art = readArt();
      const shouldYield = !art;
      if (art && (yielded || !images.idle)) { images = imageUrls(character, art); loaded.clear(); lastPose = ''; notebook.setCharacter(character, images.idle); }
      if (shouldYield !== yielded) { yielded = shouldYield; lastPose = ''; }
    } else yielded = false;
    root.hidden = settings.enabled === false || yielded;
    root.dataset.source = dataSource?.getSnapshot().source || 'waiting';
    root.dataset.fx = fxTier(); overlay.dataset.fx = root.dataset.fx;
    overlay.hidden = root.hidden && notebookRoot.hidden;
    const snapshot = model.snapshot;
    const now = Date.now();
    for (const done of lifeModel.tick()) {
      const result = care.feed(done.who, done.item.id);
      if (done.who === character.id) { say('care.mealDone', 4600); if (result.tierUp) celebrate(result.tierUp); }
    }
    const activity = lifeModel.view(character.id);
    for (const id of CHARACTER_IDS) {
      const view = id === character.id ? activity : lifeModel.view(id);
      const key = view.active?.uid;
      if (view.ready && key && !readyNotified.has(key)) {
        readyNotified.add(key);
        if (id === character.id) say('care.workDone', 5200);
      }
    }
    const localPose = model.pose();
    const canPeek = settings.enabled && settings.edgePeeks && !dragging && !yielded
      && notebookRoot.hidden && !chat?.busy && !activity.active && !life?.visible && localPose === 'idle' && !snapshot.busy && !doc.hidden;
    const edge = canPeek ? dockEdge(point, bounds) : null;
    const edgePose = edge && `edge-${edge}`;
    const pose = dragging?.moved ? 'lifted' : edgePose && edgePose !== failedEdge ? edgePose
      : now < landingUntil ? 'land' : chat?.busy && localPose === 'idle' && model.canInteract() ? 'writing'
      : localPose !== 'idle' ? localPose : activity.active && !snapshot.busy && !snapshot.silent
        ? activity.ready ? 'complete' : activity.item.image : localPose;
    if (pose !== lastPose && !yielded) {
      lastPose = pose;
      showPose(pose);
      portrait.title = `${poseLabel(character, pose)} · 轻点互动 · 拖动移动 · 右键看小本子`;
    }
    root.dataset.interaction = model.lastInteraction;
    const replace = settings.enabled !== false && settings.hideOriginal && snapshot.connected && hasDecodedPose && !assetFailed && !yielded;
    if (doc.body.hasAttribute('data-erii-replace-database-pet') !== Boolean(replace))
      doc.body.toggleAttribute('data-erii-replace-database-pet', Boolean(replace));
    const activeTask = currentTask();
    followTask(snapshot, activeTask, now);
    greetIfDue(now);
    const hasTaskMessage = snapshot.busy;
    const hasNoticeMessage = Boolean(model.history.length && Date.now() < terminalUntil);
    const newest = model.history[0];
    const failureNotice = hasNoticeMessage && ['error', 'warning'].includes(newest.kind);
    const feedback = stopFeedback?.until > now && snapshot.busy
      && (!snapshot.activeTaskId || stopFeedback.taskId === snapshot.activeTaskId) ? stopFeedback : null;
    const taskDisplay = activeTask ? settings.taskDetails
      ? [activeTask.feature || '数据库任务', activeTask.detail].filter(Boolean).join('\n')
      : `正在${activeTask.feature || '处理任务'}…` : '数据库正在处理任务，等待进度同步…';
    const showTask = snapshot.connected && !snapshot.silent && (hasTaskMessage || hasNoticeMessage);
    if (speech && speech.until <= now) speech = null;
    const showSpeech = Boolean(speech) && !showTask;
    const wasHidden = message.hidden;
    message.hidden = Boolean(dragging?.moved) || notebookRoot.hidden === false || !settings.enabled || yielded || (!showTask && !showSpeech);
    let changed = wasHidden !== message.hidden;
    if (!message.hidden) {
      const status = showTask ? feedback ? feedback.text : failureNotice ? newest.text : hasTaskMessage ? taskDisplay : newest.text : '';
      const said = showTask ? (taskTalk.text && (hasTaskMessage || taskTalk.key === `notice:${newest?.id}`) ? taskTalk.text : '') : speech.text;
      message.dataset.kind = showTask ? feedback ? feedback.kind : failureNotice ? newest.kind : hasTaskMessage ? activeTask?.kind || 'info' : newest.kind : 'speech';
      message.dataset.tone = showTask ? 'task' : 'speech';
      if (messageName.textContent !== nameOf(character)) messageName.textContent = nameOf(character);
      if (messageLine.textContent !== said) { messageLine.textContent = said; changed = true; }
      messageLine.hidden = !said;
      if (messageText.textContent !== status) { messageText.textContent = status; changed = true; }
      messageText.hidden = !status;
      const canStop = Boolean(showTask && hasTaskMessage && activeTask?.action?.run);
      messageStop.hidden = !canStop;
      messageStop.dataset.taskId = activeTask?.id || '';
      messageStop.disabled = taskStopBusy;
      messageStop.textContent = taskStopBusy ? '停止中…' : (activeTask?.action?.label || '停止');
      messageLook.hidden = !(showTask && failureNotice && !feedback);
      messageLook.dataset.page = failureNotice ? pageForNotice(newest.text) : '';
      messageActions.hidden = messageStop.hidden && messageLook.hidden;
    }
    const panelTask = showTask ? {
      text: feedback ? feedback.text : failureNotice ? newest.text : hasTaskMessage ? taskDisplay : newest.text,
      id: activeTask?.id, kind: feedback ? feedback.kind : failureNotice ? newest.kind : '',
      canStop: Boolean(hasTaskMessage && activeTask?.action?.run), pending: taskStopBusy,
    } : null;
    chat?.setTask(panelTask); life?.setTask(panelTask); life?.render();
    const hadLifeBubble = !lifeBubble.hidden;
    const focus = lifeFocus();
    lifeBubble.hidden = !settings.enabled || yielded || snapshot.silent || !message.hidden || Boolean(dragging)
      || !notebookRoot.hidden || chat?.visible || life?.visible || house?.visible || !focus;
    if (!lifeBubble.hidden) {
      const seconds = Math.ceil(focus.remaining / 1000);
      const who = nameOf(resolveCharacter(focus.who));
      const text = focus.ready ? `${focus.who === character.id ? '下班啦' : `${who}下班了`}，${focus.item.reward} 金币等你来领。`
        : focus.active?.kind === 'job' ? `${who}在${focus.item.name}帮忙 · ${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')} 后下班`
        : `${who}在吃${focus.item.name} · 还有 ${seconds} 秒`;
      if (lifeText.textContent !== text) {lifeText.textContent = text; changed = true;}
      lifeClaim.hidden = !focus.ready; lifeClaim.dataset.who = focus.who;
    }
    changed ||= hadLifeBubble !== !lifeBubble.hidden;
    renderNotebook();
    if (now > nextChatter) {
      nextChatter = now + 240000 + Math.random() * 120000;
      if (settings.idleActions && message.hidden && !storyteller.current && !storyBlocked()) say(`mood.${care.mood(character.id, moodExtra(character.id))}`, 4800);
    }
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
  function applyCharacterTexts() {
    root.dataset.character = character.id; overlay.dataset.character = character.id;
    portrait.setAttribute('aria-label', `${character.fullName}：单击、连点或长按互动；手机长按打开小本子，电脑右键查看任务`);
    portrait.title = '轻点互动 · 连点有不同反应 · 手机长按打开小本子 · 拖动移动 · 电脑右键看小本子';
    lifeBubble.setAttribute('aria-label', `${character.name}的生活进度`);
    storyBubble.setAttribute('aria-label', `${character.name}的治愈小故事`);
    notebook.setCharacter(character, images.idle);
    settingsControls?.sync();
  }
  function chatSaved(id) {
    if (id === DEFAULT_CHARACTER) return settings.chat || {};
    if (!settings.chats[id]) {
      // 第一次和新角色聊天：沿用小绘的连接设置，不用重填接口；聊天记录和人设各自独立。
      const base = settings.chat || {};
      settings.chats[id] = { ...Object.fromEntries(CHAT_CONNECTION.filter(key => key in base).map(key => [key, base[key]])), relationship: resolveCharacter(id).relationship, history: [] };
    }
    return settings.chats[id];
  }
  function makeChat() {
    const id = character.id;
    return createChatWindow(host, {
      character, avatarUrl: () => images.idle, welcomeUrl: () => images.reading || images.idle,
      getContext: () => host.SillyTavern?.getContext?.() || context,
      saved: chatSaved(id),
      persist: value => { if (id === DEFAULT_CHARACTER) settings.chat = value; else settings.chats[id] = value; persistStore(); },
      onOpen: () => { life?.close(); house?.close(); setNotebook(false); storyteller.dismiss(); },
      onState: () => { if (point) update(); },
      onReply: () => { const result = care.chatRound(id); if (model.canInteract()) model.leisure('wave'); if (result.tierUp) celebrate(result.tierUp); },
      onStopTask: stopDatabaseTask,
      onOpenDatabase: () => openPage('form-fill'),
      returnFocus: () => (settings.enabled === false || yielded ? settingsMount?.querySelector('button[aria-controls]') : portrait)?.focus({ preventScroll: true }),
    });
  }
  function switchCharacter(id) {
    const next = resolveCharacter(id);
    if (switching || next.id === character.id) return false;
    if (usesDatabaseArt(next) && !readArt(true)) return false;
    switching = true;
    say('switchOut', 900, true);
    model.interruptLocal(); model.leisure('wave'); update();
    const delay = fxTier() === 'off' ? 0 : 650;
    const timer = host.setTimeout(() => {
      timers.delete(timer);
      if (destroyed) return;
      const chatWasOpen = chat?.visible;
      const seenToday = care.state(next.id).lastSeen === dayKey(Date.now());
      character = next; settings.character = next.id;
      images = imageUrls(character, usesDatabaseArt(character) ? readArt(true) : null);
      loaded.clear(); failedEdge = null; assetFailed = false; lastPose = ''; speech = null; yielded = false;
      for (const pose of Object.keys(images)) loadAsset(pose);
      applyCharacterTexts();
      chat?.destroy(); chat = makeChat(); if (chatWasOpen) chat.open();
      life?.setCharacter(character.id);
      landingUntil = Date.now() + 1100; switching = false;
      // 今天见过就说一句“我来了”；没见过的话，下面的 update 会改成当天第一次见面的问候。
      if (seenToday) speech = { text: line('switchIn'), until: Date.now() + 3600 };
      save();
      sparkle(null, 18);
      house?.render();
      update();
    }, delay);
    timers.add(timer);
    return true;
  }
  function giveGift() {
    if (!model.gift()) return;
    const result = care.gift(character.id);
    say(result.capped ? 'care.giftLimit' : 'care.gift', 4200, true);
    sparkle('hearts', 12);
    if (result.tierUp) celebrate(result.tierUp);
    setNotebook(false); update();
  }
  function cleanCharacter(id) {
    if (settings.needs === false) return null;
    const result = care.clean(id);
    if (id === character.id) {
      say(result.tooSoon ? 'care.cleanSoon' : 'care.clean', 4200, true);
      if (!result.tooSoon) sparkle('bubbles', 16);
      if (result.tierUp) celebrate(result.tierUp);
    }
    update();
    return result;
  }
  function mountSettings() {
    if (settingsMount?.isConnected) return;
    const target = doc.getElementById('extensions_settings2') || doc.getElementById('extensions_settings');
    if (!target) return;
    settingsMount = el(doc, 'details', undefined, 'erii-companion-settings');
    settingsMount.id = `${ID}-settings`;
    const summary = el(doc, 'summary', '');
    settingsMount.append(summary);
    const roster = el(doc, 'div', undefined, 'pet-settings__roster');
    roster.setAttribute('role', 'group'); roster.setAttribute('aria-label', '当前桌宠');
    const rosterButtons = CHARACTER_IDS.map(id => {
      const item = CHARACTERS[id];
      const control = el(doc, 'button', undefined, 'pet-settings__pick'); control.type = 'button'; control.dataset.id = id; control.dataset.character = id;
      control.append(el(doc, 'span', item.fullName));
      roster.append(control);
      listen(control, 'click', () => {
        if (id !== character.id && !switchCharacter(id) && usesDatabaseArt(item)) house?.open(id);
      });
      return control;
    });
    const houseSetting = el(doc, 'button', '桌宠小屋', 'pet-settings__house'); houseSetting.type = 'button';
    houseSetting.setAttribute('aria-controls', `${ID}-house`); roster.append(houseSetting);
    listen(houseSetting, 'click', () => house?.open());
    settingsMount.append(roster);
    const fields = [];
    const group = title => { const box = el(doc, 'fieldset', undefined, 'pet-settings__group'); box.append(el(doc, 'legend', title)); settingsMount.append(box); return box; };
    const toggle = (box, key, label, after) => {
      const row = el(doc, 'label');
      const input = el(doc, 'input');
      input.type = 'checkbox';
      input.checked = settings[key] === true;
      row.append(input, el(doc, 'span', label));
      box.append(row);
      listen(input, 'change', () => { settings[key] = input.checked; after?.(); save(); });
      fields.push([key, input]);
    };
    const display = group('桌宠');
    toggle(display, 'enabled', '显示桌宠');
    toggle(display, 'idleActions', '空闲时做小动作、偶尔说说话');
    toggle(display, 'edgePeeks', '拖到边缘后探头');
    toggle(display, 'healingStories', '空闲时讲治愈小故事');
    const sizeRow = el(doc, 'label', undefined, 'pet-settings__range');
    const range = el(doc, 'input');
    range.type = 'range'; range.min = '56'; range.max = '112'; range.step = '4'; range.value = String(settings.size);
    sizeRow.append(el(doc, 'span', '桌宠大小'), range);
    display.append(sizeRow);
    listen(range, 'input', () => { settings.size = Number(range.value); save(); });
    const database = group('数据库');
    toggle(database, 'hideOriginal', '隐藏数据库原桌宠和原气泡');
    toggle(database, 'taskTalk', '任务时说话');
    const taskRow = el(doc, 'label', undefined, 'pet-settings__select');
    const taskMode = el(doc, 'select'); taskMode.setAttribute('aria-label', '任务内容显示');
    for (const [value, caption] of [['brief', '简略版'], ['full', '完整版（真实工作内容）']]) {
      const option = el(doc, 'option', caption); option.value = value; taskMode.append(option);
    }
    taskMode.value = settings.taskDetails ? 'full' : 'brief';
    taskRow.append(el(doc, 'span', '任务内容显示'), taskMode); database.append(taskRow);
    listen(taskMode, 'change', () => { settings.taskDetails = taskMode.value === 'full'; save(); });
    const nurture = group('养成与外观');
    toggle(nurture, 'needs', '需求值（饱腹、清洁会随时间下降，没有惩罚）', () => care.setNeedsEnabled(settings.needs));
    const fxRow = el(doc, 'label', undefined, 'pet-settings__select');
    const fxMode = el(doc, 'select'); fxMode.setAttribute('aria-label', '特效');
    for (const [value, caption] of [['auto', '自动（电脑华丽、手机简约）'], ['fancy', '华丽'], ['simple', '简约'], ['off', '关闭']]) {
      const option = el(doc, 'option', caption); option.value = value; fxMode.append(option);
    }
    fxMode.value = settings.effects;
    fxRow.append(el(doc, 'span', '特效'), fxMode); nurture.append(fxRow);
    listen(fxMode, 'change', () => { settings.effects = fxMode.value; save(); house?.refreshEffects(); });
    const buttons = el(doc, 'div', undefined, 'pet-settings__buttons');
    const resetSetting = el(doc, 'button', '重置桌宠位置'); resetSetting.type = 'button';
    listen(resetSetting, 'click', resetPosition);
    const openBook = el(doc, 'button', '查看任务小本子'); openBook.type = 'button';
    openBook.setAttribute('aria-controls', notebookRoot.id);
    listen(openBook, 'click', () => setNotebook(true));
    const chatSetting = el(doc, 'button', '和小绘聊天'); chatSetting.type = 'button';
    chatSetting.setAttribute('aria-controls', `${ID}-chat`); listen(chatSetting, 'click', () => chat?.open());
    const lifeSetting = el(doc, 'button', '生活手帐'); lifeSetting.type = 'button';
    lifeSetting.setAttribute('aria-controls', `${ID}-life`); listen(lifeSetting, 'click', () => life?.open());
    buttons.append(resetSetting, openBook, chatSetting, lifeSetting);
    settingsMount.append(buttons);
    const hint = el(doc, 'p', '');
    settingsMount.append(hint);
    settingsControls = { sync() {
      for (const [key, input] of fields) input.checked = settings[key] === true;
      range.value = String(settings.size); taskMode.value = settings.taskDetails ? 'full' : 'brief'; fxMode.value = settings.effects;
      summary.textContent = `${character.fullName} · 数据库桌宠`;
      chatSetting.textContent = `和${character.name}聊天`;
      hint.textContent = `轻点或连点${character.name}可互动；普通长按让${character.pronoun}放松，手机长按约 1.4 秒打开小本子。电脑可右键打开，或使用这里的按钮。`;
      for (const control of rosterButtons) control.setAttribute('aria-pressed', String(control.dataset.id === character.id));
    } };
    settingsControls.sync();
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
    try { await task.action.run(); if (settings.taskTalk) taskTalk = { key: `stopped:${task.id}`, text: line('task.stopped.any'), at: Date.now(), kind: lastTaskKind }; }
    catch { stopFeedback = { taskId: task.id, text: '停止任务失败，请重试或打开数据库面板。', kind: 'error', until: Date.now() + 8000 }; }
    finally { taskStopBusy = false; dataSource?.refresh(); update(); }
  }
  listen(messageStop, 'click', event => {
    event.stopPropagation();
    if (!message.hidden && !messageStop.hidden) stopDatabaseTask(messageStop.dataset.taskId);
  });
  listen(messageLook, 'click', event => {
    event.stopPropagation();
    if (messageLook.dataset.page) openPage(messageLook.dataset.page);
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
    if (moved) { save(); if (Math.random() < .5) say('touch.land', 2400); }
    else if (held) { model.endComfort(); suppressClick = true; update(); }
    else { suppressClick = true; interactTap(); }
  }
  let lastTapLine = 0;
  function interactTap() {
    if (settings.enabled === false || destroyed || yielded) return;
    landingUntil = 0; storyteller.dismiss();
    const resting = lastPose === 'rest';
    const action = model.tap();
    if (action) {
      const result = care.touch(character.id);
      const now = Date.now();
      const path = resting ? 'touch.wake' : { greet: 'touch.tap', duck: 'touch.double', bashful: 'touch.bashful', playful: 'touch.playful' }[action];
      if (path && (action !== 'greet' || resting || (now - lastTapLine > 6000 && Math.random() < .45))) { lastTapLine = now; say(path, 2600); }
      if (action === 'playful') sparkle(null, 10);
      if (result.tierUp) celebrate(result.tierUp);
    }
    update();
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
      if (model.startComfort()) say('touch.comfort', 3200, true);
      update();
    }, 550);
    if (event.pointerType === 'touch') {
      mobileBookTimer = host.setTimeout(() => {
        mobileBookTimer = null;
        if (!dragging || dragging.moved) return;
        mobileBookOpened = true; longPressed = true; suppressClick = true;
        model.endComfort(); speech = null; setNotebook(true); update();
      }, 1400);
    }
  });
  listen(portrait, 'pointermove', event => {
    if (event.pointerId !== dragging?.id) return;
    const dx = event.clientX - dragging.startX, dy = event.clientY - dragging.startY;
    if (!dragging.moved && Math.hypot(dx, dy) < (event.pointerType === 'touch' ? 8 : 6)) return;
    if (!dragging.moved) {
      dragging.moved = true; clearHold(); model.interruptLocal();
      notebookRoot.hidden = true; portrait.setAttribute('aria-expanded', 'false');
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
    setNotebook(notebookRoot.hidden);
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
  listen(storyClose, 'click', () => { storyteller.dismiss(); update(); portrait.focus({ preventScroll: true }); });
  listen(storyNext, 'click', () => {
    if (storyBlocked()) return;
    storyteller.show(); update();
    if (storyBubble.matches(':hover')) storyteller.pause('hover');
    if (storyBubble.contains(doc.activeElement)) storyteller.pause('focus');
  });
  listen(storyBubble, 'pointerenter', () => storyteller.pause('hover'));
  listen(storyBubble, 'pointerleave', () => storyteller.resume('hover'));
  listen(storyBubble, 'focusin', () => storyteller.pause('focus'));
  listen(storyBubble, 'focusout', event => {
    if (!storyBubble.contains(event.relatedTarget)) storyteller.resume('focus');
  });
  // On a phone, touching the text freezes expiry until it is deliberately closed.
  listen(storyBubble, 'pointerdown', event => { if (event.pointerType === 'touch') storyteller.pause('touch'); });
  listen(message, 'click', event => {
    if (event.target.closest?.('button') || message.dataset.tone !== 'speech') return;
    speech = null; update();
  });
  listen(doc, 'keydown', event => {
    if (event.key !== 'Escape') return;
    if (house?.visible) { house.close(); return; }
    if (life?.visible) { life.close(); return; }
    if (chat?.visible) { chat.close(); return; }
    if (dragging) finishDrag(null, true);
    if (!notebookRoot.hidden) setNotebook(false);
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
      if (!doc.hidden && settings.enabled && settings.idleActions && !yielded && !dragging && notebookRoot.hidden && !chat?.visible && !life?.visible && !house?.visible
        && !lifeModel.activity(character.id) && !storyteller.current && model.pose() === 'idle' && !root.dataset.edge) {
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
  const returnToPet = () => (settings.enabled === false || yielded ? settingsMount?.querySelector('button[aria-controls]') : portrait)?.focus({preventScroll:true});
  chat = makeChat();
  life = createLifeWindow(host, {
    model:lifeModel, characters:CHARACTER_IDS.map(id => CHARACTERS[id]), currentId:() => character.id,
    art:(item, pose) => artFor(item)[pose] || null, nameOf,
    onOpen:() => {chat?.close(); house?.close(); setNotebook(false); storyteller.dismiss();},
    onChange:() => {if (point) update();},
    onEvent:(type, who, detail) => {
      const mine = who === character.id;
      if (type === 'job' && mine) say('care.workStart', 3600, true);
      if (type === 'food' && mine) say(`care.eat.${detail.id}`, 3600, true);
      if (type === 'wage') { const result = care.wage(who, detail.id); if (mine) { say('care.wage', 4200, true); if (result.tierUp) celebrate(result.tierUp); } }
      if (type === 'welfare') say('care.welfare', 4200, true);
      if (type === 'wage' || type === 'welfare') { const rect = life.coinAnchor(); effects.burst('coins', rect.x, rect.y, ['#f2c14e', '#e0a526', '#ffe08a'], 12); }
    },
    blocked:() => model.snapshot.busy || chat?.busy,
    onStopTask:stopDatabaseTask,
    onOpenDatabase:() => openPage('form-fill'),
    returnFocus:returnToPet,
  });
  house = createPetHouse(host, {
    characters: CHARACTER_IDS.map(id => CHARACTERS[id]), currentId: () => character.id, care,
    portraits: item => { const art = artFor(item); return art.idle ? { idle: art.idle, wave: art.wave || art.idle } : null; },
    available: item => usesDatabaseArt(item) && !readArt() ? { ok: false, reason: '奶蛋的图来自正在运行的数据库。请启用龙血玄黄·数据库，并打开它自带的桌宠。' } : { ok: true },
    moodExtra, nameOf, statusOf, fxTier,
    actions: {
      switchTo: id => switchCharacter(id),
      feed: id => { house.close(); life.open(id); },
      clean: id => cleanCharacter(id),
      nickname: (id, value) => {
        const changed = care.setNickname(id, value);
        if (changed && id === character.id) { applyCharacterTexts(); if (value.trim()) say('care.nickname', 4200, true); }
        return changed;
      },
      needsEnabled: () => settings.needs !== false,
      onOpen: () => { chat?.close(); life?.close(); setNotebook(false); storyteller.dismiss(); },
      onClose: () => update(),
    },
    returnFocus: returnToPet,
  });
  listen(lifeClaim, 'click', () => {
    const who = lifeClaim.dataset.who || character.id;
    const job = lifeModel.claim(who);
    if (!job) return;
    const result = care.wage(who, job.id);
    if (who === character.id) say('care.wage', 4200, true);
    if (result.tierUp && who === character.id) celebrate(result.tierUp);
    const rect = lifeBubble.getBoundingClientRect();
    effects.burst('coins', rect.left + rect.width / 2, rect.top, ['#f2c14e', '#e0a526', '#ffe08a'], 12);
    update();
  });
  applyCharacterTexts();
  for (const pose of Object.keys(images)) loadAsset(pose);
  connect(); mountSettings(); watchInput(); position(); scheduleLeisure();
  // Establish the saved location before enabling movement easing (no fly-in from 0,0).
  root.getBoundingClientRect();
  root.style.transition = '';
  return {
    model,
    get chat() { return chat; },
    life,
    lifeModel,
    care,
    house,
    get character() { return character.id; },
    switchCharacter,
    refresh: update,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      chat?.destroy();
      life.destroy();
      house.destroy();
      notebookSheet.destroy();
      effects.destroy();
      storyteller.dismiss();
      swapVersion++; cancelDrag(); motion.destroy(); loaded.clear();
      if (layoutFrame !== null) host.cancelAnimationFrame(layoutFrame);
      geometryObserver?.disconnect(); panelObserver?.disconnect();
      unsubscribe?.();
      dataSource?.destroy();
      for (const remove of subscriptions) remove();
      for (const timer of timers) { host.clearInterval(timer); host.clearTimeout(timer); }
      timers.clear();
      notebook.destroy(); root.remove(); overlay.remove(); settingsMount?.remove();
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
  else console.warn('[数据库桌宠] 酒馆设置接口尚未就绪，重新启用插件可重试。');
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
