import {createChatWindow} from './chat-window.js';
import {normalizeChatConfig} from './chat-transport.js';
import {createSheet, leave} from './sheet.js';

export const MAX_CONVERSATIONS = 20;
// Chuyển đổi các cuộc trò chuyện trong cùng một cửa sổ; mỗi cuộc trò chuyện vẫn sở hữu bản nháp, kết nối và yêu cầu riêng.
// Bản ghi cũ tiếp tục lưu trong profile.history / repair, bản ghi mới thêm sẽ lưu vào conversations.
export function createChatWorkspace(host, options) {
  const {saved={},persist,character}=options;
  const {conversations,activeConversation,mainTitle,...legacy}=saved;
  const sessions=[{id:'main',title:String(mainTitle || 'Cuộc trò chuyện ban đầu').slice(0,40),state:legacy}];
  const seen=new Set(['main']);
  for (const item of Array.isArray(conversations) ? conversations : []) {
    if (!item || !/^[a-z0-9-]{1,50}$/.test(item.id) || seen.has(item.id) || !item.state || typeof item.state !== 'object') continue;
    seen.add(item.id); sessions.push({id:item.id,title:String(item.title || 'Cuộc trò chuyện mới').slice(0,40),state:item.state});
    if(sessions.length>=MAX_CONVERSATIONS)break;
  }
  const windows=new Map(), ephemeralKeys=new Map(); let active=sessions.find(item=>item.id===activeConversation)?.id || 'main';
  let destroyed=false, serial=0, task=null, expanded=false;
  const find=id=>sessions.find(item=>item.id===id);
  const root=host.document.createElement('section');
  root.id='erii-database-pet-chat';root.className='erii-chat';root.hidden=true;
  root.dataset.character=character.id;root.setAttribute('role','dialog');
  root.setAttribute('aria-label',`Trò chuyện cùng ${character.fullName}`);
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
      onRename:title=>{session.title=title.trim().slice(0,40)||'Cuộc trò chuyện chưa đặt tên';save();sync();},
      onDelete:id==='main' ? null : ()=>remove(id),
    });
    windows.set(id,window); if(task)window.setTask(task); sync();return window;
  }
  function openSession(id, openOptions) {
    if(destroyed || !find(id))return;
    // Lưu trước bản nháp hiện tại. Khi chuyển tab chỉ thu gọn nội dung, phản hồi chạy ngầm vẫn ghi vào bản ghi thuộc về nó.
    if(active!==id)windows.get(active)?.cover();
    active=id;
    const window=make(id);window.open(openOptions);sync();save();return window;
  }
  function create(record=null) {
    if(destroyed)return {ok:false,reason:'Cửa sổ đã đóng.'};
    if(sessions.length>=MAX_CONVERSATIONS)return {ok:false,reason:`Mỗi nhân vật chỉ lưu tối đa ${MAX_CONVERSATIONS} cuộc trò chuyện, vui lòng xóa bớt cuộc trò chuyện không cần thiết trước.`};
    const base=find(active)?.state || sessions[0].state;
    const id=`c-${Date.now().toString(36)}-${++serial}`;
    let number=1;while(sessions.some(item=>item.title===`Cuộc trò chuyện mới ${number}`))number++;
    ephemeralKeys.set(id,windows.get(active)?.sessionKey() || '');
    sessions.push({id,title:record?.title || `Cuộc trò chuyện mới ${number}`,state:{...normalizeChatConfig(base,{relationship:character.relationship}),history:record?.messages || [],repair:[],draft:''}});
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
    // Hiện chỉ có một cửa sổ trò chuyện: khi đóng cửa sổ cũng sẽ dừng các phản hồi chưa hoàn tất trong các cuộc trò chuyện đã chuyển đi.
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