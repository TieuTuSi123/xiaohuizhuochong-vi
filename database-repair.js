// 检修模式的写入：只调用数据库公开的 AutoCardUpdaterAPI，只执行用户勾选并确认的条目。
// 写之前先整份导出表格做备份；撤销就是把备份原样导回去（数据库会把它当作一次新的保存）。
// 剧情推进预设只做“切换”：数据库的导入预设接口会顺带把当前聊天切到 LLM 召回模式，
// 公开接口又没有删除预设或改回模式的方法，写了就撤销不了，所以不做。
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
    try { presets = (database.getPlotPresetNames?.() || []).map(String); } catch { /* 预设读不到时只是不能切换 */ }
    try { current = String(database.getCurrentPlotPreset?.() ?? ''); } catch { /* 同上 */ }
    return { data: tables(), presets, current, chatKey: chatKey() };
  }
  const done = text => ({ ok: true, text });
  const failed = text => ({ ok: false, text });
  async function applyOne(database, item) {
    if (item.kind === 'preset') return await database.switchPlotPreset?.(item.after) ? done('已切换') : failed('数据库没有切换成功。');
    if (item.kind === 'refill') {
      if (typeof database.manualUpdate !== 'function') return failed('这个版本的数据库没有提供重新填表的接口。');
      return await database.manualUpdate() === false ? failed('数据库没有完成这次填表，可以在数据库里查看原因。') : done('数据库已重新填表');
    }
    const data = tables();
    const sheet = data[item.sheetKey];
    if (!sheet || String(sheet.name) !== item.table) return failed('这张表已经找不到了。');
    if (item.kind === 'insert') {
      const index = await database.insertRow(item.table, Object.fromEntries(item.values.map(value => [value.column, value.after])));
      return Number(index) > 0 ? done(`已加在第 ${index} 行`) : failed('数据库没有接受这一行。');
    }
    const index = locateRow(data, item.sheetKey, item.rowId);
    if (index < 0) return failed('这一行已经不在了，没有改。');
    const headers = sheet.content[0];
    const now = column => String(sheet.content[index][headers.indexOf(column)] ?? '');
    if (item.kind === 'delete') return await database.deleteRow(item.table, index) ? done('已删除') : failed('数据库拒绝了删除（这一行可能被锁定）。');
    if (item.kind === 'cell') {
      if (now(item.column) !== item.before) return failed(`确认前这一格已经变了（现在是「${clip(now(item.column), 40)}」），没有改。`);
      return await database.updateCell(item.table, index, item.column, item.after) ? done('已写入') : failed('数据库拒绝了写入（可能被锁定）。');
    }
    if (item.kind === 'row') {
      const moved = item.changes.find(change => now(change.column) !== change.before);
      if (moved) return failed(`确认前「${moved.column}」已经变了，没有改。`);
      return await database.updateRow(item.table, index, Object.fromEntries(item.changes.map(change => [change.column, change.after])))
        ? done('已写入') : failed('数据库拒绝了写入（可能被锁定）。');
    }
    return failed('看不懂这一条，没有改。');
  }
  async function apply(ticket, { character = '', onBackup } = {}) {
    if (!available()) return { ok: false, text: '没有检测到数据库，没有写入。' };
    if (ticket.chatKey && ticket.chatKey !== chatKey()) return { ok: false, text: '现在打开的不是提出这张修改单时的聊天，没有写入。' };
    const items = executionOrder(ticket.items);
    if (!items.length) return { ok: false, text: '还没有勾选要改的地方。' };
    const database = api();
    let presetBefore = '';
    try { presetBefore = String(database.getCurrentPlotPreset?.() ?? ''); } catch { /* 只影响撤销时切回预设 */ }
    let backupId = '';
    try { backupId = await backups.put({ chatKey: chatKey(), character, tables: JSON.stringify(database.exportTableAsJson() || {}), presetBefore }); }
    catch { backupId = ''; }
    if (!backupId) return { ok: false, text: '备份没有成功，为了安全没有写入。' };
    // 先把备份编号交给调用方存好：万一写到一半页面被关掉，之后仍能找到备份撤销或下载。
    onBackup?.(backupId);
    const results = [];
    for (const item of items) {
      let outcome;
      try { outcome = await applyOne(database, item); } catch (error) { outcome = failed(`出错了：${clip(error?.message || error, 120)}`); }
      results.push({ id: item.id, ...outcome });
    }
    const written = results.filter(result => result.ok).length;
    let digest = '';
    try { digest = digestTables(database.exportTableAsJson()); } catch { /* 没有指纹时撤销前一律再确认 */ }
    return { ok: written > 0, results, backupId, digest, durable: backups.durable,
      presetChanged: results.some(result => result.ok && items.find(item => item.id === result.id)?.kind === 'preset'),
      text: written ? `已写入 ${written} 处${written < results.length ? `，${results.length - written} 处没写进去` : ''}。` : '一处都没有写进去，表格没有变化。' };
  }
  async function undo(ticket, { force = false } = {}) {
    if (!available()) return { ok: false, text: '没有检测到数据库，没法撤销。' };
    if (ticket.chatKey && ticket.chatKey !== chatKey()) return { ok: false, text: '现在打开的不是这张修改单所在的聊天。切回那个聊天后再撤销。' };
    const record = await backups.get(ticket.backupId);
    if (!record?.tables) return { ok: false, text: '找不到这次的备份了（页面刷新过，而且浏览器没能把备份存下来）。' };
    if (!force && !ticket.digest) return { ok: false, confirm: true, text: '上次写入的结果没有记录完整，没法确认表格之后有没有变过。撤销会把整份表格恢复到写入前。' };
    if (!force && digestTables(api().exportTableAsJson()) !== ticket.digest)
      return { ok: false, confirm: true, text: '写入之后表格又有变化（可能是数据库自己填了表）。撤销会把这些变化一起退回到写入前。' };
    if (!await api().importTableAsJson(record.tables)) return { ok: false, text: '数据库没有接受恢复，表格没有变化。可以下载备份，在数据库里手动导入。' };
    let tail = '';
    if (ticket.presetChanged) {
      try { tail = await api().switchPlotPreset?.(record.presetBefore ?? '') ? '，剧情推进预设也切回去了' : '，但剧情推进预设没能切回去'; }
      catch { tail = '，但剧情推进预设没能切回去'; }
    }
    return { ok: true, text: `已恢复到写入前的表格${tail}。` };
  }
  return { available, snapshot, apply, undo, chatKey, backup: id => backups.get(id), get durable() { return backups.durable; } };
}
