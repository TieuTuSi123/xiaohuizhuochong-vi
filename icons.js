// Một bộ icon nét mảnh, độ dày viền đồng nhất, nhằm tránh việc render emoji không đồng bộ trên các nền tảng khác nhau. Chỉ chèn các SVG cố định có trong tệp này.
const PATHS = {
  heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  bowl: '<path d="M4 11h16a8 8 0 0 1-16 0z"/><path d="M8.5 7.5c0-1 1-1.4 1-2.4M12 7.5c0-1 1-1.4 1-2.4M15.5 7.5c0-1 1-1.4 1-2.4"/>',
  bubbles: '<circle cx="9" cy="14" r="5"/><circle cx="17" cy="7.5" r="3"/><circle cx="17.5" cy="16.5" r="1.8"/><path d="M7 12.4a2.3 2.3 0 0 1 2-1.4"/>',
  gauge: '<path d="M4 16a8 8 0 1 1 16 0"/><path d="M12 16l3.6-4.6"/><circle cx="12" cy="16" r="1.1"/>',
  table: '<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M4 10h16M10 10v9"/>',
  compass: '<circle cx="12" cy="12" r="8"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  archive: '<rect x="3.5" y="5" width="17" height="4" rx="1"/><path d="M5 9v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9M10 13h4"/>',
  plug: '<path d="M9 3v5M15 3v5M7 8h10v3a5 5 0 0 1-10 0zM12 16v5"/>',
  grid: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 9.5h16M4 14.5h16M9.5 4v16M14.5 4v16"/>',
  chat: '<path d="M5 6h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-8l-4 3v-3H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z"/>',
  coin: '<circle cx="12" cy="12" r="7.5"/><path d="M12 8.4v7.2M14.3 10.1c-.4-.8-1.2-1.2-2.3-1.2-1.4 0-2.3.7-2.3 1.6 0 2.3 4.6 1.2 4.6 3.4 0 1-.9 1.6-2.3 1.6-1.1 0-1.9-.4-2.3-1.2"/>',
  house: '<path d="M4 11l8-6 8 6M6 9.8V19h12V9.8"/><path d="M10 19v-5h4v5"/>',
  book: '<path d="M5 5.5A1.5 1.5 0 0 1 6.5 4H19v15H6.5A1.5 1.5 0 0 0 5 20.5z"/><path d="M5 20.5V5.5M9 8h6"/>',
  flower: '<circle cx="12" cy="8.5" r="2"/><path d="M12 10.5V20M12 15.5c-1.8-1.8-3.8-1.9-5-1M12 6.5c.2-2 1.2-3 2.2-3s1.8 1.6-.4 3.7M10 8.5c-2 .1-3.1-.8-3.1-1.8s1.6-1.9 3.6.2M14 8.5c2-.1 3.1.8 3.1 1.8s-1.6 1.9-3.6-.2"/>',
  sparkle: '<path d="M12 3.5l1.7 4.8 4.8 1.7-4.8 1.7L12 16.5l-1.7-4.8L5.5 10l4.8-1.7z"/><path d="M18.5 16v4M16.5 18h4"/>',
  pencil: '<path d="M5 19l1-4 9.5-9.5 3 3L9 18z"/><path d="M13.5 7.5l3 3"/>',
  story: '<path d="M6 4h9l3 3v13H6z"/><path d="M15 4v3h3M9 11h6M9 14h6M9 17h4"/>',
  briefcase: '<rect x="4" y="7.5" width="16" height="11" rx="2"/><path d="M9 7.5V6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6v1.5M4 12.5h16"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  expand: '<path d="M14 5h5v5M10 19H5v-5M19 5l-6 6M5 19l6-6"/>',
  stop: '<rect x="7" y="7" width="10" height="10" rx="1.5"/>',
  look: '<circle cx="11" cy="11" r="6"/><path d="M15.5 15.5L20 20"/>',
};

export function icon(doc, name, className = '') {
  const span = doc.createElement('span');
  span.className = `pet-icon${className ? ` ${className}` : ''}`;
  span.setAttribute('aria-hidden', 'true');
  span.innerHTML = `<svg viewBox="0 0 24 24" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${PATHS[name] || ''}</svg>`;
  return span;
}
