// Ghi vào cơ sở dữ liệu trong chế độ kiểm tra: Chỉ gọi AutoCardUpdaterAPI public của cơ sở dữ liệu, chỉ thực thi các mục mà người dùng đã tick chọn và xác nhận.
// Trước khi ghi, sẽ xuất toàn bộ bảng ra để sao lưu; hoàn tác (undo) tức là nhập lại y nguyên bản sao lưu đó vào (cơ sở dữ liệu sẽ coi đây là một lần lưu mới).
// Preset thúc đẩy cốt truyện chỉ thực hiện "chuyển đổi": API nhập preset của cơ sở dữ liệu sẽ tiện tay chuyển luôn chat hiện tại sang chế độ thu hồi LLM,
// mà API public lại không có phương thức xóa preset hay chuyển lại chế độ, ghi vào thì không thể hoàn tác, vì vậy không làm.
import { digestTables, executionOrder, locateRow, clip } from './repair.js';

const NEEDED = ['exportTableAsJson', 'importTableAsJson', 'updateCell', 'updateRow', 'insertRow', 'deleteRow'];

export function createRepairService(host, { backups }) {
  const api = () => host.AutoCardUpdaterAPI;
  function chatKey() {
    try {
      const context = host.SillyTavern?.getContext?.();
      return String(context?.getCurrentChatId?.() ?? context?.chatId ?? '');
    } catch { return ''; }
  }
  const available = () => NEEDED.every(name => typeof api()?.[name] === 'function');
  const tables = () => JSON.parse(JSON.stringify(api().exportTableAsJson() || {}));
  function snapshot() {
    const database = api();
    let presets = [];
    let current = '';
    try { presets = (database.getPlotPresetNames?.() || []).map(String); } catch { /* Không đọc được preset thì chỉ là không thể chuyển đổi thôi */ }
    try { current = String(database.getCurrentPlotPreset?.() ?? ''); } catch { /* Như trên */ }
    return { data: tables(), presets, current, chatKey: chatKey() };
  }
  const done = text => ({ ok: true, text });
  const failed = text => ({ ok: false, text });
  async function applyOne(database, item) {
    if (item.kind === 'preset') return await database.switchPlotPreset?.(item.after) ? done('Đã chuyển đổi') : failed('Cơ sở dữ liệu chuyển đổi không thành công.');
    if (item.kind === 'refill') {
      if (typeof database.manualUpdate !== 'function') return failed('Phiên bản cơ sở dữ liệu này không cung cấp API để điền lại bảng.');
      return await database.manualUpdate() === false ? failed('Cơ sở dữ liệu chưa hoàn thành lần điền bảng này, có thể kiểm tra lý do trong cơ sở dữ liệu.') : done('Cơ sở dữ liệu đã điền lại bảng');
    }
    const data = tables();
    const sheet = data[item.sheetKey];
    if (!sheet || String(sheet.name) !== item.table) return failed('Không tìm thấy bảng này nữa.');
    if (item.kind === 'insert') {
      const index = await database.insertRow(item.table, Object.fromEntries(item.values.map(value => [value.column, value.after])));
      return Number(index) > 0 ? done(`Đã thêm vào dòng thứ ${index}`) : failed('Cơ sở dữ liệu không chấp nhận dòng này.');
    }
    const index = locateRow(data, item.sheetKey, item.rowId);
    if (index < 0) return failed('Dòng này không còn nữa, không sửa.');
    const headers = sheet.content[0];
    const now = column => String(sheet.content[index][headers.indexOf(column)] ?? '');
    if (item.kind === 'delete') return await database.deleteRow(item.table, index) ? done('Đã xóa') : failed('Cơ sở dữ liệu từ chối xóa (dòng này có thể bị khóa).');
    if (item.kind === 'cell') {
      if (now(item.column) !== item.before) return failed(`Trước khi xác nhận, ô này đã thay đổi (hiện tại là "${clip(now(item.column), 40)}"), không sửa.`);
      return await database.updateCell(item.table, index, item.column, item.after) ? done('Đã ghi') : failed('Cơ sở dữ liệu từ chối ghi (có thể bị khóa).');
    }
    if (item.kind === 'row') {
      const moved = item.changes.find(change => now(change.column) !== change.before);
      if (moved) return failed(`Trước khi xác nhận, "${moved.column}" đã thay đổi, không sửa.`);
      return await database.updateRow(item.table, index, Object.fromEntries(item.changes.map(change => [change.column, change.after])))
        ? done('Đã ghi') : failed('Cơ sở dữ liệu từ chối ghi (có thể bị khóa).');
    }
    return failed('Không hiểu mục này, không sửa.');
  }
  async function apply(ticket, { character = '', onBackup } = {}) {
    if (!available()) return { ok: false, text: 'Không phát hiện cơ sở dữ liệu, không ghi.' };
    if (ticket.chatKey && ticket.chatKey !== chatKey()) return { ok: false, text: 'Cuộc trò chuyện hiện đang mở không phải là cuộc trò chuyện lúc đưa ra phiếu chỉnh sửa này, không ghi.' };
    const items = executionOrder(ticket.items);
    if (!items.length) return { ok: false, text: 'Vẫn chưa tick chọn những chỗ cần sửa.' };
    const database = api();
    let presetBefore = '';
    try { presetBefore = String(database.getCurrentPlotPreset?.() ?? ''); } catch { /* Chỉ ảnh hưởng đến việc chuyển lại preset khi hoàn tác */ }
    let backupId = '';
    try { backupId = await backups.put({ chatKey: chatKey(), character, tables: JSON.stringify(database.exportTableAsJson() || {}), presetBefore }); }
    catch { backupId = ''; }
    if (!backupId) return { ok: false, text: 'Sao lưu không thành công, để an toàn nên chưa ghi.' };
    // Trước tiên giao mã số sao lưu cho bên gọi cất giữ: phòng khi đang ghi dở thì trang bị đóng, sau này vẫn có thể tìm lại bản sao lưu để hoàn tác hoặc tải xuống.
    onBackup?.(backupId);
    const results = [];
    for (const item of items) {
      let outcome;
      try { outcome = await applyOne(database, item); } catch (error) { outcome = failed(`Đã có lỗi: ${clip(error?.message || error, 120)}`); }
      results.push({ id: item.id, ...outcome });
    }
    const written = results.filter(result => result.ok).length;
    let digest = '';
    try { digest = digestTables(database.exportTableAsJson()); } catch { /* Khi không có dấu vân tay (digest), luôn xác nhận lại trước khi hoàn tác */ }
    return { ok: written > 0, results, backupId, digest, durable: backups.durable,
      presetChanged: results.some(result => result.ok && items.find(item => item.id === result.id)?.kind === 'preset'),
      text: written ? `Đã ghi ${written} chỗ${written < results.length ? `, ${results.length - written} chỗ chưa ghi được` : ''}.` : 'Không ghi được vào chỗ nào, bảng biểu không có thay đổi.' };
  }
  async function undo(ticket, { force = false } = {}) {
    if (!available()) return { ok: false, text: 'Không phát hiện cơ sở dữ liệu, không thể hoàn tác.' };
    if (ticket.chatKey && ticket.chatKey !== chatKey()) return { ok: false, text: 'Cuộc trò chuyện hiện đang mở không phải là cuộc trò chuyện của phiếu chỉnh sửa này. Hãy chuyển lại cuộc trò chuyện đó rồi mới hoàn tác.' };
    const record = await backups.get(ticket.backupId);
    if (!record?.tables) return { ok: false, text: 'Không tìm thấy bản sao lưu lần này nữa (trang đã được làm mới, và trình duyệt không thể lưu lại bản sao lưu).' };
    if (!force && !ticket.digest) return { ok: false, confirm: true, text: 'Kết quả của lần ghi trước không được ghi lại đầy đủ, không thể xác nhận bảng biểu sau đó có thay đổi hay không. Hoàn tác sẽ khôi phục toàn bộ bảng về thời điểm trước khi ghi.' };
    if (!force && digestTables(api().exportTableAsJson()) !== ticket.digest)
      return { ok: false, confirm: true, text: 'Sau khi ghi, bảng biểu lại có thay đổi (có thể do cơ sở dữ liệu tự điền bảng). Hoàn tác sẽ đưa luôn những thay đổi này trở về thời điểm trước khi ghi.' };
    if (!await api().importTableAsJson(record.tables)) return { ok: false, text: 'Cơ sở dữ liệu không chấp nhận khôi phục, bảng biểu không có thay đổi. Có thể tải xuống bản sao lưu và nhập thủ công trong cơ sở dữ liệu.' };
    let tail = '';
    if (ticket.presetChanged) {
      try { tail = await api().switchPlotPreset?.(record.presetBefore ?? '') ? ', preset thúc đẩy cốt truyện cũng đã chuyển lại rồi' : ', nhưng preset thúc đẩy cốt truyện không thể chuyển lại'; }
      catch { tail = ', nhưng preset thúc đẩy cốt truyện không thể chuyển lại'; }
    }
    return { ok: true, text: `Đã khôi phục về bảng biểu thời điểm trước khi ghi${tail}.` };
  }
  return { available, snapshot, apply, undo, chatKey, backup: id => backups.get(id), get durable() { return backups.durable; } };
}
