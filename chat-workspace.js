import {createChatWindow} from './chat-window.js';
import {normalizeChatConfig} from './chat-transport.js';
import {createSheet, leave} from './sheet.js';

export const MAX_CONVERSATIONS = 20;
// 同一窗口切换记录；每份记录仍拥有自己的草稿、连接和请求。
// 老记录继续放在 profile.history / repair，新增记录放 conversations。
export function createChatWorkspace(host, options) {
  const {saved={},persist,character}=options;
  const {conversations,activeConversation,mainTitle,...legacy}=saved;
  const sessions=[{id:'main',title:String(mainTitle || '原有对话').slice(0,40),state:legacy}];
  const seen=new Set(['main']);
  for (const item of Array.isArray(conversations) ? conversations : []) {
    if (!item || !/^[a-z0-9-]{1,50}$/.test(item.id) || seen.has(item.id) || !item.state || typeof item.state !== 'object') continue;
    seen.add(item.id); sessions.push({id:item.id,title:String(item.title || '新对话').slice(0,40),state:item.state});
    if(sessions.length>=MAX_CONVERSATIONS)break;
  }
  const windows=new Map(), ephemeralKeys=new Map(); let active=sessions.find(item=>item.id===activeConversation)?.id || 'main';
  let destroyed=false, serial=0, task=null, expanded=false;
  const find=id=>sessions.find(item=>item.id===id);
  const root=host.document.createElement('section');
  root.id='erii-database-pet-chat';root.className='erii-chat';root.hidden=true;
  root.dataset.character=character.id;root.setAttribute('role','dialog');
  root.setAttribute('aria-label',`和${character.fullName}聊天`);
  const grip=host.document.createElement('div');grip.className='pet-grip';grip.setAttribute('aria-hidden','true');
  root.append(grip);host.document.body.append(root);
  const sheet=createSheet(host,root,{grip,drag:[root],dragSelector:'.erii-chat__header',onDismiss:close,
    desktop:()=>({width:expanded?600:440,height:expanded?760:660,align:'right'})});
  const frame={root,layout:()=>sheet.layout(),isSheet:()=>sheet.isSheet(),close,
    get expanded(){return expanded;},expand(){expanded=!expanded;}};
  function save() {
    if(destroyed)return;
    persist({...sessions[0].state,conversationSchema:1,mainTitle:sessions[0].title,activeConversation:active,
      conversations:sessions.slice(1).map(item=>({id:item.id,title:item.title,state:item.state}))});
  }
  function sync() {
    const list=sessions.map(({id,title})=>({id,title}));
    for(const [id,window] of windows)window.setConversations(list,find(id).title);
  }
  function make(id) {
    if(windows.has(id))return windows.get(id);
    const session=find(id); if(!session)return null;
    const window=createChatWindow(host,{...options,saved:session.state,frame,
      windowId:`erii-database-pet-chat-session-${character.id}-${id}`,
      conversationId:id,conversationTitle:session.title,initialApiKey:ephemeralKeys.get(id) || '',
      persist:value=>{session.state=value;save();},
      onNew:()=>create(),onSelect:next=>openSession(next),onImport:record=>create(record),
      onRename:title=>{session.title=title.trim().slice(0,40)||'未命名对话';save();sync();},
      onDelete:id==='main' ? null : ()=>remove(id),
    });
    windows.set(id,window); if(task)window.setTask(task); sync();return window;
  }
  function openSession(id, openOptions) {
    if(destroyed || !find(id))return;
    // 先存好原草稿。切走只收起内容，后台回复仍写回它所属的记录。
    if(active!==id)windows.get(active)?.cover();
    active=id;
    const window=make(id);window.open(openOptions);sync();save();return window;
  }
  function create(record=null) {
    if(destroyed)return {ok:false,reason:'窗口已关闭。'};
    if(sessions.length>=MAX_CONVERSATIONS)return {ok:false,reason:`每个角色最多保存 ${MAX_CONVERSATIONS} 个对话，请先删除不需要的对话。`};
    const base=find(active)?.state || sessions[0].state;
    const id=`c-${Date.now().toString(36)}-${++serial}`;
    let number=1;while(sessions.some(item=>item.title===`新对话 ${number}`))number++;
    ephemeralKeys.set(id,windows.get(active)?.sessionKey() || '');
    sessions.push({id,title:record?.title || `新对话 ${number}`,state:{...normalizeChatConfig(base,{relationship:character.relationship}),history:record?.messages || [],repair:[],draft:''}});
    openSession(id);return {ok:true,id};
  }
  function remove(id) {
    const session=find(id);
    if(destroyed || !session || id==='main' || windows.get(id)?.busy)return;
    windows.get(id)?.destroy();windows.delete(id);ephemeralKeys.delete(id);
    sessions.splice(sessions.indexOf(session),1);
    if(active===id)active='main';sync();openSession(active);
  }
  function close() {
    if(destroyed)return;
    // 现在只有一个聊天窗口：关闭它时也停止已切走对话中尚未完成的回复。
    for(const window of windows.values())window.stop();
    if(root.hidden)return;
    leave(host,root,()=>{
      const regain=root.contains(host.document.activeElement)||host.document.activeElement===host.document.body;
      root.hidden=true;options.onState?.({open:false,busy:false});if(regain)options.returnFocus?.();
    });
  }
  make(active);
  return {
    open:opts=>openSession(find(opts?.conversationId) ? opts.conversationId : active,opts),newConversation:()=>create(),openConversation:openSession,
    close,
    async comment(...args){const id=active;return {...await make(id).comment(...args),conversationId:id};},
    cancelComment(){for(const window of windows.values())window.cancelComment();},
    setMode:mode=>make(active).setMode(mode),
    contextChanged(){for(const window of windows.values())window.contextChanged();},
    setTask(value){task=value;for(const window of windows.values())window.setTask(value);},
    get view(){return make(active).view;},get visible(){return !root.hidden;},
    get busy(){return [...windows.values()].some(window=>window.busy);},
    get conversations(){return sessions.map(({id,title})=>({id,title}));},
    destroy(){if(destroyed)return;sheet.destroy();for(const window of windows.values())window.destroy();save();destroyed=true;windows.clear();ephemeralKeys.clear();root.remove();},
  };
}
