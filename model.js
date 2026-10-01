export const PROTOCOL = 'acu-companion/v1';
const KINDS = new Set(['info', 'success', 'warning', 'error']);
const text = value => typeof value === 'string' ? value.slice(0, 600) : '';

export function normalizeSnapshot(value) {
  if (!value || value.protocol !== PROTOCOL || !Array.isArray(value.tasks) || !Array.isArray(value.notices)) return null;
  return {
    protocol: PROTOCOL, connected: value.connected === true, busy: value.busy === true,
    silent: value.silent === true, activityKnown: value.activityKnown !== false, version: Number(value.version) || 0,
    tasks: value.tasks.slice(0, 100).map(item => ({ id: text(item.id), feature: text(item.feature),
      detail: text(item.detail), kind: KINDS.has(item.kind) ? item.kind : 'info', busy: item.busy === true })),
    notices: value.notices.slice(0, 20).map(item => ({ id: text(item.id), title: text(item.title),
      text: text(item.text), kind: KINDS.has(item.kind) ? item.kind : 'info', createdAt: Number(item.createdAt) || 0 })),
  };
}

export class CompanionModel {
  constructor(now = () => Date.now()) {
    this.now = now;
    this.snapshot = { connected: false, busy: false, silent: false, tasks: [], notices: [] };
    this.seen = new Set();
    this.history = [];
    this.reaction = null;
    this.idle = null;
  }
  ingest(raw) {
    const next = normalizeSnapshot(raw);
    if (!next) return false;
    const previous = this.snapshot;
    this.snapshot = next;
    if (!next.connected) {
      if (this.reaction?.source === 'database') this.reaction = null;
      return true;
    }
    const added = next.tasks.filter(task => task.busy && !previous.tasks.some(old => old.id === task.id));
    if (added.length || (next.busy && !previous.busy)) { this.reaction = { pose: 'received', until: this.now() + 1400, source: 'database' }; this.idle = null; }
    if (next.busy) this.idle = null;
    for (const notice of next.notices) {
      if (!notice.id || this.seen.has(notice.id)) continue;
      this.seen.add(notice.id);
      this.history.unshift(notice);
      this.history = this.history.slice(0, 20);
      if (notice.kind === 'error' || notice.kind === 'warning') this.reaction = { pose: 'error', until: this.now() + 5000, source: 'database' };
      else if (notice.kind === 'success') this.reaction = { pose: 'complete', until: this.now() + 3500, source: 'database' };
    }
    while (this.seen.size > 200) this.seen.delete(this.seen.values().next().value);
    return true;
  }
  pose() {
    if (this.reaction && this.reaction.until > this.now()) return this.reaction.pose;
    if (this.snapshot.busy) return 'writing';
    return this.idle && this.idle.until > this.now() ? this.idle.pose : 'idle';
  }
  leisure(pose) {
    if (!['tea', 'reading', 'origami', 'duck', 'stretch', 'rest', 'wave', 'peek'].includes(pose) || this.snapshot.busy || (this.reaction?.until > this.now() && this.reaction.source === 'database')) return false;
    this.reaction = null;
    this.idle = { pose, until: this.now() + (pose === 'wave' || pose === 'peek' ? 2000 : 10000) };
    return true;
  }
  interruptLocal() {
    this.idle = null;
    if (this.reaction?.source === 'local') this.reaction = null;
  }
  gift() {
    if (this.snapshot.busy || (this.reaction?.until > this.now() && this.reaction.source === 'database')) return false;
    this.reaction = { pose: 'gift', until: this.now() + 3500, source: 'local' };
    return true;
  }
}
