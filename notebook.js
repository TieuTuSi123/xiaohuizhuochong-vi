import { icon } from './icons.js';
import { DATABASE_PAGES } from './database-shortcuts.js';

// Cuốn sổ nhỏ: Bảng điều khiển gắn liền với pet màn hình (trên điện thoại là ngăn kéo dưới cùng). Chỉ chịu trách nhiệm về giao diện và nút bấm, trạng thái do index.js cung cấp.
export function createNotebook(doc, { id, actions }) {
  const el = (tag, text, className) => {
    const node = doc.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  };
  const button = (text, className, iconName) => {
    const node = el('button', undefined, className); node.type = 'button';
    if (iconName) node.append(icon(doc, iconName));
    node.append(el('span', text));
    return node;
  };
  const root = el('section', undefined, 'erii-companion__notebook erii-nb');
  root.id = `${id}-notebook`; root.hidden = true;
  const grip = el('div', undefined, 'pet-grip'); grip.setAttribute('aria-hidden', 'true');
  const head = el('header', undefined, 'erii-companion__header erii-nb__head');
  const avatarFrame = el('span', undefined, 'erii-nb__avatar');
  const avatar = el('img'); avatar.alt = ''; avatar.draggable = false; avatarFrame.append(avatar);
  const who = el('div', undefined, 'erii-nb__who');
  const title = el('strong', '', 'erii-nb__title');
  const subtitle = el('span', '', 'erii-nb__subtitle');
  const hearts = el('span', undefined, 'erii-nb__hearts'); hearts.setAttribute('role', 'img');
  for (let i = 0; i < 5; i++) hearts.append(icon(doc, 'heart'));
  who.append(title, subtitle, hearts);
  const mood = el('span', '', 'erii-nb__mood');
  const close = el('button', '×', 'erii-companion__close'); close.type = 'button'; close.setAttribute('aria-label', 'Thu gọn sổ nhỏ');
  head.append(avatarFrame, who, mood, close);

  const needs = el('div', undefined, 'erii-nb__needs');
  const meters = {};
  for (const [key, label, iconName] of [['fullness', 'Độ no', 'bowl'], ['cleanliness', 'Độ sạch', 'bubbles']]) {
    const meter = el('div', undefined, 'pet-meter'); meter.dataset.need = key;
    const bar = el('span', undefined, 'pet-meter__bar'); const fill = el('i'); bar.append(fill);
    const value = el('span', '', 'pet-meter__value');
    meter.append(icon(doc, iconName), el('span', label, 'pet-meter__label'), bar, value);
    needs.append(meter); meters[key] = { meter, fill, value };
  }

  const section = (label, className) => { const node = el('section', undefined, `erii-nb__section ${className}`); node.append(el('h4', label, 'erii-nb__label')); return node; };
  const database = section('Cơ sở dữ liệu', 'erii-nb__database');
  const connection = el('p', 'Đang đợi giao diện dữ liệu của cơ sở dữ liệu', 'erii-companion__connection');
  const shortcuts = el('div', undefined, 'erii-nb__shortcuts');
  const shortcutButtons = [];
  for (const page of DATABASE_PAGES) {
    const primary = page.id === 'dashboard';
    const control = button(primary ? 'Mở cơ sở dữ liệu gốc' : page.label, primary ? 'erii-companion__database-open erii-nb__shortcut' : 'erii-nb__shortcut', page.icon);
    control.dataset.page = page.id;
    if (primary) { control.setAttribute('aria-label', 'Mở cơ sở dữ liệu gốc'); control.title = 'Mở cơ sở dữ liệu (Bảng điều khiển)'; }
    else control.title = `Mở bảng "${page.label}" của cơ sở dữ liệu`;
    shortcuts.append(control); shortcutButtons.push(control);
  }
  const tasks = el('div', undefined, 'erii-companion__tasks');
  database.append(connection, shortcuts, tasks);

  const company = section('Bầu bạn', 'erii-nb__company');
  const chips = el('div', undefined, 'erii-companion__controls');
  const leisureButtons = [];
  for (let i = 0; i < 6; i++) { const control = button('', 'pet-chip'); chips.append(control); leisureButtons.push(control); }
  const flower = button('Tặng cô ấy một bông hoa', 'pet-chip pet-chip--accent', 'flower');
  const clean = button('Tắm rửa', 'pet-chip pet-chip--accent', 'bubbles');
  chips.append(flower, clean);
  const story = button('Nghe một câu chuyện nhỏ', 'erii-companion__story-open', 'story');
  company.append(chips, story);

  const rooms = el('nav', undefined, 'erii-nb__rooms'); rooms.setAttribute('aria-label', 'Cửa sổ');
  const chat = button('Trò chuyện cùng Tiểu Hội', 'erii-nb__room', 'chat'); chat.setAttribute('aria-controls', `${id}-chat`);
  const life = button('Sổ tay sinh hoạt', 'erii-nb__room', 'coin'); life.setAttribute('aria-controls', `${id}-life`);
  const house = button('Nhà pet màn hình', 'erii-nb__room', 'house'); house.setAttribute('aria-controls', `${id}-house`);
  rooms.append(chat, life, house);

  const records = section('Bản ghi gần đây', 'erii-nb__records');
  const history = el('div', undefined, 'erii-companion__history');
  records.append(history);
  const help = el('p', '', 'erii-companion__help');
  root.append(grip, head, needs, database, company, rooms, records, help);

  const listeners = [];
  const listen = (target, type, callback) => { target.addEventListener(type, callback); listeners.push(() => target.removeEventListener(type, callback)); };
  listen(close, 'click', () => actions.close());
  listen(shortcuts, 'click', event => { const control = event.target.closest?.('button[data-page]'); if (control && !control.disabled) actions.shortcut(control.dataset.page); });
  listen(chips, 'click', event => { const control = event.target.closest?.('button[data-action]'); if (control && !control.disabled) actions.leisure(control.dataset.action); });
  listen(flower, 'click', () => actions.gift());
  listen(clean, 'click', () => actions.clean());
  listen(story, 'click', () => actions.story());
  listen(chat, 'click', () => actions.chat());
  listen(life, 'click', () => actions.life());
  listen(house, 'click', () => actions.house());

  let lastTasks = '', lastHistory = '';
  return {
    root, grip, head, close, flower, story,
    setCharacter(character, avatarUrl) {
      root.dataset.character = character.id;
      root.setAttribute('aria-label', character.notebookTitle);
      avatar.src = avatarUrl || '';
      avatarFrame.hidden = !avatarUrl;
      character.leisure.forEach(([slot, caption], index) => {
        const control = leisureButtons[index];
        control.dataset.action = slot; control.querySelector('span').textContent = caption;
      });
      flower.querySelector('span:last-child').textContent = `Tặng ${character.pronoun.toLowerCase()} một bông hoa`;
      chat.querySelector('span:last-child').textContent = `Trò chuyện cùng ${character.name}`;
      help.textContent = character.help;
    },
    render(view) {
      title.textContent = view.title;
      subtitle.textContent = `${view.care.tierName} · ${view.care.honor}`;
      hearts.setAttribute('aria-label', `Độ thân thiết ${view.care.tierName} (${view.care.tier + 1}/5)`);
      [...hearts.children].forEach((heart, index) => heart.classList.toggle('is-on', index <= view.care.tier));
      mood.textContent = view.care.moodName; mood.dataset.mood = view.care.mood;
      needs.hidden = !view.needsEnabled;
      for (const key of ['fullness', 'cleanliness']) {
        const value = Math.round(view.care[key]);
        meters[key].fill.style.width = `${value}%`; meters[key].value.textContent = String(value);
        meters[key].meter.dataset.low = String(value < 30);
      }
      connection.textContent = view.connection;
      const taskKey = JSON.stringify(view.tasks.map(task => [task.id, task.kind, task.feature, task.detail, task.busy]).concat([view.connected, view.busy]));
      if (taskKey !== lastTasks) {
        lastTasks = taskKey; tasks.replaceChildren();
        if (!view.tasks.length) tasks.append(el('p', view.connected ? view.busy ? 'Nhiệm vụ đã bắt đầu, tiến độ sẽ được đồng bộ theo thông báo của cơ sở dữ liệu.' : 'Đang đợi thông báo nhiệm vụ cơ sở dữ liệu tiếp theo.' : 'Chưa nhận được dữ liệu nhiệm vụ.', 'erii-nb__empty'));
        for (const task of view.tasks) {
          const card = el('article', undefined, 'erii-companion__task'); card.dataset.kind = task.kind;
          card.append(el('strong', task.feature || 'Nhiệm vụ cơ sở dữ liệu'), el('p', task.detail || (task.busy ? 'Đang xử lý…' : 'Đang đợi xử lý')));
          tasks.append(card);
        }
      }
      const historyKey = JSON.stringify(view.history.map(record => record.id));
      if (historyKey !== lastHistory) {
        lastHistory = historyKey; history.replaceChildren();
        if (!view.history.length) history.append(el('p', 'Thông báo mới sẽ được ghi lại ở đây.', 'erii-nb__empty'));
        for (const record of view.history.slice(0, 6)) {
          const card = el('article', undefined, 'erii-companion__record'); card.dataset.kind = record.kind;
          if (record.title) card.append(el('strong', record.title));
          card.append(el('p', record.text)); history.append(card);
        }
      }
      const blocked = view.busy || !view.enabled;
      flower.disabled = blocked; story.disabled = blocked;
      for (const control of leisureButtons) control.disabled = blocked;
      clean.disabled = !view.enabled || !view.needsEnabled;
      flower.title = view.busy ? `Đợi ${view.character?.pronoun.toLowerCase() || 'cô ấy'} ghi chép xong rồi hãy tặng hoa` : 'Tặng hoa chỉ có tác dụng với pet màn hình, không làm thay đổi nhiệm vụ cơ sở dữ liệu';
      clean.title = view.needsEnabled ? 'Tắm rửa chải chuốt một chút, khôi phục tối đa độ sạch (Thời gian hồi chiêu: 30 phút)' : 'Chỉ số nhu cầu đã bị tắt';
    },
    destroy() { for (const remove of listeners) remove(); root.remove(); },
  };
}
