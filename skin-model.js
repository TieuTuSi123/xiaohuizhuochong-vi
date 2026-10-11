// 换装（皮肤）：用家里钱包里的金币或花票购买，按角色各自拥有和穿着。纯逻辑，保存交给调用方。
// 约定：每个角色自带一套「默认装扮」，免费、永远拥有、不能卖掉；买过的皮肤不会消失，随时可以换回默认。
// 以后加皮肤：在下面的 CATALOG 里加一条，currency 不写时仍使用金币，写 tickets 使用花票。
// 把图放进 assets/skins/<皮肤 id>/，别的代码不用改。
export const DEFAULT_SKIN = 'default';
export const SKIN_ID = /^[a-z][a-z0-9-]{0,39}$/;
const MAX_OWNED = 200;

// 皮肤条目的写法（示例，没有真正上架）：
// {
//   id: 'erii-yukata',                        // 唯一 id：小写字母开头，只用小写字母、数字、连字符
//   name: '夏日浴衣',                          // 界面上显示的名字
//   description: '夏夜祭典穿的浴衣，手里多了一把团扇。',
//   price: 120,                               // 金币；0 表示免费（仍要“买”一次才算拥有）
//   characters: ['erii'],                     // 哪些角色可以穿；写 '*' 表示所有角色
//   assets: {                                 // 只写有图的姿势，没写的姿势沿用角色原来的图
//     base: 'assets/skins/erii-yukata/',      // 相对扩展根目录
//     poses: { idle: 'idle.webp', wave: 'wave.webp', 'edge-left': 'edge-left.webp', 'eat-pudding': 'eat-pudding.webp' },
//   },
//   theme: { colors: ['#6fb1d8', '#dff1fb', '#ffffff'] },   // 可选：覆盖粒子颜色；界面配色用 [data-skin="erii-yukata"] 写 CSS
// }
const CATALOG = [{
  id: 'erii-purple-night', name: '月读命·紫夜礼裙',
  description: '红发与黑紫礼裙，手丝、珍珠与花饰。打工攒金币，兑换花票后买下。',
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

// 目录里的条目不合规时跳过并提示，不让一条写错的皮肤拖垮整个扩展。
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

export const SKINS = normalizeCatalog(CATALOG, skin => console.warn('[数据库桌宠] 皮肤目录里有一条写法不对，已跳过：', skin));

export const fits = (skin, who) => Boolean(skin) && (skin.characters === '*' || skin.characters.includes(who));
export const defaultEntry = () => ({ id: DEFAULT_SKIN, name: '默认装扮', description: '平时的样子。免费，随时可以换回来。', price: 0, currency: 'coins', characters: '*', assets: null, theme: null });

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

// 买过的皮肤即使暂时不在目录里（比如退回旧版、或者维护者先下架了）也留在存档里，重新上架就能继续穿。
export class SkinModel {
  constructor(saved, { persist = () => {}, catalog = SKINS } = {}) {
    this.state = normalizeSkins(saved); this.persist = persist; this.catalog = catalog;
  }
  save() { this.persist(JSON.parse(JSON.stringify(this.state))); }
  find(id) { return this.catalog.find(skin => skin.id === id) || null; }
  available(who) { return this.catalog.filter(skin => fits(skin, who)); }
  ownedIds(who) { return this.state.owned[who] || []; }
  owns(who, id) { return id === DEFAULT_SKIN || this.ownedIds(who).includes(id); }
  // 当前穿着的皮肤对象；默认装扮、或者穿着的皮肤已不在目录里时返回 null，调用方按默认处理。
  equipped(who) {
    const id = this.state.equipped[who];
    if (!id || !this.owns(who, id)) return null;
    const skin = this.find(id);
    return skin && fits(skin, who) ? skin : null;
  }
  equippedId(who) { return this.equipped(who)?.id || DEFAULT_SKIN; }
  // 给界面用的目录：默认装扮永远排第一；affordable 表示买得起（已拥有的也算）。
  list(who, { coins = 0, tickets = 0 } = {}) {
    const current = this.equippedId(who);
    return [defaultEntry(), ...this.available(who)].map(skin => {
      const owned = this.owns(who, skin.id);
      const currency = skin.currency || 'coins', balance = integer(currency === 'tickets' ? tickets : coins);
      return { id: skin.id, skin, price: skin.price, currency, balance, owned, equipped: skin.id === current, affordable: owned || balance >= skin.price };
    });
  }
  // pay(price, skin) 负责真正扣钱并返回是否成功（例如 LifeModel.spend）；这里只管“能不能买”和记账。
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
  // 换上已拥有的皮肤；传 DEFAULT_SKIN 换回默认。没有变化时返回 false。
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
