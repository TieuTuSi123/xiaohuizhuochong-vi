// Nội dung trò chuyện chính và nội dung suy nghĩ (thinking/reasoning) do API trả về rõ ràng được lưu riêng; không suy đoán hoặc tự ý điền thêm nội dung không được trả về.
export const HISTORY_LIMIT = 100;
export const HISTORY_BUDGET = 128000;
export const IMPORT_BYTES = 2 * 1024 * 1024;

export function splitReasoning(value, extra = '') {
  let content = typeof value === 'string' ? value : '';
  const thoughts = typeof extra === 'string' && extra.trim() ? [extra.trim()] : [];
  const opening = /<(think|thinking|analysis|reasoning)(?:\s[^>]*)?>/ig;
  let result = '', cursor = 0, match;
  while ((match = opening.exec(content))) {
    result += content.slice(cursor, match.index);
    const end = new RegExp(`</${match[1]}\\s*>`, 'ig'); end.lastIndex = opening.lastIndex;
    const closing = end.exec(content);
    thoughts.push(content.slice(opening.lastIndex, closing ? closing.index : content.length).trim());
    cursor = closing ? end.lastIndex : content.length; opening.lastIndex = cursor;
  }
  result += content.slice(cursor);
  // Một số API tương thích lược bỏ thẻ think mở đầu, chỉ để lại thẻ đóng.
  const orphan = !thoughts.length && /<\/(?:think|thinking|analysis|reasoning)\s*>/i.exec(result);
  if (orphan) { thoughts.push(result.slice(0, orphan.index).trim()); result = result.slice(orphan.index + orphan[0].length); }
  return {content:result.trim(), reasoning:[...new Set(thoughts.filter(Boolean))].join('\n\n').slice(0,32000)};
}

export function normalizeMessage(item) {
  if (!['user','assistant'].includes(item?.role) || typeof item.content !== 'string') return null;
  const value = item.role === 'assistant' ? splitReasoning(item.content, item.reasoning) : {content:item.content,reasoning:''};
  return {role:item.role, content:value.content.slice(0,16000), ...(value.reasoning ? {reasoning:value.reasoning} : {}),
    ...(typeof item.at === 'string' && Number.isFinite(Date.parse(item.at)) ? {at:item.at} : {}),
    ...(item.kind === 'watch' ? {kind:'watch'} : {})};
}

export function chatExport(character, title, history) {
  return {format:'erii-pet-chat',version:1,character:{id:character.id,name:character.fullName},title:String(title || 'Lịch sử trò chuyện').slice(0,40),
    exportedAt:new Date().toISOString(),messages:history.map(normalizeMessage).filter(Boolean)};
}

// Chỉ nhập văn bản, vai trò, thời gian và nội dung suy nghĩ. Không tiếp nhận cài đặt API, API key hoặc lệnh chỉnh sửa cơ sở dữ liệu có thể thực thi.
export function parseChatImport(text, character) {
  if (typeof text !== 'string' || new TextEncoder().encode(text).length > IMPORT_BYTES) throw new Error('Tệp quá lớn, vui lòng dùng tệp trò chuyện dưới 2 MB.');
  const source = text.replace(/^\uFEFF/,'').trim();
  if (!source) throw new Error('Tệp này không có nội dung trò chuyện.');
  let data;
  try { data = JSON.parse(source); }
  catch {
    try { data = source.split(/\r?\n/).filter(line=>line.trim()).map(line=>JSON.parse(line)); }
    catch { return parseTextImport(source, character); }
  }
  let items, title = 'Đoạn trò chuyện đã nhập';
  if (data?.format === 'erii-pet-chat') {
    if (data.version !== 1 || !Array.isArray(data.messages)) throw new Error('Hiện chưa hỗ trợ phiên bản tệp trò chuyện này.');
    if (data.character?.id && data.character.id !== character.id) throw new Error(`Đây là bản ghi của ${String(data.character.name || data.character.id).slice(0,40)}, vui lòng chuyển sang nhân vật tương ứng rồi nhập lại.`);
    items = data.messages; title = String(data.title || title).slice(0,40);
  } else if (Array.isArray(data)) {
    items = data.filter(item=>!(item && !('mes' in item) && !('content' in item) && ('user_name' in item || 'chat_metadata' in item || 'character_name' in item)));
    items = items.map(item=> typeof item?.mes === 'string' && typeof item.is_user === 'boolean'
      ? {role:item.is_user ? 'user' : 'assistant',content:item.mes,at:validDate(item.send_date),reasoning:item.extra?.reasoning}
      : item);
  } else if (Array.isArray(data?.messages)) items = data.messages;
  else throw new Error('Không tìm thấy danh sách tin nhắn. Hỗ trợ JSON của plugin, JSONL của Tavern và TXT bản cũ.');
  return checkedImport(items,title);
}
function validDate(value) { if(!['string','number'].includes(typeof value) || value === '')return undefined; const date = new Date(value); return Number.isFinite(date.getTime()) ? date.toISOString() : undefined; }
function checkedImport(items,title) {
  if (!items.length) throw new Error('Tệp này không có tin nhắn nào để nhập.');
  if (items.length > HISTORY_LIMIT) throw new Error(`Mỗi lần chỉ được nhập tối đa ${HISTORY_LIMIT} tin nhắn, vui lòng chia nhỏ tệp trước.`);
  const messages = items.map(item=> {
    if (!item || !['user','assistant'].includes(item.role) || typeof item.content !== 'string') throw new Error('Định dạng tin nhắn không hợp lệ: chỉ nhận tin nhắn văn bản của user / assistant.');
    if (item.content.length > 16000 || (typeof item.reasoning === 'string' && item.reasoning.length > 32000)) throw new Error('Có một tin nhắn vượt quá giới hạn độ dài, vui lòng chia nhỏ trước.');
    const result=normalizeMessage(item);
    if (!result.content && !result.reasoning) throw new Error('Tệp có chứa tin nhắn trống, vui lòng kiểm tra lại trước khi nhập.');
    return result;
  });
  if (messages.reduce((sum,item)=>sum+item.content.length+(item.reasoning?.length || 0),0) > HISTORY_BUDGET) throw new Error('Văn bản trò chuyện vượt quá 128.000 ký tự, vui lòng chia nhỏ tệp trước.');
  return {title,messages};
}
function parseTextImport(source,character) {
  const lines=source.split(/\r?\n/), heading=lines.shift();
  if (heading !== `Lịch sử trò chuyện của ${character.fullName}` && heading !== `${character.fullName}的聊天记录`) {
    throw new Error('Không thể nhận diện tệp này. Vui lòng nhập JSON của plugin, JSONL của Tavern hoặc TXT bản cũ của nhân vật hiện tại.');
  }
  const messages=[]; let current=null;
  // TXT cũ không có đánh dấu cấu trúc, nhận diện tin nhắn theo dòng "Tên người · Thời gian" xuất ban đầu; sao lưu mới khuyến nghị dùng JSON.
  for (const line of lines) {
    const match=/^(.+?) · (\d{4}\/\d{1,2}\/\d{1,2} \d{1,2}:\d{2}(?::\d{2})?)$/.exec(line);
    const bare=[character.fullName,`${character.fullName}（旁观）`,`${character.fullName} (Quan sát)`,'你','Bạn'].includes(line);
    if (match || bare) {
      if (current) {current.content=current.content.trim();messages.push(current);}
      const name=match ? match[1] : line, assistant=name.startsWith(character.fullName);
      const isWatch = name.endsWith('（旁观）') || name.endsWith('(Quan sát)') || name.endsWith('（Quan sát）');
      current={role:assistant?'assistant':'user',content:'',...(match?{at:validDate(match[2])}:{}),...(isWatch?{kind:'watch'}:{})};
    } else if (current) current.content+=line+'\n';
    else if (line.trim()) throw new Error('Không thể nhận diện dòng tên người hoặc thời gian của TXT cũ, vui lòng sử dụng tệp xuất gốc.');
  }
  if (current) {current.content=current.content.trim();messages.push(current);}
  return checkedImport(messages,'Đoạn trò chuyện cũ đã nhập');
}