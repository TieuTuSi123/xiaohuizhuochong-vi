// Version authority: official 1.14.0–1.19.0 openai.js and the installed 1.17.0 source.
// Each request owns its AbortSignal. No global generation/stop events or setting edits.
export const CHAT_DEFAULTS = { mode: 'current', url: '', model: '', nickname: '', relationship: '恋人', maxTokens: 768, rememberKey: false, replyStyle: 'natural', memory: '' };

export function normalizeChatConfig(value = {}) {
  return { ...CHAT_DEFAULTS, mode: value.mode === 'custom' ? 'custom' : 'current',
    url: String(value.url || '').trim().slice(0, 1000), model: String(value.model || '').trim().slice(0, 200),
    nickname: String(value.nickname || '').trim().slice(0, 40), relationship: String(value.relationship || '恋人').trim().slice(0, 80),
    maxTokens: Math.min(4096, Math.max(128, Number(value.maxTokens) || 768)), rememberKey: value.rememberKey === true,
    replyStyle: ['natural', 'short', 'detailed'].includes(value.replyStyle) ? value.replyStyle : 'natural',
    memory: String(value.memory || '').trim().slice(0, 2000) };
}

export function apiBase(value) {
  let url;
  try { url = new URL(value); } catch { throw new Error('请填写完整的 API 地址，例如 https://你的接口/v1'); }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash)
    throw new Error('API 地址需使用 http 或 https，密钥请填写在单独的密钥框里。');
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
  let text = typeof error === 'string' ? error : error?.message || '连接没有成功，请检查 API 设置后重试。';
  if (key) text = text.split(key).join('［密钥已隐藏］');
  return String(text).slice(0, 350);
}

async function fetchHostJSON(host, context, url, body, signal) {
  signal?.throwIfAborted();
  if (typeof context.getRequestHeaders !== 'function') throw new Error('酒馆连接接口尚未就绪，请刷新后再试。');
  const response = await host.fetch(url, { method: 'POST', headers: context.getRequestHeaders(), body: JSON.stringify(body), signal, cache: 'no-store' });
  let data;
  try { data = await response.json(); } catch { throw new Error(`接口没有返回有效数据（${response.status}），请检查地址是否正确。`); }
  if (!response.ok || data?.error) {
    const detail = typeof data?.error === 'string' ? data.error : data?.error?.message;
    throw new Error(detail || `连接失败（${response.status}），请检查地址、模型、密钥或额度。`);
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

// Native status route verified in 1.14.0–1.19.0; this only reads model metadata.
export async function requestModelList(host, context, config, { signal, apiKey = '' } = {}) {
  if (config.mode !== 'custom') throw new Error('当前连接跟随酒馆的模型；如需单独选模型，请切换到“单独配置 API”。');
  const data = await fetchHostJSON(host, context, '/api/backends/chat-completions/status', {
    chat_completion_source: 'custom', custom_url: apiBase(config.url),
    custom_include_headers: JSON.stringify({ Authorization: apiKey ? `Bearer ${apiKey}` : '' }),
  }, signal);
  const models = normalizeModelList(data);
  if (!models.length) throw new Error('接口没有返回可选模型。它可能不提供模型列表，仍可手动填写模型名称。');
  return models;
}

export async function requestChat(host, context, config, messages, { signal, apiKey = '', loadModule } = {}) {
  signal?.throwIfAborted();
  if (context.eriiPreviewMode === 'live' && config.mode !== 'custom')
    throw new Error('独立预览页无法读取酒馆当前 API，请在连接设置中选择“单独配置 API”。安装到酒馆后可使用当前连接。');
  const load = loadModule || (path => import(new URL(path, host.document.baseURI).href));
  const fetchJSON = (url, body) => fetchHostJSON(host, context, url, body, signal);
  let data;
  if (config.mode === 'custom') {
    if (!config.model) throw new Error('请先在连接设置里填写模型名称。');
    data = await fetchJSON('/api/backends/chat-completions/generate', {
      chat_completion_source: 'custom', custom_url: apiBase(config.url), model: config.model,
      // Always override the host's CUSTOM secret, including keyless local endpoints.
      custom_include_headers: JSON.stringify({ Authorization: apiKey ? `Bearer ${apiKey}` : '' }),
      messages, max_tokens: config.maxTokens, temperature: 0.8, top_p: 1, stream: false,
    });
  } else if (!context.mainApi || context.mainApi === 'openai') {
    const native = await load('scripts/openai.js');
    const settings = context.chatCompletionSettings || native.oai_settings;
    if (!settings) throw new Error('请先在酒馆中配置一个聊天补全连接。');
    if (typeof native.createGenerationParameters === 'function') {
      const own = { ...settings, openai_max_tokens: config.maxTokens, stream_openai: false, n: 1,
        function_calling: false, enable_web_search: false, request_images: false };
      const model = native.getChatCompletionModel(own);
      const { generate_data } = await native.createGenerationParameters(own, model, 'quiet', messages);
      signal?.throwIfAborted();
      data = await fetchJSON('/api/backends/chat-completions/generate', generate_data);
    } else if (typeof native.sendOpenAIRequest === 'function') {
      // 1.14 predates the exported parameter builder; native quiet request has its own signal.
      data = await native.sendOpenAIRequest('quiet', messages, signal);
    } else throw new Error('当前酒馆缺少聊天接口，可以使用单独配置 API。');
  } else if (context.mainApi === 'textgenerationwebui') {
    const [core, native] = await Promise.all([load('script.js'), load('scripts/textgen-settings.js')]);
    const prompt = core.createRawPrompt(messages, context.mainApi, false, false, '', '');
    const body = await native.getTextGenGenerationData(prompt, config.maxTokens, false, false, null, 'quiet');
    body.stream = false;
    data = await fetchJSON(core.getGenerateUrl(context.mainApi), body);
  } else throw new Error(`当前连接类型 ${context.mainApi} 暂不支持独立聊天，请使用聊天补全、文本补全或单独配置 API。`);
  signal?.throwIfAborted();
  const text = String(responseText(data)).trim();
  if (!text) throw new Error('接口返回了空回复，请检查模型或提高回复长度后重试。');
  return text.slice(0, 16000);
}
