// Chọn lọc lời thoại: Lọc theo cấp độ thân thiết và tâm trạng, không lặp lại vài câu vừa nói gần đây ở cùng một chỗ. Hoàn toàn chạy cục bộ, không gọi API.
export function taskKind(feature) {
  const text = String(feature || '');
  if (/điền bảng|bắt kịp|bảng biểu/i.test(text)) return 'fill';
  if (/kế hoạch|cốt truyện|thúc đẩy/i.test(text)) return 'plot';
  return 'other';
}

export function timeOfDay(date = new Date()) {
  const hour = date.getHours();
  return hour >= 5 && hour < 11 ? 'morning' : hour >= 11 && hour < 17 ? 'noon' : hour >= 17 && hour < 23 ? 'evening' : 'night';
}

const entry = item => typeof item === 'string' ? { text: item } : item && typeof item.t === 'string' ? { text: item.t, tier: item.tier, mood: item.mood } : null;

function lookup(lines, path) {
  let node = lines;
  for (const part of path.split('.')) node = node?.[part];
  return Array.isArray(node) ? node : [];
}

export function fillLine(text, { me = '', user = '' } = {}) {
  return text.replaceAll('{me}', me).replaceAll('{user}', user);
}

export function createLinePicker({ random = Math.random } = {}) {
  const recent = new Map();
  function pick(character, path, { tier = 0, mood = 'calm', me = character.name, user = '' } = {}) {
    const usable = lookup(character.lines, path).map(entry).filter(item => item?.text
      && (item.tier || 0) <= tier && (!item.mood || item.mood === mood) && (user || !item.text.includes('{user}')));
    if (!usable.length) return '';
    const special = usable.filter(item => item.mood);
    const plain = usable.filter(item => !item.mood);
    const pool = special.length && (!plain.length || random() < .6) ? special : plain;
    const key = `${character.id}:${path}`;
    const memory = recent.get(key) || [];
    const fresh = pool.filter(item => !memory.includes(item.text));
    const from = fresh.length ? fresh : pool;
    const choice = from[Math.floor(random() * from.length) % from.length];
    memory.push(choice.text);
    while (memory.length > Math.max(0, Math.min(3, pool.length - 1))) memory.shift();
    recent.set(key, memory);
    return fillLine(choice.text, { me, user });
  }
  return { pick };
}
