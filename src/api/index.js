import http from './public'
// 分页获取群组列表接口 
export let chatGroupsTree = (data)=>{
    return http.fetchGet('/chat/groups/tree',data)
}
//分页获取群历史信息接口  
export let getGroupMsg = (data)=>{
    return http.fetchGet('/chat/msg/getGroupMsg',data)
}
//分页获取群历史信息接口  
export let getHisGroupMsg = (data)=>{
    return http.fetchGet('/chat/msg/getHisGroupMsg',data)
}
//文件上传
export let  chatAttach = ()=>{
    return localStorage.getItem('jcChatPort')+'/chat/attach';
}
//文件上传
export let  chatAttachUpdate = (data,url,progressCall)=>{
           data.update=true;
    return http.fetchPost(url,data,progressCall);
}
//Websocket
export let  websocket = ()=>{
    return localStorage.getItem('jcChatPort')+'/websocket/fromweb'
}
//downloadFile
export let downloadFileUrl = ()=>{
    return localStorage.getItem('jcChatPort')+'/chat/attach'
}
//分页获取入群申请列表 
export let cgReq = (data)=>{
    return http.fetchGet('/chat/group/req',data)
}
//入群申请审批 
export let cgrApprove = (data)=>{
    return http.fetchPost('/chat/group/req/approve',data)
}
//获取用户信息
export let getUserInfo = (data)=>{
    return http.fetchGet('/chat/users/info',data)
}
//消息催办提醒接口 
export let chatRemind = (data)=>{
    return http.fetchPost('/chat/msg/chatRemind',data)
}
//退出登录 
export let loginOut = (data)=>{
    return http.fetchGet('/wechat/webapp/logout',data)
}
//退出群 
export let groupsQuit = (data)=>{
    return http.fetchPost('/chat/groups/quit',data)
}
//解散群 
export let retreatGroup = (data,groupId)=>{
    return http.fetchPost(`/chat/groups/disband/${groupId}`,data)
}
// 获取所有父群组 
export const getGroupsSelector = (data)=>{
    return http.fetchGet('/chat/groups/selector',data);
}
//群名重复校验  
export const checkGroupName = (data)=>{
    return http.fetchPost('/chat/groups/check/groupName',data);
}
// 获取所有用户列表  
export const getUsersSelector = (data)=>{
    return http.fetchGet('/chat/users/selector',data);
}
//创建群组|修改群组信息
export const chatGroups = (data,groupId='')=>{
    return http.fetchPost('/chat/groups/'+groupId,data);
}
//聊天记录迁移 
export const msgMove = (data)=>{
    return http.fetchPost('/chat/msg/move',data);
}
//消息转发
export const msgForward = (data)=>{
    return http.fetchPost('/chat/msg/forward',data);
}
//添加需求 
export const demandAdd = (data)=>{
    return http.fetchPost('/demand/add',data);
}
//查询需求 
export const demandGet = (data)=>{
    return http.fetchGet('/demand/get',data);
}
//确认需求 
export const demandConfirm = (data)=>{
    return http.fetchPost('/demand/confirm',data);
}
//修改需求 
export const demandEdit = (data)=>{
    return http.fetchPost('/demand/edit',data);
}
//取消到期提醒  
export const demandPromptcancel = (data)=>{
    return http.fetchPost('/demand/prompt/cancel',data);
}
//查询标签
export const evaluateLabel = (data)=>{
    return http.fetchGet('/evaluateLabel',data);
}
//添加评价
export const reviewAdd = (data)=>{
    return http.fetchPost('/review/add',data);
}
//项目办结
export const reviewFinish = (data)=>{
    return http.fetchPost('/review/finish',data);
}
//历史群 
export const historyGroupsTree = (data)=>{
    return http.fetchGet('/history/groups/tree',data);
}
//获取文件上传接口
export const fileUploadUrl = (data)=>{
    return http.fetchGet('/chat/attach/fileUploadUrl',data);
}
//获取水印图片  
export const getWatermarkUrl = (data)=>{
    return http.fetchGet('/chat/watermark/current',data);
}
//发起压图
export const diagramAdd = (data)=>{
    return http.fetchPost('/diagram/add',data);
}
//压图签收
export const diagramConfirm = (data)=>{
    return http.fetchPost('/diagram/confirm',data);
}
//压图签收
export const diagramEdit = (data)=>{
    return http.fetchPost('/diagram/edit',data);
}
//
export const diagramCheck = (data,groupId)=>{
    return http.fetchGet(`/diagram/check/${groupId}`,data);
}