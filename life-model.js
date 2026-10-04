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
const integer = value => Math.min(1000000000, Math.max(0, Math.floor(Number(value) || 0)));
const catalog = activity => (activity?.kind === 'job' ? JOBS : activity?.kind === 'food' ? FOODS : []).find(item => item.id === activity.id);

export function normalizeLife(saved = {}) {
  const activity = saved?.active;
  const valid = catalog(activity) && Number.isFinite(activity.startedAt) && activity.startedAt > 0
    && Number.isFinite(new Date(activity.startedAt).getTime()) && typeof activity.uid === 'string';
  return {schema:1, coins:integer(saved?.coins), earned:integer(saved?.earned), spent:integer(saved?.spent),
    jobs:integer(saved?.jobs), meals:integer(saved?.meals),
    active:valid ? {kind:activity.kind, id:activity.id, startedAt:activity.startedAt, uid:activity.uid.slice(0,100)} : null,
    journal:Array.isArray(saved?.journal) ? saved.journal.filter(item => item && typeof item.text === 'string'
      && Number.isFinite(item.at) && Number.isFinite(new Date(item.at).getTime()) && ['earned','spent','meal','cancel'].includes(item.kind)).slice(0,20)
      .map(item => ({text:item.text.slice(0,160), at:item.at, kind:item.kind})) : []};
}

// One manually started activity, using elapsed wall time. A completed job stays
// ready until claimed; claiming clears it before crediting, so repeated clicks
// cannot pay twice. No repeating jobs, hidden AI calls, or database writes.
export class LifeModel {
  constructor(saved, {now = () => Date.now(), persist = () => {}} = {}) {
    this.state = normalizeLife(saved); this.now = now; this.persist = persist; this.serial = 0;
  }
  save() { this.persist(JSON.parse(JSON.stringify(this.state))); }
  record(kind, text) { this.state.journal.unshift({kind,text,at:this.now()}); this.state.journal.length = Math.min(20,this.state.journal.length); }
  view() {
    const active = this.state.active, item = catalog(active);
    const elapsed = active ? Math.max(0,this.now() - active.startedAt) : 0;
    const remaining = item ? Math.max(0,item.duration - elapsed) : 0;
    return { ...this.state, active, item, remaining, progress:item ? Math.min(1,elapsed / item.duration) : 0,
      ready:active?.kind === 'job' && remaining === 0 };
  }
  startJob(id) {
    this.tick(); const job = JOBS.find(item => item.id === id);
    if (!job || this.state.active) return false;
    this.state.active = {kind:'job',id,startedAt:this.now(),uid:`job-${this.now()}-${++this.serial}`}; this.save(); return true;
  }
  claim() {
    const view = this.view(); if (!view.ready) return false;
    this.state.active = null;
    this.state.coins = integer(this.state.coins + view.item.reward);
    this.state.earned = integer(this.state.earned + view.item.reward); this.state.jobs = integer(this.state.jobs + 1);
    this.record('earned',`${view.item.name}下班，领到 ${view.item.reward} 金币。`); this.save(); return true;
  }
  cancelJob() {
    const view = this.view(); if (view.active?.kind !== 'job' || view.ready) return false;
    this.state.active = null; this.record('cancel',`提前结束${view.item.name}的工作，这次没有领取工资。`); this.save(); return true;
  }
  buyFood(id) {
    this.tick(); const food = FOODS.find(item => item.id === id);
    if (!food || this.state.active || this.state.coins < food.price) return false;
    this.state.coins -= food.price; this.state.spent = integer(this.state.spent + food.price);
    this.state.active = {kind:'food',id,startedAt:this.now(),uid:`food-${this.now()}-${++this.serial}`};
    this.record('spent',`花 ${food.price} 金币买了${food.name}。`); this.save(); return true;
  }
  tick() {
    const view = this.view();
    if (view.active?.kind !== 'food' || view.remaining > 0) return false;
    this.state.active = null; this.state.meals = integer(this.state.meals + 1);
    this.record('meal',`${view.item.name}吃完啦。${view.item.line}`); this.save(); return true;
  }
}
