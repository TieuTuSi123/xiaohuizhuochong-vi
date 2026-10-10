// Sổ đăng ký nhân vật. Bản thể pet màn hình, cửa sổ trò chuyện, sổ tay sinh hoạt và nhà nhỏ của pet đều chỉ lấy tên, lời thoại và hình ảnh từ đối tượng nhân vật.
// Đặt ở thư mục gốc của repository: import.meta.url ở đây cùng cơ sở (base) với index.js, đường dẫn hình ảnh của Erii giống y hệt từng chữ so với bản 0.7.1.
import erii from './characters/erii.js';
import zero from './characters/zero.js';
import naidan from './characters/naidan.js';

export const CHARACTERS = Object.freeze({ erii, zero, naidan });
export const CHARACTER_IDS = Object.freeze(Object.keys(CHARACTERS));
export const DEFAULT_CHARACTER = 'erii';
export const POSES = Object.freeze(['idle', 'received', 'writing', 'complete', 'error', 'tea', 'reading', 'origami', 'duck',
  'stretch', 'rest', 'gift', 'lifted', 'land', 'wave', 'peek']);
export const EDGE_POSES = Object.freeze(['edge-left', 'edge-right', 'edge-bottom', 'edge-top']);
export const LIFE_POSES = Object.freeze(['work-bookshop', 'work-bakery', 'work-florist', 'eat-pudding', 'eat-riceball', 'eat-omurice', 'eat-ramen']);

export const resolveCharacter = id => CHARACTERS[id] || CHARACTERS[DEFAULT_CHARACTER];
export const usesDatabaseArt = character => character.assets.source === 'database';

// Trả về đường dẫn hình ảnh của một tư thế. Những nhân vật lấy từ cơ sở dữ liệu như Nai Dan cần bảng hình ảnh đọc được tại thời điểm runtime, nếu không đọc được sẽ trả về null.
export function assetUrl(character, pose, runtimeImages = null) {
  const assets = character.assets;
  if (assets.source === 'database') return runtimeImages?.[assets.poses[pose] || assets.poses.idle] || null;
  if (pose.startsWith('edge-')) return new URL(`${assets.base}${assets.edge[pose.slice(5)]}.webp`, import.meta.url).href;
  if (/^(work|eat)-/.test(pose)) return new URL(`${assets.life}${pose}.webp`, import.meta.url).href;
  return new URL(`${assets.base}${assets.files[pose] || pose}.webp`, import.meta.url).href;
}

export function imageUrls(character, runtimeImages = null) {
  const urls = {};
  for (const pose of [...POSES, ...EDGE_POSES, ...LIFE_POSES]) urls[pose] = assetUrl(character, pose, runtimeImages);
  return urls;
}

export function poseLabel(character, pose) {
  if (pose.startsWith('eat-')) return 'Thong thả ăn một bữa cơm';
  if (pose.startsWith('work-')) return 'Chăm chỉ hoàn thành công việc nhỏ hôm nay';
  return character.labels[pose] || character.labels.idle;
}
