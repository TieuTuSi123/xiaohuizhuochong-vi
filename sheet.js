// Hình dáng cửa sổ: Trên máy tính là một cửa sổ nổi có thể kéo thả; trên điện thoại (độ rộng khả dụng < 640) là một bảng điều khiển được kéo lên từ dưới cùng, nhấn giữ phần đầu rồi kéo xuống dưới để đóng.
export const MOBILE_WIDTH = 640;
const INTERACTIVE = 'button, input, textarea, select, a, label, [role="tab"], [contenteditable="true"]';

export function viewport(host) {
  const view = host.visualViewport;
  return { left: view?.offsetLeft || 0, top: view?.offsetTop || 0, width: view?.width || host.innerWidth, height: view?.height || host.innerHeight };
}

export function createSheet(host, root, { grip = null, drag = [], desktop = null, onDismiss = () => {} } = {}) {
  const listeners = [];
  let position = null, moving = null, pulling = null, destroyed = false;
  const listen = (target, type, callback, options) => { target.addEventListener(type, callback, options); listeners.push(() => target.removeEventListener(type, callback, options)); };
  const isSheet = () => viewport(host).width < MOBILE_WIDTH;
  function layout() {
    if (destroyed || root.hidden) return;
    const view = viewport(host);
    const sheet = view.width < MOBILE_WIDTH;
    root.classList.toggle('pet-sheet', sheet);
    if (sheet) {
      const height = Math.round(Math.max(240, Math.min(view.height - 12, view.height * .86)));
      Object.assign(root.style, { width: `${view.width}px`, height: `${height}px`, maxHeight: '', left: `${view.left}px`, top: `${view.top + view.height - height}px` });
      return;
    }
    if (!desktop) { root.style.width = ''; root.style.height = ''; return; }
    const { width, height, align = 'center' } = desktop();
    const w = Math.min(width, Math.max(160, view.width - 20)), h = Math.min(height, Math.max(160, view.height - 20));
    const x = position ? position.x : align === 'right' ? view.left + view.width - w - 10 : view.left + (view.width - w) / 2;
    const y = position ? position.y : view.top + Math.max(10, (view.height - h) / 2);
    Object.assign(root.style, { width: `${w}px`, height: `${h}px`,
      left: `${Math.max(view.left + 10, Math.min(view.left + view.width - w - 10, x))}px`,
      top: `${Math.max(view.top + 10, Math.min(view.top + view.height - h - 10, y))}px` });
  }
  function down(event) {
    if (event.button !== 0 || event.target.closest?.(INTERACTIVE)) return;
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
    destroy() { destroyed = true; for (const remove of listeners) remove(); listeners.length = 0; },
  };
}

// Phát hoạt ảnh rời đi trước khi đóng (nếu bật chế độ giảm chuyển động thì sẽ đóng ngay lập tức).
export function leave(host, root, done) {
  const reduced = host.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  if (reduced || root.hidden || typeof root.animate !== 'function') { done(); return; }
  root.classList.add('is-leaving');
  let finished = false;
  const finish = () => { if (finished) return; finished = true; host.clearTimeout(timer); root.removeEventListener('animationend', finish); root.classList.remove('is-leaving'); done(); };
  const timer = host.setTimeout(finish, 220);
  root.addEventListener('animationend', finish);
}
