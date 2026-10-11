// 检修写入前的整份表格备份：存在这台设备、这个浏览器的 IndexedDB 里，只留最近 10 份。
// IndexedDB 用不了时只留在内存里（刷新页面就没了），durable 变成 false，界面据此提示用户先下载一份。
const NAME = 'erii-database-pet';
const STORE = 'repair-backups';
export const KEEP_BACKUPS = 10;

export function createBackupStore(host) {
  const memory = new Map();
  let database = null;
  let durable = Boolean(host.indexedDB);
  function open() {
    database ||= new Promise((resolve, reject) => {
      let request;
      try { request = host.indexedDB.open(NAME, 1); } catch (error) { reject(error); return; }
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id' }).createIndex('at', 'at');
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error('backup database blocked'));
    });
    return database;
  }
  const finished = transaction => new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error || new Error('aborted'));
  });
  function remember(record) {
    memory.set(record.id, record);
    while (memory.size > KEEP_BACKUPS) memory.delete(memory.keys().next().value);
  }
  async function put(record) {
    const saved = { ...record, id: record.id || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`, at: record.at || Date.now() };
    remember(saved);
    if (durable) {
      try {
        const db = await open();
        const transaction = db.transaction(STORE, 'readwrite');
        const store = transaction.objectStore(STORE);
        store.put(saved);
        const keys = store.index('at').getAllKeys();
        keys.onsuccess = () => { for (const key of keys.result.slice(0, Math.max(0, keys.result.length - KEEP_BACKUPS))) store.delete(key); };
        await finished(transaction);
      } catch { durable = false; }
    }
    return saved.id;
  }
  async function get(id) {
    if (!id) return null;
    if (memory.has(id)) return memory.get(id);
    if (!host.indexedDB) return null;
    try {
      const db = await open();
      const transaction = db.transaction(STORE, 'readonly');
      const request = transaction.objectStore(STORE).get(id);
      await finished(transaction);
      return request.result || null;
    } catch { return null; }
  }
  return { put, get, get durable() { return durable; },
    close() { database?.then(db => db.close()).catch(() => {}); database = null; } };
}
