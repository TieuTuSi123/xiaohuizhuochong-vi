// Mở nhanh một bảng của cơ sở dữ liệu. Việc mở cơ sở dữ liệu sẽ thông qua AutoCardUpdaterAPI public của nó;
// Để nhảy đến bảng chỉ định, cần gọi thao tác chuyển trang trong giao diện của nó (tương đương với việc nhấp vào thanh bên của nó), chỉ chuyển trang, không đọc ghi bảng biểu, không đụng đến nhiệm vụ.
// Khi không tìm thấy thao tác chuyển trang thì lùi về thao tác nhấp thanh bên, nếu vẫn không được thì chỉ mở cơ sở dữ liệu.
export const DATABASE_PAGES = Object.freeze([
  { id: 'dashboard', label: 'Bảng điều khiển', icon: 'gauge' },
  { id: 'form-fill', label: 'Bàn làm việc điền bảng', icon: 'table' },
  { id: 'plot', label: 'Thúc đẩy cốt truyện', icon: 'compass' },
  { id: 'data-mgmt', label: 'Quản lý dữ liệu', icon: 'archive' },
  { id: 'api', label: 'API', icon: 'plug' },
  { id: 'visualizer', label: 'Xem bảng biểu', icon: 'grid' },
]);

// CẢNH BÁO KỸ THUẬT: Các chuỗi dưới đây được dùng để tìm nút bấm DOM. Phải khớp chính xác với chữ trên giao diện cơ sở dữ liệu.
const TITLES = { dashboard: 'Bảng điều khiển', 'form-fill': 'Bàn làm việc điền bảng', plot: 'Thúc đẩy cốt truyện', 'data-mgmt': 'Quản lý dữ liệu', api: 'API', 'advanced-tools': 'Công cụ nâng cao' };

// Khi báo lỗi thì nút "Đi xem" nên chuyển đến đâu: Các vấn đề về API thì đến bảng API, còn lại thì đến Công cụ nâng cao (nhật ký chạy).
export function pageForNotice(text) {
  return /API|api|khóa|key|401|403|429|hạn mức|số dư|model|quá giờ|timeout|mạng|kết nối|proxy/.test(String(text || '')) ? 'api' : 'advanced-tools';
}

function routerStore(doc) {
  const app = doc.getElementById('acu-app-v2')?.__vue_app__;
  const pinia = app?.config?.globalProperties?.$pinia;
  const store = pinia?._s?.get?.('acu-v2-router');
  return store && typeof store.setActivePage === 'function' ? store : null;
}

function clickMenuItem(host, doc) {
  const item = doc.getElementById('acu-v2-menu-item') || doc.getElementById('shujuku_v120-menu-item')
    || [...doc.querySelectorAll('#extensionsMenu .list-group-item')].find(node => node.querySelector('.fa-database') && /Cơ sở dữ liệu/.test(node.textContent || '')); // Từ khóa DOM
  if (!(item instanceof host.HTMLElement)) return false;
  item.click();
  return true;
}

const wait = (host, ms) => new Promise(resolve => host.setTimeout(resolve, ms));

async function openApp(host, doc) {
  const api = host.AutoCardUpdaterAPI;
  if (typeof api?.openSettings === 'function') {
    try { if (await api.openSettings() !== false) return true; } catch { /* lùi về điểm đầu vào trên menu */ }
  }
  return clickMenuItem(host, doc);
}

// Trả về { ok, exact, reason }: exact biểu thị đã dừng ở bảng mục tiêu.
export async function openDatabasePage(host, pageId = 'dashboard') {
  const doc = host.document;
  const api = host.AutoCardUpdaterAPI;
  if (pageId === 'visualizer') {
    if (typeof api?.openVisualizer === 'function') {
      try { if (await api.openVisualizer() !== false) return { ok: true, exact: true }; } catch { /* report below */ }
    }
    return (await openApp(host, doc)) ? { ok: true, exact: false, reason: 'Cơ sở dữ liệu hiện tại không cung cấp điểm đầu vào cho bảng biểu trực quan, đã mở cơ sở dữ liệu.' }
      : { ok: false, exact: false, reason: 'Không tìm thấy điểm đầu vào của cơ sở dữ liệu, vui lòng bật cơ sở dữ liệu trước.' };
  }
  if (!(await openApp(host, doc))) return { ok: false, exact: false, reason: 'Không tìm thấy điểm đầu vào của cơ sở dữ liệu, vui lòng bật cơ sở dữ liệu trước.' };
  if (pageId === 'dashboard' && !routerStore(doc)) return { ok: true, exact: false };
  for (let attempt = 0; attempt < 20; attempt++) {
    const store = routerStore(doc);
    if (store) {
      const visible = Array.isArray(store.visiblePages) ? store.visiblePages.some(page => page.id === pageId) : true;
      if (!visible) return { ok: true, exact: false, reason: `Bảng "${TITLES[pageId] || pageId}" không hiển thị trong các tính năng của cơ sở dữ liệu hiện tại, đã mở cơ sở dữ liệu.` };
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
  return { ok: true, exact: false, reason: 'Đã mở cơ sở dữ liệu, nhưng không thể tự động nhảy đến bảng tương ứng.' };
}
