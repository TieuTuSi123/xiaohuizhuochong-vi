// 聊天正文与接口明确返回的思考内容分开保存；不推测或补写未返回的内容。
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
  // 部分兼容接口省去开头的 think 标签，只留下结尾。
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
  return {format:'erii-pet-chat',version:1,character:{id:character.id,name:character.fullName},title:String(title || '聊天记录').slice(0,40),
    exportedAt:new Date().toISOString(),messages:history.map(normalizeMessage).filter(Boolean)};
}

// 只导入文字、角色、时间与思考内容。不接收接口设置、密钥或可执行的数据库修改单。
export function parseChatImport(text, character) {
  if (typeof text !== 'string' || new TextEncoder().encode(text).length > IMPORT_BYTES) throw new Error('文件太大，请使用 2 MB 以内的对话文件。');
  const source = text.replace(/^\uFEFF/,'').trim();
  if (!source) throw new Error('这个文件没有对话内容。');
  let data;
  try { data = JSON.parse(source); }
  catch {
    try { data = source.split(/\r?\n/).filter(line=>line.trim()).map(line=>JSON.parse(line)); }
    catch { return parseTextImport(source, character); }
  }
  let items, title = '导入的对话';
  if (data?.format === 'erii-pet-chat') {
    if (data.version !== 1 || !Array.isArray(data.messages)) throw new Error('暂不支持这个版本的对话文件。');
    if (data.character?.id && data.character.id !== character.id) throw new Error(`这是${String(data.character.name || data.character.id).slice(0,40)}的记录，请切换到对应角色再导入。`);
    items = data.messages; title = String(data.title || title).slice(0,40);
  } else if (Array.isArray(data)) {
    items = data.filter(item=>!(item && !('mes' in item) && !('content' in item) && ('user_name' in item || 'chat_metadata' in item || 'character_name' in item)));
    items = items.map(item=> typeof item?.mes === 'string' && typeof item.is_user === 'boolean'
      ? {role:item.is_user ? 'user' : 'assistant',content:item.mes,at:validDate(item.send_date),reasoning:item.extra?.reasoning}
      : item);
  } else if (Array.isArray(data?.messages)) items = data.messages;
  else throw new Error('没有找到消息列表。支持本插件 JSON、酒馆 JSONL 和旧版导出 TXT。');
  return checkedImport(items,title);
}
function validDate(value) { if(!['string','number'].includes(typeof value) || value === '')return undefined; const date = new Date(value); return Number.isFinite(date.getTime()) ? date.toISOString() : undefined; }
function checkedImport(items,title) {
  if (!items.length) throw new Error('这个文件没有可导入的消息。');
  if (items.length > HISTORY_LIMIT) throw new Error(`一次最多导入 ${HISTORY_LIMIT} 条消息，请先拆分文件。`);
  const messages = items.map(item=> {
    if (!item || !['user','assistant'].includes(item.role) || typeof item.content !== 'string') throw new Error('消息格式不对：只接收 user / assistant 的文字消息。');
    if (item.content.length > 16000 || (typeof item.reasoning === 'string' && item.reasoning.length > 32000)) throw new Error('有一条消息超过长度限制，请先拆分。');
    const result=normalizeMessage(item);
    if (!result.content && !result.reasoning) throw new Error('文件中含有空消息，请检查后再导入。');
    return result;
  });
  if (messages.reduce((sum,item)=>sum+item.content.length+(item.reasoning?.length || 0),0) > HISTORY_BUDGET) throw new Error('对话文字超过 128000 字符，请先拆分文件。');
  return {title,messages};
}
function parseTextImport(source,character) {
  const lines=source.split(/\r?\n/), heading=lines.shift();
  if (heading !== `${character.fullName}的聊天记录`) throw new Error('无法识别这个文件。请导入本插件 JSON、酒馆 JSONL 或当前角色的旧版聊天 TXT。');
  const messages=[]; let current=null;
  // 旧 TXT 无结构标记，按原导出的人名·时间行识别消息；新备份推荐 JSON。
  for (const line of lines) {
    const match=/^(.+?) · (\d{4}\/\d{1,2}\/\d{1,2} \d{1,2}:\d{2}(?::\d{2})?)$/.exec(line);
    const bare=[character.fullName,`${character.fullName}（旁观）`,'你'].includes(line);
    if (match || bare) {
      if (current) {current.content=current.content.trim();messages.push(current);}
      const name=match ? match[1] : line, assistant=name===character.fullName || name===`${character.fullName}（旁观）`;
      current={role:assistant?'assistant':'user',content:'',...(match?{at:validDate(match[2])}:{}),...(name.endsWith('（旁观）')?{kind:'watch'}:{})};
    } else if (current) current.content+=line+'\n';
    else if (line.trim()) throw new Error('旧 TXT 的人名或时间行无法识别，请使用原始导出文件。');
  }
  if (current) {current.content=current.content.trim();messages.push(current);}
  return checkedImport(messages,'导入的旧对话');
}
