// Một click mở một bảng (panel) chỉ định của cơ sở dữ liệu. Mở cơ sở dữ liệu qua AutoCardUpdaterAPI công khai của nó;
// Nhảy đến bảng chỉ định cần gọi thao tác chuyển trang trong giao diện của nó (tương đương với việc nhấp vào thanh bên của nó), chỉ đổi trang, không đọc/ghi bảng biểu, không đụng đến nhiệm vụ.
// Khi không tìm thấy thao tác chuyển trang thì lùi về nhấp thanh bên, nếu vẫn không được thì chỉ mở cơ sở dữ liệu.
export const DATABASE_PAGES = Object.freeze([
  { id: 'dashboard', label: 'Bảng điều khiển', icon: 'gauge' },
  { id: 'form-fill', label: 'Bàn làm việc điền bảng', icon: 'table' },
  { id: 'plot', label: 'Thúc đẩy cốt truyện', icon: 'compass' },
  { id: 'data-mgmt', label: 'Quản lý dữ liệu', icon: 'archive' },
  { id: 'api', label: 'API', icon: 'plug' },
  { id: 'visualizer', label: 'Xem bảng biểu', icon: 'grid' },
]);
const TITLES = { dashboard: 'Bảng điều khiển', 'form-fill': 'Bàn làm việc điền bảng', plot: 'Thúc đẩy cốt truyện', 'data-mgmt': 'Quản lý dữ liệu', api: 'API', 'advanced-tools': 'Công cụ nâng cao' };

// Khi báo lỗi, "Đi xem" nên chuyển đến đâu: Các vấn đề liên quan đến API thì tới bảng API, các lỗi còn lại tới Công cụ nâng cao (nhật ký chạy).
export function pageForNotice(text) {
  return /API|api|key|khoá|khóa|401|403|429|quota|hạn mức|số dư|model|mô hình|timeout|hết giờ|mạng|kết nối|network|proxy/i.test(String(text || '')) ? 'api' : 'advanced-tools';
}

function routerStore(doc) {
  const app = doc.getElementById('acu-app-v2')?.__vue_app__;
  const pinia = app?.config?.globalProperties?.$pinia;
  const store = pinia?._s?.get?.('acu-v2-router');
  return store && typeof store.setActivePage === 'function' ? store : null;
}

function clickMenuItem(host, doc) {
  const item = doc.getElementById('acu-v2-menu-item') || doc.getElementById('shujuku_v120-menu-item')
    || [...doc.querySelectorAll('#extensionsMenu .list-group-item')].find(node => node.querySelector('.fa-database') && /Cơ sở dữ liệu|Database/i.test(node.textContent || ''));
  if (!(item instanceof host.HTMLElement)) return false;
  item.click();
  return true;
}

const wait = (host, ms) => new Promise(resolve => host.setTimeout(resolve, ms));

async function openApp(host, doc) {
  const api = host.AutoCardUpdaterAPI;
  if (typeof api?.openSettings === 'function') {
    try { if (await api.openSettings() !== false) return true; } catch { /* lùi về điểm đầu vào menu */ }
  }
  return clickMenuItem(host, doc);
}

// Trả về { ok, exact, reason }: exact thể hiện việc đã dừng đúng ở bảng mục tiêu.
export async function openDatabasePage(host, pageId = 'dashboard') {
  const doc = host.document;
  const api = host.AutoCardUpdaterAPI;
  if (pageId === 'visualizer') {
    if (typeof api?.openVisualizer === 'function') {
      try { if (await api.openVisualizer() !== false) return { ok: true, exact: true }; } catch { /* báo cáo bên dưới */ }
    }
    return (await openApp(host, doc)) ? { ok: true, exact: false, reason: 'Cơ sở dữ liệu hiện tại không cung cấp điểm đầu vào bảng biểu trực quan, đã mở cơ sở dữ liệu.' }
      : { ok: false, exact: false, reason: 'Không tìm thấy điểm đầu vào cơ sở dữ liệu, vui lòng bật cơ sở dữ liệu trước.' };
  }
  if (!(await openApp(host, doc))) return { ok: false, exact: false, reason: 'Không tìm thấy điểm đầu vào cơ sở dữ liệu, vui lòng bật cơ sở dữ liệu trước.' };
  if (pageId === 'dashboard' && !routerStore(doc)) return { ok: true, exact: false };
  for (let attempt = 0; attempt < 20; attempt++) {
    const store = routerStore(doc);
    if (store) {
      const visible = Array.isArray(store.visiblePages) ? store.visiblePages.some(page => page.id === pageId) : true;
      if (!visible) return { ok: true, exact: false, reason: `「${TITLES[pageId] || pageId}」không hiển thị trong cấp độ tính năng của cơ sở dữ liệu hiện tại, đã mở cơ sở dữ liệu.` };
      store.setActivePage(pageId);
      if (store.activePageId === pageId) return { ok: true, exact: true };
      break;
    }
    await wait(host, 50);
  }
  const title = TITLES[pageId];
  const button = title && [...(doc.getElementById('acu-app-v2')?.querySelectorAll('button, [role="tab"], a') || [])]
    .find(node => (node.textContent || '').trim() === title);
  if (button) { button.click(); return { ok: true, exact: true }; }
  return { ok: true, exact: false, reason: 'Đã mở cơ sở dữ liệu, nhưng không thể tự động chuyển đến bảng tương ứng.' };
}