export const PROTOCOL = 'acu-companion/v1';
export const COMFORT_RELEASE_MS = 12000;
const KINDS = new Set(['info', 'success', 'warning', 'error']);
const text = value => typeof value === 'string' ? value.slice(0, 600) : '';

export function normalizeSnapshot(value) {
  if (!value || value.protocol !== PROTOCOL || !Array.isArray(value.tasks) || !Array.isArray(value.notices)) return null;
  return {
    protocol: PROTOCOL, connected: value.connected === true, busy: value.busy === true,
    silent: value.silent === true, activityKnown: value.activityKnown !== false, version: Number(value.version) || 0,
    activeTaskId: value.activeTaskId === undefined ? text(value.tasks.find(task => task.busy)?.id) : text(value.activeTaskId),
    tasks: value.tasks.slice(0, 100).map(item => ({ id: text(item.id), feature: text(item.feature),
      detail: typeof item.detail === 'string' ? item.detail : '', kind: KINDS.has(item.kind) ? item.kind : 'info', busy: item.busy === true,
      dismissible: item.dismissible === true,
      action: item.action && typeof item.action.run === 'function' ? {
        label: text(item.action.label || 'Dừng'),
        variant: item.action.variant === 'danger' ? 'danger' : 'default',
        run: item.action.run,
      } : null })),
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
    this.tapTimes = [];
    this.sequence = null;
    this.comforting = false;
    this.lastInteraction = '';
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
    if (next.busy) { this.idle = null; this.resetInteraction(); }
    for (const notice of next.notices) {
      if (!notice.id || this.seen.has(notice.id)) continue;
      this.seen.add(notice.id);
      this.history.unshift(notice);
      this.history = this.history.slice(0, 20);
      if (['error', 'warning', 'success'].includes(notice.kind)) this.resetInteraction();
      if (notice.kind === 'error' || notice.kind === 'warning') this.reaction = { pose: 'error', until: this.now() + 5000, source: 'database' };
      else if (notice.kind === 'success') this.reaction = { pose: 'complete', until: this.now() + 3500, source: 'database' };
    }
    while (this.seen.size > 200) this.seen.delete(this.seen.values().next().value);
    return true;
  }
  pose() {
    if (this.reaction && this.reaction.until > this.now()) return this.reaction.pose;
    if (this.snapshot.busy) return 'writing';
    const step = this.sequence?.find(step => step.until > this.now());
    if (step) return step.pose;
    return this.idle && this.idle.until > this.now() ? this.idle.pose : 'idle';
  }
  canInteract() {
    return !this.snapshot.busy && !(this.reaction?.until > this.now() && this.reaction.source === 'database');
  }
  resetInteraction() {
    this.tapTimes = []; this.sequence = null; this.comforting = false;
    this.lastInteraction = '';
  }
  tap() {
    if (!this.canInteract()) { this.tapTimes = []; return false; }
    if (this.sequence?.some(step => step.until > this.now())) return false;
    const now = this.now();
    this.tapTimes = [...this.tapTimes.filter(time => now - time < 2600), now];
    const recent = this.tapTimes.filter(time => now - time < 1200).length;
    this.idle = null; this.comforting = false; this.sequence = null;
    if (this.tapTimes.length >= 6) {
      this.tapTimes = [];
      this.reaction = null;
      this.sequence = [{ pose: 'peek', until: now + 900 }, { pose: 'duck', until: now + 2400 }, { pose: 'wave', until: now + 3900 }];
      return this.lastInteraction = 'playful';
    }
    const [pose, duration, action] = recent >= 3 ? ['peek', 1600, 'bashful'] : recent === 2 ? ['duck', 2400, 'duck'] : ['wave', 1600, 'greet'];
    this.reaction = { pose, until: now + duration, source: 'local' };
    return this.lastInteraction = action;
  }
  startComfort() {
    this.tapTimes = [];
    if (!this.canInteract()) return false;
    this.sequence = null; this.idle = null; this.comforting = true;
    this.reaction = { pose: 'rest', until: Infinity, source: 'local' };
    this.lastInteraction = 'comfort';
    return true;
  }
  endComfort() {
    if (!this.comforting) return;
    this.comforting = false;
    if (this.reaction?.source === 'local' && this.reaction.pose === 'rest') this.reaction.until = this.now() + COMFORT_RELEASE_MS;
  }
  leisure(pose) {
    if (!['tea', 'reading', 'origami', 'duck', 'stretch', 'rest', 'wave', 'peek'].includes(pose) || !this.canInteract() || this.comforting || this.sequence?.some(step => step.until > this.now())) return false;
    this.reaction = null;
    this.idle = { pose, until: this.now() + (pose === 'wave' || pose === 'peek' ? 2000 : 10000) };
    return true;
  }
  interruptLocal() {
    this.resetInteraction();
    this.idle = null;
    if (this.reaction?.source === 'local') this.reaction = null;
  }
  gift() {
    if (!this.canInteract()) return false;
    this.resetInteraction();
    this.reaction = { pose: 'gift', until: this.now() + 3500, source: 'local' };
    return true;
  }
}

