const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

// Các vị trí được tính toán dưới dạng tỷ lệ bên trong khung nhìn (viewport) khả dụng, nhờ đó chúng vẫn an toàn khi xoay màn hình hoặc bật bàn phím ảo.
export function readBounds(host, doc, preferredSize) {
  const view = host.visualViewport;
  const width = view?.width || host.innerWidth;
  const height = view?.height || host.innerHeight;
  const left = view?.offsetLeft || 0;
  const top = view?.offsetTop || 0;
  const size = Math.min(width <= 640 ? Math.min(preferredSize, 72) : preferredSize, width - 16, height - 16);
  const send = doc.getElementById('send_form')?.getBoundingClientRect();
  const inputVisible = send && send.width > 0 && send.height > 0 && send.bottom > top && send.top < top + height;
  const bottom = inputVisible && send.bottom >= top + height - 4 ? Math.max(top + size + 16, send.top - 12) : top + height - 12;
  return { width, height, left, top, size, minX: left + 8, maxX: Math.max(left + 8, left + width - size - 8),
    minY: top + 8, maxY: Math.max(top + 8, bottom - size), input: inputVisible ? send : null };
}

export function constrain(point, bounds, snap = false) {
  let x = clamp(point.x, bounds.minX, bounds.maxX);
  let y = clamp(point.y, bounds.minY, bounds.maxY);
  if (snap) {
    if (x - bounds.minX < 22) x = bounds.minX;
    else if (bounds.maxX - x < 22) x = bounds.maxX;
  }
  const input = bounds.input;
  if (input && x + bounds.size > input.left && x < input.right && y + bounds.size > input.top - 8 && y < input.bottom) {
    y = clamp(input.top - bounds.size - 12, bounds.minY, bounds.maxY);
  }
  return { x, y };
}

export function fromRatio(saved, bounds, side = 'right') {
  const valid = saved && Number.isFinite(saved.x) && Number.isFinite(saved.y);
  return constrain(valid ? {
    x: bounds.minX + clamp(saved.x, 0, 1) * (bounds.maxX - bounds.minX),
    y: bounds.minY + clamp(saved.y, 0, 1) * (bounds.maxY - bounds.minY),
  } : { x: side === 'left' ? bounds.minX + 4 : bounds.maxX - 4, y: bounds.maxY - 12 }, bounds);
}

export function toRatio(point, bounds) {
  return { x: clamp((point.x - bounds.minX) / Math.max(1, bounds.maxX - bounds.minX), 0, 1),
    y: clamp((point.y - bounds.minY) / Math.max(1, bounds.maxY - bounds.minY), 0, 1) };
}

// Chỉ thực hiện phân loại vị trí. Hàm này không bao giờ di chuyển pet hay lưu tọa độ mới.
export function dockEdge(point, bounds) {
  if (!point || !bounds) return null;
  const distances = [
    ['top', point.y - bounds.minY], ['bottom', bounds.maxY - point.y],
    ['left', point.x - bounds.minX], ['right', bounds.maxX - point.x],
  ].sort((a, b) => a[1] - b[1]);
  return distances[0][1] <= 16 ? distances[0][0] : null;
}
