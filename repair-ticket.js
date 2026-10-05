// 修改单卡片：只按单子的状态把它画出来。勾选、应用、撤销都用 data-action 交给聊天窗处理。
import { clip, pickable } from './repair.js';

const STAMPS = { open: '待你确认', applying: '写入中…', applied: '已写入', dismissed: '没有采用', undoing: '撤销中…', undone: '已撤销', interrupted: '结果未知' };

function where(item) {
  if (item.kind === 'preset') return ['剧情推进', '当前聊天的预设'];
  if (item.kind === 'refill') return ['数据库', '重新填一次表'];
  if (item.kind === 'unknown') return [item.label || '未知操作', ''];
  const place = item.kind === 'insert' ? '新增一行' : item.kind === 'delete' ? `删除第 ${item.row ?? '?'} 行`
    : [item.row ? `第 ${item.row} 行` : '', item.kind === 'cell' ? item.column : item.changes?.length ? `改 ${item.changes.length} 列` : ''].filter(Boolean).join(' · ');
  return [item.table || '（没写表名）', place];
}

export function ticketCounts(ticket) {
  const valid = ticket.items.filter(pickable);
  return { valid: valid.length, picked: valid.filter(item => item.picked).length };
}

// 勾选时只改按钮文字，不重画整段记录，键盘焦点留在勾选框上。
export function syncTicketActions(card, ticket, { dbBusy = false, pending = false } = {}) {
  const { valid, picked } = ticketCounts(ticket);
  const apply = card.querySelector('[data-action="ticket-apply"]');
  const all = card.querySelector('[data-action="ticket-all"]');
  if (apply) { apply.textContent = `应用所选（${picked} 处）`; apply.disabled = !picked || dbBusy || pending; }
  if (all) { all.textContent = valid && picked === valid ? '全不选' : '全选'; all.disabled = !valid || pending; }
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
  const value = (tag, text) => { const full = text === '' || text == null ? '（空）' : String(text); const element = node(tag, clip(full, 300)); element.title = full; return element; };
  const arrow = () => node('span', '→', 'erii-repair__arrow');
  const busy = pending || ['applying', 'undoing'].includes(ticket.state);
  const card = node('div', undefined, 'erii-repair__ticket');
  card.dataset.state = ticket.state;
  const head = node('div', undefined, 'erii-repair__head');
  head.append(node('strong', `修改单 · ${ticket.items.length} 处`), node('small', '写入前会自动备份整份表格'));
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
    // 核对没通过的条目没有可信的新旧值，只显示原因。
    if (item.kind === 'cell' ? item.after !== undefined : item.kind === 'preset' && Boolean(item.after))
      diff.append(value('del', item.kind === 'preset' ? item.before || '跟随全局设置' : item.before), arrow(), value('ins', item.after));
    else if (item.kind === 'row') for (const change of item.changes || []) {
      const line = node('span', undefined, 'erii-repair__change');
      line.append(node('b', change.column), value('del', change.before), arrow(), value('ins', change.after));
      diff.append(line);
    }
    else if (item.kind === 'insert') diff.append(value('ins', (item.values || []).map(entry => `${entry.column}：${entry.after}`).join(' · ')));
    else if (item.kind === 'delete') diff.append(value('del', item.preview || `第 ${item.row} 行`));
    else if (item.kind === 'refill') diff.append(node('span', '按数据库现在的设置重新填一次表。会调用你在数据库里配置的填表 API，和平时填表一样计费。'));
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
    actions.append(action('全选', 'ticket-all'), action('应用所选（0 处）', 'ticket-apply', 'erii-chat__send'), action('全部不要', 'ticket-dismiss'));
    card.append(actions);
    syncTicketActions(card, ticket, { dbBusy, pending: busy });
    if (dbBusy) card.append(node('p', '数据库正在处理任务，等它忙完再应用。', 'erii-repair__hint'));
    if (ticket.note) card.append(node('p', ticket.note, 'erii-repair__hint'));
    return card;
  }
  const receipt = node('div', undefined, 'erii-repair__receipt');
  receipt.dataset.state = ticket.state;
  const text = {
    applied: `${ticket.note || '已写入。'}写入前已备份${ticket.durable === false || !durable ? '（备份只在这次打开的页面里，建议先下载一份）' : ''}。`,
    undone: ticket.note || '已撤销。', dismissed: '没有采用这张修改单，表格没有变化。',
    interrupted: '上次写入或撤销时页面被关闭了，结果未知。可以在数据库里核对；需要的话用备份恢复。',
    applying: '正在按顺序写入…', undoing: '正在恢复备份…',
  }[ticket.state] || '';
  receipt.append(node('span', text));
  if (ticket.backupId && ['applied', 'interrupted'].includes(ticket.state) && !ticket.undoConfirm) {
    const undo = action('撤销', 'ticket-undo'); undo.disabled = busy; receipt.append(undo);
  }
  if (ticket.backupId && ['applied', 'undone', 'interrupted'].includes(ticket.state)) {
    const save = action('下载备份', 'ticket-download'); save.disabled = busy; receipt.append(save);
  }
  card.append(receipt);
  if (ticket.undoConfirm) {
    const confirm = node('div', undefined, 'erii-repair__confirm');
    const force = action('仍要撤销', 'ticket-undo-force'); force.disabled = busy;
    const keep = action('先不撤销', 'ticket-keep'); keep.disabled = busy;
    confirm.append(node('span', ticket.undoConfirm), force, keep);
    card.append(confirm);
  }
  return card;
}
