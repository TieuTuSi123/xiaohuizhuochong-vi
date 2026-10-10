// Thẻ danh sách sửa đổi: Chỉ vẽ ra dựa trên trạng thái của danh sách. Việc đánh dấu chọn, áp dụng, hoàn tác đều dùng data-action giao cho cửa sổ trò chuyện xử lý.
import { clip, pickable } from './repair.js';

const STAMPS = { open: 'Chờ bạn xác nhận', applying: 'Đang ghi...', applied: 'Đã ghi', dismissed: 'Không áp dụng', undoing: 'Đang hoàn tác...', undone: 'Đã hoàn tác', interrupted: 'Chưa rõ kết quả' };

function where(item) {
  if (item.kind === 'preset') return ['Thúc đẩy cốt truyện', 'Preset của cuộc trò chuyện hiện tại'];
  if (item.kind === 'refill') return ['Cơ sở dữ liệu', 'Điền bảng lại một lần'];
  if (item.kind === 'unknown') return [item.label || 'Thao tác không xác định', ''];
  const place = item.kind === 'insert' ? 'Thêm một dòng' : item.kind === 'delete' ? `Xóa dòng thứ ${item.row ?? '?'}`
    : [item.row ? `Dòng thứ ${item.row}` : '', item.kind === 'cell' ? item.column : item.changes?.length ? `Sửa ${item.changes.length} cột` : ''].filter(Boolean).join(' · ');
  return [item.table || '（Chưa ghi tên bảng）', place];
}

export function ticketCounts(ticket) {
  const valid = ticket.items.filter(pickable);
  return { valid: valid.length, picked: valid.filter(item => item.picked).length };
}

// Khi đánh dấu chọn thì chỉ đổi chữ trên nút, không vẽ lại toàn bộ đoạn ghi chép, tiêu điểm bàn phím vẫn giữ nguyên trên ô đánh dấu.
export function syncTicketActions(card, ticket, { dbBusy = false, pending = false } = {}) {
  const { valid, picked } = ticketCounts(ticket);
  const apply = card.querySelector('[data-action="ticket-apply"]');
  const all = card.querySelector('[data-action="ticket-all"]');
  if (apply) { apply.textContent = `Áp dụng mục đã chọn (${picked} mục)`; apply.disabled = !picked || dbBusy || pending; }
  if (all) { all.textContent = valid && picked === valid ? 'Bỏ chọn tất cả' : 'Chọn tất cả'; all.disabled = !valid || pending; }
}

export function renderTicket(doc, ticket, { index, dbBusy = false, pending = false, durable = true }) {
  const node = (tag, text, className) => {
    const element = doc.createElement(tag);
    if (text !== undefined) element.textContent = text;
    if (className) element.className = className;
    return element;
  };
  const action = (text, name, className) => {
    const control = node('button', text, className); control.type = 'button';
    control.dataset.action = name; control.dataset.index = String(index);
    return control;
  };
  const value = (tag, text) => { const full = text === '' || text == null ? '（Trống）' : String(text); const element = node(tag, clip(full, 300)); element.title = full; return element; };
  const arrow = () => node('span', '→', 'erii-repair__arrow');
  const busy = pending || ['applying', 'undoing'].includes(ticket.state);
  const card = node('div', undefined, 'erii-repair__ticket');
  card.dataset.state = ticket.state;
  const head = node('div', undefined, 'erii-repair__head');
  head.append(node('strong', `Danh sách sửa đổi · ${ticket.items.length} mục`), node('small', 'Trước khi ghi sẽ tự động sao lưu toàn bộ bảng'));
  card.append(node('span', STAMPS[ticket.state] || '', 'erii-repair__stamp'), head);
  const results = new Map((ticket.results || []).map(result => [result.id, result]));
  for (const item of ticket.items) {
    const row = node('label', undefined, 'erii-repair__item');
    row.dataset.kind = item.kind;
    if (item.problem) row.dataset.problem = 'true';
    const box = node('input'); box.type = 'checkbox';
    box.dataset.action = 'ticket-pick'; box.dataset.index = String(index); box.dataset.item = item.id;
    box.checked = Boolean(item.picked) && pickable(item);
    box.disabled = ticket.state !== 'open' || !pickable(item) || busy;
    const [table, place] = where(item);
    const title = node('span', `${table} `, 'erii-repair__where');
    if (place) title.append(node('em', `· ${place}`));
    box.setAttribute('aria-label', `${table} ${place}`.trim());
    const diff = node('span', undefined, 'erii-repair__diff');
    // Các mục không qua được bước đối chiếu sẽ không có giá trị cũ và mới đáng tin cậy, chỉ hiển thị nguyên nhân.
    if (item.kind === 'cell' ? item.after !== undefined : item.kind === 'preset' && Boolean(item.after))
      diff.append(value('del', item.kind === 'preset' ? item.before || 'Theo cài đặt toàn cục' : item.before), arrow(), value('ins', item.after));
    else if (item.kind === 'row') for (const change of item.changes || []) {
      const line = node('span', undefined, 'erii-repair__change');
      line.append(node('b', change.column), value('del', change.before), arrow(), value('ins', change.after));
      diff.append(line);
    }
    else if (item.kind === 'insert') diff.append(value('ins', (item.values || []).map(entry => `${entry.column}: ${entry.after}`).join(' · ')));
    else if (item.kind === 'delete') diff.append(value('del', item.preview || `Dòng thứ ${item.row}`));
    else if (item.kind === 'refill') diff.append(node('span', 'Dựa theo cài đặt hiện tại của cơ sở dữ liệu để điền bảng lại một lần. Sẽ gọi API điền bảng mà bạn đã cấu hình trong cơ sở dữ liệu, và tính phí y như khi điền bảng bình thường.'));
    row.append(box, title);
    if (diff.childNodes.length) row.append(diff);
    if (item.reason) row.append(node('span', item.reason, 'erii-repair__why'));
    if (item.problem) row.append(node('span', item.problem, 'erii-repair__problem'));
    const result = results.get(item.id);
    if (result) { const line = node('span', `${result.ok ? '✓' : '✗'} ${result.text}`, 'erii-repair__result'); line.dataset.ok = String(result.ok); row.append(line); }
    card.append(row);
  }
  if (ticket.state === 'open') {
    const actions = node('div', undefined, 'erii-repair__actions');
    actions.append(action('Chọn tất cả', 'ticket-all'), action('Áp dụng mục đã chọn (0 mục)', 'ticket-apply', 'erii-chat__send'), action('Bỏ qua tất cả', 'ticket-dismiss'));
    card.append(actions);
    syncTicketActions(card, ticket, { dbBusy, pending: busy });
    if (dbBusy) card.append(node('p', 'Cơ sở dữ liệu đang xử lý nhiệm vụ, hãy đợi nó làm xong rồi áp dụng.', 'erii-repair__hint'));
    if (ticket.note) card.append(node('p', ticket.note, 'erii-repair__hint'));
    return card;
  }
  const receipt = node('div', undefined, 'erii-repair__receipt');
  receipt.dataset.state = ticket.state;
  const text = {
    applied: `${ticket.note || 'Đã ghi xong.'} Đã sao lưu trước khi ghi${ticket.durable === false || !durable ? ' (Bản sao lưu chỉ tồn tại trong lần mở trang này, khuyên bạn nên tải về một bản trước)' : ''}.`,
    undone: ticket.note || 'Đã hoàn tác.', dismissed: 'Không áp dụng danh sách sửa đổi này, bảng không có gì thay đổi.',
    interrupted: 'Lần ghi hoặc hoàn tác trước đó trang đã bị đóng, chưa rõ kết quả. Bạn có thể kiểm tra lại trong cơ sở dữ liệu; dùng bản sao lưu để khôi phục nếu cần.',
    applying: 'Đang lần lượt ghi vào...', undoing: 'Đang khôi phục bản sao lưu...',
  }[ticket.state] || '';
  receipt.append(node('span', text));
  if (ticket.backupId && ['applied', 'interrupted'].includes(ticket.state) && !ticket.undoConfirm) {
    const undo = action('Hoàn tác', 'ticket-undo'); undo.disabled = busy; receipt.append(undo);
  }
  if (ticket.backupId && ['applied', 'undone', 'interrupted'].includes(ticket.state)) {
    const save = action('Tải bản sao lưu về', 'ticket-download'); save.disabled = busy; receipt.append(save);
  }
  card.append(receipt);
  if (ticket.undoConfirm) {
    const confirm = node('div', undefined, 'erii-repair__confirm');
    const force = action('Vẫn muốn hoàn tác', 'ticket-undo-force'); force.disabled = busy;
    const keep = action('Tạm thời không hoàn tác', 'ticket-keep'); keep.disabled = busy;
    confirm.append(node('span', ticket.undoConfirm), force, keep);
    card.append(confirm);
  }
  return card;
}
