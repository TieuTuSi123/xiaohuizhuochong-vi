import { icon } from './icons.js';
import { createSheet, leave } from './sheet.js';
import { createAurora } from './effects.js';
import { TIER_NAMES, MOOD_NAMES } from './care-model.js';

const LATIN = { erii: 'ERII', zero: 'ZERO', naidan: 'NAIDAN' };

// 桌宠小屋：一本翻开的图鉴。左页是立绘和流光，右页是养成档案；切换角色时翻页。
export function createPetHouse(host, { characters, currentId, care, portraits, available, moodExtra, nameOf, statusOf, fxTier, actions, returnFocus }) {
  const doc = host.document, listeners = [];
  let destroyed = false, focusId = currentId(), view = 'profile', aurora = null, ticker = null, editing = false, openedStory = '';
  const el = (tag, text, className) => { const node = doc.createElement(tag); if (text !== undefined) node.textContent = text; if (className) node.className = className; return node; };
  const button = (text, className, iconName) => { const node = el('button', undefined, className); node.type = 'button'; if (iconName) node.append(icon(doc, iconName)); node.append(el('span', text)); return node; };
  const listen = (target, type, callback, options) => { target.addEventListener(type, callback, options); listeners.push(() => target.removeEventListener(type, callback, options)); };
  const byId = id => characters.find(item => item.id === id) || characters[0];

  const root = el('section', undefined, 'erii-house'); root.id = 'erii-database-pet-house'; root.hidden = true;
  root.setAttribute('role', 'dialog'); root.setAttribute('aria-label', '桌宠小屋');
  const grip = el('div', undefined, 'pet-grip'); grip.setAttribute('aria-hidden', 'true');
  const header = el('header', undefined, 'erii-house__header');
  const heading = el('div', undefined, 'erii-house__heading');
  heading.append(el('span', '桌宠小屋 · 图鉴', 'erii-house__eyebrow'), el('h2', '今天，谁来陪你'));
  const close = el('button', '×', 'erii-house__close'); close.type = 'button'; close.setAttribute('aria-label', '关闭桌宠小屋');
  header.append(heading, close);
  const ribbons = el('div', undefined, 'erii-house__ribbons'); ribbons.setAttribute('role', 'tablist'); ribbons.setAttribute('aria-label', '角色');
  const ribbonButtons = {};
  characters.forEach((character, index) => {
    const ribbon = el('button', undefined, 'erii-house__ribbon'); ribbon.type = 'button';
    ribbon.dataset.id = character.id; ribbon.dataset.character = character.id;
    ribbon.setAttribute('role', 'tab'); ribbon.id = `erii-house-tab-${character.id}`; ribbon.setAttribute('aria-controls', 'erii-house-book');
    const thumb = el('img'); thumb.alt = ''; thumb.draggable = false;
    ribbon.append(el('span', `0${index + 1}`, 'erii-house__ribbon-no'), thumb, el('span', character.fullName, 'erii-house__ribbon-name'), el('span', '陪伴中', 'erii-house__ribbon-badge'));
    ribbons.append(ribbon); ribbonButtons[character.id] = ribbon;
  });

  const book = el('div', undefined, 'erii-house__book'); book.id = 'erii-house-book'; book.setAttribute('role', 'tabpanel');
  const plate = el('article', undefined, 'erii-house__plate');
  const glow = el('canvas', undefined, 'erii-house__aurora'); glow.setAttribute('aria-hidden', 'true');
  const frame = el('div', undefined, 'erii-house__frame');
  const portrait = el('img', undefined, 'erii-house__portrait'); portrait.draggable = false;
  const missing = el('p', '', 'erii-house__missing'); missing.hidden = true;
  frame.append(portrait, missing);
  const number = el('span', '', 'erii-house__no'), latin = el('span', '', 'erii-house__latin'), stamp = el('span', '', 'erii-house__stamp');
  plate.append(glow, frame, number, latin, stamp);

  const page = el('article', undefined, 'erii-house__page');
  const profile = el('div', undefined, 'erii-house__profile');
  const nameRow = el('div', undefined, 'erii-house__name-row');
  const name = el('h3', '', 'erii-house__name');
  const rename = el('button', undefined, 'erii-house__rename'); rename.type = 'button'; rename.append(icon(doc, 'pencil')); rename.setAttribute('aria-label', '改昵称'); rename.title = '改昵称';
  const nameInput = el('input', undefined, 'erii-house__name-input'); nameInput.maxLength = 12; nameInput.hidden = true; nameInput.setAttribute('aria-label', '昵称（留空恢复默认）');
  nameRow.append(name, rename, nameInput);
  const honor = el('p', '', 'erii-house__honor');
  const affection = el('div', undefined, 'erii-house__affection');
  const hearts = el('span', undefined, 'erii-house__hearts'); hearts.setAttribute('role', 'img');
  for (let i = 0; i < 5; i++) hearts.append(icon(doc, 'heart'));
  const bar = el('span', undefined, 'erii-house__bar'); const fill = el('i'); bar.append(fill);
  const points = el('span', '', 'erii-house__points');
  affection.append(hearts, bar, points);
  const moodRow = el('div', undefined, 'erii-house__mood');
  const moodStamp = el('span', '', 'erii-house__mood-stamp');
  moodRow.append(el('span', '心情', 'erii-house__key'), moodStamp);
  const needs = el('div', undefined, 'erii-house__needs');
  const meters = {};
  for (const [key, label, iconName] of [['fullness', '饱腹', 'bowl'], ['cleanliness', '清洁', 'bubbles']]) {
    const meter = el('div', undefined, 'pet-meter'); meter.dataset.need = key;
    const track = el('span', undefined, 'pet-meter__bar'); const level = el('i'); track.append(level);
    const value = el('span', '', 'pet-meter__value');
    meter.append(icon(doc, iconName), el('span', label, 'pet-meter__label'), track, value);
    needs.append(meter); meters[key] = { meter, level, value };
  }
  const facts = el('dl', undefined, 'erii-house__facts');
  const fact = label => { const wrap = el('div'); const value = el('dd', ''); wrap.append(el('dt', label), value); facts.append(wrap); return value; };
  const daysValue = fact('陪伴天数'), metValue = fact('认识的第一天'), taskValue = fact('陪你填表');
  const intro = el('p', '', 'erii-house__intro');
  const deck = el('div', undefined, 'erii-house__actions');
  const choose = button('换她来陪我', 'erii-house__choose', 'sparkle');
  const feed = button('喂她', 'erii-house__action', 'bowl');
  const wash = button('梳洗', 'erii-house__action', 'bubbles');
  const diaryOpen = button('成长日记', 'erii-house__action', 'book');
  deck.append(choose, feed, wash, diaryOpen);
  profile.append(nameRow, honor, affection, moodRow, needs, facts, intro, deck);

  const diary = el('div', undefined, 'erii-house__diary'); diary.hidden = true;
  const diaryHead = el('div', undefined, 'erii-house__diary-head');
  const diaryBack = button('回到档案', 'erii-house__action');
  diaryHead.append(el('h3', '成长日记'), diaryBack);
  const entries = el('ol', undefined, 'erii-house__entries');
  const storyList = el('div', undefined, 'erii-house__stories');
  diary.append(diaryHead, entries, el('h4', '专属小故事', 'erii-house__subhead'), storyList);
  page.append(profile, diary);
  book.append(plate, page);
  const status = el('p', '', 'erii-house__status'); status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
  root.append(grip, header, ribbons, book, status);
  doc.body.append(root);

  const sheet = createSheet(host, root, { grip, drag: [header], desktop: () => ({ width: 780, height: 600 }), onDismiss: () => hide() });
  const say = text => { status.textContent = text; };
  const date = ms => ms ? new Date(ms).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';

  function syncAurora() {
    const fancy = fxTier() === 'fancy' && !root.hidden && !doc.hidden;
    root.dataset.fx = fxTier();
    if (fancy && !aurora) aurora = createAurora(glow, host);
    if (!aurora) return;
    aurora.setColors(byId(focusId).theme.aurora);
    if (fancy) aurora.start(); else aurora.stop();
  }
  function render() {
    if (destroyed || root.hidden) return;
    const character = byId(focusId), current = currentId();
    const art = portraits(character), ready = available(character);
    root.dataset.character = character.id; plate.dataset.character = character.id;
    for (const item of characters) {
      const ribbon = ribbonButtons[item.id];
      const selected = item.id === focusId;
      ribbon.setAttribute('aria-selected', String(selected)); ribbon.tabIndex = selected ? 0 : -1;
      ribbon.dataset.current = String(item.id === current);
      const thumb = ribbon.querySelector('img'), thumbUrl = portraits(item)?.idle;
      thumb.hidden = !thumbUrl; if (thumbUrl && thumb.src !== thumbUrl) thumb.src = thumbUrl;
      ribbon.querySelector('.erii-house__ribbon-name').textContent = nameOf(item);
    }
    portrait.hidden = !art?.idle; missing.hidden = Boolean(art?.idle);
    if (art?.idle && !portrait.matches(':hover') && portrait.src !== art.idle) portrait.src = art.idle;
    portrait.alt = `${character.fullName}的立绘`;
    missing.textContent = ready.ok ? '' : ready.reason;
    number.textContent = `No.0${characters.indexOf(character) + 1}`; latin.textContent = LATIN[character.id] || character.id.toUpperCase();
    const state = care.view(character.id, moodExtra(character.id));
    const tier = state.tier;
    stamp.textContent = statusOf(character.id);
    stamp.dataset.current = String(character.id === current);
    if (!editing) name.textContent = nameOf(character);
    honor.textContent = `「${character.titles[tier]}」 · ${TIER_NAMES[tier]}`;
    hearts.setAttribute('aria-label', `亲密度 ${TIER_NAMES[tier]}（${tier + 1}/5）`);
    [...hearts.children].forEach((heart, index) => heart.classList.toggle('is-on', index <= tier));
    fill.style.width = `${Math.round(state.progress * 100)}%`;
    points.textContent = state.next === null ? `${state.affection} · 已满` : `${state.affection} / ${state.next}`;
    moodStamp.textContent = MOOD_NAMES[state.mood]; moodStamp.dataset.mood = state.mood;
    needs.hidden = !actions.needsEnabled();
    for (const key of ['fullness', 'cleanliness']) {
      const value = Math.round(state[key]);
      meters[key].level.style.width = `${value}%`; meters[key].value.textContent = String(value);
      meters[key].meter.dataset.low = String(value < 30);
    }
    daysValue.textContent = state.days ? `${state.days} 天` : '还没见过';
    metValue.textContent = date(state.firstMet);
    taskValue.textContent = `${state.counts.tasks} 次`;
    intro.textContent = character.intro;
    const isCurrent = character.id === current;
    choose.disabled = isCurrent || !ready.ok;
    choose.dataset.state = isCurrent ? 'current' : ready.ok ? '' : 'unavailable';
    choose.querySelector('span:last-child').textContent = isCurrent ? `${character.pronoun}正在陪你` : `换${character.pronoun}来陪我`;
    choose.title = ready.ok ? '' : ready.reason;
    feed.querySelector('span:last-child').textContent = `喂${character.pronoun}`;
    wash.disabled = !actions.needsEnabled();
    if (!diary.hidden) renderDiary(character, state);
  }
  function renderDiary(character, state) {
    entries.replaceChildren();
    if (!state.diary.length) entries.append(el('li', '还没有记录。多陪陪她吧。', 'erii-house__empty'));
    for (const item of state.diary.slice(0, 40)) {
      const row = el('li'); row.dataset.kind = item.kind;
      const when = el('time', new Date(item.at).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })); when.dateTime = new Date(item.at).toISOString();
      row.append(when, el('span', item.text)); entries.append(row);
    }
    storyList.replaceChildren();
    for (const story of character.stories) {
      const open = state.tier >= story.tier;
      const card = el('article', undefined, 'erii-house__story'); card.dataset.locked = String(!open);
      const toggle = el('button', undefined, 'erii-house__story-title'); toggle.type = 'button';
      toggle.append(el('span', open ? story.title : '？？？'), el('small', open ? '读一读' : `「${TIER_NAMES[story.tier]}」解锁`));
      toggle.disabled = !open; toggle.dataset.story = story.title;
      toggle.setAttribute('aria-expanded', String(openedStory === `${character.id}:${story.title}`));
      card.append(toggle);
      if (open && openedStory === `${character.id}:${story.title}`) card.append(el('p', story.text));
      storyList.append(card);
    }
  }
  function focus(id, animate = true) {
    if (id === focusId) return;
    focusId = id; editing = false; nameInput.hidden = true; name.hidden = false; openedStory = '';
    if (animate && fxTier() !== 'off') {
      page.classList.remove('is-turning'); plate.classList.remove('is-turning');
      void page.offsetWidth;
      page.classList.add('is-turning'); plate.classList.add('is-turning');
    }
    say(''); render(); syncAurora();
  }
  function startRename() {
    editing = true; nameInput.value = care.state(focusId).nickname; nameInput.placeholder = byId(focusId).name;
    name.hidden = true; nameInput.hidden = false; nameInput.focus({ preventScroll: true }); nameInput.select();
  }
  function finishRename(commit) {
    if (!editing) return;
    editing = false; nameInput.hidden = true; name.hidden = false;
    if (commit && actions.nickname(focusId, nameInput.value)) say(nameInput.value.trim() ? `记住了：${nameInput.value.trim()}` : '恢复了原来的名字。');
    render(); rename.focus({ preventScroll: true });
  }
  function open(id = currentId()) {
    if (destroyed) return;
    actions.onOpen?.();
    focusId = id; view = 'profile'; diary.hidden = true; profile.hidden = false;
    root.hidden = false; root.classList.remove('is-leaving');
    sheet.layout(); render(); syncAurora();
    host.clearInterval(ticker); ticker = host.setInterval(render, 1000);
    close.focus({ preventScroll: true });
  }
  function hide() {
    if (destroyed || root.hidden) return;
    finishRename(false);
    host.clearInterval(ticker); ticker = null;
    leave(host, root, () => { root.hidden = true; aurora?.stop(); say(''); actions.onClose?.(); returnFocus?.(); });
  }
  listen(close, 'click', hide);
  listen(ribbons, 'click', event => { const ribbon = event.target.closest?.('button[data-id]'); if (ribbon) focus(ribbon.dataset.id); });
  listen(ribbons, 'keydown', event => {
    const ids = characters.map(item => item.id), index = ids.indexOf(focusId);
    const next = { ArrowLeft: index - 1, ArrowUp: index - 1, ArrowRight: index + 1, ArrowDown: index + 1, Home: 0, End: ids.length - 1 }[event.key];
    if (next === undefined) return;
    event.preventDefault(); const id = ids[(next + ids.length) % ids.length]; focus(id); ribbonButtons[id].focus();
  });
  const wave = () => { const art = portraits(byId(focusId)); if (art?.wave) portrait.src = art.wave; };
  const rest = () => { const art = portraits(byId(focusId)); if (art?.idle) portrait.src = art.idle; };
  listen(portrait, 'pointerenter', wave); listen(portrait, 'pointerleave', rest);
  listen(rename, 'click', startRename);
  listen(nameInput, 'keydown', event => { if (event.key === 'Enter') { event.preventDefault(); finishRename(true); } if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); finishRename(false); } });
  listen(nameInput, 'blur', () => finishRename(true));
  listen(choose, 'click', () => { if (!choose.disabled) { actions.switchTo(focusId); render(); } });
  listen(feed, 'click', () => actions.feed(focusId));
  listen(wash, 'click', () => {
    const result = actions.clean(focusId);
    say(result?.tooSoon ? `刚梳洗过，${Math.ceil(result.wait / 60000)} 分钟后再来。` : '洗得干干净净。');
    render();
  });
  listen(diaryOpen, 'click', () => { view = 'diary'; profile.hidden = true; diary.hidden = false; render(); diaryBack.focus({ preventScroll: true }); });
  listen(diaryBack, 'click', () => { view = 'profile'; diary.hidden = true; profile.hidden = false; render(); diaryOpen.focus({ preventScroll: true }); });
  listen(storyList, 'click', event => {
    const toggle = event.target.closest?.('button[data-story]'); if (!toggle || toggle.disabled) return;
    const key = `${focusId}:${toggle.dataset.story}`; openedStory = openedStory === key ? '' : key; render();
  });
  listen(root, 'keydown', event => { if (event.key === 'Escape' && !editing) { event.stopPropagation(); hide(); } });
  listen(doc, 'visibilitychange', syncAurora);
  return {
    open, close: hide, render, get visible() { return !root.hidden; }, get focused() { return focusId; },
    refreshEffects: syncAurora,
    destroy() {
      if (destroyed) return;
      destroyed = true; host.clearInterval(ticker); aurora?.destroy(); sheet.destroy();
      for (const remove of listeners) remove(); root.remove();
    },
  };
}
