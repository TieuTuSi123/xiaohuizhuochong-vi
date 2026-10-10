// Nuôi dưỡng: độ thân thiết, chỉ số nhu cầu, tâm trạng, nhật ký trưởng thành, biệt danh, gặp mặt hằng ngày. Chỉ chứa logic thuần, thời gian có thể tiêm (inject) vào, việc lưu trữ giao cho bên gọi (caller).
// Quy ước: độ thân thiết chỉ tăng không giảm; chỉ số nhu cầu chỉ ảnh hưởng đến tâm trạng và lời thoại, không có bất kỳ hình phạt nào, có thể tắt toàn bộ.
const MINUTE = 60000, HOUR = 60 * MINUTE, DAY = 24 * HOUR;
export const TIERS = Object.freeze([0, 100, 300, 700, 1500]);
export const TIER_NAMES = Object.freeze(['Mới quen', 'Quen thuộc', 'Gần gũi', 'Tin tưởng', 'Yêu thương']);
export const MOOD_NAMES = Object.freeze({ worried: 'Lo lắng', sulky: 'Tủi thân', hungry: 'Đói bụng', dirty: 'Muốn tắm rửa', missing: 'Nhớ bạn', happy: 'Vui vẻ', calm: 'Bình tĩnh' });
export const DECAY = Object.freeze({ fullness: 100 / (12 * HOUR), cleanliness: 100 / (24 * HOUR) });
export const FOOD_CARE = Object.freeze({ pudding: [15, 3], riceball: [25, 4], omurice: [40, 6], ramen: [50, 8] });
export const CLEAN_COOLDOWN = 30 * MINUTE;
// [Mỗi lần cộng bao nhiêu, mỗi ngày cộng tối đa bao nhiêu]
const GAINS = Object.freeze({ tap: [1, 20], gift: [5, 15], chat: [2, 20], task: [2, 20], greet: [5, 5], wage: [3, Infinity], clean: [2, 6], meal: [0, Infinity] });
const TASK_MARKS = [1, 10, 50, 100, 500, 1000];
const DAY_MARKS = [7, 30, 100, 365];
const FOOD_NAMES = { pudding: 'Pudding', riceball: 'Cơm nắm', omurice: 'Cơm cuộn trứng', ramen: 'Ramen' };
const JOB_NAMES = { bookshop: 'Tiệm sách', bakery: 'Tiệm bánh ngọt', florist: 'Tiệm hoa' };

const count = value => Math.min(1e9, Math.max(0, Math.floor(Number(value) || 0)));
const level = value => Math.min(100, Math.max(0, Number.isFinite(Number(value)) ? Number(value) : 80));
const time = value => Number.isFinite(value) && value > 0 ? value : 0;
export function dayKey(ms) {
  const date = new Date(ms);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export const tierOf = affection => TIERS.reduce((found, need, index) => affection >= need ? index : found, 0);

function normalizeCharacter(saved = {}, now) {
  const counts = saved.counts || {};
  const bag = value => Object.fromEntries(Object.entries(value && typeof value === 'object' ? value : {}).map(([key, n]) => [String(key).slice(0, 20), count(n)]).slice(0, 20));
  return {
    affection: count(saved.affection), firstMet: time(saved.firstMet), lastSeen: typeof saved.lastSeen === 'string' ? saved.lastSeen.slice(0, 10) : '',
    days: count(saved.days), fullness: level(saved.fullness), cleanliness: level(saved.cleanliness),
    needsAt: time(saved.needsAt) || now, lastCleanAt: time(saved.lastCleanAt), lastTouchAt: time(saved.lastTouchAt), lastTreatAt: time(saved.lastTreatAt),
    nickname: typeof saved.nickname === 'string' ? saved.nickname.trim().slice(0, 12) : '',
    daily: { date: typeof saved.daily?.date === 'string' ? saved.daily.date : '', counts: bag(saved.daily?.counts) },
    counts: { tasks: count(counts.tasks), gifts: count(counts.gifts), cleans: count(counts.cleans), chats: count(counts.chats), meals: bag(counts.meals), jobs: bag(counts.jobs) },
    diary: Array.isArray(saved.diary) ? saved.diary.filter(item => item && typeof item.text === 'string' && Number.isFinite(item.at))
      .slice(0, 120).map(item => ({ at: item.at, kind: String(item.kind || 'note').slice(0, 20), text: item.text.slice(0, 120) })) : [],
    marks: Object.fromEntries(Object.entries(saved.marks && typeof saved.marks === 'object' ? saved.marks : {}).filter(([, at]) => Number.isFinite(at)).slice(0, 200)),
    seeded: saved.seeded === true,
  };
}

export class CareModel {
  constructor(saved, { now = () => Date.now(), persist = () => {}, needsEnabled = () => true } = {}) {
    this.now = now; this.persist = persist; this.needsEnabled = needsEnabled;
    const current = this.now();
    this.characters = {};
    for (const [id, value] of Object.entries(saved?.characters || {})) this.characters[id] = normalizeCharacter(value, current);
  }
  state(id) { return this.characters[id] ||= normalizeCharacter({}, this.now()); }
  save() { this.persist({ schema: 1, characters: JSON.parse(JSON.stringify(this.characters)) }); }
  note(state, kind, text, mark = '') {
    if (mark) { if (state.marks[mark]) return; state.marks[mark] = this.now(); }
    state.diary.unshift({ at: this.now(), kind, text });
    state.diary.length = Math.min(120, state.diary.length);
  }
  // Chỉ số nhu cầu giảm dần theo thời gian; khi tắt chỉ số nhu cầu sẽ đóng băng tại thời điểm tắt (setNeedsEnabled chịu trách nhiệm quyết toán).
  needs(id) {
    const state = this.state(id);
    if (!this.needsEnabled()) return { fullness: state.fullness, cleanliness: state.cleanliness };
    const elapsed = Math.max(0, this.now() - state.needsAt);
    return { fullness: Math.max(0, state.fullness - elapsed * DECAY.fullness), cleanliness: Math.max(0, state.cleanliness - elapsed * DECAY.cleanliness) };
  }
  settle(state, id) {
    const values = this.needs(id);
    state.fullness = values.fullness; state.cleanliness = values.cleanliness; state.needsAt = this.now();
  }
  setNeedsEnabled(enabled) {
    for (const [id, state] of Object.entries(this.characters)) {
      if (!enabled) { const values = this.needs(id); state.fullness = values.fullness; state.cleanliness = values.cleanliness; }
      state.needsAt = this.now();
    }
    this.save();
  }
  tier(id) { return tierOf(this.state(id).affection); }
  gain(id, source, amount = GAINS[source]?.[0] || 0) {
    const state = this.state(id);
    const today = dayKey(this.now());
    if (state.daily.date !== today) state.daily = { date: today, counts: {} };
    const cap = GAINS[source]?.[1] ?? Infinity;
    const used = state.daily.counts[source] || 0;
    const add = Math.max(0, Math.min(amount, cap - used));
    if (Number.isFinite(cap)) state.daily.counts[source] = used + add;
    const before = tierOf(state.affection);
    state.affection = count(state.affection + add);
    const after = tierOf(state.affection);
    if (after > before) this.note(state, 'tier', `Độ thân thiết tăng lên mức 「${TIER_NAMES[after]}」。`, `tier-${after}`);
    return { gained: add, capped: add < amount, tierUp: after > before ? after : 0 };
  }
  // Lần đầu gặp mặt mỗi ngày: trả về first (lần đầu quen biết) / back (cách nhau trên ba ngày) / chào hỏi bình thường; gọi lại trong cùng một ngày sẽ trả về null.
  greet(id) {
    const state = this.state(id);
    const now = this.now(), today = dayKey(now);
    if (state.lastSeen === today) return null;
    const first = !state.firstMet;
    const away = state.lastSeen ? Math.round((new Date(`${today}T00:00`) - new Date(`${state.lastSeen}T00:00`)) / DAY) : 0;
    // Mở nhà nhỏ trước khi quen biết cũng sẽ tạo hồ sơ; chỉ số nhu cầu chỉ bắt đầu tính từ lần gặp mặt đầu tiên.
    if (first) { state.firstMet = now; state.fullness = 80; state.cleanliness = 80; state.needsAt = now; this.note(state, 'meet', 'Ngày đầu tiên quen biết.', 'meet'); }
    state.lastSeen = today; state.days = count(state.days + 1); state.lastTouchAt = now;
    for (const mark of DAY_MARKS) if (state.days === mark) this.note(state, 'days', `Ngày thứ ${mark} đồng hành cùng nhau.`, `days-${mark}`);
    const result = this.gain(id, 'greet');
    this.save();
    return { first, back: away >= 3, days: state.days, ...result };
  }
  touch(id) { const state = this.state(id); state.lastTouchAt = this.now(); const result = this.gain(id, 'tap'); this.save(); return result; }
  gift(id) {
    const state = this.state(id);
    state.lastTouchAt = state.lastTreatAt = this.now(); state.counts.gifts = count(state.counts.gifts + 1);
    if (state.counts.gifts === 1) this.note(state, 'gift', 'Lần đầu tiên nhận được hoa bạn tặng.', 'gift');
    const result = this.gain(id, 'gift'); this.save(); return result;
  }
  feed(id, foodId) {
    const [fullness, affection] = FOOD_CARE[foodId] || [10, 2];
    const state = this.state(id);
    this.settle(state, id);
    state.fullness = Math.min(100, state.fullness + fullness);
    state.lastTouchAt = state.lastTreatAt = this.now();
    state.counts.meals[foodId] = count((state.counts.meals[foodId] || 0) + 1);
    if (state.counts.meals[foodId] === 1 && FOOD_NAMES[foodId]) this.note(state, 'meal', `Lần đầu tiên ăn ${FOOD_NAMES[foodId]}.`, `meal-${foodId}`);
    const result = this.gain(id, 'meal', affection); this.save(); return result;
  }
  clean(id) {
    const state = this.state(id);
    if (this.now() - state.lastCleanAt < CLEAN_COOLDOWN) return { tooSoon: true, gained: 0, tierUp: 0, wait: CLEAN_COOLDOWN - (this.now() - state.lastCleanAt) };
    this.settle(state, id);
    state.cleanliness = 100; state.lastCleanAt = state.lastTouchAt = this.now(); state.counts.cleans = count(state.counts.cleans + 1);
    if (state.counts.cleans === 1) this.note(state, 'clean', 'Lần đầu tiên được chải chuốt tắm rửa sạch sẽ.', 'clean');
    const result = this.gain(id, 'clean'); this.save(); return { tooSoon: false, ...result };
  }
  chatRound(id) {
    const state = this.state(id);
    state.lastTouchAt = this.now(); state.counts.chats = count(state.counts.chats + 1);
    if (state.counts.chats === 1) this.note(state, 'chat', 'Lần đầu tiên trò chuyện.', 'chat');
    const result = this.gain(id, 'chat'); this.save(); return result;
  }
  taskDone(id) {
    const state = this.state(id);
    state.counts.tasks = count(state.counts.tasks + 1);
    for (const mark of TASK_MARKS) if (state.counts.tasks === mark) this.note(state, 'task', mark === 1 ? 'Lần đầu tiên cùng bạn điền xong cơ sở dữ liệu.' : `Đã cùng bạn hoàn thành ${mark} nhiệm vụ cơ sở dữ liệu.`, `task-${mark}`);
    const result = this.gain(id, 'task'); this.save(); return result;
  }
  wage(id, jobId) {
    const state = this.state(id);
    state.lastTouchAt = this.now(); state.counts.jobs[jobId] = count((state.counts.jobs[jobId] || 0) + 1);
    if (state.counts.jobs[jobId] === 1 && JOB_NAMES[jobId]) this.note(state, 'job', `Lần đầu tiên đi làm thêm ở ${JOB_NAMES[jobId]}.`, `job-${jobId}`);
    const result = this.gain(id, 'wage'); this.save(); return result;
  }
  setNickname(id, value) {
    const state = this.state(id);
    const nickname = String(value || '').trim().slice(0, 12);
    if (nickname === state.nickname) return false;
    state.nickname = nickname;
    if (nickname) this.note(state, 'name', `Đã có cái tên mới: ${nickname}.`);
    this.save(); return true;
  }
  // Người dùng cũ nâng cấp: quy đổi độ thân thiết ban đầu dựa trên ghi chép đã có, tối đa đến mốc「Quen thuộc」; chỉ thực hiện một lần.
  seed(id, { chats = 0, jobs = 0, meals = 0, earliest = 0 } = {}) {
    const state = this.state(id);
    if (state.seeded) return false;
    state.seeded = true;
    if (!state.affection && !state.firstMet && (chats || jobs || meals || earliest)) {
      state.affection = Math.min(TIERS[2] - 1, count(chats) * 2 + count(jobs) * 3 + count(meals) * 5);
      state.firstMet = time(earliest) || this.now();
      state.diary.unshift({ at: state.firstMet, kind: 'meet', text: 'Ngày đầu tiên quen biết.' });
      state.marks.meet = state.firstMet;
    }
    this.save(); return true;
  }
  mood(id, { worriedUntil = 0, unanswered = 0 } = {}) {
    const state = this.state(id), now = this.now();
    const { fullness, cleanliness } = this.needs(id);
    const needs = this.needsEnabled();
    if (worriedUntil > now) return 'worried';
    if (unanswered >= 3) return 'sulky';
    if (needs && fullness < 30) return 'hungry';
    if (needs && cleanliness < 30) return 'dirty';
    if (state.lastTouchAt && now - state.lastTouchAt > 6 * HOUR) return 'missing';
    if (state.lastSeen && state.lastSeen !== dayKey(now)) return 'missing';
    if (now - state.lastTreatAt < 30 * MINUTE || (now - state.lastTouchAt < HOUR && (!needs || (fullness >= 60 && cleanliness >= 60)))) return 'happy';
    return 'calm';
  }
  view(id, extra) {
    const state = this.state(id);
    const tier = tierOf(state.affection);
    const floor = TIERS[tier], next = TIERS[tier + 1];
    return { ...state, ...this.needs(id), tier, tierName: TIER_NAMES[tier], next: next ?? null,
      progress: next ? (state.affection - floor) / (next - floor) : 1, mood: this.mood(id, extra) };
  }
}
