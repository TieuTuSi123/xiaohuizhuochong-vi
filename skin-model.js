// Thay đổi trang phục (Skin): Mua bằng tiền vàng hoặc phiếu hoa trong ví tiền gia đình, sở hữu và mặc riêng theo từng nhân vật. Logic thuần túy, việc lưu trữ do bên gọi phụ trách.
// Quy ước: Mỗi nhân vật luôn có sẵn một bộ "Trang phục mặc định", miễn phí, sở hữu vĩnh viễn, không thể bán; trang phục đã mua sẽ không mất đi, có thể đổi về mặc định bất cứ lúc nào.
// Thêm trang phục sau này: Chỉ cần thêm một mục vào CATALOG bên dưới, không khai báo currency thì mặc định dùng tiền vàng (coins), khai báo tickets thì dùng phiếu hoa.
// Đặt hình ảnh vào assets/skins/<id trang phục>/, không cần chỉnh sửa mã nguồn khác.
export const DEFAULT_SKIN = 'default';
export const SKIN_ID = /^[a-z][a-z0-9-]{0,39}$/;
export const ZERO_SECRET = '这一路上我们不会彼此抛弃，不彼此出卖，直到死亡的尽头';
const MAX_OWNED = 200;

// Cách khai báo một mục trang phục (ví dụ tham khảo, chưa mở bán chính thức):
// {
//   id: 'erii-yukata',                        // ID duy nhất: bắt đầu bằng chữ cái thường, chỉ gồm chữ thường, số, dấu gạch nối
//   name: 'Yukata Mùa Hè',                    // Tên hiển thị trên giao diện
//   description: 'Bộ yukata mặc đi lễ hội đêm hè, trên tay cầm thêm một chiếc quạt tròn.',
//   price: 120,                               // Tiền vàng; 0 nghĩa là miễn phí (vẫn cần "mua" một lần để tính là đã sở hữu)
//   characters: ['erii'],                     // Nhân vật có thể mặc; điền '*' nếu áp dụng cho tất cả nhân vật
//   assets: {                                 // Chỉ khai báo các tư thế có ảnh, tư thế không khai báo sẽ kế thừa ảnh gốc của nhân vật
//     base: 'assets/skins/erii-yukata/',      // Đường dẫn tương đối so với thư mục gốc của tiện ích mở rộng
//     poses: { idle: 'idle.webp', wave: 'wave.webp', 'edge-left': 'edge-left.webp', 'eat-pudding': 'eat-pudding.webp' },
//   },
//   theme: { colors: ['#6fb1d8', '#dff1fb', '#ffffff'] },   // Tùy chọn: Ghi đè màu hạt hiệu ứng; màu giao diện dùng [data-skin="erii-yukata"] để viết CSS
// }
const CATALOG = [{
  id: 'erii-purple-night', name: 'Tsukuyomi · Dạ Lễ Phục Tím',
  description: 'Mái tóc đỏ cùng lễ phục dạ hội đen tím, găng tay ren mỏng, ngọc trai và hoa cài. Đi làm tích lũy tiền vàng, đổi lấy phiếu hoa để mua.',
  price: 10320, currency: 'tickets', characters: ['erii'],
  assets: { base: 'assets/skins/erii-purple-night/', poses: Object.fromEntries([
    'idle', 'received', 'writing', 'complete', 'error', 'tea', 'reading', 'origami', 'duck',
    'stretch', 'rest', 'gift', 'lifted', 'land', 'wave', 'peek',
    'edge-left', 'edge-right', 'edge-bottom', 'edge-top',
    'work-bookshop', 'work-bakery', 'work-florist', 'eat-pudding', 'eat-riceball', 'eat-omurice', 'eat-ramen',
  ].map(pose => [pose, `${pose}.webp`])) },
  theme: { colors: ['#b892e5', '#eadcfa', '#ceaeed'] },
}, {
  id: 'zero-ice-rose', name: 'Hoàng Nữ Zero · Băng Lam Tường Vi',
  description: 'Mái tóc dài vàng nhạt, hoa tường vi xanh băng cùng lễ phục đen trắng. Dùng mật ngữ hai người đã ước định để mở khóa bộ trang phục này.',
  unlock: { type: 'phrase', phrase: ZERO_SECRET }, price: null, currency: null, characters: ['zero'],
  assets: { base: 'assets/skins/zero-ice-rose/', poses: Object.fromEntries([
    'idle', 'received', 'writing', 'complete', 'error', 'tea', 'reading', 'origami', 'duck', 'stretch', 'rest', 'gift', 'lifted', 'land', 'wave', 'peek',
    'edge-left', 'edge-right', 'edge-bottom', 'edge-top', 'work-bookshop', 'work-bakery', 'work-florist', 'eat-pudding', 'eat-riceball', 'eat-omurice', 'eat-ramen',
  ].map(pose => [pose, `${pose}.webp`])) }, theme: { colors: ['#7daede', '#d8ebfa', '#a6cbe8'] },
}];

const integer = value => Math.min(1000000000, Math.max(0, Math.floor(Number(value) || 0)));
const validWho = who => typeof who === 'string' && /^[a-z][a-z0-9-]{0,19}$/.test(who);
const validId = id => typeof id === 'string' && SKIN_ID.test(id) && id !== DEFAULT_SKIN;

// Bỏ qua và đưa ra cảnh báo khi mục trong danh mục không hợp lệ, tránh để một trang phục viết sai làm sập toàn bộ tiện ích.
export function validSkin(skin) {
  if (!skin || typeof skin !== 'object' || !validId(skin.id)) return false;
  if (typeof skin.name !== 'string' || !skin.name.trim()) return false;
  if (skin.unlock !== undefined) {
    if (skin.unlock?.type !== 'phrase' || typeof skin.unlock.phrase !== 'string' || !skin.unlock.phrase.trim() || skin.unlock.phrase.length > 200) return false;
    if (skin.price != null || skin.currency != null) return false;
  } else {
    if (!Number.isInteger(skin.price) || skin.price < 0) return false;
    if (skin.currency !== undefined && !['coins', 'tickets'].includes(skin.currency)) return false;
  }
  if (!(skin.characters === '*' || (Array.isArray(skin.characters) && skin.characters.length > 0 && skin.characters.every(validWho)))) return false;
  if (skin.assets !== undefined && skin.assets !== null) {
    if (typeof skin.assets !== 'object') return false;
    if (skin.assets.base !== undefined && typeof skin.assets.base !== 'string') return false;
    if (skin.assets.poses !== undefined && (typeof skin.assets.poses !== 'object' || skin.assets.poses === null)) return false;
  }
  if (skin.theme !== undefined && skin.theme !== null && typeof skin.theme !== 'object') return false;
  return true;
}

export function normalizeCatalog(list, warn = () => {}) {
  const seen = new Set(), result = [];
  for (const skin of Array.isArray(list) ? list : []) {
    if (!validSkin(skin)) { warn(skin); continue; }
    if (seen.has(skin.id)) { warn(skin); continue; }
    seen.add(skin.id); result.push(Object.freeze({ ...skin, currency: skin.unlock ? null : skin.currency || 'coins', description: typeof skin.description === 'string' ? skin.description : '' }));
  }
  return Object.freeze(result);
}

export const SKINS = normalizeCatalog(CATALOG, skin => console.warn('[Pet CSDL] Danh mục trang phục có một mục không đúng định dạng, đã bỏ qua:', skin));

export const fits = (skin, who) => Boolean(skin) && (skin.characters === '*' || skin.characters.includes(who));
export const defaultEntry = () => ({ id: DEFAULT_SKIN, name: 'Trang phục mặc định', description: 'Dáng vẻ ngày thường. Miễn phí, có thể đổi lại bất cứ lúc nào.', price: 0, currency: 'coins', characters: '*', assets: null, theme: null });

export function normalizeSkins(saved = {}) {
  const owned = {}, equipped = {};
  for (const [who, list] of Object.entries(saved?.owned && typeof saved.owned === 'object' ? saved.owned : {})) {
    if (!validWho(who) || !Array.isArray(list)) continue;
    const ids = [...new Set(list.filter(validId))].slice(0, MAX_OWNED);
    if (ids.length) owned[who] = ids;
  }
  for (const [who, id] of Object.entries(saved?.equipped && typeof saved.equipped === 'object' ? saved.equipped : {}))
    if (validWho(who) && validId(id)) equipped[who] = id;
  return { schema: 2, owned, equipped, bought: integer(saved?.bought), spent: integer(saved?.spent), spentTickets: integer(saved?.spentTickets) };
}

// Trang phục đã mua dù tạm thời không có trong danh mục (ví dụ khi hạ cấp về bản cũ hoặc tạm thời gỡ xuống) vẫn được lưu trong hồ sơ, khi có lại sẽ tiếp tục mặc được bình thường.
export class SkinModel {
  constructor(saved, { persist = () => {}, catalog = SKINS } = {}) {
    this.state = normalizeSkins(saved); this.persist = persist; this.catalog = catalog;
  }
  save() { this.persist(JSON.parse(JSON.stringify(this.state))); }
  find(id) { return this.catalog.find(skin => skin.id === id) || null; }
  available(who) { return this.catalog.filter(skin => fits(skin, who)); }
  ownedIds(who) { return this.state.owned[who] || []; }
  owns(who, id) { return id === DEFAULT_SKIN || this.ownedIds(who).includes(id); }
  // Đối tượng trang phục đang mặc hiện tại; trả về null khi là trang phục mặc định hoặc trang phục đang mặc không còn trong danh mục, phía gọi sẽ xử lý theo mặc định.
  equipped(who) {
    const id = this.state.equipped[who];
    if (!id || !this.owns(who, id)) return null;
    const skin = this.find(id);
    return skin && fits(skin, who) ? skin : null;
  }
  equippedId(who) { return this.equipped(who)?.id || DEFAULT_SKIN; }
  // Danh mục dùng cho giao diện: Trang phục mặc định luôn xếp đầu tiên; affordable biểu thị có đủ khả năng mua (đã sở hữu cũng tính là true).
  list(who, { coins = 0, tickets = 0 } = {}) {
    const current = this.equippedId(who);
    return [defaultEntry(), ...this.available(who)].map(skin => {
      const owned = this.owns(who, skin.id);
      const currency = skin.unlock ? null : skin.currency || 'coins', balance = integer(currency === 'tickets' ? tickets : coins);
      return { id: skin.id, skin, price: skin.price, currency, balance, owned, equipped: skin.id === current, affordable: owned || (!skin.unlock && balance >= skin.price) };
    });
  }
  // pay(price, skin) phụ trách trừ tiền thực tế và trả về kết quả thành công hay không (ví dụ LifeModel.spend); ở đây chỉ quản lý "có thể mua hay không" và ghi sổ.
  buy(who, id, pay) {
    if (!validWho(who)) return { ok: false, reason: 'who' };
    const skin = this.find(id);
    if (!skin || !fits(skin, who)) return { ok: false, reason: 'missing' };
    if (this.owns(who, id)) return { ok: false, reason: 'owned' };
    if (skin.unlock) return { ok: false, reason: 'phrase' };
    if (this.ownedIds(who).length >= MAX_OWNED) return { ok: false, reason: 'full' };
    if (typeof pay !== 'function' || pay(skin.price, skin) !== true) return { ok: false, reason: skin.currency === 'tickets' ? 'tickets' : 'coins' };
    (this.state.owned[who] ||= []).push(id);
    this.state.bought = integer(this.state.bought + 1);
    if (skin.currency === 'tickets') this.state.spentTickets = integer(this.state.spentTickets + skin.price);
    else this.state.spent = integer(this.state.spent + skin.price);
    this.save(); return { ok: true, skin };
  }
  unlock(who, id, phrase) {
    if (!validWho(who)) return { ok: false, reason: 'who' };
    const skin = this.find(id);
    if (!skin || !fits(skin, who) || skin.unlock?.type !== 'phrase') return { ok: false, reason: 'missing' };
    if (this.owns(who, id)) return { ok: false, reason: 'owned' };
    if (this.ownedIds(who).length >= MAX_OWNED) return { ok: false, reason: 'full' };
    if (typeof phrase !== 'string' || phrase.trim().normalize('NFC') !== skin.unlock.phrase) return { ok: false, reason: 'phrase' };
    (this.state.owned[who] ||= []).push(id); this.save(); return { ok: true, skin };
  }
  // Mặc trang phục đã sở hữu; truyền DEFAULT_SKIN để đổi về trang phục mặc định. Trả về false khi không có thay đổi.
  equip(who, id) {
    if (!validWho(who)) return false;
    if (id === DEFAULT_SKIN) {
      if (!this.state.equipped[who]) return false;
      delete this.state.equipped[who]; this.save(); return true;
    }
    const skin = this.find(id);
    if (!skin || !fits(skin, who) || !this.owns(who, id) || this.state.equipped[who] === id) return false;
    this.state.equipped[who] = id; this.save(); return true;
  }
}