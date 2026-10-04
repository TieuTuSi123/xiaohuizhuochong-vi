import { PROTOCOL } from './model.js';

const clean = value => typeof value === 'string' ? value.slice(0, 600) : '';
const tone = value => ['info', 'success', 'warning', 'error'].includes(value) ? value : 'info';

// Read the existing renderer's props. Never invoke its handlers or alter its data.
export function findComponent(root, name) {
  const queue = [root];
  const seen = new Set();
  let remaining = 1200;
  while (queue.length && remaining-- > 0) {
    const node = queue.shift();
    if (!node || typeof node !== 'object' || seen.has(node)) continue;
    seen.add(node);
    const component = node.component;
    if ((component?.type?.__name || node.type?.__name) === name) return component || node;
    if (component?.subTree) queue.push(component.subTree);
    if (Array.isArray(node.children)) queue.push(...node.children);
    if (Array.isArray(node.dynamicChildren)) queue.push(...node.dynamicChildren);
    if (node.ssContent) queue.push(node.ssContent);
  }
  return null;
}

export function readDatabaseView(doc) {
  const root = doc.getElementById('acu-app-v2');
  const tree = root?._vnode;
  if (!tree) return { connected: false, source: root ? 'unsupported-view' : 'waiting', busy: false, activityKnown: false, task: null, notice: null };
  const layer = findComponent(tree, 'DeskPetLayer');
  if (!layer?.subTree) return { connected: false, source: 'unsupported-view', busy: false, activityKnown: false, task: null, notice: null };
  const pet = findComponent(layer.subTree, 'DeskPet');
  const bubble = findComponent(layer.subTree, 'NoticeBubble');
  const petBusy = pet?.props?.busy;
  const props = bubble?.props;
  if (!props || !('slide' in props) || !('task' in props)) return { connected: false, source: 'unsupported-view', busy: false, activityKnown: false, task: null, notice: null };
  const current = props.task;
  const task = current && typeof current.id === 'string' ? {
    id: clean(current.id), feature: clean(current.feature), detail: typeof current.detail === 'string' ? current.detail : '',
    kind: tone(current.kind), busy: current.busy === true, dismissible: current.dismissible === true, action: current.action && typeof current.action.run === 'function' ? { label: clean(current.action.label || '停止'), variant: current.action.variant === 'danger' ? 'danger' : 'default', run: current.action.run } : null,
  } : null;
  const incoming = props.slide?.type === 'notice' ? props.slide.notice : null;
  const notice = incoming && typeof incoming.id === 'string' ? {
    id: clean(incoming.id), title: clean(incoming.title), text: clean(incoming.text),
    kind: tone(incoming.kind), createdAt: Number(incoming.createdAt) || 0,
  } : null;
  return {
    connected: true, source: 'database-view',
    busy: typeof petBusy === 'boolean' ? petBusy : task?.busy === true,
    activityKnown: typeof petBusy === 'boolean' || task?.busy === true,
    task, notice,
  };
}

export function createDatabaseObserver(host, { now = () => Date.now(), interval = 250 } = {}) {
  const subscribers = new Set();
  let snapshot = { protocol: PROTOCOL, connected: false, source: 'waiting', busy: false, activityKnown: false, activeTaskId: '', tasks: [], notices: [], silent: false, version: 0 };
  let signature = '';
  let destroyed = false;
  const observed = new Map();
  function sample() {
    if (destroyed) return;
    let view;
    try { view = readDatabaseView(host.document); }
    catch { view = { connected: false, source: 'unsupported-view', busy: false, activityKnown: false }; }
    if (!view.connected || !view.busy) observed.clear();
    if (view.task) observed.set(view.task.id, { task: view.task, seenAt: now() });
    for (const [id, record] of observed) if (now() - record.seenAt > 15000) observed.delete(id);
    // Only report tasks actually observed in the database's carousel, not a made-up total.
    const tasks = view.busy ? [...observed.values()].map(record => record.task).slice(-20) : view.task ? [view.task] : [];
    const next = { protocol: PROTOCOL, connected: view.connected, source: view.source,
      busy: view.busy, activityKnown: view.activityKnown, tasks,
      activeTaskId: view.busy && view.task?.busy ? view.task.id : '',
      notices: view.notice ? [view.notice] : [], silent: false };
    const key = JSON.stringify(next);
    // JSON omits functions. A new native stop handler must still reach the UI.
    const actionChanged = tasks.some((task, index) => task.action?.run !== snapshot.tasks[index]?.action?.run);
    if (key === signature && !actionChanged) return;
    signature = key;
    snapshot = { ...next, version: snapshot.version + 1 };
    for (const listener of subscribers) {
      try { listener(snapshot); } catch { /* isolate the companion UI */ }
    }
  }
  sample();
  const timer = host.setInterval(sample, interval);
  return {
    getSnapshot: () => snapshot,
    refresh() { sample(); return snapshot; },
    subscribe(listener) {
      if (typeof listener !== 'function' || destroyed) return () => {};
      subscribers.add(listener);
      try { listener(snapshot); } catch { /* isolate the companion UI */ }
      return () => subscribers.delete(listener);
    },
    destroy() { destroyed = true; host.clearInterval(timer); subscribers.clear(); observed.clear(); },
  };
}

