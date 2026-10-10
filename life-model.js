export const JOBS = Object.freeze([
  {id:'bookshop', name:'Tiệm sách', task:'Xếp những cuốn sách mới lên kệ', duration:60000, reward:10, image:'work-bookshop', line:'Bìa quyển sách này đẹp quá. Chờ lúc tan làm, sẽ đọc thêm một trang nữa.'},
  {id:'bakery', name:'Tiệm bánh ngọt', task:'Giúp chuẩn bị các món tráng miệng hôm nay', duration:120000, reward:18, image:'work-bakery', line:'Kem phải nặn từ từ. Làm xong khay này là được nghỉ rồi.'},
  {id:'florist', name:'Tiệm hoa', task:'Sắp xếp lại các bó hoa, thay nước cho hoa', duration:180000, reward:25, image:'work-florist', line:'Cắt tỉa cành hoa cho gọn gàng, rồi giữ lại một bông cho ngày hôm nay.'},
]);
export const FOODS = Object.freeze([
  {id:'pudding', name:'Pudding', price:5, duration:8000, image:'eat-pudding', line:'Mềm mại, vị ngọt vừa vặn.'},
  {id:'riceball', name:'Cơm nắm', price:8, duration:9000, image:'eat-riceball', line:'Cơm nắm vẫn còn ấm. Phải ăn từ từ thôi.'},
  {id:'omurice', name:'Cơm cuộn trứng', price:15, duration:10000, image:'eat-omurice', line:'Món cơm cuộn trứng hôm nay, có một chút xíu hương vị của sự hạnh phúc.'},
  {id:'ramen', name:'Ramen', price:20, duration:12000, image:'eat-ramen', line:'Một bát mì nóng hổi, đến tâm trạng cũng ấm lên theo.'},
]);
// Trợ cấp cơ bản (Low-income guarantee): Khi ví tiền ở nhà sắp cạn thì có thể nhận một khoản nhỏ, mỗi ngày một lần, không được dùng để cày tiền.
export const WELFARE = Object.freeze({below:5, amount:8});
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

// Lưu trữ tương thích với bản 0.7.1: Hoạt động của Tiểu Hội vẫn được ghi trong 'active', của các nhân vật khác ghi trong 'activeBy'; Lùi về phiên bản cũ chỉ làm mất đi hoạt động đang diễn ra của các nhân vật khác.
export function normalizeLife(saved = {}) {
  const activeBy = {};
  for (const [who, activity] of Object.entries(saved?.activeBy && typeof saved.activeBy === 'object' ? saved.activeBy : {}))
    if (validWho(who) && who !== OWNER) activeBy[who] = normalizeActivity(activity);
  return {schema:2, coins:integer(saved?.coins), earned:integer(saved?.earned), spent:integer(saved?.spent),
    jobs:integer(saved?.jobs), meals:integer(saved?.meals),
    active:normalizeActivity(saved?.active), activeBy,
    welfareDate:typeof saved?.welfareDate === 'string' ? saved.welfareDate.slice(0,10) : '',
    journal:Array.isArray(saved?.journal) ? saved.journal.filter(item => item && typeof item.text === 'string'
      && Number.isFinite(item.at) && Number.isFinite(new Date(item.at).getTime()) && ['earned','spent','meal','cancel','welfare'].includes(item.kind)).slice(0,20)
      .map(item => ({text:item.text.slice(0,160), at:item.at, kind:item.kind, ...(validWho(item.who) ? {who:item.who} : {})})) : []};
}

// Mỗi nhân vật chỉ thực hiện một hoạt động tại cùng một thời điểm, tính toán dựa trên thời gian thực trôi qua. Công việc sau khi tan làm sẽ được giữ nguyên cho đến khi nhận lương;
// Khi nhận lương thì trước tiên xóa hoạt động rồi mới ghi sổ (ghi có), nhấp chuột nhiều lần cũng không bị nhận hai lần. Không có thao tác tự động lặp lại công việc, không có lời gọi AI ngầm hay ghi vào cơ sở dữ liệu.
export class LifeModel {
  constructor(saved, {now = () => Date.now(), persist = () => {}} = {}) {
    this.state = normalizeLife(saved); this.now = now; this.persist = persist; this.serial = 0;
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
    this.record('earned',`Đã tan làm ở ${view.item.name}, nhận được ${view.item.reward} tiền vàng.`, who); this.save(); return view.item;
  }
  cancelJob(who = OWNER) {
    const view = this.view(who); if (view.active?.kind !== 'job' || view.ready) return false;
    this.setActivity(who, null); this.record('cancel',`Đã kết thúc sớm công việc ở ${view.item.name}, lần này không nhận được tiền lương.`, who); this.save(); return true;
  }
  buyFood(id, who = OWNER) {
    this.tick(); const food = FOODS.find(item => item.id === id);
    if (!food || this.activity(who) || this.state.coins < food.price) return false;
    this.state.coins -= food.price; this.state.spent = integer(this.state.spent + food.price);
    this.setActivity(who, {kind:'food',id,startedAt:this.now(),uid:`food-${this.now()}-${++this.serial}`});
    this.record('spent',`Đã tiêu ${food.price} tiền vàng để mua ${food.name}.`, who); this.save(); return true;
  }
  welfareAvailable() { return this.state.coins < WELFARE.below && this.state.welfareDate !== today(this.now()); }
  claimWelfare() {
    if (!this.welfareAvailable()) return 0;
    this.state.welfareDate = today(this.now());
    this.state.coins = integer(this.state.coins + WELFARE.amount);
    this.record('welfare',`Đã nhận một khoản trợ cấp cơ bản, ${WELFARE.amount} tiền vàng.`); this.save(); return WELFARE.amount;
  }
  // Quyết toán (Thanh toán) tất cả các bữa cơm đã ăn xong, trả về [{who, item}]; nếu chưa ăn xong thì trả về mảng rỗng.
  tick() {
    const finished = [];
    for (const who of this.busyCharacters()) {
      const view = this.view(who);
      if (view.active?.kind !== 'food' || view.remaining > 0) continue;
      this.setActivity(who, null); this.state.meals = integer(this.state.meals + 1);
      this.record('meal',`Đã ăn xong ${view.item.name}. ${view.item.line}`, who); finished.push({who, item:view.item});
    }
    if (finished.length) this.save();
    return finished;
  }
}
