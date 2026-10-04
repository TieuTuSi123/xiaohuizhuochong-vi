import { chatMessages } from './chat-prompt.js';
import { normalizeChatConfig, requestChat, requestModelList, safeChatError } from './chat-transport.js';
import { createSheet, leave } from './sheet.js';
import { pickable, settleTicket, ticketNote } from './repair.js';
import { renderTicket, syncTicketActions } from './repair-ticket.js';
import { tidyComment } from './watch.js';

// 密钥按设备保存一份，所有角色共用；聊天记录、人设和称呼按角色分开保存。
// 检修记录和闲聊记录分开存（saved.repair），检修的资料不会混进日常聊天。
const KEY_ID = 'erii-database-pet-chat-key';
function keepHistory(list, max, tickets = false) {
  return Array.isArray(list) ? list.filter(m => ['user', 'assistant'].includes(m?.role) && typeof m.content === 'string').slice(-max)
    .map(m => {
      const ticket = tickets ? settleTicket(m.ticket) : null;
      return { role: m.role, content: m.content.slice(0, 16000), ...(typeof m.at === 'string' && Number.isFinite(Date.parse(m.at)) ? {at:m.at} : {}),
        ...(m.kind === 'watch' ? {kind:'watch'} : {}), ...(ticket ? {ticket} : {}) };
    }) : [];
}
export function createChatWindow(host, { character, avatarUrl, welcomeUrl, getContext, saved = {}, persist, onState, onOpen, onReply, onStopTask, onOpenDatabase, returnFocus,
  repair = null, onUserMessage, onRepairDone }) {
  const doc = host.document;
  const listeners = [];
  const { name, fullName } = character;
  const persona = { prompt: character.persona, relationship: character.relationship };
  let config = normalizeChatConfig(saved, persona);
  const lists = { chat: keepHistory(saved.history, 100), repair: keepHistory(saved.repair, 40, true) };
  let view = 'chat';
  let history = lists.chat;
  let apiKey = '';
  let operation = null;
  let modelOperation = null;
  let commentOperation = null;
  let ticketBusy = false;
  let databaseBusy = false;
  let serial = 0;
  let destroyed = false;
  let confirmClear = false;
  let expanded = false;
  let draftTimer = null;
  let unreadReply = false;
  let editingIndex = Number.isInteger(saved.editIndex) && saved.editIndex >= 0 && saved.editIndex === lastUserIndex() ? saved.editIndex : null;
  let draftBeforeEdit = String(saved.draftBeforeEdit || '').slice(0, 4000);
  const feedbackTimers = new Set();
  const downloadURLs = new Set();
  const keyStore = () => getContext().accountStorage || host.localStorage;
  try { if (config.rememberKey) apiKey = keyStore().getItem(KEY_ID) || ''; } catch { /* storage may be unavailable */ }
  const node = (tag, text, name) => {
    const element = doc.createElement(tag);
    if (text !== undefined) element.textContent = text;
    if (name) element.className = name;
    return element;
  };
  const listen = (target, type, callback, options) => {
    target.addEventListener(type, callback, options);
    listeners.push(() => target.removeEventListener(type, callback, options));
  };
  const button = (text, name) => { const b = node('button', text, name); b.type = 'button'; return b; };
  const root = node('section', undefined, 'erii-chat');
  root.id = 'erii-database-pet-chat'; root.hidden = true; root.dataset.character = character.id;
  root.setAttribute('role', 'dialog'); root.setAttribute('aria-label', `和${fullName}聊天`);
  const grip = node('div', undefined, 'pet-grip'); grip.setAttribute('aria-hidden', 'true');
  const header = node('header', undefined, 'erii-chat__header');
  const avatar = node('img'); avatar.src = avatarUrl() || ''; avatar.alt = '';
  avatar.draggable = false;
  const heading = node('div'); heading.append(node('strong', fullName), node('span', character.chatTagline));
  const expand = button('↔', 'erii-chat__expand'); expand.setAttribute('aria-label', '展开聊天窗口'); expand.title = '展开聊天窗口';
  const close = button('×', 'erii-chat__close'); close.setAttribute('aria-label', '关闭聊天窗口');
  header.append(avatar, heading, expand, close);
  const toolbar = node('div', undefined, 'erii-chat__toolbar');
  const connection = node('span', undefined, 'erii-chat__connection');
  const settingsButton = button('连接设置'); settingsButton.setAttribute('aria-expanded', 'false');
  const clear = button('清空记录');
  const exportButton = button('导出'); exportButton.setAttribute('aria-label', '导出聊天记录');
  toolbar.append(connection, settingsButton, exportButton, clear);
  const modeBar = node('div', undefined, 'erii-chat__mode'); modeBar.hidden = !repair;
  modeBar.setAttribute('role', 'group'); modeBar.setAttribute('aria-label', '聊天模式');
  const chatTab = button('闲聊'); chatTab.dataset.mode = 'chat';
  const repairTab = button('检修数据库'); repairTab.dataset.mode = 'repair';
  modeBar.append(chatTab, repairTab);
  const scope = node('div', undefined, 'erii-repair__scope'); scope.hidden = true;
  const scopeLead = node('span'); const scopeTail = node('span');
  const floorsSelect = node('select', undefined, 'erii-repair__floors'); floorsSelect.setAttribute('aria-label', '检修时附上最近几层正文');
  for (let count = 0; count <= 10; count++) { const option = node('option', String(count)); option.value = String(count); floorsSelect.append(option); }
  scope.append(scopeLead, floorsSelect, scopeTail);
  const environment = node('p', '', 'erii-chat__environment');
  const previewMode = getContext().eriiPreviewMode;
  environment.hidden = !previewMode;
  environment.textContent = previewMode === 'demo' ? '演示模式 · 示例回复，不连接 API'
    : '独立预览 · 单独配置 API 后可真实对话';
  const taskBar = node('div', undefined, 'erii-chat__task'); taskBar.hidden = true;
  const taskText = node('span'); const taskOpen = button('打开数据库'); const taskStop = button('停止任务');
  taskStop.setAttribute('aria-label', '停止数据库任务（聊天窗口）'); taskBar.append(taskText, taskOpen, taskStop);
  const log = node('div', undefined, 'erii-chat__log');
  log.setAttribute('role', 'log'); log.setAttribute('aria-label', `与${fullName}的聊天记录`);
  log.setAttribute('aria-live', 'polite'); log.tabIndex = 0;
  const status = node('p', '', 'erii-chat__status'); status.setAttribute('role', 'status');
  const composer = node('form', undefined, 'erii-chat__composer');
  const input = node('textarea'); input.rows = 2; input.maxLength = 4000;
  input.value = String(saved.draft || '').slice(0, 4000);
  input.placeholder = `和${name}说句话…`; input.setAttribute('aria-label', '聊天内容');
  const actions = node('div', undefined, 'erii-chat__actions');
  const tip = node('span', 'Enter 发送 · Shift+Enter 换行');
  const retry = button('重试'); retry.hidden = true;
  const stop = button('停止回复'); stop.hidden = true;
  const send = button('发送', 'erii-chat__send'); send.type = 'submit';
  const editBar = node('div', undefined, 'erii-chat__edit-bar');
  editBar.append(node('span', '修改上一条消息；发送成功后更新这一轮。'));
  const cancelEditButton = button('取消修改'); editBar.append(cancelEditButton); editBar.hidden = editingIndex === null;
  const latest = button('回到最新消息', 'erii-chat__latest'); latest.hidden = true;
  actions.append(tip, retry, stop, send); composer.append(editBar, input, actions);
  const settingsPanel = node('form', undefined, 'erii-chat__settings'); settingsPanel.hidden = true;
  settingsPanel.setAttribute('aria-label', `${name}聊天连接设置`);
  const field = (title, type, value = '') => {
    const label = node('label', title);
    const control = node(type === 'select' ? 'select' : type === 'textarea' ? 'textarea' : 'input');
    control.setAttribute('aria-label', title);
    if (!['select', 'textarea'].includes(type)) control.type = type;
    control.value = value; label.append(control); settingsPanel.append(label); return control;
  };
  settingsPanel.append(node('h3', '连接', 'erii-chat__section-title'));
  const mode = field('聊天连接', 'select');
  for (const [value, title] of [['current', '使用酒馆当前 API'], ['custom', '单独配置 API（OpenAI 兼容）']]) {
    const option = node('option', title); option.value = value; mode.append(option);
  }
  const custom = node('div', undefined, 'erii-chat__custom');
  const customField = (title, type) => { const control = field(title, type); custom.append(control.parentElement); return control; };
  const url = customField('API 地址', 'url'); url.placeholder = 'https://你的接口/v1';
  const key = customField('API 密钥', 'password'); key.autocomplete = 'off'; key.spellcheck = false;
  const fetchModels = button('获取模型列表', 'erii-chat__fetch-models');
  custom.append(fetchModels);
  const modelStatus = node('small', '', 'erii-chat__model-status'); modelStatus.setAttribute('role', 'status'); custom.append(modelStatus);
  const models = customField('可用模型', 'select'); models.parentElement.hidden = true;
  const model = customField('模型名称', 'text'); model.maxLength = 200; model.placeholder = '从列表选择，或手动填写';
  custom.append(node('small', '填写地址和密钥后获取列表；选中模型会填入名称，保存设置后使用。接口不提供列表时可手动填写。'));
  const rememberLabel = node('label', undefined, 'erii-chat__remember');
  const remember = node('input'); remember.type = 'checkbox';
  rememberLabel.append(remember, node('span', '记住此设备上的密钥')); custom.append(rememberLabel);
  custom.append(node('small', '勾选后密钥会保存在浏览器中。取消勾选并保存即可删除；地址和模型会单独保存。'));
  settingsPanel.append(custom);
  settingsPanel.append(node('h3', `你和${name}`, 'erii-chat__section-title'));
  const nickname = field(`${name}怎么称呼你`, 'text'); nickname.maxLength = 40; nickname.placeholder = '默认使用你的酒馆名字';
  const relationship = field('你们的关系', 'text'); relationship.maxLength = 80; relationship.placeholder = '恋人、朋友，或你自己的设定';
  const length = field('回复长度上限', 'number'); length.min = '128'; length.max = '4096'; length.step = '128';
  const replyStyle = field('聊天风格', 'select');
  for (const [value,text] of [['natural','自然闲聊'],['short','简短陪伴'],['detailed','详细交流']]) {
    const option = node('option',text); option.value=value; replyStyle.append(option);
  }
  const memory = field(`希望${name}记住的事`, 'textarea'); memory.rows = 4; memory.maxLength = 2000;
  memory.placeholder = '例如：我喜欢被叫作小云；最近在准备考试；不喜欢聊到一半就被安排一堆建议。';
  settingsPanel.append(node('small', '只保存你在这里写下的资料，每次聊天都会带上。可以随时修改或清空，不会自动提取聊天或数据库内容。'));
  settingsPanel.append(node('small', '聊天记录独立保存在当前酒馆账号中。每次携带最近最多 40 条、约 24000 字符的聊天内容。'));
  const settingsActions = node('div', undefined, 'erii-chat__settings-actions');
  const test = button('测试连接'); const apply = button('保存设置', 'erii-chat__send');
  settingsActions.append(test, apply); settingsPanel.append(settingsActions);
  settingsPanel.append(node('small', '测试会发送一次简短请求，不加入聊天记录。单独配置的接口由运行酒馆的设备连接。'));
  root.append(grip, header, toolbar, modeBar, scope, environment, taskBar, log, latest, settingsPanel, status, composer); doc.body.append(root);
  const sheet = createSheet(host, root, { grip, drag: [header], onDismiss: () => hide(),
    desktop: () => ({ width: expanded ? 600 : 440, height: expanded ? 760 : 660, align: 'right' }) });

  function notify() { onState?.({ open: !root.hidden, busy: Boolean(operation) }); }
  function trim(which, max, budget) {
    let list = lists[which];
    let removed = Math.max(0, list.length - max);
    list = list.slice(-max);
    // 修改单也算进大小，避免检修记录把扩展设置撑得太大。
    const size = m => m.content.length + (m.ticket ? JSON.stringify(m.ticket).length : 0);
    let characters = list.reduce((sum, m) => sum + size(m), 0);
    while (list.length > 1 && characters > budget) { characters -= size(list.shift()); removed++; }
    lists[which] = list;
    if (view === which) history = list;
    return removed;
  }
  function save() {
    const removed = trim('chat', 100, 128000);
    trim('repair', 40, 64000);
    // 只有闲聊能“修改重发”，所以编辑位置只跟着闲聊记录移动。
    if (editingIndex !== null) { editingIndex -= removed; if (editingIndex < 0) editingIndex = null; }
    persist({ ...config, history: lists.chat.map(m => ({ ...m })), repair: lists.repair.map(m => ({ ...m })), draft: input.value.slice(0, 4000), editIndex: editingIndex,
      draftBeforeEdit: editingIndex === null ? '' : draftBeforeEdit });
  }
  function say(text, kind = '') { status.textContent = text; status.dataset.kind = kind; }
  function syncControls() {
    const pending = Boolean(operation);
    const listing = Boolean(modelOperation);
    send.disabled = pending || listing; test.disabled = pending || listing; apply.disabled = pending || listing;
    fetchModels.disabled = pending;
    fetchModels.textContent = listing ? '取消获取' : '获取模型列表';
    root.dataset.loadingModels = String(listing);
    stop.hidden = !pending;
    retry.hidden = pending || editingIndex !== null || history.at(-1)?.role !== 'user';
    retry.disabled = pending;
    clear.disabled = pending;
    exportButton.disabled = !history.length;
    cancelEditButton.disabled = pending;
    input.readOnly = pending && operation.kind === 'edit';
    editBar.hidden = editingIndex === null;
    root.classList.toggle('erii-chat--expanded', expanded);
    root.dataset.busy = String(pending);
    root.dataset.mode = view;
    connection.textContent = config.mode === 'custom' ? `单独连接 · ${config.model || '尚未设置'}` : '酒馆当前 API';
    const repairing = view === 'repair';
    for (const tab of [chatTab, repairTab]) { tab.setAttribute('aria-pressed', String(tab.dataset.mode === view)); tab.disabled = pending || ticketBusy; }
    if (repairing && !repair?.available()) send.disabled = true;
    input.placeholder = repairing ? '说说哪里不对，或者直接说「帮我检查一下」…' : `和${name}说句话…`;
    tip.textContent = tipText();
    notify();
  }
  function tipText() {
    return view === 'repair' ? '检修模式：每次写入都要你确认' : sheet.isSheet() ? '点发送聊天 · 回车换行' : 'Enter 发送 · Shift+Enter 换行';
  }
  function renderScope() {
    scope.hidden = view !== 'repair' || !repair;
    if (scope.hidden) return;
    const info = repair.scope();
    floorsSelect.hidden = !info.available; scopeTail.hidden = !info.available;
    if (!info.available) { scopeLead.textContent = '没有检测到数据库。启用龙血玄黄·数据库后再来检修。'; return; }
    scopeLead.textContent = `${character.pronoun}能看到：全部表格（${info.tables} 张）· 最近`;
    floorsSelect.value = String(info.floors);
    scopeTail.textContent = `层正文 · 错误 ${info.errors} 条`;
  }
  function setMode(next) {
    if (next === view || (next === 'repair' && !repair) || operation || ticketBusy) return;
    cancelEdit(); confirmClear = false; clear.textContent = '清空记录';
    view = next; history = lists[view]; unreadReply = false; say('');
    renderScope(); renderHistory(true); syncControls();
  }
  function fillSettings() {
    resetModels();
    mode.value = config.mode; url.value = config.url; model.value = config.model; key.value = apiKey;
    remember.checked = config.rememberKey; nickname.value = config.nickname;
    relationship.value = config.relationship; length.value = String(config.maxTokens);
    replyStyle.value = config.replyStyle; memory.value = config.memory;
    custom.hidden = mode.value !== 'custom';
  }
  function commitSettings() {
    if (operation || modelOperation) return false;
    config = normalizeChatConfig({ mode: mode.value, url: url.value, model: model.value,
      nickname: nickname.value, relationship: relationship.value, maxTokens: length.value, rememberKey: remember.checked,
      replyStyle: replyStyle.value, memory: memory.value }, persona);
    apiKey = key.value.trim();
    try {
      if (config.rememberKey) keyStore().setItem(KEY_ID, apiKey);
      else keyStore().removeItem(KEY_ID);
    } catch {
      config.rememberKey = false; remember.checked = false;
      say('设置已保存；浏览器无法保存密钥，本次仍可使用。', 'error');
      save(); syncControls(); return false;
    }
    save(); syncControls(); return true;
  }
  function lastUserIndex(items = history) {
    for (let i = items.length - 1; i >= 0; i--) if (items[i].role === 'user') return i;
    return -1;
  }
  function nearBottom() { return log.scrollHeight - log.scrollTop - log.clientHeight < 70; }
  function scrollToLatest() { log.scrollTop = log.scrollHeight; unreadReply = false; latest.hidden = true; }
  function syncLatest() { latest.hidden = log.hidden || !unreadReply || nearBottom(); }
  function renderHistory(forceBottom = false) {
    const follow = forceBottom || nearBottom();
    const previousTop = log.scrollTop;
    const shown = operation?.candidate || history;
    const repairing = view === 'repair';
    log.replaceChildren();
    if (!shown.length) {
      const welcome = node('div', undefined, 'erii-chat__welcome');
      const illustration = node('img'); illustration.src = welcomeUrl() || avatar.src; illustration.alt = '';
      const words = repairing ? [`${name}来帮你检修数据库`, '说说哪里不对，或者直接说「帮我检查一下」。要改什么都会先列成修改单，等你勾选确认。'] : character.chatWelcome;
      welcome.append(illustration, node('span', words[0]), node('p', words[1]));
      const starters = node('div', undefined, 'erii-chat__starters');
      const choices = repairing ? [['帮我检查一下', '帮我检查一下表格，有没有和正文对不上的地方。'], ['刚才报错了', '刚才数据库报错了，帮我看看是怎么回事。'],
        ['有没有漏记', '最近几层里，有没有表格漏记的东西？']] : character.starters;
      for (const [text,prompt] of choices) {
        const b = button(text); b.dataset.action = 'starter'; b.dataset.prompt = prompt; starters.append(b);
      }
      welcome.append(starters);
      log.append(welcome);
    }
    let day = '';
    for (const [index,item] of shown.entries()) {
      const date = item.at && new Date(item.at);
      const currentDay = date?.toLocaleDateString('zh-CN');
      if (currentDay && currentDay !== day) { day = currentDay; log.append(node('div', currentDay, 'erii-chat__day')); }
      const row = node('div', undefined, `erii-chat__row erii-chat__row--${item.role}`);
      const identity = item.role === 'assistant' ? node('img', undefined, 'erii-chat__avatar')
        : node('span', (config.nickname || '你').slice(0,1), 'erii-chat__avatar erii-chat__avatar--user');
      if (item.role === 'assistant') { identity.src = avatar.src; identity.alt = ''; }
      const bubble = node('article', undefined, `erii-chat__bubble erii-chat__bubble--${item.role}`);
      const meta = node('small', undefined, 'erii-chat__message-meta');
      const who = node('span', item.role === 'user' ? (config.nickname || '你') : fullName);
      if (item.kind === 'watch') who.append(node('em', '旁观', 'erii-chat__tag'));
      meta.append(who);
      if (date) { const time = node('time', date.toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit',hour12:false})); time.dateTime = item.at; meta.append(time); }
      const tools = node('div', undefined, 'erii-chat__message-tools');
      const copy = button('复制'); copy.dataset.action = 'copy'; copy.dataset.index = String(index); tools.append(copy);
      if (!repairing && index === lastUserIndex(shown) && item.role === 'user') {
        const edit = button('修改重发'); edit.dataset.action = 'edit'; edit.dataset.index = String(index); tools.append(edit);
      }
      if (!repairing && item.role === 'assistant' && item.kind !== 'watch' && index === shown.length - 1 && lastUserIndex(shown) >= 0) {
        const regenerate = button('重新回答'); regenerate.dataset.action = 'regenerate'; tools.append(regenerate);
      }
      if (item.kind === 'watch' && index === shown.length - 1) {
        const answer = button(`回${character.pronoun}`); answer.dataset.action = 'reply'; tools.append(answer);
      }
      for (const control of tools.children) if (!['copy', 'reply'].includes(control.dataset.action)) control.disabled = Boolean(operation) || Boolean(modelOperation);
      bubble.append(meta, node('p', item.content));
      if (item.ticket) bubble.append(renderTicket(doc, item.ticket, { index, dbBusy: databaseBusy, pending: Boolean(operation) || ticketBusy, durable: repair?.durable !== false }));
      bubble.append(tools); row.append(identity, bubble); log.append(row);
    }
    if (operation && !operation.isTest) {
      const waiting = node('div', undefined, 'erii-chat__pending');
      waiting.append(node('span', `${fullName}正在写回复`), node('i', '·'), node('i', '·'), node('i', '·'));
      waiting.setAttribute('role', 'status'); log.append(waiting);
    }
    if (follow) scrollToLatest(); else log.scrollTop = previousTop;
    syncLatest();
  }
  function resizeInput() {
    input.style.height = 'auto'; input.style.height = `${Math.min(110, Math.max(48, input.scrollHeight))}px`;
  }
  function flushDraft() {
    if (draftTimer !== null) host.clearTimeout(draftTimer);
    draftTimer = null; save();
  }
  function beginEdit(index) {
    if (operation || modelOperation || index !== lastUserIndex()) return;
    if (editingIndex === null) draftBeforeEdit = input.value;
    editingIndex = index; input.value = history[index].content; resizeInput(); syncControls(); flushDraft();
    input.focus({preventScroll:true}); say(`修改后发送，会更新这条消息和${name}的回答。`);
  }
  function cancelEdit() {
    if (operation || editingIndex === null) return;
    editingIndex = null; input.value = draftBeforeEdit; draftBeforeEdit = ''; resizeInput(); syncControls(); flushDraft(); say('');
  }
  async function copyMessage(index, control) {
    const content = (operation?.candidate || history)[index]?.content;
    if (typeof content !== 'string') return;
    try {
      if (host.navigator.clipboard?.writeText) await host.navigator.clipboard.writeText(content);
      else {
        const fallback = node('textarea'); fallback.value = content; fallback.style.cssText = 'position:fixed;left:-9999px;top:0';
        doc.body.append(fallback); const previous = doc.activeElement;
        try { fallback.select(); if (!doc.execCommand('copy')) throw new Error('Clipboard unavailable'); }
        finally { fallback.remove(); previous?.focus?.({preventScroll:true}); }
      }
      if (destroyed) return;
      control.textContent = '已复制';
      const timer = host.setTimeout(() => { feedbackTimers.delete(timer); control.textContent = '复制'; }, 1800); feedbackTimers.add(timer);
    } catch { if (!destroyed) say('浏览器无法自动复制，可以选中消息文字后复制。', 'error'); }
  }
  function exportHistory() {
    if (!history.length) return;
    const title = view === 'repair' ? '检修记录' : '聊天记录';
    const text = `${fullName}的${title}\n\n` + history.map(item => {
      const who = item.role === 'user' ? (config.nickname || '你') : `${fullName}${item.kind === 'watch' ? '（旁观）' : ''}`;
      const time = item.at ? ' · ' + new Date(item.at).toLocaleString('zh-CN',{hour12:false}) : '';
      return `${who}${time}\n${item.content}${item.ticket ? `\n${ticketNote(item.ticket)}` : ''}`;
    }).join('\n\n');
    download(new host.Blob(['\uFEFF'+text],{type:'text/plain;charset=utf-8'}), `${fullName}${view === 'repair' ? '检修' : '聊天'}-${new Date().toISOString().slice(0,10)}.txt`);
  }
  function download(file, filename) {
    const link = node('a'); const address = host.URL.createObjectURL(file);
    downloadURLs.add(address);
    link.href = address; link.download = filename;
    doc.body.append(link); link.click(); link.remove();
    const timer = host.setTimeout(() => { feedbackTimers.delete(timer); downloadURLs.delete(address); host.URL.revokeObjectURL(address); }, 1000); feedbackTimers.add(timer);
  }
  function layout() {
    if (destroyed || root.hidden) return;
    sheet.layout();
    tip.textContent = tipText();
    resizeInput();
  }
  function settingsVisible(show) {
    if (!show) stopModels();
    settingsPanel.hidden = !show; log.hidden = show; composer.hidden = show;
    settingsButton.textContent = show ? '返回聊天' : '连接设置';
    settingsButton.setAttribute('aria-expanded', String(show));
    syncLatest();
    if (show) fillSettings();
  }
  function stopModels(message = '已取消获取模型。') {
    if (!modelOperation) return;
    const current = modelOperation; modelOperation = null;
    host.clearTimeout(current.timer); current.controller.abort();
    modelStatus.textContent = message; modelStatus.dataset.kind = '';
    syncControls();
  }
  function resetModels() {
    stopModels(); models.replaceChildren(); models.parentElement.hidden = true;
    modelStatus.textContent = ''; modelStatus.dataset.kind = '';
  }
  async function loadModels() {
    if (operation || destroyed) return;
    if (modelOperation) { stopModels(); return; }
    resetModels();
    const controller = new host.AbortController();
    let timedOut = false;
    const request = { controller, timer: host.setTimeout(() => { timedOut = true; controller.abort(); }, 30000) };
    const secret = key.value.trim();
    modelOperation = request; modelStatus.textContent = '正在获取模型…'; syncControls();
    try {
      const list = await requestModelList(host, getContext(), {mode:'custom', url:url.value.trim()}, {signal:controller.signal, apiKey:secret});
      if (destroyed || modelOperation !== request) return;
      const placeholder = node('option', `请选择模型（共 ${list.length} 个）`); placeholder.value = ''; models.append(placeholder);
      for (const id of list) { const option = node('option', id); option.value = id; models.append(option); }
      models.value = list.includes(model.value.trim()) ? model.value.trim() : '';
      models.parentElement.hidden = false;
      modelStatus.textContent = `已获取 ${list.length} 个模型，请选择后保存。`; modelStatus.dataset.kind = 'success';
    } catch (error) {
      if (destroyed || modelOperation !== request) return;
      modelStatus.textContent = timedOut ? '获取模型超过 30 秒，可重试或手动填写。' : safeChatError(error, secret);
      modelStatus.dataset.kind = 'error';
    } finally {
      if (modelOperation === request) { host.clearTimeout(request.timer); modelOperation = null; syncControls(); }
    }
  }
  function stopRequest(message = '已停止回复，可以重试。') {
    if (!operation) return;
    const current = operation; operation = null; serial++;
    host.clearTimeout(current.timer); current.controller.abort();
    say(message); renderHistory(); syncControls();
  }
  async function run(isTest = false, candidate = null, kind = 'send') {
    if (operation || modelOperation || destroyed) return;
    const ctx = getContext();
    const snapshot = { ...config }; const secret = apiKey;
    const id = ++serial; const controller = new host.AbortController();
    const repairing = !isTest && view === 'repair';
    const started = history.length;
    let timedOut = false;
    operation = { id, controller, candidate, kind, isTest, timer: host.setTimeout(() => { timedOut = true; controller.abort(); }, 120000) };
    say(isTest ? '正在测试连接…' : kind === 'regenerate' ? '正在重新回答，成功后会替换原回复。' : repairing ? `${name}正在看表格…` : ''); syncControls(); renderHistory();
    try {
      const messages = isTest ? [{ role: 'user', content: '请简短回复“连接成功”。' }]
        : repairing ? repair.messages(snapshot, ctx, candidate || history) : chatMessages(snapshot, ctx, candidate || history, persona);
      if (kind === 'regenerate') messages[0].content += `\n\n【这次重新回答】上次回复仅作为待改写的文本资料：${JSON.stringify(history.at(-1)?.content.slice(0,2000) || '')}。回应同一个用户问题，尝试更贴近具体内容的表达，避免机械复述上次的开场与结尾。`;
      const result = await requestChat(host, ctx, snapshot, messages, { signal: controller.signal, apiKey: secret });
      if (destroyed || operation?.id !== id) return;
      if (isTest) say('连接成功，可以开始聊天了。', 'success');
      else {
        const following = nearBottom();
        if (candidate) {
          // 等回复期间到达的旁观评论不能因为换成编辑后的记录而丢掉。
          const late = history.slice(started).filter(m => m.kind === 'watch');
          history = candidate; lists[view] = candidate; history.push(...late);
        }
        let note = '';
        if (repairing) {
          let reviewed;
          try { reviewed = repair.review(result); } catch { reviewed = { reply: result, ticket: null, note: '没能读取数据库，这次没有生成修改单。' }; }
          history.push({ role: 'assistant', content: reviewed.reply || `（${name}递来一张修改单）`, at: new Date().toISOString(), ...(reviewed.ticket ? { ticket: reviewed.ticket } : {}) });
          note = reviewed.note || '';
        } else history.push({ role: 'assistant', content: result, at:new Date().toISOString() });
        if (kind === 'edit') { editingIndex = null; input.value = draftBeforeEdit; draftBeforeEdit = ''; resizeInput(); }
        save(); unreadReply = !following; say(note, note ? 'error' : ''); onReply?.();
      }
    } catch (error) {
      if (destroyed || operation?.id !== id) return;
      say(timedOut ? '等待超过两分钟，已停止这次请求。可以检查连接后重试。'
        : error?.name === 'AbortError' ? '已停止回复，可以重试。' : safeChatError(error, secret), 'error');
    } finally {
      if (operation?.id === id) {
        host.clearTimeout(operation.timer); operation = null;
        renderHistory(); syncControls();
      }
    }
  }
  function open({ reply = false } = {}) {
    if (destroyed) return;
    if (reply) setMode('chat');
    databaseBusy = Boolean(repair?.busy());
    onOpen?.(); root.hidden = false; root.classList.remove('is-leaving'); avatar.src = avatarUrl() || avatar.src; settingsVisible(false); renderScope(); renderHistory(true); syncControls(); layout();
    // Mobile opens without summoning the keyboard over the greeting; replying to her comment is a deliberate request to type.
    if (reply || host.innerWidth >= 640) input.focus({ preventScroll: true }); else close.focus({ preventScroll: true });
  }
  async function downloadBackup(ticket) {
    const record = await repair?.backup(ticket.backupId);
    if (destroyed) return;
    if (!record?.tables) { say('找不到这次的备份了（页面刷新过，而且浏览器没能把备份存下来）。', 'error'); return; }
    const stamp = new Date(record.at || Date.now()).toLocaleString('sv-SE', { hour12: false }).replace(/[: ]/g, '-').slice(0, 16);
    download(new host.Blob([record.tables], { type: 'application/json' }), `${fullName}检修备份-${stamp}.json`);
  }
  async function ticketAction(control) {
    const ticket = history[Number(control.dataset.index)]?.ticket;
    if (!ticket || !repair || ticketBusy) return;
    const action = control.dataset.action;
    if (action === 'ticket-download') { downloadBackup(ticket); return; }
    if (action === 'ticket-all' && ticket.state === 'open') {
      const valid = ticket.items.filter(pickable); const all = valid.every(item => item.picked);
      for (const item of valid) item.picked = !all;
    } else if (action === 'ticket-dismiss' && ticket.state === 'open') ticket.state = 'dismissed';
    else if (action === 'ticket-keep') ticket.undoConfirm = '';
    else if (action === 'ticket-apply' && ticket.state === 'open') {
      if (repair.busy()) { say('数据库正在处理任务，等它忙完再应用。', 'error'); return; }
      ticketBusy = true; ticket.state = 'applying'; ticket.note = ''; save(); renderHistory(); syncControls();
      let result;
      try { result = await repair.apply(ticket, { onBackup: id => { ticket.backupId = id; ticket.durable = repair.durable; save(); } }); }
      catch (error) { result = { ok: false, text: safeChatError(error) }; }
      ticketBusy = false;
      if (result.results) ticket.results = result.results;
      if (result.ok) Object.assign(ticket, { state: 'applied', backupId: result.backupId, digest: result.digest, presetChanged: result.presetChanged,
        durable: result.durable, note: result.text, appliedAt: Date.now() });
      else Object.assign(ticket, { state: 'open', note: result.text, ...(result.backupId ? { backupId: result.backupId } : {}) });
      if (destroyed) return;
      save(); renderHistory(); syncControls(); say(result.text, result.ok ? 'success' : 'error');
      if (result.ok) onRepairDone?.('applied');
      return;
    } else if ((action === 'ticket-undo' || action === 'ticket-undo-force') && ['applied', 'interrupted'].includes(ticket.state) && ticket.backupId) {
      const previous = ticket.state;
      ticketBusy = true; ticket.state = 'undoing'; save(); renderHistory(); syncControls();
      let result;
      try { result = await repair.undo(ticket, action === 'ticket-undo-force'); } catch (error) { result = { ok: false, text: safeChatError(error) }; }
      ticketBusy = false;
      if (result.ok) Object.assign(ticket, { state: 'undone', undoConfirm: '', note: result.text });
      else Object.assign(ticket, { state: previous, undoConfirm: result.confirm ? result.text : '', ...(result.confirm ? {} : { note: result.text }) });
      if (destroyed) return;
      save(); renderHistory(); syncControls(); say(result.text, result.ok ? 'success' : result.confirm ? '' : 'error');
      if (result.ok) onRepairDone?.('undone');
      return;
    } else return;
    save(); renderHistory();
  }
  function hide() {
    if (root.hidden) return;
    stopRequest(); stopModels(); flushDraft();
    leave(host, root, () => { root.hidden = true; notify(); returnFocus?.(); });
  }
  listen(close, 'click', hide);
  listen(expand, 'click', () => {
    expanded = !expanded; expand.setAttribute('aria-label', expanded ? '恢复聊天窗口大小' : '展开聊天窗口');
    expand.title = expanded ? '恢复聊天窗口大小' : '展开聊天窗口'; layout(); syncControls();
  });
  listen(exportButton, 'click', exportHistory);
  listen(latest, 'click', scrollToLatest);
  listen(cancelEditButton, 'click', cancelEdit);
  listen(log, 'scroll', () => { if (nearBottom()) unreadReply = false; syncLatest(); });
  listen(log, 'click', event => {
    const control = event.target.closest?.('button[data-action]'); if (!control || !log.contains(control)) return;
    if (control.dataset.action === 'copy') { copyMessage(Number(control.dataset.index), control); return; }
    if (control.dataset.action === 'reply') { input.focus({ preventScroll: true }); say(`写下想对${name}说的话，发送就好。`); return; }
    if (operation || modelOperation) return;
    if (control.dataset.action.startsWith('ticket-')) { ticketAction(control); return; }
    if (control.dataset.action === 'starter') { input.value = control.dataset.prompt; resizeInput(); flushDraft(); input.focus({preventScroll:true}); }
    if (control.dataset.action === 'edit') beginEdit(Number(control.dataset.index));
    if (control.dataset.action === 'regenerate' && history.at(-1)?.role === 'assistant') {
      const last = lastUserIndex(); if (last >= 0) run(false, history.slice(0,last+1).map(m=>({...m})), 'regenerate');
    }
  });
  listen(log, 'change', event => {
    const box = event.target.closest?.('input[data-action="ticket-pick"]'); if (!box || !log.contains(box)) return;
    const ticket = history[Number(box.dataset.index)]?.ticket;
    const item = ticket?.items.find(entry => entry.id === box.dataset.item);
    if (!item || ticket.state !== 'open' || !pickable(item) || ticketBusy) { box.checked = Boolean(item?.picked); return; }
    item.picked = box.checked; save();
    const card = box.closest('.erii-repair__ticket');
    if (card) syncTicketActions(card, ticket, { dbBusy: databaseBusy, pending: Boolean(operation) || ticketBusy });
  });
  listen(modeBar, 'click', event => { const tab = event.target.closest?.('button[data-mode]'); if (tab) setMode(tab.dataset.mode); });
  listen(floorsSelect, 'change', () => { repair?.setFloors(Number(floorsSelect.value)); renderScope(); });
  listen(settingsButton, 'click', () => settingsVisible(settingsPanel.hidden));
  listen(mode, 'change', () => { resetModels(); custom.hidden = mode.value !== 'custom'; });
  listen(url, 'input', resetModels); listen(key, 'input', resetModels);
  listen(fetchModels, 'click', loadModels);
  listen(models, 'change', () => { if (models.value) model.value = models.value; });
  listen(model, 'input', () => { models.value = model.value; });
  listen(apply, 'click', () => { if (commitSettings()) say('连接设置已保存。', 'success'); });
  listen(settingsPanel, 'submit', event => { event.preventDefault(); if (commitSettings()) say('连接设置已保存。', 'success'); });
  listen(test, 'click', () => { if (!operation && !modelOperation) { commitSettings(); run(true); } });
  listen(composer, 'submit', event => {
    event.preventDefault(); if (operation || modelOperation) return;
    const text = input.value.trim(); if (!text) return;
    const message = { role:'user', content:text.slice(0,4000), at:new Date().toISOString() };
    confirmClear = false; clear.textContent = '清空记录';
    if (editingIndex !== null) {
      const candidate = [...history.slice(0,editingIndex).map(m=>({...m})),message];
      scrollToLatest(); run(false,candidate,'edit');
    } else {
      history.push(message); input.value = ''; resizeInput(); flushDraft(); renderHistory(true); run();
    }
    onUserMessage?.(view);
  });
  listen(input, 'keydown', event => {
    if (host.innerWidth >= 640 && event.key === 'Enter' && !event.shiftKey && !event.isComposing && event.keyCode !== 229) {
      event.preventDefault(); if (!operation) composer.requestSubmit?.();
    }
  });
  listen(input, 'input', () => {
    resizeInput();
    if (draftTimer !== null) host.clearTimeout(draftTimer);
    draftTimer = host.setTimeout(() => { draftTimer = null; save(); }, 350);
  });
  listen(retry, 'click', () => run()); listen(stop, 'click', () => stopRequest());
  listen(taskStop, 'click', () => onStopTask?.(taskStop.dataset.taskId));
  listen(taskOpen, 'click', () => onOpenDatabase?.());
  listen(clear, 'click', () => {
    if (ticketBusy) return;
    if (!confirmClear && history.length) {
      confirmClear = true; clear.textContent = '确认清空';
      say(view === 'repair' ? '再次点击“确认清空”删除检修记录。已经写入的表格和备份不受影响。' : '再次点击“确认清空”删除这份聊天记录。'); return;
    }
    cancelEdit(); history = []; lists[view] = history; unreadReply = false; confirmClear = false; clear.textContent = '清空记录'; save(); renderHistory(true); say(''); syncControls();
  });
  listen(root, 'keydown', event => { if (event.key === 'Escape') { event.stopPropagation(); hide(); } });
  listen(host, 'resize', layout);
  if (host.visualViewport) { listen(host.visualViewport, 'resize', layout); listen(host.visualViewport, 'scroll', layout); }
  // 旁观陪聊的评论：用这个角色的聊天连接发一次请求，结果作为一条“旁观”消息放进闲聊记录。
  // 用户正在等回复或在获取模型时不发，交给调用方稍后再试。
  async function comment(build) {
    if (destroyed) return { ok: false, reason: 'closed' };
    if (operation || modelOperation || commentOperation) return { ok: false, reason: 'busy' };
    const ctx = getContext(); const snapshot = { ...config }; const secret = apiKey;
    const controller = new host.AbortController();
    const current = { controller, timer: host.setTimeout(() => controller.abort(), 90000) };
    commentOperation = current;
    try {
      const text = tidyComment(await requestChat(host, ctx, snapshot, build(snapshot, ctx), { signal: controller.signal, apiKey: secret }), name);
      if (destroyed || commentOperation !== current) return { ok: false, reason: 'closed' };
      if (!text) return { ok: false, reason: '接口返回了空回复。' };
      const following = nearBottom();
      lists.chat.push({ role: 'assistant', content: text, at: new Date().toISOString(), kind: 'watch' });
      save();
      if (!root.hidden && view === 'chat' && !operation) { unreadReply = !following; renderHistory(); syncControls(); }
      return { ok: true, text };
    } catch (error) {
      // 换角色或关闭扩展时会中止请求，这不算接口出错。
      if (destroyed || commentOperation !== current) return { ok: false, reason: 'closed' };
      return { ok: false, reason: error?.name === 'AbortError' ? '等待评论超时了。' : safeChatError(error, secret) };
    } finally {
      host.clearTimeout(current.timer);
      if (commentOperation === current) commentOperation = null;
    }
  }
  fillSettings(); renderHistory(); syncControls();
  return { open, close: hide, comment, setMode, get view() { return view; }, get visible() { return !root.hidden; }, get busy() { return Boolean(operation); },
    setTask(task) {
      // 数据库忙闲变化时重画检修记录，让修改单的“应用”按钮跟着可用或停用。
      const busyNow = Boolean(repair?.busy());
      if (busyNow !== databaseBusy) { databaseBusy = busyNow; if (!root.hidden && view === 'repair' && !operation) renderHistory(); }
      taskBar.hidden = !task;
      if (!task) return;
      taskText.textContent = task.text; taskBar.dataset.kind = task.kind || '';
      taskStop.hidden = !task.canStop; taskStop.disabled = task.pending;
      taskStop.dataset.taskId = task.id || ''; taskStop.textContent = task.pending ? '停止中…' : '停止任务';
    },
    destroy() {
      if (destroyed) return;
      flushDraft();
      destroyed = true;
      if (operation) { host.clearTimeout(operation.timer); operation.controller.abort(); operation = null; }
      if (modelOperation) { host.clearTimeout(modelOperation.timer); modelOperation.controller.abort(); modelOperation = null; }
      if (commentOperation) { host.clearTimeout(commentOperation.timer); commentOperation.controller.abort(); commentOperation = null; }
      serial++; apiKey = ''; sheet.destroy();
      for (const timer of feedbackTimers) host.clearTimeout(timer); feedbackTimers.clear();
      for (const address of downloadURLs) host.URL.revokeObjectURL(address); downloadURLs.clear();
      for (const remove of listeners) remove(); root.remove();
    } };
}
