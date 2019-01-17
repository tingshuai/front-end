<template>
  <div class="chat-sidebar">
    <!-- search -->
    <div class="chat-sidebar-search">
      <div class="cs-search">
        <div class="cs-seach-logo bg-search_copy_2"></div>
        <input type="text" placeholder="搜索关键词" v-model="searchData" @change="search">
      </div>
    </div>
    <!-- 群列表 -->
    <div class="group-list-box">
      <!-- 自定义滚动条 -->
      <scroll-bar :config="scrollBarData" ref="myScroll"></scroll-bar>
      <!-- 内容 -->
      <div class="group-list scroll-content">
        <div v-for="data in chatData" class="group-list-item" :style="{'height':unfoldAnim(data)}">
          <!-- 父亲 -->
          <div class="gli-father clearfix" :class="{'chat-active':currChatData.groupId === data.groupId}" @click="chatItemClick(data)">
            <img :src="data.icon||getUrl()+'/images/default_group_icon.jpg'" alt="">
            <div class="red-circular" v-if="type!=='history'">{{getUnreadCount(data.groupId)>99?'99+':getUnreadCount(data.groupId)}}</div>
            <div class="group-info left">
              <h3 class="group-title">{{data.groupName}}</h3>
              <p class="group-last-msg">{{data.lastMsg}}</p>
            </div>
            <!-- 是否有儿子 -->
            <div class="el-icon-arrow-up right" :style="{'transform': arrowAmim(data)}" v-if="data.children.length>0" @click.stop="showMenu(data)"></div>
          </div>
          <!-- 子 -->
          <div class="gli-Son" v-if="data.children.length>0" v-show="data.ishow">
            <div class="gli-Son-item  clearfix" v-for="item in data.children" @click="chatItemClick(item)" :class="{'chat-active':currChatData.groupId === item.groupId}">
              <img :src="item.icon||getUrl()+'/images/default_group_icon.jpg'" alt="">
              <div class="red-circular">{{getUnreadCount(item.groupId)>99?'99+':getUnreadCount(item.groupId)}}</div>
              <div class="group-info left">
                <h3 class="group-title">{{item.groupName}}</h3>
                <p class="group-last-msg">{{item.lastMsg}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 内容结束 -->
    </div>
    <!-- 群列表结束 -->
    <!-- 消息提示音 -->
    <audio :src="getUrl()+'/ring.mp3'" id="myAudio"></audio>
  </div>
</template>
<script>
  import {
    chatGroupsTree,
    getGroupMsg,
    getHisGroupMsg,
    historyGroupsTree,
    websocket
  } from '../../api/index'
  import {
    mapGetters,
    mapMutations
  } from 'vuex'
  import {
    notifiMsg,
    groupMsg
  } from '../../toolClass/notification.js'
  export default {
    props: ['type'],
    data() {
      return {
        currChatData: {}, //当前选中数据
        scrollBarData: { //滚动条数据配置
          scrollBgColor: "transparent",
          scrollbarColor: "#D6D6D6"
        },
        chatData: [], //群显示数据
        chatDataAll: [], //群总数
        groupDataList: [], //群处理数据
        audio: null, //消息提示音
        searchData: '' //搜索数据
      }
    },
    computed: {
      ...mapGetters(['getfromUser', 'getGroupData'])
    },
    updated() { //数据更新时操作
      this.$nextTick(() => {
        if (this.$refs['myScroll']) this.$refs['myScroll'].initScrollBar();
      })
    },
    activated() {
      if (this.type === 'history') {
        this.getSidebarData(); //获取数据
      }
      this.$nextTick(() => {
        if (this.$refs['myScroll']) this.$refs['myScroll'].initScrollBar();
      })
    },
    mounted() { //数据初始话
      if (this.type === 'history') {
        this.getSidebarData(); //获取数据
      } else {
        this.getSidebarData(); //获取数据
        this.sysTem(); //全局webSocket
        this.$nextTick(() => {
          this.audio = document.getElementById('myAudio');
        })
      }
    },
    methods: {
      ...mapMutations(['setGroupData', 'setwebSocket', 'setGroupHisData', 'setIsChatRecord']),
      search() { //搜索
        let reg = new RegExp(this.searchData);
        this.chatData = this.chatDataAll.filter(item => {
          return reg.test(item.groupName);
        })
      },
      getUnreadCount(groupId) { //未读数量
        let index = this.groupDataList.findIndex(item => {
          return item.groupId === groupId;
        })
        if (index === -1) {
          return ''
        }
        if (this.groupDataList[index].unreadCount > 0) {
          return this.groupDataList[index].unreadCount;
        } else {
          return '';
        }
      },
      msgHandle(data) { //消息处理
      console.log(data,'msgHandle');
       if(data.cmd === '10000'){//退出登录
             console.log('data.cmd === 10000'+data);
            window.location.href = data.content;
            return;
        }
        if(data.children&&data.groupDate){
          data.groupDate.children = data.children;
        }
        if(data.groupDate&&!data.groupDate.children){
          data.groupDate.children = [];
        }
        let groupData = this.groupDataList[this.groupDataList.findIndex(item => {
          let groupId = data.groupId||data.groupDate.groupId;
          return item.groupId === groupId
        })];
        if (data.cmd == '1') { //消息撤回通知
          let index = groupData.msgData.findIndex(_item => {
            return _item.msgId === data.msgId;
          })
          groupData.lastMsg = this.setLastMsg(data);//xxxx
          groupData.msgData[index].cmd = '1';
          if(!groupData.msgData[index].readStatus){
               this.$set(groupData, 'unreadCount', groupData.unreadCount - 1);
          }
          return;
        }
        //消息处理
        if (data.cmd == '2') { //系统消息
          switch (data.msgType) {
            case 10: //退群消息
            debugger
            if(groupData){
                groupData.msgData.push({
                  cmd: 2,
                  content: data.fromUserName + '退群了'
                })
            }
              this.retreatGroup(data);
              if (this.currChatData.groupId === data.groupId && this.getfromUser.fromUserId === data.openId) {
                this.setGroupData('');
                this.currChatData = {};
              }
              break;
            case 11: //解散处理
              this.dissolution(data);
              break;
            case 12: //建群
              this.initGroupData(data.groupDate);
              this.setChatData(data.groupDate, 'add');
              break;
            case 13: //修改群
              this.setChatData(data.groupDate, 'edit');
              break;
          }
        } else if (data.cmd == '3') { //消息已读
          let index = groupData.msgData.findIndex(_item => {
            return _item.msgId === data.msgId;
          })
          try {
            this.$set(groupData.msgData[index], 'readCount', data.readCount);
          } catch (error) {
            console.log('暂不做处理');
          }
        } else if (data.cmd == '4') {
          groupMsg(data.fromUserName, `${data.groupName}群发送了一条消息,请注意查收`, data.headImgUrl);
        } else if (data.cmd == '0') { //正常接收消息
          let msgType = data.msgType;
          // if ((msgType>=20&&msgType<=24)||(msgType>=40&&msgType<=42))data.content = JSON.parse(data.content); 
          if (data.isJson)this.$set(data, 'content', JSON.parse(data.content));
          if (data.msgType === 22 || data.msgType === 21 || data.msgType === 42||data.msgType === 41) this.setdemandState(data, groupData);
          groupData.msgData.push(data); //新消息添加
          groupData.lastMsg = this.setLastMsg(data);
          // //撤回功能
          this.$set(data, 'withdraw', true);
          //未读消息统计
          this.msgGroupTop(data); //置顶
          if (this.getfromUser.fromUserId !== data.fromUser) {
            this.$set(groupData, 'unreadCount', groupData.unreadCount + 1);
            //播放提示用户来消息了
            this.audio.play();
          } else {
            return;
          }
          //消息处理
          if (data.msgType == '0') { //文本消息
            groupMsg(data.fromUserName, `${data.groupName}群:${data.content}`, data.headImgUrl);
          } else if (data.msgType == '7') {
            let toUser = data.toUser.split(',');
            let index = toUser.indexOf(this.getfromUser.fromUserId);
            if (index !== -1) {
              groupMsg(data.fromUserName, `${data.groupName}群,${data.fromUserName}@了你`, data.headImgUrl);
            }
          } else { //其它类型消息
            groupMsg(data.fromUserName, `${data.groupName}群,来了一条消息`, data.headImgUrl);
          }
        }else if(data.cmd == '100'||data.cmd=='999'||data.cmd=='1000'){
          if (data.isJson)this.$set(data, 'content', JSON.parse(data.content));
          groupData.lastMsg = this.setLastMsg(data);//xxxx
          groupData.msgData.push(data); //办结提示
          if (this.getfromUser.fromUserId !== data.fromUser) {//办结未读+1
              this.$set(groupData, 'unreadCount', groupData.unreadCount + 1);
          }
        }
      },
      setChatData(data, type) { //添加or编辑群
        let index = this.chatData.findIndex(item => {
          return data.parentId === item.groupId;
        })
        switch (type) {
          case 'add':
            if (index != -1) {
              this.chatData[index].children.splice(0,0,data);
            } else {
              this.chatData.splice(0,0,data);
            }
            break;
          case 'edit':
            let _index = null;
            let currGroupData = null;
            if (index != -1) {
              //子群层
              _index = this.chatData[index].children.findIndex(item => {
                return data.groupId === item.groupId
              })
              if(_index===-1){//有父群，但子群里没有该群
                this.chatData[index].children.splice(0,0,data);
                this.initGroupData(data);
                return;
              }
             //替换信息
             this.$set(this.chatData[index].children,_index,data);
             console.log(this.chatData,'xx')
            } else {
              //父群层
              _index = this.chatData.findIndex(item => {
                return data.groupId === item.groupId;
              })
              if(_index===-1){//子群没有父群也没有
                this.chatData.splice(0,0,data);
                this.initGroupData(data);
                return 
              }
              this.$set(this.chatData,_index,data);
              this.$set(this.chatData[_index],'children',data.children);
              // this.eidtObject( this.chatData[_index],data);
            }
            //该用户是否被移除
            let _result = data.groupUsers.findIndex(item => {
              return item.openId === this.getfromUser.fromUserId;
            })
            //拿到对应数据索引
            let __index__ = this.groupDataList.findIndex(item => {
              return item.groupId === data.groupId;
            })
            if(_result===-1){//被移除
              index === -1 ? this.chatData.splice(_index, 1) : this.chatData[index].children.splice(_index, 1);
                this.groupDataList.splice(__index__, 1);
                if (this.getGroupData&&this.getGroupData.groupId === data.groupId) {
                  this.setGroupData('');
                }
              return;
            }
            //保存对应数据---没有被移除，且不是新增人员
            if (__index__ !== -1) {
              this.groupDataList[__index__] = {
                groupId: this.groupDataList[__index__].groupId,
                managerId: data.managerId,
                msgData: this.groupDataList[__index__].msgData,
                addMemberOpenIds: data.addMemberOpenIds,
                groupName: data.groupName,
                groupUsers: data.groupUsers,
                groupDesc: data.groupDesc,
                unreadCount: this.groupDataList[__index__].unreadCount,
                parentId: this.groupDataList[__index__].parentId,
                pageSize: this.groupDataList[__index__].pageSize,
                pageNum: this.groupDataList[__index__].pageNum,
                isBottom: this.groupDataList[__index__].isBottom,
                time: this.groupDataList[__index__].time,
                lastMsg:this.groupDataList[__index__].lastMsg
              }
              data.lastMsg = this.groupDataList[__index__].lastMsg;//保留最后一条消息
            }
            //用户是否在当前群聊天
            if (this.getGroupData&&this.getGroupData.groupId === data.groupId) { 
              this.editGroupData({
                managerId: data.managerId,
                addMemberOpenIds: data.addMemberOpenIds,
                groupUsers: data.groupUsers,
                groupDesc: data.groupDesc,
                groupName: data.groupName
              })
              this.currChatData = data;
            }
            break;
        }
      },
      eidtObject(a,b){//cody对象值
           for(let attr in b){
            //  if(attr!=='children'){
               a[attr] = b[attr];
            //  }
           }
      },
      msgGroupTop(data) { //群置顶
        let item = null;
        for (let i = 0; i < this.chatData.length; i++) {
          item = this.chatData[i];
          if (this.chatData[i].groupId === data.groupId) {
            this.setTop(item);
            break;
          } else if (item.children.length > 0) {
            let index = item.children.findIndex(item => {
              return item.groupId === data.groupId;
            })
            if (index !== -1) {
              this.setTop(item, item.children[index]);
              break;
            }
          }
        }
      },
      setTop(item, child) { //置顶
        let curr = null;
        //移除
        this.chatData.findIndex((data, _index) => {
          if (data.groupId === item.groupId) {
            curr = data;
            this.chatData.splice(_index, 1);
            return true;
          };
        })
        //插入到前排
        this.chatData.splice(0, 0, curr);
        if (child) {
          let _index = this.chatData[0].children.findIndex(item => {
            return child.groupId === item.groupId;
          })
          curr = this.chatData[0].children[_index];
          this.chatData[0].children.splice(_index, 1);
          this.chatData[0].children.splice(0, 0, curr);
          this.showMenu(this.chatData[0],true);
        }
      },
      setdemandState(data, groupData) { //需求相关数据处理
      //disableMsgId 该消息为上一条需要关闭编辑的消息
        let index = groupData.msgData.findIndex(item => {
          return item.msgId === data.content.disableMsgId;
        })
        if(index!=-1) {
              groupData.msgData[index].content.editable = false
              if(data.content.signAt){//签收时间
                this.$set(groupData.msgData[index],'signAt',data.content.signAt);
              }
          };
      },
      retreatGroup(data) { //退群处理
        if (this.getfromUser.fromUserId === data.openId) { //自己
          this.dissolution(data, true);
        } else { //其他人
          let groupUsers = null;
          if (data.parentId) {
            let index = this.chatData.findIndex(item => { //查找父群
              return item.groupId === data.parentId;
            })
            let _index = this.chatData[index].children.findIndex(item => { //查找对应群
              return item.groupId === data.groupId;
            })
            let _index_ = this.chatData[index].children[_index].groupUsers.findIndex(item => {
              return item.openId === data.openId;
            })
            this.chatData[index].children[_index].groupUsers.splice(_index_, 1);
            groupUsers = this.chatData[index].children[_index].groupUsers;
            this.groupDataList[this.isGroupNow(data.groupId)].groupUsers = groupUsers;
          } else {
            let index = this.chatData.findIndex(item => {
              return item.groupId === data.groupId;
            })
            if(index===-1)return;
            let _index = this.chatData[index].groupUsers.findIndex(item => {
              return item.openId === data.openId;
            })
            this.chatData[index].groupUsers.splice(_index, 1);
            groupUsers = this.chatData[index].groupUsers;
            this.groupDataList[this.isGroupNow(data.groupId)].groupUsers = groupUsers;
          }
          if (this.getGroupData&&this.getGroupData.groupId === data.groupId) this.editGroupData({
            groupUsers
          });
        }
      },
      editGroupData(data) { //设置全局对象
        this.setGroupData({
          groupId: data.groupId || this.getGroupData.groupId,
          managerId: data.managerId || this.getGroupData.managerId,
          msgData: data.msgData || this.getGroupData.msgData,
          addMemberOpenIds: data.addMemberOpenIds || this.getGroupData.addMemberOpenIds,
          groupUsers: data.groupUsers || this.getGroupData.groupUsers,
          groupDesc: data.groupDesc || this.getGroupData.groupDesc,
          groupName: data.groupName || this.getGroupData.groupName,
          unreadCount: data.unreadCount || this.getGroupData.unreadCount,
          parentId: data.parentId || this.getGroupData.parentId,
          pageSize: data.pageSize || this.getGroupData.pageSize,
          pageNum: data.pageNum || this.getGroupData.pageNum,
          isBottom: data.isBottom || this.getGroupData.isBottom,
          time: data.time || this.getGroupData.time
        });
      },
      dissolution(data, flag = false) { //解散群 flag 不执行解散特殊操作
        if (!flag) {
          if (this.getGroupData&&data.groupId === this.getGroupData.groupId) {
            this.setGroupData('');
            this.$message({
              type: 'info',
              message: `: “${ data.groupName }”已经解散了`
            });
          } else{ //当前群是解散群子群
            let index = this.chatData.findIndex(item => { //查找对应群
              return item.groupId === data.groupId;
            })
            if(this.getGroupData&&index !== -1){
              let _index = this.chatData[index].children.findIndex(item => {
                return item.groupId === this.getGroupData.groupId;
              })
              if (_index !== -1){
                this.setGroupData('');
                this.$message({
                  type: 'info',
                  message: `: “${ data.groupName }”已经解散了`
                });
              }
            }
          }
        }
        if (data.parentId) {
          let index = this.chatData.findIndex(item => { //查找父群
            return item.groupId === data.parentId;
          })
          if(index===-1)return;
          let _index = this.chatData[index].children.findIndex(item => { //查找对应群
            return item.groupId === data.groupId;
          })
          this.groupDataList.splice(this.isGroupNow(data.groupId), 1);
          this.chatData[index].children.splice(_index, 1); //移除该群 
          if(!flag){
            this.$message({
              type: 'info',
              message: `: “${ data.groupName }”已经解散了`
            });
          }     
        } else {
          let index = this.chatData.findIndex(item => {
            return item.groupId === data.groupId;
          })
          if(index===-1)return;
          this.groupDataList.splice(this.isGroupNow(data.groupId), 1);
          this.chatData.splice(index, 1);
          if(!flag){
            this.$message({
              type: 'info',
              message: `: “${ data.groupName }”已经解散了`
            });
          }
        }
      },
      isGroupNow(groupId) { //获取当前群索引
        let index = this.groupDataList.findIndex(item => {
          return item.groupId === groupId;
        })
        return index;
      },
      sysTem() { //系统websockt
        this.setwebSocket(null); //全局webSocket
        let ws = this.websocketInit(); //创建websocket
        ws.onopen = () => { //连接成功

        };
        ws.onmessage = (evt) => { //服务端消息接收
          let data = JSON.parse(evt.data);
          this.msgHandle(data);
        }
        ws.onclose = () => {
          setTimeout(()=>{//三秒进行重新连接
             this.sysTem(); //重新连接
          },3000)
        }
        this.setwebSocket(ws); //全局webSocket
      },
      websocketInit() { //websockt创建
        let url = websocket().replace(/.{1,}:\/\/(.{1,})/, "wss://$1") + '/' + this.getfromUser.fromUserId;
        let ws = new WebSocket(url);
        return ws;
      },
      chatItemClick(data) { //群点击处理
        this.setIsChatRecord(false);
        let index = this.groupDataList.findIndex(item=>{
            return item.groupId === data.groupId
        })
        this.currChatData = this.groupDataList[index];
        this.groupDataList[index].groupUsers = data.groupUsers;//解决一个你不知道你bug哈哈
        if (this.type === 'history') {
          this.setGroupHisData(this.groupDataList[index]); //历史群
        } else {
          this.setGroupData(this.groupDataList[index]); //当前群全局数据保存
        }
      },
      async getSidebarData() { //获取菜单数据
        let getGroupsTree = this.type === 'history' ? historyGroupsTree : chatGroupsTree;
        let data = await getGroupsTree({
                      Vue: this,
                      params: {
                        openId: this.getfromUser.fromUserId,
                        pageSize: 0
                      }
                    })
          this.chatData = data.data.rows;
          this.chatDataAll = [].concat(this.chatData);
          this.groupDataList = [];
          this.chatData.forEach((item, index) => {
            this.initGroupData(item);
            if (item.children && Array.isArray(item.children)) {
              item.children.forEach((item) => {
                this.initGroupData(item);
              })
            }
          })
      },
      initGroupData(item) { //当前info消息
        this.$set(item, 'msgData', []);
        this.$set(item, 'pageSize', 20);
        this.$set(item, 'pageNum', 1);
        this.$set(item, 'isBottom', false);
        this.$set(item, 'lastMsg', '');
        //获取群历史消息  
        this.getMsgData(item.groupId, item);
        //websocket管理        
        this.groupDataList.push(item);
      },
     async getMsgData(groupId, _currData) { //获取群消息列表
        let getMsg = this.type === 'history' ? getHisGroupMsg : getGroupMsg;
        //获取历史记录
       let data = await getMsg({
          params: {
            groupId: groupId,
            openId: this.getfromUser.fromUserId,
            pageSize: _currData.pageSize,
            pageNum: _currData.pageNum
          }
        })
        _currData.msgData = data.data.rows;
          //处理最后一条消息
          let len = _currData.msgData.length - 1;
          if (len < 0) {
            return this.$set(_currData, 'lastMsg', '无消息');
          }
          //拿到最后一条消息
          let lastMsg = '系统提示';
          for (let i = len; i >= 0; i--){
              if (_currData.msgData[i].cmd === 0||_currData.msgData[i].cmd === 100 ||_currData.msgData[i].cmd===999||_currData.msgData[i].cmd==1000||_currData.msgData[i].cmd===1) {
                lastMsg = this.setLastMsg(_currData.msgData[i]);
                break;
              }
            }
            this.$set(_currData, 'lastMsg', lastMsg);
          //数据处理  
          _currData.msgData.forEach(item => {
            // let  msgType = item.msgType;
            // if ((msgType>=20&&msgType<=24)||(msgType>=40&&msgType<=42))this.$set(item, 'content', JSON.parse(item.content));
            if (item.isJson)this.$set(item, 'content', JSON.parse(item.content));
          })
      },
      setLastMsg(msg) { //设置最后一条消息
       if(msg.cmd==1){
         return msg.fromUserName + '：' + '撤回了一条消息'; 
       }
        if(msg.cmd == 100){
          return '项目办结消息提醒';
        }
        if(msg.cmd == 999){
            return '需求到期提醒';
        }
        if(msg.cmd == 1000){
            return '需求到期提醒取消';
        }
        switch (msg.msgType) {
          case 0:
            return msg.fromUserName + '：' + msg.content.replace(/\(@`-`@\)/g,'');
          case 1:
            return msg.fromUserName + '：发送了一张图片';
          case 2:
            return msg.fromUserName + '：发送了一段语音';
          case 6:
            return msg.fromUserName + '：发送了一个文件';
          case 7:
            return msg.fromUserName + '：@了群里的人';
          case 20:
            return msg.fromUserName + '：有一条新的需求';
          case 21:
            return msg.fromUserName + '：有一条已确认的需求';
          case 22:
            return msg.fromUserName + '：有一条修改待确认的需求';
          case 30:
            return msg.fromUserName + '：群主发送了项目结办消息';
          case 40:
            return msg.fromUserName + '：发送了压图';
          case 41:
          return msg.fromUserName + '：修改了压图';
          case 42:
            return msg.fromUserName + '：签收了压图';
          default:
            return '无消息'
        }
      },
      getUrl() { //获取资源访问地址
        return localStorage.getItem('jcChatPort');
      },
      unfoldAnim(data) { //菜单展开动画
        return data.ishow ? 70 + 66 * data.children.length + 'px' : '70px'
      },
      arrowAmim(data) { //动画
        return data.ishow ? 'rotate(0)' : 'rotate(180deg)';
      },
      showMenu(item,flag) { //展开子菜单
      if(flag){
        this.$set(item, 'ishow', flag);
      }else{
        this.$set(item, 'ishow', !item.ishow);
      }
        setTimeout(() => { //延时更新滚动条
          if (this.$refs['myScroll']) this.$refs['myScroll'].initScrollBar();
        }, 500) //延时500秒的原因在于动画时间的长度
      }
    }
  }

</script>
<style lang="less">
  @import '../../assets/less/tools.less';
  .chat-sidebar {
    width: 272px;
    background-color: #F7F7FA;
    position: absolute;
    height: 100%;
    left: 60px;
    overflow: hidden;
    .chat-sidebar-search {
      height: 53px;
      border-bottom: 1px solid #EFEFEF; // border-right:  1px solid #EFEFEF;
      .mix-flex-center();
      .cs-search {
        background-color: #FFFFFF;
        padding-left: 36px;
        padding-right: 10px;
        width: 240px;
        height: 30px;
        box-sizing: border-box;
        border: 1px solid #EFEFEF;
        position: relative;
      }
      .cs-seach-logo {
        position: absolute;
        left: 12px;
        top: 7px;
      }
      input {
        border: none;
        outline: none;
        width: 100%;
        font-size: 14px;
        color: #999;
        margin-top: 2px;
      }

    }
    .group-list-item {
      cursor: pointer; // transition:height 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      // transition:height 0.5s cubic-bezier(0.19, 1, 0.22, 1);
      transition: height 0.3s cubic-bezier(0.215, 0.610, 0.355, 1); // transition:height 0.5s cubic-bezier(0.23, 1, 0.320, 1);
      position: relative;
      overflow: hidden;
      .gli-father {
        padding: 12px 16px;
        border-bottom: 1px solid #EFEFEF;
        background-color: #F7F7FA;
        .group-info {
          .mix-text-overflow();
          width: 160px;
        }
      }
      img {
        width: 40px;
        height: 40px;
        float: left;
        margin-right: 10px;
        border-radius: 4px;
        margin-top: 4px;
      }
      .group-title {
        font-size: 16px;
        color: #2D3132;
        font-weight: 400;
        .mix-text-overflow();
        width: 160px;
        margin-top: 2px;
      }
      .group-last-msg {
        font-size: 12px;
        color: #8B969C;
        margin-top: 6px;
        .mix-text-overflow();
        width: 160px;
      }
      .gli-Son {
        overflow: hidden;
        background-color: #F7F7FA;
        img {
          width: 35px;
          height: 35px;
        }
        .group-title {
          font-size: 14px;
        }
        .group-last-msg {
          font-size: 12px;
          margin-top: 4px;
        }
      }
      .gli-Son-item {
        padding: 12px 16px 12px 40px;
        border-bottom: 1px solid #EFEFEF;
        position: relative;
        .red-circular {
          left: 32px;
          top: 5px;
        }
      }
      .chat-active {
        background-color: #EBECF0;
      }
    }
    .group-list-box {
      bottom: 0;
      box-sizing: border-box;
      overflow: hidden;
      position: absolute;
      top: 54px;
      width: 100%;
      .el-icon-arrow-up {
        transition: transform 0.2s;
      }
    }
    .red-circular {
      border-radius: 20px;
      padding: 0 6px;
      background-color: #da4242;
      color: white;
      text-align: center;
      line-height: 19px;
      font-size: 12px;
      position: absolute;
      left: 45px;
      top: 8px;
    }
    ::-webkit-input-placeholder {
      /* WebKit browsers */
      color: #BCC2C6;
    }
    :-moz-placeholder {
      /* Mozilla Firefox 4 to 18 */
      color: #BCC2C6;
    }
    ::-moz-placeholder {
      /* Mozilla Firefox 19+ */
      color: #BCC2C6;
    }
    :-ms-input-placeholder {
      /* Internet Explorer 10+ */
      color: #BCC2C6;
    }

  }

</style>
