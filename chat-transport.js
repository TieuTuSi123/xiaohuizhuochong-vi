import {splitReasoning} from './chat-history.js';
// Căn cứ phiên bản: openai.js chính thức 1.14.0–1.19.0 và mã nguồn 1.17.0 đã cài đặt.
// Mỗi yêu cầu sở hữu AbortSignal riêng. Không dùng sự kiện tạo/dừng toàn cục hay sửa đổi cài đặt.
export const CHAT_DEFAULTS = { mode: 'current', url: '', model: '', nickname: '', relationship: 'Người yêu', maxTokens: 768, rememberKey: false, replyStyle: 'natural', memory: '' };

export function normalizeChatConfig(value = {}, defaults = {}) {
  const relationship = defaults.relationship || CHAT_DEFAULTS.relationship;
  return { ...CHAT_DEFAULTS, mode: value.mode === 'custom' ? 'custom' : 'current',
    url: String(value.url || '').trim().slice(0, 1000), model: String(value.model || '').trim().slice(0, 200),
    nickname: String(value.nickname || '').trim().slice(0, 40), relationship: String(value.relationship || relationship).trim().slice(0, 80),
    maxTokens: Math.min(4096, Math.max(128, Math.floor(Number(value.maxTokens) || 768))), rememberKey: value.rememberKey === true,
    replyStyle: ['natural', 'short', 'detailed'].includes(value.replyStyle) ? value.replyStyle : 'natural',
    memory: String(value.memory || '').trim().slice(0, 2000) };
}

export function apiBase(value) {
  let url;
  try { url = new URL(value); } catch { throw new Error('Vui lòng điền đầy đủ địa chỉ API, ví dụ https://api-cua-ban/v1'); }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash)
    throw new Error('Địa chỉ API phải dùng giao thức http hoặc https, khóa bí mật (API key) vui lòng điền vào ô khóa riêng.');
  url.pathname = url.pathname.replace(/\/chat\/completions\/?$/, '').replace(/\/+$/, '');
  return url.href.replace(/\/$/, '');
}

export function responseMessage(data) {
  if (typeof data === 'string') return splitReasoning(data);
  const message=data?.choices?.[0]?.message;
  const thoughts=[];
  const parts=value=>typeof value === 'string' ? value : Array.isArray(value) ? value.map(part=> {
    if (['thinking','reasoning','reasoning_text'].includes(part?.type) || part?.thought === true) {
      const text=part.thinking || part.text; if (typeof text === 'string') thoughts.push(text); return '';
    }
    return typeof part?.text === 'string' ? part.text : '';
  }).join('') : '';
  const metadata=message?.reasoning_content || message?.reasoning || data?.reasoning_content;
  if (typeof metadata === 'string') thoughts.push(metadata);
  const output=Array.isArray(data?.output) ? data.output : [];
  for (const part of output) if (part.type === 'reasoning') {
    const text=parts(part.summary || part.content); if(text)thoughts.push(text);
  }
  const content=parts(message?.content) || data?.choices?.[0]?.text || parts(data?.content)
    || parts(data?.candidates?.[0]?.content?.parts) || data?.results?.[0]?.text
    || output.filter(part=>part.type === 'message').map(part=>parts(part.content)).join('') || data?.response || '';
  return splitReasoning(typeof content === 'string' ? content : '', thoughts.join('\n\n'));
}
export const responseText = data => responseMessage(data).content;

export function safeChatError(error, key = '') {
  let text = typeof error === 'string' ? error : error?.message || 'Kết nối không thành công, vui lòng kiểm tra cài đặt API rồi thử lại.';
  if (key) text = text.split(key).join('[Khóa bí mật đã ẩn]');
  return String(text).slice(0, 350);
}

async function fetchHostJSON(host, context, url, body, signal) {
  signal?.throwIfAborted();
  if (typeof context.getRequestHeaders !== 'function') throw new Error('Giao diện kết nối SillyTavern chưa sẵn sàng, vui lòng tải lại trang rồi thử lại.');
  const response = await host.fetch(url, { method: 'POST', headers: context.getRequestHeaders(), body: JSON.stringify(body), signal, cache: 'no-store' });
  let data;
  try { data = await response.json(); } catch { throw new Error(`API không trả về dữ liệu hợp lệ (${response.status}), vui lòng kiểm tra xem địa chỉ có chính xác không.`); }
  if (!response.ok || data?.error) {
    const detail = typeof data?.error === 'string' ? data.error : data?.error?.message;
    throw new Error(detail || `Kết nối thất bại (${response.status}), vui lòng kiểm tra địa chỉ, mô hình, API key hoặc hạn mức.`);
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

// Định tuyến status gốc được kiểm chứng từ 1.14.0–1.19.0; phần này chỉ đọc metadata của mô hình.
export async function requestModelList(host, context, config, { signal, apiKey = '' } = {}) {
  if (config.mode !== 'custom') throw new Error('Kết nối hiện tại theo mô hình của SillyTavern; nếu muốn chọn mô hình riêng, vui lòng chuyển sang "Tự cấu hình API".');
  const data = await fetchHostJSON(host, context, '/api/backends/chat-completions/status', {
    chat_completion_source: 'custom', custom_url: apiBase(config.url),
    custom_include_headers: JSON.stringify({ Authorization: apiKey ? `Bearer ${apiKey}` : '' }),
  }, signal);
  const models = normalizeModelList(data);
  if (!models.length) throw new Error('API không trả về mô hình khả dụng nào. Có thể API không hỗ trợ liệt kê danh sách, bạn vẫn có thể tự nhập tên mô hình.');
  return models;
}

export async function requestChat(host, context, config, messages, { signal, apiKey = '', loadModule, includeReasoning = false } = {}) {
  signal?.throwIfAborted();
  if (context.eriiPreviewMode === 'live' && config.mode !== 'custom')
    throw new Error('Trang xem trước độc lập không thể đọc API hiện tại của SillyTavern, vui lòng chọn "Tự cấu hình API" trong cài đặt kết nối. Sau khi cài vào SillyTavern có thể dùng kết nối hiện tại.');
  const load = loadModule || (path => import(new URL(path, host.document.baseURI).href));
  const fetchJSON = (url, body) => fetchHostJSON(host, context, url, body, signal);
  let data;
  if (config.mode === 'custom') {
    if (!config.model) throw new Error('Vui lòng điền tên mô hình trong phần cài đặt kết nối trước.');
    data = await fetchJSON('/api/backends/chat-completions/generate', {
      chat_completion_source: 'custom', custom_url: apiBase(config.url), model: config.model,
      // Luôn ghi đè khóa bí mật CUSTOM của host, bao gồm cả các endpoint cục bộ không cần khóa.
      custom_include_headers: JSON.stringify({ Authorization: apiKey ? `Bearer ${apiKey}` : '' }),
      messages, max_tokens: config.maxTokens, temperature: 0.8, top_p: 1, stream: false,
    });
  } else if (!context.mainApi || context.mainApi === 'openai') {
    const native = await load('scripts/openai.js');
    const settings = context.chatCompletionSettings || native.oai_settings;
    if (!settings) throw new Error('Vui lòng cấu hình kết nối Chat Completion trong SillyTavern trước.');
    if (typeof native.createGenerationParameters === 'function') {
      const own = { ...settings, openai_max_tokens: config.maxTokens, stream_openai: false, n: 1,
        function_calling: false, enable_web_search: false, request_images: false };
      const model = native.getChatCompletionModel(own);
      const { generate_data } = await native.createGenerationParameters(own, model, 'quiet', messages);
      signal?.throwIfAborted();
      data = await fetchJSON('/api/backends/chat-completions/generate', generate_data);
    } else if (typeof native.sendOpenAIRequest === 'function') {
      // Bản 1.14 ra trước bộ tạo tham số export; yêu cầu quiet gốc sở hữu signal riêng.
      data = await native.sendOpenAIRequest('quiet', messages, signal);
    } else throw new Error('SillyTavern hiện tại thiếu API trò chuyện, có thể dùng "Tự cấu hình API".');
  } else if (context.mainApi === 'textgenerationwebui') {
    const [core, native] = await Promise.all([load('script.js'), load('scripts/textgen-settings.js')]);
    const prompt = core.createRawPrompt(messages, context.mainApi, false, false, '', '');
    const body = await native.getTextGenGenerationData(prompt, config.maxTokens, false, false, null, 'quiet');
    body.stream = false;
    data = await fetchJSON(core.getGenerateUrl(context.mainApi), body);
  } else throw new Error(`Loại kết nối hiện tại (${context.mainApi}) chưa hỗ trợ trò chuyện độc lập, vui lòng sử dụng Chat Completion, Text Completion hoặc Tự cấu hình API.`);
  signal?.throwIfAborted();
  const result = responseMessage(data);
  if (!result.content && !(includeReasoning && result.reasoning)) throw new Error('API không trả về nội dung chính, vui lòng tăng độ dài phản hồi (max tokens) rồi thử lại.');
  result.content=result.content.slice(0,16000);
  return includeReasoning ? result : result.content;
}