// 窗口外形：电脑上是可拖动的浮窗；手机（可见宽度 < 640）上是从底部拉起的面板，按住顶部往下拉即可关闭。
export const MOBILE_WIDTH = 640;
const INTERACTIVE = 'button, input, textarea, select, a, label, [role="tab"], [contenteditable="true"]';
const leaving = new WeakMap();
const cancelLeave = root => leaving.get(root)?.();

export function viewport(host) {
  const view = host.visualViewport;
  return { left: view?.offsetLeft || 0, top: view?.offsetTop || 0, width: view?.width || host.innerWidth, height: view?.height || host.innerHeight };
}

export function createSheet(host, root, { grip = null, drag = [], dragSelector = null, desktop = null, onDismiss = () => {} } = {}) {
  const listeners = [];
  let position = null, moving = null, pulling = null, destroyed = false;
  const listen = (target, type, callback, options) => { target.addEventListener(type, callback, options); listeners.push(() => target.removeEventListener(type, callback, options)); };
  const isSheet = () => viewport(host).width < MOBILE_WIDTH;
  function layout() {
    if (destroyed || root.hidden) return;
    // open() 已移除离场样式：撤销上一次关闭，防止旧回调把新打开的窗口关掉。
    if (!root.classList.contains('is-leaving')) cancelLeave(root);
    const view = viewport(host);
    const sheet = view.width < MOBILE_WIDTH;
    root.classList.toggle('pet-sheet', sheet);
    if (sheet) {
      const height = Math.round(Math.max(1, Math.min(view.height - 12, view.height * (view.height<480 ? 1 : .86))));
      Object.assign(root.style, { width: `${view.width}px`, height: `${height}px`, maxHeight: '', left: `${view.left}px`, top: `${view.top + view.height - height}px` });
      return;
    }
    if (!desktop) { root.style.width = ''; root.style.height = ''; return; }
    const { width, height, align = 'center', offset = 0 } = desktop();
    const w = Math.min(width, Math.max(160, view.width - 20)), h = Math.min(height, Math.max(160, view.height - 20));
    const columns=Math.max(1,Math.floor((view.width-20)/(w+12))), row=Math.floor(offset/columns)%4;
    const shift=(offset%columns)*(w+12)+row*24;
    const x = position ? position.x : align === 'right' ? view.left + view.width - w - 10 - shift : view.left + (view.width - w) / 2;
    const y = position ? position.y : view.top + Math.max(10, (view.height - h) / 2 - row*18);
    Object.assign(root.style, { width: `${w}px`, height: `${h}px`,
      left: `${Math.max(view.left + 10, Math.min(view.left + view.width - w - 10, x))}px`,
      top: `${Math.max(view.top + 10, Math.min(view.top + view.height - h - 10, y))}px` });
  }
  function down(event) {
    if (event.button !== 0 || event.target.closest?.(INTERACTIVE)) return;
    if (dragSelector && event.currentTarget !== grip && !event.target.closest?.(dragSelector)) return;
    const rect = root.getBoundingClientRect();
    if (isSheet()) pulling = { id: event.pointerId, y: event.clientY, at: event.timeStamp, height: rect.height, dy: 0 };
    else if (desktop) moving = { id: event.pointerId, x: event.clientX, y: event.clientY, left: rect.left, top: rect.top };
    else return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  }
  function move(event) {
    if (moving?.id === event.pointerId) {
      position = { x: moving.left + event.clientX - moving.x, y: moving.top + event.clientY - moving.y }; layout();
    } else if (pulling?.id === event.pointerId) {
      pulling.dy = Math.max(0, event.clientY - pulling.y);
      root.style.transition = 'none'; root.style.transform = `translateY(${pulling.dy}px)`;
    }
  }
  function up(event) {
    if (moving?.id === event.pointerId) moving = null;
    if (pulling?.id !== event.pointerId) return;
    const { dy, at, height } = pulling; pulling = null;
    const speed = dy / Math.max(1, event.timeStamp - at);
    root.style.transition = ''; root.style.transform = '';
    if (dy > Math.max(90, height * .22) || (dy > 24 && speed > .7)) onDismiss();
  }
  for (const target of [grip, ...drag].filter(Boolean)) {
    listen(target, 'pointerdown', down); listen(target, 'pointermove', move);
    listen(target, 'pointerup', up); listen(target, 'pointercancel', up);
  }
  listen(host, 'resize', layout);
  if (host.visualViewport) { listen(host.visualViewport, 'resize', layout); listen(host.visualViewport, 'scroll', layout); }
  return {
    layout, isSheet,
    resetPosition() { position = null; layout(); },
    destroy() { destroyed = true; cancelLeave(root); for (const remove of listeners) remove(); listeners.length = 0; },
  };
}

// 关闭前播放离场动画（减少动态效果时直接关闭）。
export function leave(host, root, done) {
  cancelLeave(root);
  const reduced = host.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  if (reduced || root.hidden || typeof root.animate !== 'function') { done(); return; }
  root.classList.add('is-leaving');
  let finished = false;
  const cleanup = () => { finished = true; host.clearTimeout(timer); root.removeEventListener('animationend', finish); leaving.delete(root); };
  const finish = event => { if (finished || (event && event.target !== root)) return; cleanup(); root.classList.remove('is-leaving'); done(); };
  const timer = host.setTimeout(finish, 220);
  leaving.set(root, cleanup);
  root.addEventListener('animationend', finish);
}
