// Bảng đăng ký nhân vật. Phần thân Desktop Pet, cửa sổ trò chuyện, sổ tay sinh hoạt và ngôi nhà pet đều chỉ lấy tên, câu thoại và hình ảnh từ đối tượng nhân vật.
// Đặt tại thư mục gốc của kho lưu trữ: import.meta.url ở đây có cùng chuẩn cơ sở với index.js, đường dẫn hình ảnh của Erii trùng khớp từng ký tự với bản 0.7.1.
import erii from './characters/erii.js';
import zero from './characters/zero.js';
import naidan from './characters/naidan.js';
import claude from './characters/claude.js';

export const CHARACTERS = Object.freeze({ erii, zero, naidan, claude });
export const CHARACTER_IDS = Object.freeze(Object.keys(CHARACTERS));
export const DEFAULT_CHARACTER = 'erii';
export const POSES = Object.freeze(['idle', 'received', 'writing', 'complete', 'error', 'tea', 'reading', 'origami', 'duck',
  'stretch', 'rest', 'gift', 'lifted', 'land', 'wave', 'peek']);
export const EDGE_POSES = Object.freeze(['edge-left', 'edge-right', 'edge-bottom', 'edge-top']);
export const LIFE_POSES = Object.freeze(['work-bookshop', 'work-bakery', 'work-florist', 'eat-pudding', 'eat-riceball', 'eat-omurice', 'eat-ramen']);

export const resolveCharacter = id => CHARACTERS[id] || CHARACTERS[DEFAULT_CHARACTER];
export const usesDatabaseArt = character => character.assets.source === 'database';

// Skin (trang phục) chỉ khai báo các tư thế có ảnh; các tư thế không viết sẽ kế thừa ảnh gốc của nhân vật. Đường dẫn tương đối so với thư mục gốc của tiện ích mở rộng (cùng chuẩn cơ sở với index.js).
export function skinAssetUrl(skin, pose) {
  const file = skin?.assets?.poses?.[pose];
  if (typeof file !== 'string' || !file) return null;
  return new URL(`${skin.assets.base || ''}${file}`, import.meta.url).href;
}

// Trả về địa chỉ URL hình ảnh của một tư thế. Những nhân vật lấy từ cơ sở dữ liệu như Nãi Đán (Naidan) cần bảng ảnh đọc được trong thời gian chạy (runtime), nếu không đọc được sẽ trả về null.
// Khi truyền vào skin (xem skin-model.js), tư thế có ảnh trong skin sẽ được ưu tiên.
export function assetUrl(character, pose, runtimeImages = null, skin = null) {
  const skinned = skinAssetUrl(skin, pose);
  if (skinned) return skinned;
  const assets = character.assets;
  if (assets.source === 'database') return runtimeImages?.[assets.poses[pose] || assets.poses.idle] || null;
  if (pose.startsWith('edge-')) return new URL(`${assets.base}${assets.edge[pose.slice(5)]}.webp`, import.meta.url).href;
  if (/^(work|eat)-/.test(pose)) return new URL(`${assets.life}${pose}.webp`, import.meta.url).href;
  return new URL(`${assets.base}${assets.files[pose] || pose}.webp`, import.meta.url).href;
}

export function imageUrls(character, runtimeImages = null, skin = null) {
  const urls = {};
  for (const pose of [...POSES, ...EDGE_POSES, ...LIFE_POSES]) urls[pose] = assetUrl(character, pose, runtimeImages, skin);
  return urls;
}

// Chủ đề như màu hạt hiệu ứng (particle): Skin có thể ghi đè một phần trong đó, phần không khai báo sẽ kế thừa từ chính nhân vật.
export const themeOf = (character, skin = null) => skin?.theme ? { ...character.theme, ...skin.theme } : character.theme;

export function poseLabel(character, pose) {
  if (pose.startsWith('eat-')) return 'Thong thả ăn một bữa cơm';
  if (pose.startsWith('work-')) return 'Chăm chỉ hoàn thành tốt công việc nhỏ hôm nay';
  return character.labels[pose] || character.labels.idle;
}