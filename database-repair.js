// Ghi dữ liệu ở chế độ kiểm tu: Chỉ gọi AutoCardUpdaterAPI công khai của cơ sở dữ liệu, chỉ thực thi các mục người dùng đã tick chọn và xác nhận.
// Trước khi ghi, xuất toàn bộ bảng biểu để sao lưu; hoàn tác tức là nhập nguyên trạng bản sao lưu trở lại (cơ sở dữ liệu sẽ coi đó là một lần lưu mới).
// Preset thúc đẩy cốt truyện chỉ thực hiện "chuyển đổi": Giao diện nhập preset của cơ sở dữ liệu sẽ tiện tay chuyển luôn cuộc trò chuyện hiện tại sang chế độ thu hồi LLM,
// mà giao diện công khai lại không có phương thức xóa preset hoặc đổi lại chế độ, đã ghi vào thì không thể hoàn tác, vì vậy không thực hiện.
import { digestTables, executionOrder, locateRow, clip } from './repair.js';

const NEEDED = ['exportTableAsJson', 'importTableAsJson', 'updateCell', 'updateRow', 'insertRow', 'deleteRow'];

export function createRepairService(host, { backups, busy = () => false }) {
  const api = () => host.AutoCardUpdaterAPI;
  let revision = 0, writing = false;
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
    try { presets = (database.getPlotPresetNames?.() || []).map(String); } catch { /* Khi không đọc được preset thì chỉ là không thể chuyển đổi */ }
    try { current = String(database.getCurrentPlotPreset?.() ?? ''); } catch { /* Tương tự như trên */ }
    return { data: tables(), presets, current, chatKey: chatKey(), revision, database };
  }
  const isCurrent = captured => Boolean(captured?.chatKey) && captured.chatKey === chatKey() && captured.revision === revision && captured.database === api();
  function guard(captured) {
    if (!isCurrent(captured) || captured.database !== api()) return 'Cuộc trò chuyện hoặc cơ sở dữ liệu đã thay đổi, thao tác này đã dừng lại. Vui lòng chuyển lại cuộc trò chuyện ban đầu rồi xác nhận lại.';
    if (busy()) return 'Cơ sở dữ liệu đang bận xử lý tác vụ, hãy đợi xong xuôi rồi hẵng thao tác.';
    return '';
  }
  async function exclusive(run) {
    if (writing) return { ok: false, text: 'Đang có một đợt ghi hoặc hoàn tác kiểm tu đang diễn ra, vui lòng đợi đợt này kết thúc.' };
    writing = true;
    try { return await run(); } finally { writing = false; }
  }
  const done = text => ({ ok: true, text });
  const failed = text => ({ ok: false, text });
  async function applyOne(database, item) {
    if (item.kind === 'preset') {
      if (typeof database.getCurrentPlotPreset !== 'function' || typeof database.switchPlotPreset !== 'function')
        return failed('Phiên bản cơ sở dữ liệu này không thể đối chiếu và chuyển đổi preset, chưa thay đổi.');
      if (typeof item.before !== 'string' || String(database.getCurrentPlotPreset() ?? '') !== item.before)
        return failed('Preset thúc đẩy cốt truyện đã thay đổi trước khi xác nhận, vui lòng tạo lại phiếu chỉnh sửa.');
      return await database.switchPlotPreset(item.after) ? done('Đã chuyển đổi') : failed('Cơ sở dữ liệu chưa chuyển đổi thành công.');
    }
    if (item.kind === 'refill') {
      if (typeof database.manualUpdate !== 'function') return failed('Phiên bản cơ sở dữ liệu này không cung cấp giao diện để điền lại bảng.');
      return await database.manualUpdate() === false ? failed('Cơ sở dữ liệu chưa hoàn thành lần điền bảng này, có thể kiểm tra nguyên nhân trong cơ sở dữ liệu.') : done('Cơ sở dữ liệu đã điền lại bảng');
    }
    const data = tables();
    const sheet = data[item.sheetKey];
    if (!sheet || String(sheet.name) !== item.table) return failed('Bảng này không còn tồn tại nữa.');
    if (item.kind === 'insert') {
      const index = await database.insertRow(item.table, Object.fromEntries(item.values.map(value => [value.column, value.after])));
      return Number(index) > 0 ? done(`Đã thêm vào dòng thứ ${index}`) : failed('Cơ sở dữ liệu không chấp nhận dòng này.');
    }
    const index = locateRow(data, item.sheetKey, item.rowId);
    if (index < 0) return failed('Dòng này không còn nữa, chưa thay đổi.');
    const headers = sheet.content[0];
    const now = column => String(sheet.content[index][headers.indexOf(column)] ?? '');
    if (item.kind === 'delete') {
      if (!item.beforeRow) return failed('Phiếu chỉnh sửa cũ này không lưu đầy đủ giá trị gốc của dòng bị xóa, vui lòng tạo lại phiếu chỉnh sửa.');
      if (JSON.stringify([headers.map(cell => String(cell ?? '')), sheet.content[index]]) !== item.beforeRow)
        return failed('Dòng này hoặc tiêu đề bảng đã thay đổi trước khi xác nhận, chưa xóa. Vui lòng tạo lại phiếu chỉnh sửa.');
      return await database.deleteRow(item.table, index) ? done('Đã xóa') : failed('Cơ sở dữ liệu đã từ chối xóa (dòng này có thể đã bị khóa).');
    }
    if (item.kind === 'cell') {
      if (now(item.column) !== item.before) return failed(`Ô này đã thay đổi trước khi xác nhận (hiện tại là「${clip(now(item.column), 40)}」), chưa thay đổi.`);
      return await database.updateCell(item.table, index, item.column, item.after) ? done('Đã ghi') : failed('Cơ sở dữ liệu đã từ chối ghi (có thể đã bị khóa).');
    }
    if (item.kind === 'row') {
      const moved = item.changes.find(change => now(change.column) !== change.before);
      if (moved) return failed(`Cột「${moved.column}」đã thay đổi trước khi xác nhận, chưa thay đổi.`);
      return await database.updateRow(item.table, index, Object.fromEntries(item.changes.map(change => [change.column, change.after])))
        ? done('Đã ghi') : failed('Cơ sở dữ liệu đã từ chối ghi (có thể đã bị khóa).');
    }
    return failed('Không hiểu mục này, chưa thay đổi.');
  }
  async function apply(ticket, { character = '', onBackup } = {}) {
    if (!available()) return { ok: false, text: 'Không phát hiện cơ sở dữ liệu, chưa ghi.' };
    const captured = { chatKey: ticket.chatKey, revision, database: api() };
    let blocked = guard(captured);
    if (blocked) return failed(blocked);
    const items = executionOrder(ticket.items);
    if (!items.length) return { ok: false, text: 'Vẫn chưa tick chọn những chỗ cần sửa.' };
    const database = api();
    let presetBefore = '';
    try { presetBefore = String(database.getCurrentPlotPreset?.() ?? ''); } catch { /* Chỉ ảnh hưởng khi cần chuyển lại preset lúc hoàn tác */ }
    let backupId = '';
    try { backupId = await backups.put({ chatKey: captured.chatKey, character, tables: JSON.stringify(database.exportTableAsJson() || {}), presetBefore }); }
    catch { backupId = ''; }
    if (!backupId) return { ok: false, text: 'Sao lưu không thành công, để an toàn nên chưa ghi.' };
    // Giao mã sao lưu cho bên gọi lưu trước: phòng trường hợp trang bị đóng giữa chừng, sau này vẫn có thể tìm thấy bản sao lưu để hoàn tác hoặc tải xuống.
    onBackup?.(backupId);
    const results = [];
    for (const item of items) {
      // Kiểm tra lại sau mỗi lần chờ kết thúc và trước khi ghi mục tiếp theo; hoàn tác cưỡng chế cũng không thể bỏ qua quyền sở hữu và trạng thái bận.
      blocked ||= guard(captured);
      let outcome;
      try { outcome = blocked ? failed(blocked) : await applyOne(database, item); } catch (error) { outcome = failed(`Đã xảy ra lỗi: ${clip(error?.message || error, 120)}`); }
      results.push({ id: item.id, ...outcome });
    }
    const written = results.filter(result => result.ok).length;
    let digest = '';
    try { if (isCurrent(captured) && database === api()) digest = digestTables(database.exportTableAsJson()); } catch { /* Khi không có digest thì trước khi hoàn tác đều phải xác nhận lại */ }
    return { ok: written > 0, results, backupId, digest, durable: backups.durable,
      presetChanged: results.some(result => result.ok && items.find(item => item.id === result.id)?.kind === 'preset'),
      text: written ? `Đã ghi ${written} vị trí${written < results.length ? `，${results.length - written} vị trí chưa ghi được` : ''}。${blocked}` : blocked || 'Chưa ghi được vị trí nào.' };
  }
  async function undo(ticket, { force = false } = {}) {
    if (!available()) return { ok: false, text: 'Không phát hiện cơ sở dữ liệu, không thể hoàn tác.' };
    const captured = { chatKey: ticket.chatKey, revision, database: api() };
    let blocked = guard(captured);
    if (blocked) return failed(blocked);
    const record = await backups.get(ticket.backupId);
    blocked = guard(captured);
    if (blocked) return failed(blocked);
    if (!record?.tables) return { ok: false, text: 'Không tìm thấy bản sao lưu lần này (trang đã được làm mới và trình duyệt không thể lưu lại bản sao lưu).' };
    if (record.chatKey !== captured.chatKey) return failed('Bản sao lưu không thuộc về cuộc trò chuyện của phiếu chỉnh sửa này, chưa khôi phục.');
    if (!force && !ticket.digest) return { ok: false, confirm: true, text: 'Kết quả ghi lần trước không được ghi lại đầy đủ, không thể xác nhận bảng sau đó có thay đổi hay không. Hoàn tác sẽ khôi phục toàn bộ bảng biểu về trước khi ghi.' };
    if (!force && digestTables(captured.database.exportTableAsJson()) !== ticket.digest)
      return { ok: false, confirm: true, text: 'Sau khi ghi, bảng biểu lại có thay đổi (có thể do cơ sở dữ liệu tự động điền bảng). Hoàn tác sẽ đưa những thay đổi này trở về trước khi ghi.' };
    blocked = guard(captured);
    if (blocked) return failed(blocked);
    if (!await captured.database.importTableAsJson(record.tables)) return { ok: false, text: 'Cơ sở dữ liệu không chấp nhận khôi phục, bảng biểu không có thay đổi. Có thể tải xuống bản sao lưu và nhập thủ công trong cơ sở dữ liệu.' };
    let tail = '';
    if (ticket.presetChanged) {
      blocked = guard(captured);
      try { tail = blocked ? `，preset chưa được khôi phục: ${blocked.replace(/。$/, '')}` : await captured.database.switchPlotPreset?.(record.presetBefore ?? '') ? '，preset thúc đẩy cốt truyện cũng đã được chuyển lại' : '，nhưng preset thúc đẩy cốt truyện không thể chuyển lại'; }
      catch { tail = '，nhưng preset thúc đẩy cốt truyện không thể chuyển lại'; }
    }
    return { ok: true, text: `Đã khôi phục bảng biểu về trước khi ghi${tail}。` };
  }
  return { available, snapshot, isCurrent, invalidate: () => { revision++; },
    apply: (ticket, options) => exclusive(() => apply(ticket, options)),
    undo: (ticket, options) => exclusive(() => undo(ticket, options)),
    chatKey, backup: id => backups.get(id), get durable() { return backups.durable; } };
}