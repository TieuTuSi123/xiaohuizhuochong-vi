// Thay đổi trang phục (Skin): Mua bằng xu vàng hoặc vé hoa trong ví gia đình, sở hữu và mặc riêng theo từng nhân vật. Logic thuần túy, việc lưu trữ giao cho phía gọi hàm.
// Quy ước: Mỗi nhân vật đều có sẵn một bộ "Trang phục mặc định", miễn phí, vĩnh viễn sở hữu, không thể bán; skin đã mua sẽ không biến mất, có thể đổi lại trang phục mặc định bất kỳ lúc nào.
// Thêm skin sau này: Thêm một mục vào CATALOG bên dưới, khi không ghi currency thì mặc định dùng xu vàng, ghi tickets sẽ dùng vé hoa.
// Đặt ảnh vào assets/skins/<id skin>/, code khác không cần sửa.
export const DEFAULT_SKIN = 'default';
export const SKIN_ID = /^[a-z][a-z0-9-]{0,39}$/;
const MAX_OWNED = 200;

// Cách viết một mục skin (ví dụ minh họa, chưa lên kệ thực tế):
// {
//   id: 'erii-yukata',                        // ID duy nhất: Bắt đầu bằng chữ thường, chỉ dùng chữ thường, số, dấu gạch nối
//   name: 'Yukata Mùa Hè',                    // Tên hiển thị trên giao diện
//   description: 'Bộ yukata mặc đi lễ hội đêm hè, trên tay cầm thêm một chiếc quạt tròn.',
//   price: 120,                               // Xu vàng; 0 nghĩa là miễn phí (vẫn cần "mua" một lần để tính là sở hữu)
//   characters: ['erii'],                     // Nhân vật nào có thể mặc; viết '*' để áp dụng cho mọi nhân vật
//   assets: {                                 // Chỉ khai báo các tư thế có ảnh, tư thế không khai báo sẽ kế thừa ảnh gốc của nhân vật
//     base: 'assets/skins/erii-yukata/',      // Đường dẫn tương đối từ thư mục gốc tiện ích
//     poses: { idle: 'idle.webp', wave: 'wave.webp', 'edge-left': 'edge-left.webp', 'eat-pudding': 'eat-pudding.webp' },
//   },
//   theme: { colors: ['#6fb1d8', '#dff1fb', '#ffffff'] },   // Tùy chọn: Ghi đè màu hạt hiệu ứng; phối màu giao diện dùng [data-skin="erii-yukata"] để viết CSS
// }
const CATALOG = [{
  id: 'erii-purple-night', name: 'Tsukuyomi · Lễ Phục Dạ Tím',
  description: 'Mái tóc đỏ cùng bộ lễ phục tím đen, găng lụa mỏng, ngọc trai và hoa cài. Chăm chỉ làm thêm tích lũy xu vàng, đổi lấy vé hoa để sở hữu.',
  price: 10320, currency: 'tickets', characters: ['erii'],
  assets: { base: 'assets/skins/erii-purple-night/', poses: Object.fromEntries([
    'idle', 'received', 'writing', 'complete', 'error', 'tea', 'reading', 'origami', 'duck',
    'stretch', 'rest', 'gift', 'lifted', 'land', 'wave', 'peek',
    'edge-left', 'edge-right', 'edge-bottom', 'edge-top',
    'work-bookshop', 'work-bakery', 'work-florist', 'eat-pudding', 'eat-riceball', 'eat-omurice', 'eat-ramen',
  ].map(pose => [pose, `${pose}.webp`])) },
  theme: { colors: ['#b892e5', '#eadcfa', '#ceaeed'] },
}];

const integer = value => Math.min(1000000000, Math.max(0, Math.floor(Number(value) || 0)));
const validWho = who => typeof who === 'string' && /^[a-z][a-z0-9-]{0,19}$/.test(who);
const validId = id => typeof id === 'string' && SKIN_ID.test(id) && id !== DEFAULT_SKIN;

// Bỏ qua và cảnh báo nếu mục trong danh mục không hợp lệ, tránh để một skin viết sai làm lỗi toàn bộ tiện ích.
export function validSkin(skin) {
  if (!skin || typeof skin !== 'object' || !validId(skin.id)) return false;
  if (typeof skin.name !== 'string' || !skin.name.trim()) return false;
  if (!Number.isInteger(skin.price) || skin.price < 0) return false;
  if (skin.currency !== undefined && !['coins', 'tickets'].includes(skin.currency)) return false;
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
    seen.add(skin.id); result.push(Object.freeze({ ...skin, currency: skin.currency || 'coins', description: typeof skin.description === 'string' ? skin.description : '' }));
  }
  return Object.freeze(result);
}

export const SKINS = normalizeCatalog(CATALOG, skin => console.warn('[Pet cơ sở dữ liệu] Danh mục trang phục có một mục cấu hình không hợp lệ, đã bỏ qua:', skin));

export const fits = (skin, who) => Boolean(skin) && (skin.characters === '*' || skin.characters.includes(who));
export const defaultEntry = () => ({ id: DEFAULT_SKIN, name: 'Trang phục mặc định', description: 'Diện mạo thường ngày. Miễn phí, có thể đổi lại bất cứ lúc nào.', price: 0, currency: 'coins', characters: '*', assets: null, theme: null });

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

// Skin đã mua dù tạm thời không còn trong danh mục (ví dụ về bản cũ hoặc người bảo trì tạm gỡ xuống) vẫn được lưu trong bộ nhớ, khi mở bán lại có thể tiếp tục mặc.
export class SkinModel {
  constructor(saved, { persist = () => {}, catalog = SKINS } = {}) {
    this.state = normalizeSkins(saved); this.persist = persist; this.catalog = catalog;
  }
  save() { this.persist(JSON.parse(JSON.stringify(this.state))); }
  find(id) { return this.catalog.find(skin => skin.id === id) || null; }
  available(who) { return this.catalog.filter(skin => fits(skin, who)); }
  ownedIds(who) { return this.state.owned[who] || []; }
  owns(who, id) { return id === DEFAULT_SKIN || this.ownedIds(who).includes(id); }
  // Đối tượng skin đang mặc; trả về null nếu là trang phục mặc định hoặc skin đang mặc không còn trong danh mục, phía gọi sẽ xử lý theo mặc định.
  equipped(who) {
    const id = this.state.equipped[who];
    if (!id || !this.owns(who, id)) return null;
    const skin = this.find(id);
    return skin && fits(skin, who) ? skin : null;
  }
  equippedId(who) { return this.equipped(who)?.id || DEFAULT_SKIN; }
  // Danh mục phục vụ giao diện: Trang phục mặc định luôn xếp đầu tiên; affordable thể hiện đủ tiền mua (đã sở hữu cũng tính là thỏa mãn).
  list(who, { coins = 0, tickets = 0 } = {}) {
    const current = this.equippedId(who);
    return [defaultEntry(), ...this.available(who)].map(skin => {
      const owned = this.owns(who, skin.id);
      const currency = skin.currency || 'coins', balance = integer(currency === 'tickets' ? tickets : coins);
      return { id: skin.id, skin, price: skin.price, currency, balance, owned, equipped: skin.id === current, affordable: owned || balance >= skin.price };
    });
  }
  // pay(price, skin) phụ trách trừ tiền thực tế và trả về trạng thái thành công (ví dụ LifeModel.spend); tại đây chỉ kiểm tra "có thể mua hay không" và ghi nhận giao dịch.
  buy(who, id, pay) {
    if (!validWho(who)) return { ok: false, reason: 'who' };
    const skin = this.find(id);
    if (!skin || !fits(skin, who)) return { ok: false, reason: 'missing' };
    if (this.owns(who, id)) return { ok: false, reason: 'owned' };
    if (this.ownedIds(who).length >= MAX_OWNED) return { ok: false, reason: 'full' };
    if (typeof pay !== 'function' || pay(skin.price, skin) !== true) return { ok: false, reason: skin.currency === 'tickets' ? 'tickets' : 'coins' };
    (this.state.owned[who] ||= []).push(id);
    this.state.bought = integer(this.state.bought + 1);
    if (skin.currency === 'tickets') this.state.spentTickets = integer(this.state.spentTickets + skin.price);
    else this.state.spent = integer(this.state.spent + skin.price);
    this.save(); return { ok: true, skin };
  }
  // Mặc skin đã sở hữu; truyền DEFAULT_SKIN để đổi về mặc định. Trả về false nếu không có thay đổi.
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