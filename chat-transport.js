// Thẩm quyền phiên bản: openai.js chính thức 1.14.0–1.19.0 và mã nguồn 1.17.0 được cài đặt.
// Mỗi yêu cầu sở hữu AbortSignal riêng. Không có các sự kiện tạo/dừng toàn cục hay chỉnh sửa thiết lập.
export const CHAT_DEFAULTS = { mode: 'current', url: '', model: '', nickname: '', relationship: 'Người yêu', maxTokens: 768, rememberKey: false, replyStyle: 'natural', memory: '' };

export function normalizeChatConfig(value = {}, defaults = {}) {
  const relationship = defaults.relationship || CHAT_DEFAULTS.relationship;
  return { ...CHAT_DEFAULTS, mode: value.mode === 'custom' ? 'custom' : 'current',
    url: String(value.url || '').trim().slice(0, 1000), model: String(value.model || '').trim().slice(0, 200),
    nickname: String(value.nickname || '').trim().slice(0, 40), relationship: String(value.relationship || relationship).trim().slice(0, 80),
    maxTokens: Math.min(4096, Math.max(128, Number(value.maxTokens) || 768)), rememberKey: value.rememberKey === true,
    replyStyle: ['natural', 'short', 'detailed'].includes(value.replyStyle) ? value.replyStyle : 'natural',
    memory: String(value.memory || '').trim().slice(0, 2000) };
}

export function apiBase(value) {
  let url;
  try { url = new URL(value); } catch { throw new Error('Vui lòng điền địa chỉ API đầy đủ, ví dụ https://api-cua-ban/v1'); }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash)
    throw new Error('Địa chỉ API cần sử dụng http hoặc https, vui lòng điền API Key vào ô nhập khóa riêng.');
  url.pathname = url.pathname.replace(/\/chat\/completions\/?$/, '').replace(/\/+$/, '');
  return url.href.replace(/\/$/, '');
}

export function responseText(data) {
  const parts = value => typeof value === 'string' ? value : Array.isArray(value)
    ? value.filter(p => p.type !== 'thinking' && p.type !== 'reasoning').map(p => p.text || '').join('') : '';
  return parts(data?.choices?.[0]?.message?.content) || data?.choices?.[0]?.text
    || parts(data?.content) || data?.candidates?.[0]?.content?.parts?.filter(p => !p.thought).map(p => p.text || '').join('')
    || data?.results?.[0]?.text || data?.output?.filter(p => p.type === 'message').map(p => parts(p.content)).join('')
    || data?.response || '';
}

export function safeChatError(error, key = '') {
  let text = typeof error === 'string' ? error : error?.message || 'Kết nối không thành công, vui lòng kiểm tra thiết lập API rồi thử lại.';
  if (key) text = text.split(key).join('［Khóa đã bị ẩn］');
  return String(text).slice(0, 350);
}

async function fetchHostJSON(host, context, url, body, signal) {
  signal?.throwIfAborted();
  if (typeof context.getRequestHeaders !== 'function') throw new Error('Giao diện kết nối SillyTavern chưa sẵn sàng, vui lòng tải lại trang rồi thử lại.');
  const response = await host.fetch(url, { method: 'POST', headers: context.getRequestHeaders(), body: JSON.stringify(body), signal, cache: 'no-store' });
  let data;
  try { data = await response.json(); } catch { throw new Error(`API không trả về dữ liệu hợp lệ (${response.status}), vui lòng kiểm tra xem địa chỉ có đúng không.`); }
  if (!response.ok || data?.error) {
    const detail = typeof data?.error === 'string' ? data.error : data?.error?.message;
    throw new Error(detail || `Kết nối thất bại (${response.status}), vui lòng kiểm tra địa chỉ, model, khóa hoặc hạn mức.`);
  }
  signal?.throwIfAborted();
  return data;
}

export function normalizeModelList(data) {
  const items = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : data?.models;
  if (!Array.isArray(items)) return [];
  return [...new Set(items.map(item => typeof item === 'string' ? item : item?.id || item?.name)
    .filter(id => typeof id === 'string' && id.trim() && id.length <= 200).map(id => id.trim()))]
    .sort((a, b) => a.localeCompare(b));
}

// Tuyến trạng thái native được xác minh trong 1.14.0–1.19.0; phần này chỉ đọc siêu dữ liệu của model.
export async function requestModelList(host, context, config, { signal, apiKey = '' } = {}) {
  if (config.mode !== 'custom') throw new Error('Kết nối hiện tại tuân theo model của SillyTavern; nếu muốn chọn model riêng, vui lòng chuyển sang "Cấu hình API riêng".');
  const data = await fetchHostJSON(host, context, '/api/backends/chat-completions/status', {
    chat_completion_source: 'custom', custom_url: apiBase(config.url),
    custom_include_headers: JSON.stringify({ Authorization: apiKey ? `Bearer ${apiKey}` : '' }),
  }, signal);
  const models = normalizeModelList(data);
  if (!models.length) throw new Error('API không trả về model nào để chọn. Có thể API không cung cấp danh sách model, vẫn có thể điền tên model thủ công.');
  return models;
}

export async function requestChat(host, context, config, messages, { signal, apiKey = '', loadModule } = {}) {
  signal?.throwIfAborted();
  if (context.eriiPreviewMode === 'live' && config.mode !== 'custom')
    throw new Error('Trang xem trước độc lập không thể đọc API hiện tại của SillyTavern, vui lòng chọn "Cấu hình API riêng" trong thiết lập kết nối. Có thể sử dụng kết nối hiện tại sau khi cài đặt vào SillyTavern.');
  const load = loadModule || (path => import(new URL(path, host.document.baseURI).href));
  const fetchJSON = (url, body) => fetchHostJSON(host, context, url, body, signal);
  let data;
  if (config.mode === 'custom') {
    if (!config.model) throw new Error('Vui lòng điền tên model trong thiết lập kết nối trước.');
    data = await fetchJSON('/api/backends/chat-completions/generate', {
      chat_completion_source: 'custom', custom_url: apiBase(config.url), model: config.model,
      // Luôn ghi đè khóa CUSTOM của host, bao gồm cả các endpoint cục bộ không cần khóa.
      custom_include_headers: JSON.stringify({ Authorization: apiKey ? `Bearer ${apiKey}` : '' }),
      messages, max_tokens: config.maxTokens, temperature: 0.8, top_p: 1, stream: false,
    });
  } else if (!context.mainApi || context.mainApi === 'openai') {
    const native = await load('scripts/openai.js');
    const settings = context.chatCompletionSettings || native.oai_settings;
    if (!settings) throw new Error('Vui lòng cấu hình một kết nối Chat Completion trong SillyTavern trước.');
    if (typeof native.createGenerationParameters === 'function') {
      const own = { ...settings, openai_max_tokens: config.maxTokens, stream_openai: false, n: 1,
        function_calling: false, enable_web_search: false, request_images: false };
      const model = native.getChatCompletionModel(own);
      const { generate_data } = await native.createGenerationParameters(own, model, 'quiet', messages);
      signal?.throwIfAborted();
      data = await fetchJSON('/api/backends/chat-completions/generate', generate_data);
    } else if (typeof native.sendOpenAIRequest === 'function') {
      // 1.14 có trước trình xây dựng tham số được export; yêu cầu quiet native có signal riêng.
      data = await native.sendOpenAIRequest('quiet', messages, signal);
    } else throw new Error('SillyTavern hiện tại thiếu giao diện trò chuyện, có thể sử dụng Cấu hình API riêng.');
  } else if (context.mainApi === 'textgenerationwebui') {
    const [core, native] = await Promise.all([load('script.js'), load('scripts/textgen-settings.js')]);
    const prompt = core.createRawPrompt(messages, context.mainApi, false, false, '', '');
    const body = await native.getTextGenGenerationData(prompt, config.maxTokens, false, false, null, 'quiet');
    body.stream = false;
    data = await fetchJSON(core.getGenerateUrl(context.mainApi), body);
  } else throw new Error(`Loại kết nối hiện tại ${context.mainApi} tạm thời không hỗ trợ trò chuyện độc lập, vui lòng sử dụng Chat Completion, Text Completion hoặc Cấu hình API riêng.`);
  signal?.throwIfAborted();
  const text = String(responseText(data)).trim();
  if (!text) throw new Error('API trả về phản hồi trống, vui lòng kiểm tra model hoặc tăng độ dài phản hồi rồi thử lại.');
  return text.slice(0, 16000);
}
