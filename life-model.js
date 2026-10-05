export const JOBS = Object.freeze([
  {id:'bookshop', name:'书店', task:'把新到的书放上书架', duration:60000, reward:10, image:'work-bookshop', line:'这本书的封面很好看。等下班了，再翻一页。'},
  {id:'bakery', name:'甜品店', task:'帮忙准备今天的小甜点', duration:120000, reward:18, image:'work-bakery', line:'奶油要慢慢挤。做好这一盘，就可以休息啦。'},
  {id:'florist', name:'花店', task:'整理花束，给花换水', duration:180000, reward:25, image:'work-florist', line:'把花枝修整齐，再留一朵给今天。'},
]);
export const FOODS = Object.freeze([
  {id:'pudding', name:'布丁', price:5, duration:8000, image:'eat-pudding', line:'软软的，甜味刚刚好。'},
  {id:'riceball', name:'饭团', price:8, duration:9000, image:'eat-riceball', line:'饭团还是温的。要慢慢吃。'},
  {id:'omurice', name:'蛋包饭', price:15, duration:10000, image:'eat-omurice', line:'今天的蛋包饭，有一点点幸福的味道。'},
  {id:'ramen', name:'拉面', price:20, duration:12000, image:'eat-ramen', line:'热乎乎的一碗，连心情也暖起来了。'},
]);
// 低保：家里的钱包快见底时可领一小笔，每天一次，不能拿来刷钱。
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

// 存档兼容 0.7.1：绘梨衣的活动仍写在 active，其他角色的写在 activeBy；退回旧版只会丢掉别的角色正在进行的活动。
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

// 每个角色同一时间只进行一项活动，用经过的真实时间计算。下班的工作一直保留到领取；
// 领取时先清掉活动再记账，重复点击不会领两次。没有自动重复工作、隐藏 AI 调用或数据库写入。
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
    this.record('earned',`${view.item.name}下班，领到 ${view.item.reward} 金币。`, who); this.save(); return view.item;
  }
  cancelJob(who = OWNER) {
    const view = this.view(who); if (view.active?.kind !== 'job' || view.ready) return false;
    this.setActivity(who, null); this.record('cancel',`提前结束${view.item.name}的工作，这次没有领取工资。`, who); this.save(); return true;
  }
  buyFood(id, who = OWNER) {
    this.tick(); const food = FOODS.find(item => item.id === id);
    if (!food || this.activity(who) || this.state.coins < food.price) return false;
    this.state.coins -= food.price; this.state.spent = integer(this.state.spent + food.price);
    this.setActivity(who, {kind:'food',id,startedAt:this.now(),uid:`food-${this.now()}-${++this.serial}`});
    this.record('spent',`花 ${food.price} 金币买了${food.name}。`, who); this.save(); return true;
  }
  welfareAvailable() { return this.state.coins < WELFARE.below && this.state.welfareDate !== today(this.now()); }
  claimWelfare() {
    if (!this.welfareAvailable()) return 0;
    this.state.welfareDate = today(this.now());
    this.state.coins = integer(this.state.coins + WELFARE.amount);
    this.record('welfare',`领了一次低保，${WELFARE.amount} 金币。`); this.save(); return WELFARE.amount;
  }
  // 结算所有已经吃完的饭，返回 [{who, item}]；没有吃完的返回空数组。
  tick() {
    const finished = [];
    for (const who of this.busyCharacters()) {
      const view = this.view(who);
      if (view.active?.kind !== 'food' || view.remaining > 0) continue;
      this.setActivity(who, null); this.state.meals = integer(this.state.meals + 1);
      this.record('meal',`${view.item.name}吃完啦。${view.item.line}`, who); finished.push({who, item:view.item});
    }
    if (finished.length) this.save();
    return finished;
  }
}
