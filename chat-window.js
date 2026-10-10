import { chatMessages } from './chat-prompt.js';
import { normalizeChatConfig, requestChat, requestModelList, safeChatError } from './chat-transport.js';
import { createSheet, leave } from './sheet.js';
import { pickable, settleTicket, ticketNote } from './repair.js';
import { renderTicket, syncTicketActions } from './repair-ticket.js';
import { tidyComment } from './watch.js';

// Khóa được lưu một bản theo thiết bị, dùng chung cho tất cả nhân vật; lịch sử trò chuyện, nhân thiết và danh xưng được lưu riêng theo từng nhân vật.
// Ghi chép kiểm tra và ghi chép trò chuyện được lưu riêng (saved.repair), dữ liệu kiểm tra sẽ không bị lẫn vào trò chuyện thường ngày.
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
  root.setAttribute('role', 'dialog'); root.setAttribute('aria-label', `Trò chuyện với ${fullName}`);
  const grip = node('div', undefined, 'pet-grip'); grip.setAttribute('aria-hidden', 'true');
  const header = node('header', undefined, 'erii-chat__header');
  const avatar = node('img'); avatar.src = avatarUrl() || ''; avatar.alt = '';
  avatar.draggable = false;
  const heading = node('div'); heading.append(node('strong', fullName), node('span', character.chatTagline));
  const expand = button('↔', 'erii-chat__expand'); expand.setAttribute('aria-label', 'Mở rộng cửa sổ trò chuyện'); expand.title = 'Mở rộng cửa sổ trò chuyện';
  const close = button('×', 'erii-chat__close'); close.setAttribute('aria-label', 'Đóng cửa sổ trò chuyện');
  header.append(avatar, heading, expand, close);
  const toolbar = node('div', undefined, 'erii-chat__toolbar');
  const connection = node('span', undefined, 'erii-chat__connection');
  const settingsButton = button('Thiết lập kết nối'); settingsButton.setAttribute('aria-expanded', 'false');
  const clear = button('Xóa lịch sử');
  const exportButton = button('Xuất'); exportButton.setAttribute('aria-label', 'Xuất lịch sử trò chuyện');
  toolbar.append(connection, settingsButton, exportButton, clear);
  const modeBar = node('div', undefined, 'erii-chat__mode'); modeBar.hidden = !repair;
  modeBar.setAttribute('role', 'group'); modeBar.setAttribute('aria-label', 'Chế độ trò chuyện');
  const chatTab = button('Trò chuyện'); chatTab.dataset.mode = 'chat';
  const repairTab = button('Kiểm tra cơ sở dữ liệu'); repairTab.dataset.mode = 'repair';
  modeBar.append(chatTab, repairTab);
  const scope = node('div', undefined, 'erii-repair__scope'); scope.hidden = true;
  const scopeLead = node('span'); const scopeTail = node('span');
  const floorsSelect = node('select', undefined, 'erii-repair__floors'); floorsSelect.setAttribute('aria-label', 'Đính kèm vài tầng chính văn gần đây khi kiểm tra');
  for (let count = 0; count <= 10; count++) { const option = node('option', String(count)); option.value = String(count); floorsSelect.append(option); }
  scope.append(scopeLead, floorsSelect, scopeTail);
  const environment = node('p', '', 'erii-chat__environment');
  const previewMode = getContext().eriiPreviewMode;
  environment.hidden = !previewMode;
  environment.textContent = previewMode === 'demo' ? 'Chế độ trình diễn · Phản hồi mẫu, không kết nối API'
    : 'Xem trước độc lập · Có thể đối thoại thực sau khi cấu hình API riêng';
  const taskBar = node('div', undefined, 'erii-chat__task'); taskBar.hidden = true;
  const taskText = node('span'); const taskOpen = button('Mở cơ sở dữ liệu'); const taskStop = button('Dừng nhiệm vụ');
  taskStop.setAttribute('aria-label', 'Dừng nhiệm vụ cơ sở dữ liệu (cửa sổ trò chuyện)'); taskBar.append(taskText, taskOpen, taskStop);
  const log = node('div', undefined, 'erii-chat__log');
  log.setAttribute('role', 'log'); log.setAttribute('aria-label', `Lịch sử trò chuyện với ${fullName}`);
  log.setAttribute('aria-live', 'polite'); log.tabIndex = 0;
  const status = node('p', '', 'erii-chat__status'); status.setAttribute('role', 'status');
  const composer = node('form', undefined, 'erii-chat__composer');
  const input = node('textarea'); input.rows = 2; input.maxLength = 4000;
  input.value = String(saved.draft || '').slice(0, 4000);
  input.placeholder = `Nói một câu với ${name}…`; input.setAttribute('aria-label', 'Nội dung trò chuyện');
  const actions = node('div', undefined, 'erii-chat__actions');
  const tip = node('span', 'Enter để gửi · Shift+Enter để xuống dòng');
  const retry = button('Thử lại'); retry.hidden = true;
  const stop = button('Dừng phản hồi'); stop.hidden = true;
  const send = button('Gửi', 'erii-chat__send'); send.type = 'submit';
  const editBar = node('div', undefined, 'erii-chat__edit-bar');
  editBar.append(node('span', 'Chỉnh sửa tin nhắn trước; sau khi gửi thành công sẽ cập nhật lượt này.'));
  const cancelEditButton = button('Hủy chỉnh sửa'); editBar.append(cancelEditButton); editBar.hidden = editingIndex === null;
  const latest = button('Trở về tin nhắn mới nhất', 'erii-chat__latest'); latest.hidden = true;
  actions.append(tip, retry, stop, send); composer.append(editBar, input, actions);
  const settingsPanel = node('form', undefined, 'erii-chat__settings'); settingsPanel.hidden = true;
  settingsPanel.setAttribute('aria-label', `Thiết lập kết nối trò chuyện ${name}`);
  const field = (title, type, value = '') => {
    const label = node('label', title);
    const control = node(type === 'select' ? 'select' : type === 'textarea' ? 'textarea' : 'input');
    control.setAttribute('aria-label', title);
    if (!['select', 'textarea'].includes(type)) control.type = type;
    control.value = value; label.append(control); settingsPanel.append(label); return control;
  };
  settingsPanel.append(node('h3', 'Kết nối', 'erii-chat__section-title'));
  const mode = field('Kết nối trò chuyện', 'select');
  for (const [value, title] of [['current', 'Sử dụng API hiện tại của SillyTavern'], ['custom', 'Cấu hình API riêng (Tương thích OpenAI)']]) {
    const option = node('option', title); option.value = value; mode.append(option);
  }
  const custom = node('div', undefined, 'erii-chat__custom');
  const customField = (title, type) => { const control = field(title, type); custom.append(control.parentElement); return control; };
  const url = customField('Địa chỉ API', 'url'); url.placeholder = 'https://api-cua-ban/v1';
  const key = customField('Khóa API', 'password'); key.autocomplete = 'off'; key.spellcheck = false;
  const fetchModels = button('Lấy danh sách model', 'erii-chat__fetch-models');
  custom.append(fetchModels);
  const modelStatus = node('small', '', 'erii-chat__model-status'); modelStatus.setAttribute('role', 'status'); custom.append(modelStatus);
  const models = customField('Model khả dụng', 'select'); models.parentElement.hidden = true;
  const model = customField('Tên model', 'text'); model.maxLength = 200; model.placeholder = 'Chọn từ danh sách, hoặc điền thủ công';
  custom.append(node('small', 'Điền địa chỉ và khóa rồi lấy danh sách; chọn model sẽ điền tên vào, lưu thiết lập để sử dụng. Có thể điền thủ công khi API không cung cấp danh sách.'));
  const rememberLabel = node('label', undefined, 'erii-chat__remember');
  const remember = node('input'); remember.type = 'checkbox';
  rememberLabel.append(remember, node('span', 'Nhớ khóa trên thiết bị này')); custom.append(rememberLabel);
  custom.append(node('small', 'Sau khi tick chọn, khóa sẽ được lưu trong trình duyệt. Bỏ tick và lưu để xóa; địa chỉ và model sẽ được lưu riêng.'));
  settingsPanel.append(custom);
  settingsPanel.append(node('h3', `Bạn và ${name}`, 'erii-chat__section-title'));
  const nickname = field(`${name} gọi bạn là gì`, 'text'); nickname.maxLength = 40; nickname.placeholder = 'Mặc định dùng tên SillyTavern của bạn';
  const relationship = field('Mối quan hệ của hai người', 'text'); relationship.maxLength = 80; relationship.placeholder = 'Người yêu, bạn bè, hoặc thiết lập riêng của bạn';
  const length = field('Giới hạn độ dài phản hồi', 'number'); length.min = '128'; length.max = '4096'; length.step = '128';
  const replyStyle = field('Phong cách trò chuyện', 'select');
  for (const [value,text] of [['natural','Trò chuyện tự nhiên'],['short','Bầu bạn ngắn gọn'],['detailed','Giao tiếp chi tiết']]) {
    const option = node('option',text); option.value=value; replyStyle.append(option);
  }
  const memory = field(`Những điều muốn ${name} nhớ`, 'textarea'); memory.rows = 4; memory.maxLength = 2000;
  memory.placeholder = 'Ví dụ: Mình thích được gọi là Tiểu Vân; dạo này đang chuẩn bị thi; không thích đang trò chuyện nửa chừng thì bị sắp xếp một đống lời khuyên.';
  settingsPanel.append(node('small', 'Chỉ lưu lại dữ liệu bạn viết ở đây, và sẽ mang theo trong mỗi lần trò chuyện. Có thể sửa hoặc xóa bất cứ lúc nào, không tự động trích xuất nội dung trò chuyện hay cơ sở dữ liệu.'));
  settingsPanel.append(node('small', 'Lịch sử trò chuyện được lưu độc lập trong tài khoản SillyTavern hiện tại. Mỗi lần mang theo tối đa 40 tin nhắn gần nhất, khoảng 24000 ký tự.'));
  const settingsActions = node('div', undefined, 'erii-chat__settings-actions');
  const test = button('Kiểm tra kết nối'); const apply = button('Lưu thiết lập', 'erii-chat__send');
  settingsActions.append(test, apply); settingsPanel.append(settingsActions);
  settingsPanel.append(node('small', 'Kiểm tra sẽ gửi một yêu cầu ngắn, không đưa vào lịch sử trò chuyện. API cấu hình riêng được kết nối bởi thiết bị đang chạy SillyTavern.'));
  root.append(grip, header, toolbar, modeBar, scope, environment, taskBar, log, latest, settingsPanel, status, composer); doc.body.append(root);
  const sheet = createSheet(host, root, { grip, drag: [header], onDismiss: () => hide(),
    desktop: () => ({ width: expanded ? 600 : 440, height: expanded ? 760 : 660, align: 'right' }) });

  function notify() { onState?.({ open: !root.hidden, busy: Boolean(operation) }); }
  function trim(which, max, budget) {
    let list = lists[which];
    let removed = Math.max(0, list.length - max);
    list = list.slice(-max);
    // Phiếu chỉnh sửa cũng được tính vào dung lượng, tránh để lịch sử kiểm tra làm phình to thiết lập của tiện ích mở rộng.
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
    // Chỉ có trò chuyện mới có thể "chỉnh sửa gửi lại", nên vị trí chỉnh sửa chỉ di chuyển theo lịch sử trò chuyện.
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
    fetchModels.textContent = listing ? 'Hủy lấy' : 'Lấy danh sách model';
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
    connection.textContent = config.mode === 'custom' ? `Kết nối riêng · ${config.model || 'Chưa thiết lập'}` : 'Sử dụng API hiện tại của SillyTavern';
    const repairing = view === 'repair';
    for (const tab of [chatTab, repairTab]) { tab.setAttribute('aria-pressed', String(tab.dataset.mode === view)); tab.disabled = pending || ticketBusy; }
    if (repairing && !repair?.available()) send.disabled = true;
    input.placeholder = repairing ? 'Hãy nói xem chỗ nào không đúng, hoặc nói thẳng "Kiểm tra giúp mình một chút"…' : `Nói một câu với ${name}…`;
    tip.textContent = tipText();
    notify();
  }
  function tipText() {
    return view === 'repair' ? 'Chế độ kiểm tra: Mỗi lần ghi đều cần bạn xác nhận' : sheet.isSheet() ? 'Bấm Gửi để trò chuyện · Enter để xuống dòng' : 'Enter để gửi · Shift+Enter để xuống dòng';
  }
  function renderScope() {
    scope.hidden = view !== 'repair' || !repair;
    if (scope.hidden) return;
    const info = repair.scope();
    floorsSelect.hidden = !info.available; scopeTail.hidden = !info.available;
    if (!info.available) { scopeLead.textContent = 'Không phát hiện cơ sở dữ liệu. Hãy bật Long Huyết Huyền Hoàng · Database rồi quay lại kiểm tra.'; return; }
    scopeLead.textContent = `${character.pronoun} có thể thấy: Toàn bộ bảng biểu (${info.tables} bảng) · Vài tầng `;
    floorsSelect.value = String(info.floors);
    scopeTail.textContent = ` chính văn gần đây · Lỗi ${info.errors} mục`;
  }
  function setMode(next) {
    if (next === view || (next === 'repair' && !repair) || operation || ticketBusy) return;
    cancelEdit(); confirmClear = false; clear.textContent = 'Xóa lịch sử';
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
      say('Đã lưu thiết lập; trình duyệt không thể lưu khóa, nhưng lần này vẫn có thể sử dụng.', 'error');
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
      const words = repairing ? [`${name} đến giúp bạn kiểm tra cơ sở dữ liệu`, 'Hãy nói xem chỗ nào không đúng, hoặc nói thẳng "Kiểm tra giúp mình một chút". Cần sửa gì đều sẽ được liệt kê thành phiếu chỉnh sửa trước, chờ bạn tick xác nhận.'] : character.chatWelcome;
      welcome.append(illustration, node('span', words[0]), node('p', words[1]));
      const starters = node('div', undefined, 'erii-chat__starters');
      const choices = repairing ? [['Kiểm tra giúp mình một chút', 'Kiểm tra giúp mình các bảng biểu xem có chỗ nào không khớp với chính văn không.'], ['Vừa nãy báo lỗi rồi', 'Vừa nãy cơ sở dữ liệu báo lỗi, xem giúp mình chuyện gì vậy.'],
        ['Có bị ghi sót không', 'Trong vài tầng gần đây, có bảng biểu nào ghi sót không?']] : character.starters;
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
        : node('span', (config.nickname || 'Bạn').slice(0,1), 'erii-chat__avatar erii-chat__avatar--user');
      if (item.role === 'assistant') { identity.src = avatar.src; identity.alt = ''; }
      const bubble = node('article', undefined, `erii-chat__bubble erii-chat__bubble--${item.role}`);
      const meta = node('small', undefined, 'erii-chat__message-meta');
      const who = node('span', item.role === 'user' ? (config.nickname || 'Bạn') : fullName);
      if (item.kind === 'watch') who.append(node('em', 'Đứng xem', 'erii-chat__tag'));
      meta.append(who);
      if (date) { const time = node('time', date.toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit',hour12:false})); time.dateTime = item.at; meta.append(time); }
      const tools = node('div', undefined, 'erii-chat__message-tools');
      const copy = button('Sao chép'); copy.dataset.action = 'copy'; copy.dataset.index = String(index); tools.append(copy);
      if (!repairing && index === lastUserIndex(shown) && item.role === 'user') {
        const edit = button('Sửa rồi gửi lại'); edit.dataset.action = 'edit'; edit.dataset.index = String(index); tools.append(edit);
      }
      if (!repairing && item.role === 'assistant' && item.kind !== 'watch' && index === shown.length - 1 && lastUserIndex(shown) >= 0) {
        const regenerate = button('Trả lời lại'); regenerate.dataset.action = 'regenerate'; tools.append(regenerate);
      }
      if (item.kind === 'watch' && index === shown.length - 1) {
        const answer = button(`Trả lời ${character.pronoun.toLowerCase()}`); answer.dataset.action = 'reply'; tools.append(answer);
      }
      for (const control of tools.children) if (!['copy', 'reply'].includes(control.dataset.action)) control.disabled = Boolean(operation) || Boolean(modelOperation);
      bubble.append(meta, node('p', item.content));
      if (item.ticket) bubble.append(renderTicket(doc, item.ticket, { index, dbBusy: databaseBusy, pending: Boolean(operation) || ticketBusy, durable: repair?.durable !== false }));
      bubble.append(tools); row.append(identity, bubble); log.append(row);
    }
    if (operation && !operation.isTest) {
      const waiting = node('div', undefined, 'erii-chat__pending');
      waiting.append(node('span', `${fullName} đang viết phản hồi`), node('i', '·'), node('i', '·'), node('i', '·'));
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
    input.focus({preventScroll:true}); say(`Sau khi sửa xong rồi gửi, sẽ cập nhật tin nhắn này và câu trả lời của ${name}.`);
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
      control.textContent = 'Đã sao chép';
      const timer = host.setTimeout(() => { feedbackTimers.delete(timer); control.textContent = 'Sao chép'; }, 1800); feedbackTimers.add(timer);
    } catch { if (!destroyed) say('Trình duyệt không thể tự động sao chép, bạn có thể bôi đen chữ của tin nhắn rồi sao chép.', 'error'); }
  }
  function exportHistory() {
    if (!history.length) return;
    const title = view === 'repair' ? 'Lịch sử kiểm tra' : 'Lịch sử trò chuyện';
    const text = `${title} của ${fullName}\n\n` + history.map(item => {
      const who = item.role === 'user' ? (config.nickname || 'Bạn') : `${fullName}${item.kind === 'watch' ? '（Đứng xem）' : ''}`;
      const time = item.at ? ' · ' + new Date(item.at).toLocaleString('zh-CN',{hour12:false}) : '';
      return `${who}${time}\n${item.content}${item.ticket ? `\n${ticketNote(item.ticket)}` : ''}`;
    }).join('\n\n');
    download(new host.Blob(['\uFEFF'+text],{type:'text/plain;charset=utf-8'}), `${fullName}${view === 'repair' ? 'kiem-tra' : 'tro-chuyen'}-${new Date().toISOString().slice(0,10)}.txt`);
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
    settingsButton.textContent = show ? 'Trở về trò chuyện' : 'Thiết lập kết nối';
    settingsButton.setAttribute('aria-expanded', String(show));
    syncLatest();
    if (show) fillSettings();
  }
  function stopModels(message = 'Đã hủy lấy model.') {
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
    modelOperation = request; modelStatus.textContent = 'Đang lấy model…'; syncControls();
    try {
      const list = await requestModelList(host, getContext(), {mode:'custom', url:url.value.trim()}, {signal:controller.signal, apiKey:secret});
      if (destroyed || modelOperation !== request) return;
      const placeholder = node('option', `Vui lòng chọn model (tổng cộng ${list.length} cái)`); placeholder.value = ''; models.append(placeholder);
      for (const id of list) { const option = node('option', id); option.value = id; models.append(option); }
      models.value = list.includes(model.value.trim()) ? model.value.trim() : '';
      models.parentElement.hidden = false;
      modelStatus.textContent = `Đã lấy được ${list.length} model, vui lòng chọn rồi lưu.`; modelStatus.dataset.kind = 'success';
    } catch (error) {
      if (destroyed || modelOperation !== request) return;
      modelStatus.textContent = timedOut ? 'Lấy model vượt quá 30 giây, có thể thử lại hoặc điền thủ công.' : safeChatError(error, secret);
      modelStatus.dataset.kind = 'error';
    } finally {
      if (modelOperation === request) { host.clearTimeout(request.timer); modelOperation = null; syncControls(); }
    }
  }
  function stopRequest(message = 'Đã dừng phản hồi, có thể thử lại.') {
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
    say(isTest ? 'Đang kiểm tra kết nối…' : kind === 'regenerate' ? 'Đang trả lời lại, sau khi thành công sẽ thay thế câu trả lời gốc.' : repairing ? `${name} đang xem bảng biểu…` : ''); syncControls(); renderHistory();
    try {
      const messages = isTest ? [{ role: 'user', content: 'Vui lòng phản hồi ngắn gọn "Kết nối thành công".' }]
        : repairing ? repair.messages(snapshot, ctx, candidate || history) : chatMessages(snapshot, ctx, candidate || history, persona);
      if (kind === 'regenerate') messages[0].content += `\n\n【Lần trả lời lại này】Phản hồi lần trước chỉ đóng vai trò là tài liệu văn bản chờ viết lại: ${JSON.stringify(history.at(-1)?.content.slice(0,2000) || '')}. Hãy phản hồi cùng một câu hỏi của người dùng, cố gắng diễn đạt bám sát nội dung cụ thể hơn, tránh lặp lại máy móc phần mở đầu và kết thúc của lần trước.`;
      const result = await requestChat(host, ctx, snapshot, messages, { signal: controller.signal, apiKey: secret });
      if (destroyed || operation?.id !== id) return;
      if (isTest) say('Kết nối thành công, có thể bắt đầu trò chuyện rồi.', 'success');
      else {
        const following = nearBottom();
        if (candidate) {
          // Bình luận đứng xem tới trong lúc chờ phản hồi không được phép mất khi thay bằng lịch sử đã sửa.
          const late = history.slice(started).filter(m => m.kind === 'watch');
          history = candidate; lists[view] = candidate; history.push(...late);
        }
        let note = '';
        if (repairing) {
          let reviewed;
          try { reviewed = repair.review(result); } catch { reviewed = { reply: result, ticket: null, note: 'Không đọc được cơ sở dữ liệu, lần này không tạo phiếu chỉnh sửa.' }; }
          history.push({ role: 'assistant', content: reviewed.reply || `(${name} đưa tới một phiếu chỉnh sửa)`, at: new Date().toISOString(), ...(reviewed.ticket ? { ticket: reviewed.ticket } : {}) });
          note = reviewed.note || '';
        } else history.push({ role: 'assistant', content: result, at:new Date().toISOString() });
        if (kind === 'edit') { editingIndex = null; input.value = draftBeforeEdit; draftBeforeEdit = ''; resizeInput(); }
        save(); unreadReply = !following; say(note, note ? 'error' : ''); onReply?.();
      }
    } catch (error) {
      if (destroyed || operation?.id !== id) return;
      say(timedOut ? 'Chờ quá hai phút, đã dừng yêu cầu lần này. Có thể kiểm tra kết nối rồi thử lại.'
        : error?.name === 'AbortError' ? 'Đã dừng phản hồi, có thể thử lại.' : safeChatError(error, secret), 'error');
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
    // Trên mobile mở ra mà không gọi bàn phím che mất câu chào; bấm trả lời bình luận của cô ấy mới là yêu cầu gõ phím một cách có chủ đích.
    if (reply || host.innerWidth >= 640) input.focus({ preventScroll: true }); else close.focus({ preventScroll: true });
  }
  async function downloadBackup(ticket) {
    const record = await repair?.backup(ticket.backupId);
    if (destroyed) return;
    if (!record?.tables) { say('Không tìm thấy bản sao lưu lần này nữa (trang đã được tải lại, và trình duyệt không thể lưu bản sao lưu này).', 'error'); return; }
    const stamp = new Date(record.at || Date.now()).toLocaleString('sv-SE', { hour12: false }).replace(/[: ]/g, '-').slice(0, 16);
    download(new host.Blob([record.tables], { type: 'application/json' }), `Sao lưu kiểm tra ${fullName}-${stamp}.json`);
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
      if (repair.busy()) { say('Cơ sở dữ liệu đang xử lý nhiệm vụ, hãy đợi nó xử lý xong rồi áp dụng.', 'error'); return; }
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
    expanded = !expanded; expand.setAttribute('aria-label', expanded ? 'Khôi phục kích thước cửa sổ trò chuyện' : 'Mở rộng cửa sổ trò chuyện');
    expand.title = expanded ? 'Khôi phục kích thước cửa sổ trò chuyện' : 'Mở rộng cửa sổ trò chuyện'; layout(); syncControls();
  });
  listen(exportButton, 'click', exportHistory);
  listen(latest, 'click', scrollToLatest);
  listen(cancelEditButton, 'click', cancelEdit);
  listen(log, 'scroll', () => { if (nearBottom()) unreadReply = false; syncLatest(); });
  listen(log, 'click', event => {
    const control = event.target.closest?.('button[data-action]'); if (!control || !log.contains(control)) return;
    if (control.dataset.action === 'copy') { copyMessage(Number(control.dataset.index), control); return; }
    if (control.dataset.action === 'reply') { input.focus({ preventScroll: true }); say(`Viết ra những lời muốn nói với ${name}, gửi đi là được.`); return; }
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
  listen(apply, 'click', () => { if (commitSettings()) say('Đã lưu thiết lập kết nối.', 'success'); });
  listen(settingsPanel, 'submit', event => { event.preventDefault(); if (commitSettings()) say('Đã lưu thiết lập kết nối.', 'success'); });
  listen(test, 'click', () => { if (!operation && !modelOperation) { commitSettings(); run(true); } });
  listen(composer, 'submit', event => {
    event.preventDefault(); if (operation || modelOperation) return;
    const text = input.value.trim(); if (!text) return;
    const message = { role:'user', content:text.slice(0,4000), at:new Date().toISOString() };
    confirmClear = false; clear.textContent = 'Xóa lịch sử';
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
      confirmClear = true; clear.textContent = 'Xác nhận xóa';
      say(view === 'repair' ? 'Nhấn "Xác nhận xóa" lần nữa để xóa lịch sử kiểm tra. Bảng biểu đã ghi và bản sao lưu không bị ảnh hưởng.' : 'Nhấn "Xác nhận xóa" lần nữa để xóa lịch sử trò chuyện này.'); return;
    }
    cancelEdit(); history = []; lists[view] = history; unreadReply = false; confirmClear = false; clear.textContent = 'Xóa lịch sử'; save(); renderHistory(true); say(''); syncControls();
  });
  listen(root, 'keydown', event => { if (event.key === 'Escape') { event.stopPropagation(); hide(); } });
  listen(host, 'resize', layout);
  if (host.visualViewport) { listen(host.visualViewport, 'resize', layout); listen(host.visualViewport, 'scroll', layout); }
  // Bình luận khi đứng xem trò chuyện: Dùng kết nối trò chuyện của nhân vật này để gửi một yêu cầu, kết quả sẽ được đưa vào lịch sử trò chuyện như một tin nhắn "Đứng xem".
  // Không gửi khi người dùng đang chờ phản hồi hoặc đang lấy model, giao cho bên gọi (caller) thử lại sau.
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
      if (!text) return { ok: false, reason: 'API trả về phản hồi rỗng.' };
      const following = nearBottom();
      lists.chat.push({ role: 'assistant', content: text, at: new Date().toISOString(), kind: 'watch' });
      save();
      if (!root.hidden && view === 'chat' && !operation) { unreadReply = !following; renderHistory(); syncControls(); }
      return { ok: true, text };
    } catch (error) {
      // Khi đổi nhân vật hoặc đóng tiện ích thì sẽ hủy yêu cầu, điều này không tính là lỗi API.
      if (destroyed || commentOperation !== current) return { ok: false, reason: 'closed' };
      return { ok: false, reason: error?.name === 'AbortError' ? 'Đợi bình luận bị quá giờ rồi.' : safeChatError(error, secret) };
    } finally {
      host.clearTimeout(current.timer);
      if (commentOperation === current) commentOperation = null;
    }
  }
  fillSettings(); renderHistory(); syncControls();
  return { open, close: hide, comment, setMode, get view() { return view; }, get visible() { return !root.hidden; }, get busy() { return Boolean(operation); },
    setTask(task) {
      // Khi trạng thái bận/rảnh của cơ sở dữ liệu thay đổi, vẽ lại lịch sử kiểm tra để nút "Áp dụng" của phiếu chỉnh sửa cũng thay đổi khả dụng hoặc vô hiệu hóa theo.
      const busyNow = Boolean(repair?.busy());
      if (busyNow !== databaseBusy) { databaseBusy = busyNow; if (!root.hidden && view === 'repair' && !operation) renderHistory(); }
      taskBar.hidden = !task;
      if (!task) return;
      taskText.textContent = task.text; taskBar.dataset.kind = task.kind || '';
      taskStop.hidden = !task.canStop; taskStop.disabled = task.pending;
      taskStop.dataset.taskId = task.id || ''; taskStop.textContent = task.pending ? 'Đang dừng…' : 'Dừng nhiệm vụ';
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
