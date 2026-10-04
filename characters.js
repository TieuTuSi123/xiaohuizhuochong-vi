// 角色注册表。桌宠本体、聊天窗、生活手帐和桌宠小屋都只从角色对象取名字、台词和图片。
// 放在仓库根目录：这里的 import.meta.url 与 index.js 同基准，绘梨衣的图片地址与 0.7.1 逐字相同。
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

// 返回一个姿势的图片地址。奶蛋这类取自数据库的角色需要运行时读到的图片表，读不到返回 null。
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
  if (pose.startsWith('eat-')) return '慢慢吃一顿饭';
  if (pose.startsWith('work-')) return '认真做好今天的小工作';
  return character.labels[pose] || character.labels.idle;
}
