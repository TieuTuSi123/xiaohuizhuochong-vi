import {createChatWindow} from './chat-window.js';
import {normalizeChatConfig} from './chat-transport.js';
import {viewport} from './sheet.js';

export const MAX_CONVERSATIONS = 20;
// 老记录继续放在 profile.history / repair，新增记录放 conversations。迁移不覆盖原对话。
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
  let destroyed=false, serial=0, task=null, top=9460;
  const find=id=>sessions.find(item=>item.id===id);
  function save() {
    if(destroyed)return;
    persist({...sessions[0].state,conversationSchema:1,mainTitle:sessions[0].title,activeConversation:active,
      conversations:sessions.slice(1).map(item=>({id:item.id,title:item.title,state:item.state}))});
  }
  function sync() {
    const list=sessions.map(({id,title})=>({id,title}));
    for(const [id,window] of windows)window.setConversations(list,find(id).title);
  }
  function focus(id) {if(destroyed)return;const changed=active!==id;active=id;windows.get(id)?.front(++top);if(changed)save();}
  function make(id) {
    if(windows.has(id))return windows.get(id);
    const session=find(id); if(!session)return null;
    const window=createChatWindow(host,{...options,saved:session.state,
      windowId:id==='main' ? 'erii-database-pet-chat' : `erii-database-pet-chat-${character.id}-${id}`,
      conversationId:id,conversationTitle:session.title,windowOffset:windows.size,initialApiKey:ephemeralKeys.get(id) || '',
      persist:value=>{session.state=value;save();},
      onFocus:()=>focus(id),
      onNew:()=>create(),onSelect:next=>openSession(next),onImport:record=>create(record),
      onRename:title=>{session.title=title.trim().slice(0,40)||'未命名对话';save();sync();},
      onDelete:id==='main' ? null : ()=>remove(id),
    });
    windows.set(id,window); if(task)window.setTask(task); sync();return window;
  }
  function openSession(id, openOptions) {
    if(destroyed)return;
    const window=make(id); if(!window)return;
    active=id;
    // 手机同一时刻显示当前面板，其他对话仍保留自己的请求与记录。
    if(viewport(host).width<640)for(const [otherId,other] of windows)if(otherId!==id)other.cover();
    window.open(openOptions);focus(id);sync();save();return window;
  }
  function create(record=null) {
    if(destroyed)return {ok:false,reason:'窗口已关闭。'};
    if(sessions.length>=MAX_CONVERSATIONS)return {ok:false,reason:`每个角色最多保存 ${MAX_CONVERSATIONS} 个对话，请先删除不需要的对话。`};
    const base=find(active)?.state || sessions[0].state;
    const id=`c-${Date.now().toString(36)}-${++serial}`;
    ephemeralKeys.set(id,windows.get(active)?.sessionKey() || '');
    sessions.push({id,title:record?.title || `新对话 ${sessions.length}`,state:{...normalizeChatConfig(base,{relationship:character.relationship}),history:record?.messages || [],repair:[],draft:''}});
    save();openSession(id);return {ok:true,id};
  }
  function remove(id) {
    if(destroyed || id==='main' || windows.get(id)?.busy)return;
    windows.get(id)?.destroy();windows.delete(id);ephemeralKeys.delete(id);
    sessions.splice(sessions.findIndex(item=>item.id===id),1);
    if(active===id)active='main';save();sync();openSession(active);
  }
  function resize(){
    if(destroyed || viewport(host).width>=640)return;
    const visible=[...windows.entries()].filter(([,window])=>window.visible);
    if(visible.length<2)return;
    const keep=visible.some(([id])=>id===active) ? active : visible.at(-1)[0];
    for(const [id,window] of visible)if(id!==keep)window.cover();
    focus(keep);
  }
  host.addEventListener('resize',resize);host.visualViewport?.addEventListener('resize',resize);
  make(active);
  return {
    open:opts=>openSession(find(opts?.conversationId) ? opts.conversationId : active,opts),newConversation:()=>create(),openConversation:openSession,
    close(){for(const window of windows.values())window.close();},
    async comment(...args){const id=active;return {...await make(id).comment(...args),conversationId:id};},
    cancelComment(){for(const window of windows.values())window.cancelComment();},
    setMode:mode=>make(active).setMode(mode),
    contextChanged(){for(const window of windows.values())window.contextChanged();},
    setTask(value){task=value;for(const window of windows.values())window.setTask(value);},
    get view(){return make(active).view;},get visible(){return [...windows.values()].some(window=>window.visible);},
    get busy(){return [...windows.values()].some(window=>window.busy);},
    get conversations(){return sessions.map(({id,title})=>({id,title}));},
    destroy(){if(destroyed)return;host.removeEventListener('resize',resize);host.visualViewport?.removeEventListener('resize',resize);for(const window of windows.values())window.destroy();save();destroyed=true;windows.clear();ephemeralKeys.clear();},
  };
}
