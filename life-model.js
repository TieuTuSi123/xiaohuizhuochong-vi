export const JOBS = Object.freeze([
  {id:'bookshop', name:'Tiệm sách', task:'Xếp sách mới về lên kệ sách', duration:60000, reward:10, image:'work-bookshop', line:'Bìa cuốn sách này đẹp thật. Đợi tan ca rồi lật xem trang tiếp theo.'},
  {id:'bakery', name:'Tiệm bánh ngọt', task:'Giúp chuẩn bị món tráng miệng hôm nay', duration:120000, reward:18, image:'work-bakery', line:'Kem tươi phải bóp từ từ. Làm xong khay này là có thể nghỉ ngơi rồi.'},
  {id:'florist', name:'Tiệm hoa', task:'Cắt tỉa bó hoa, thay nước cho hoa', duration:180000, reward:25, image:'work-florist', line:'Cắt tỉa cành hoa cho gọn gàng, giữ lại một đóa cho ngày hôm nay.'},
]);
export const FOODS = Object.freeze([
  {id:'pudding', name:'Bánh pudding', price:5, duration:8000, image:'eat-pudding', line:'Mềm mịn, độ ngọt vừa vặn.'},
  {id:'riceball', name:'Cơm nắm', price:8, duration:9000, image:'eat-riceball', line:'Cơm nắm vẫn còn ấm. Phải ăn từ từ mới ngon.'},
  {id:'omurice', name:'Cơm cuộn trứng', price:15, duration:10000, image:'eat-omurice', line:'Cơm cuộn trứng hôm nay có một chút hương vị của hạnh phúc.'},
  {id:'ramen', name:'Mì ramen', price:20, duration:12000, image:'eat-ramen', line:'Một tô mì nóng hổi, đến cả tâm trạng cũng ấm áp theo.'},
]);
// Trợ cấp: Có thể nhận một khoản nhỏ khi ví sắp cạn kiệt, mỗi ngày một lần, không thể dùng để cày tiền.
export const WELFARE = Object.freeze({below:5, amount:8});
// Vé hoa dùng để đổi trang phục: Quy đổi một chiều từ số vàng nguyên, người dùng thao tác thủ công, không tự động trừ tiền.
export const FLOWER_EXCHANGE_RATE = 40;
const MAX_BALANCE = 1000000000;
const OWNER = 'erii';
const integer = value => Math.min(1000000000, Math.max(0, Math.floor(Number(value) || 0)));
const catalog = activity => (activity?.kind === 'job' ? JOBS : activity?.kind === 'food' ? FOODS : []).find(item => item.id === activity.id);
const today = ms => { const d = new Date(ms); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
const validWho = who => typeof who === 'string' && /^[a-z][a-z0-9-]{0,19}$/.test(who);

function normalizeActivity(activity) {
  const valid = catalog(activity) && Number.isFinite(activity.startedAt) && activity.startedAt > 0
    && Number.isFinite(new Date(activity.startedAt).getTime()) && typeof activity.uid === 'string';
  return valid ? {kind:activity.kind, id:activity.id, startedAt:activity.startedAt, uid:activity.uid.slice(0,100)} : null;
}

// Tiếp tục đọc bản lưu cũ: Hoạt động của Erii ghi trong active, các nhân vật khác ghi trong activeBy;
// Việc hạ cấp về bản cũ không nhận biết các trường này rồi lưu lại có thể làm mất vé hoa/nhật ký mới hoặc hoạt động của nhân vật khác, cần sao lưu trước.
export function normalizeLife(saved = {}) {
  const activeBy = {};
  for (const [who, activity] of Object.entries(saved?.activeBy && typeof saved.activeBy === 'object' ? saved.activeBy : {}))
    if (validWho(who) && who !== OWNER) activeBy[who] = normalizeActivity(activity);
  return {schema:3, coins:integer(saved?.coins), earned:integer(saved?.earned), spent:integer(saved?.spent),
    tickets:integer(saved?.tickets), ticketsEarned:integer(saved?.ticketsEarned), ticketsSpent:integer(saved?.ticketsSpent),
    jobs:integer(saved?.jobs), meals:integer(saved?.meals),
    active:normalizeActivity(saved?.active), activeBy,
    welfareDate:typeof saved?.welfareDate === 'string' ? saved.welfareDate.slice(0,10) : '',
    journal:Array.isArray(saved?.journal) ? saved.journal.filter(item => item && typeof item.text === 'string'
      && Number.isFinite(item.at) && Number.isFinite(new Date(item.at).getTime()) && ['earned','spent','meal','cancel','welfare','exchange','tickets'].includes(item.kind)).slice(0,20)
      .map(item => ({text:item.text.slice(0,160), at:item.at, kind:item.kind, ...(validWho(item.who) ? {who:item.who} : {})})) : []};
}

// Mỗi nhân vật tại cùng một thời điểm chỉ thực hiện một hoạt động, tính theo thời gian thực đã trôi qua. Công việc sau khi tan ca được giữ nguyên cho đến khi nhận lương;
// Khi nhận lương sẽ xóa hoạt động trước rồi mới ghi sổ, nhấn lặp lại sẽ không nhận hai lần. Không có tự động lặp lại công việc, không có lệnh gọi AI ẩn hay ghi vào cơ sở dữ liệu.
export class LifeModel {
  constructor(saved, {now = () => Date.now(), persist = () => {}, onMeal = () => {}} = {}) {
    this.state = normalizeLife(saved); this.now = now; this.persist = persist; this.onMeal = onMeal; this.serial = 0;
  }
  save() { this.persist(JSON.parse(JSON.stringify(this.state))); }
  record(kind, text, who) { this.state.journal.unshift({kind,text,at:this.now(),...(who ? {who} : {})}); this.state.journal.length = Math.min(20,this.state.journal.length); }
  activity(who = OWNER) { return who === OWNER ? this.state.active : this.state.activeBy[who] || null; }
  setActivity(who, value) { if (who === OWNER) this.state.active = value; else this.state.activeBy[who] = value; }
  busyCharacters() { return [OWNER, ...Object.keys(this.state.activeBy)].filter(who => this.activity(who)); }
  view(who = OWNER) {
    const active = this.activity(who), item = catalog(active);
    const elapsed = active ? Math.max(0,this.now() - active.startedAt) : 0;
    const remaining = item ? Math.max(0,item.duration - elapsed) : 0;
    return { ...this.state, who, active, item, remaining, progress:item ? Math.min(1,elapsed / item.duration) : 0,
      ready:active?.kind === 'job' && remaining === 0, welfare:this.welfareAvailable() };
  }
  startJob(id, who = OWNER) {
    this.tick(); const job = JOBS.find(item => item.id === id);
    if (!job || this.activity(who)) return false;
    this.setActivity(who, {kind:'job',id,startedAt:this.now(),uid:`job-${this.now()}-${++this.serial}`}); this.save(); return true;
  }
  claim(who = OWNER) {
    const view = this.view(who); if (!view.ready) return null;
    this.setActivity(who, null);
    this.state.coins = integer(this.state.coins + view.item.reward);
    this.state.earned = integer(this.state.earned + view.item.reward); this.state.jobs = integer(this.state.jobs + 1);
    this.record('earned',`${view.item.name} tan ca, nhận được ${view.item.reward} vàng.`, who); this.save(); return view.item;
  }
  cancelJob(who = OWNER) {
    const view = this.view(who); if (view.active?.kind !== 'job' || view.ready) return false;
    this.setActivity(who, null); this.record('cancel',`Kết thúc sớm công việc ở ${view.item.name}, lần này không nhận lương.`, who); this.save(); return true;
  }
  buyFood(id, who = OWNER) {
    this.tick(); const food = FOODS.find(item => item.id === id);
    if (!food || this.activity(who) || this.state.coins < food.price) return false;
    this.state.coins -= food.price; this.state.spent = integer(this.state.spent + food.price);
    this.setActivity(who, {kind:'food',id,startedAt:this.now(),uid:`food-${this.now()}-${++this.serial}`});
    this.record('spent',`Dùng ${food.price} vàng mua ${food.name}.`, who); this.save(); return true;
  }
  // Dùng vàng trong ví để mua đồ khác (ví dụ: trang phục): Số dư không đủ trả về false, không trừ tiền; khi thành công ghi một dòng vào sổ chi tiêu.
  spend(amount, text, who = OWNER) {
    const price = integer(amount);
    if (this.state.coins < price) return false;
    this.state.coins -= price; this.state.spent = integer(this.state.spent + price);
    this.record('spent', String(text || `Đã dùng ${price} vàng.`).slice(0, 160), who); this.save(); return true;
  }
  exchangeTickets(coins) {
    if (!Number.isSafeInteger(coins) || coins <= 0 || coins > this.state.coins) return false;
    const tickets = coins * FLOWER_EXCHANGE_RATE;
    if (!Number.isSafeInteger(tickets) || this.state.tickets + tickets > MAX_BALANCE) return false;
    this.state.coins -= coins; this.state.spent = integer(this.state.spent + coins);
    this.state.tickets += tickets; this.state.ticketsEarned = integer(this.state.ticketsEarned + tickets);
    this.record('exchange', `Đã dùng ${coins} vàng đổi lấy ${tickets} vé hoa.`); this.save(); return {coins, tickets};
  }
  spendTickets(amount, text, who = OWNER) {
    if (!Number.isSafeInteger(amount) || amount < 0 || this.state.tickets < amount) return false;
    this.state.tickets -= amount; this.state.ticketsSpent = integer(this.state.ticketsSpent + amount);
    this.record('tickets', String(text || `Đã dùng ${amount} vé hoa.`).slice(0, 160), who); this.save(); return true;
  }
  welfareAvailable() { return this.state.coins < WELFARE.below && this.state.welfareDate !== today(this.now()); }
  claimWelfare() {
    if (!this.welfareAvailable()) return 0;
    this.state.welfareDate = today(this.now());
    this.state.coins = integer(this.state.coins + WELFARE.amount);
    this.record('welfare',`Đã nhận một lần trợ cấp, ${WELFARE.amount} vàng.`); this.save(); return WELFARE.amount;
  }
  // Quyết toán tất cả các bữa ăn đã hoàn thành, trả về [{who, item}]; chưa ăn xong trả về mảng rỗng.
  tick() {
    const finished = [];
    for (const who of this.busyCharacters()) {
      const view = this.view(who);
      if (view.active?.kind !== 'food' || view.remaining > 0) continue;
      this.setActivity(who, null); this.state.meals = integer(this.state.meals + 1);
      this.record('meal',`Đã ăn xong ${view.item.name}. ${view.item.line}`, who); finished.push({who, item:view.item});
    }
    if (finished.length) { this.save(); for(const meal of finished)this.onMeal(meal); }
    return finished;
  }
}