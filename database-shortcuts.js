// 一键打开数据库的某个版面。打开数据库走它公开的 AutoCardUpdaterAPI；
// 跳到指定版面要调用它界面里的切页动作（等同于点它的侧边栏），只换页面，不读写表格、不碰任务。
// 找不到切页动作时退回点侧边栏，再不行就只打开数据库。
export const DATABASE_PAGES = Object.freeze([
  { id: 'dashboard', label: '仪表盘', icon: 'gauge' },
  { id: 'form-fill', label: '填表工作台', icon: 'table' },
  { id: 'plot', label: '剧情推进', icon: 'compass' },
  { id: 'data-mgmt', label: '数据管理', icon: 'archive' },
  { id: 'api', label: 'API', icon: 'plug' },
  { id: 'visualizer', label: '看表格', icon: 'grid' },
]);
const TITLES = { dashboard: '仪表盘', 'form-fill': '填表工作台', plot: '剧情推进', 'data-mgmt': '数据管理', api: 'API', 'advanced-tools': '高级工具' };

// 报错时“去看看”该去哪：接口类问题去 API 版面，其余去高级工具（运行日志）。
export function pageForNotice(text) {
  return /API|api|密钥|key|401|403|429|额度|余额|模型|超时|timeout|网络|连接|代理/.test(String(text || '')) ? 'api' : 'advanced-tools';
}

function routerStore(doc) {
  const app = doc.getElementById('acu-app-v2')?.__vue_app__;
  const pinia = app?.config?.globalProperties?.$pinia;
  const store = pinia?._s?.get?.('acu-v2-router');
  return store && typeof store.setActivePage === 'function' ? store : null;
}

function clickMenuItem(host, doc) {
  const item = doc.getElementById('acu-v2-menu-item') || doc.getElementById('shujuku_v120-menu-item')
    || [...doc.querySelectorAll('#extensionsMenu .list-group-item')].find(node => node.querySelector('.fa-database') && /数据库/.test(node.textContent || ''));
  if (!(item instanceof host.HTMLElement)) return false;
  item.click();
  return true;
}

const wait = (host, ms) => new Promise(resolve => host.setTimeout(resolve, ms));

async function openApp(host, doc) {
  const api = host.AutoCardUpdaterAPI;
  if (typeof api?.openSettings === 'function') {
    try { if (await api.openSettings() !== false) return true; } catch { /* fall back to the menu entry */ }
  }
  return clickMenuItem(host, doc);
}

// 返回 { ok, exact, reason }：exact 表示已经停在目标版面。
export async function openDatabasePage(host, pageId = 'dashboard') {
  const doc = host.document;
  const api = host.AutoCardUpdaterAPI;
  if (pageId === 'visualizer') {
    if (typeof api?.openVisualizer === 'function') {
      try { if (await api.openVisualizer() !== false) return { ok: true, exact: true }; } catch { /* report below */ }
    }
    return (await openApp(host, doc)) ? { ok: true, exact: false, reason: '当前数据库没有提供可视化表格入口，已打开数据库。' }
      : { ok: false, exact: false, reason: '未找到数据库入口，请先启用数据库。' };
  }
  if (!(await openApp(host, doc))) return { ok: false, exact: false, reason: '未找到数据库入口，请先启用数据库。' };
  if (pageId === 'dashboard' && !routerStore(doc)) return { ok: true, exact: false };
  for (let attempt = 0; attempt < 20; attempt++) {
    const store = routerStore(doc);
    if (store) {
      const visible = Array.isArray(store.visiblePages) ? store.visiblePages.some(page => page.id === pageId) : true;
      if (!visible) return { ok: true, exact: false, reason: `「${TITLES[pageId] || pageId}」在当前数据库的功能档位里没有显示，已打开数据库。` };
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
  return { ok: true, exact: false, reason: '已打开数据库，但没能自动跳到对应版面。' };
}
