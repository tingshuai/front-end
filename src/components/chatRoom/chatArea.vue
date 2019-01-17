<template>
  <div class="chat-area"   :style="{'bottom':bottomNum}" @contextmenu.prevent>
    <!-- 自定义滚动条 -->
    <scroll-bar :config="scrollBarData" ref="myScroll"></scroll-bar>
    <!-- 消息容器 -->
    <div class="message-container"  id="ca-content" @scroll="msgScroll($event)">

      <!-- 消息 -->
      <div v-for="(item,index) in groupData.msgData" class="message-info clearfix" @mouseenter="chatItemEnter(item)"
        @mouseleave="chatItemLeave(item)" :data-index="index">
        <!-- 普通消息 -->
        <div v-if="item.cmd=='0'||item.cmd===100" :class="getfromUser.fromUserId===item.fromUser?'right':'left'">
          <!-- 头像 -->
          <img class="user-img" :class="getfromUser.fromUserId===item.fromUser?'right':'left'" :src="item.headImgUrl||(getUrl()+'/images/headimg.png')">
          <div class="left">
            <!-- 个人简介 -->
            <div class="user-info" :class="getfromUser.fromUserId===item.fromUser?'txt-r':'txt-l'">
              {{item.fromUserName||'无'}}
              <span>{{item.position||'无'}}</span>
            </div>
            <!-- 对话框  {'need':(item.msgType>=20&&item.msgType<=22)||(item.msgType>=40&&item.msgType<=42)}-->
            <div class="message-box" :class="[getfromUser.fromUserId===item.fromUser?'l-left':'r-left',{'need':item.isJson}]">
              <!-- text -->
              <span class="message-box-text" v-if="item.msgType==0||item.msgType==''" v-html="setTextURL(item.content)"></span>
              <!-- img -->
              <img v-else-if="item.msgType==1" v-lazy="item.attachUrl" @load="imgLoad" class="message-images" @click.stop="picturePreview(item.attachUrl)" />
              <!-- 语音 -->
              <div v-else-if="item.msgType==2&&getfromUser.fromUserId===item.fromUser" class="message-voice" @click="playVoice(item)"
                :style="{'background-image':item.isplay?'url('+getUrl()+'/images/yy.gif)':'url('+getUrl()+'/images/yy.png)'}"></div>
              <div v-else-if="item.msgType==2" class="message-voice" @click="playVoice(item)" :style="{'background-image':item.isplay?'url('+getUrl()+'/images/1Rw0-Kq.gif)':'url('+getUrl()+'/images/huise.png)'}"></div>
              <!-- 文件 -->
              <div v-else-if="item.msgType==6" class="message-file" :class="getfromUser.fromUserId===item.fromUser?'mf-left':'mf-right'">
                <img src="../../assets/images/file.png" class="message-file-icon">
                <p>{{item.content}}</p>
                <div @click="downloadFile(item)">下载</div>
              </div>
              <!-- @功能 -->
              <div v-else-if="item.msgType==7" class="message-box-text" v-html="setAate(item.content)"></div>
             <!-- 需求相关开始 -->
              <!-- 需求 -->
              <div v-else-if="item.msgType==20" @click="demandSuer(item)">
                <div class="new-tools-header text-cl">需求确认</div>
                <div class="new-tools-content">
                  <div class="left bg-Group_6_Copy_2"></div>
                  <p class="ndc-p1">需求单{{item.content.demandNum}}</p>
                  <p class="ndc-p2">对接人
                    <span>@{{item.content.confirmUserName}}</span>
                  </p>
                </div>
              </div>
              <!-- 已确认 -->
              <div v-else-if="item.msgType==21" @click="demandSuer(item)">
                <div class="new-tools-header text-cl">需求已确认</div>
                <div class="new-tools-content">
                  <div class="left bg-Group_6_Copy_2"></div>
                  <p class="ndc-p1">需求单{{item.content.demandNum}}</p>
                  <p class="ndc-p2">对接人
                    <span>@{{item.content.confirmUserName}}</span>
                  </p>
                </div>
              </div>
              <!-- 修改 -->
              <div v-else-if="item.msgType==22" @click="demandSuer(item)">
                <div class="new-tools-header text-cr">修改需求确认</div>
                <div class="new-tools-content">
                  <div class="left bg-Group_6_Copy_2"></div>
                  <p class="ndc-p1">需求单{{item.content.demandNum}}</p>
                  <p class="ndc-p2">对接人
                    <span>@{{item.content.confirmUserName}}</span>
                  </p>
                </div>
              </div>
              <!-- 需求到期提醒 -->
               <!-- <div v-else-if="item.msgType==23" class="organize-msg" :class="item.fromUser === getfromUser.fromUserId?'organize-msg-r':'organize-msg-l'">
                <h1>需求到期提醒</h1>
                <p class="ndc-p1">需求单{{item.content.demandNum}},该{{item.content.promptContent}},请及时处理</p>
                <div v-if="type!=='history'&&item.toUser===getfromUser.fromUserId">
                  <a  @click="demandPromptcancel(item)" class="demand-msg"  href="javascript:void(0)" >取消提醒</a>
                </div>
               </div> -->
               <!-- 需求到期取消 -->
               <!-- <div v-else-if="item.msgType==24" class="organize-msg" :class="item.fromUser === getfromUser.fromUserId?'organize-msg-r':'organize-msg-l'">
                <h1>需求提醒取消</h1>
                <p class="ndc-p1">{{item.content.msgTemplate}}</p>
               </div> -->
               <!-- 需求相关结尾 -->
               <!-- 压图相关开始 -->
               <!-- 待确认 -->
               <div v-else-if="item.msgType==40" @click="diagram(item)">
                <div class="new-tools-header text-cr">待签收</div>
                <div class="new-tools-content">
                  <div class="left yatuIcon">
                     <img src="../../assets/images/yatuIcon.png" alt="">
                  </div>
                  <p class="ndc-p1">压图单{{item.content.diagramNum}}</p>
                  <p class="ndc-p2">对接人
                    <span>@{{item.content.signUserName}}</span>
                  </p>
                </div>
              </div>
              <!-- 已确认 -->
              <div v-else-if="item.msgType==42" @click="pressImageComplete(item)">
                <div class="new-tools-header text-cl">已签收</div>
                <div class="new-tools-content">
                  <div class="left yatuIcon">
                     <img src="../../assets/images/yatuIcon.png" alt="">
                  </div>
                  <p class="ndc-p1">压图单{{item.content.diagramNum}}</p>
                  <p class="ndc-p2">对接人
                    <span>@{{item.content.signUserName}}</span>
                  </p>
                </div>
              </div>
              <!-- 修改 -->
              <div v-else-if="item.msgType==41" @click="diagram(item)">
                <div class="new-tools-header text-cr">修改</div>
                <div class="new-tools-content">
                  <div class="left yatuIcon">
                     <img src="../../assets/images/yatuIcon.png" alt="">
                  </div>
                  <p class="ndc-p1">压图单{{item.content.diagramNum}}</p>
                  <p class="ndc-p2">对接人
                    <span>@{{item.content.signUserName}}</span>
                  </p>
                </div>
              </div>
               <!-- 压图相关结尾 -->
              <!-- 办结 -->
              <div v-else-if="item.msgType==30" class="organize-msg" :class="item.fromUser === getfromUser.fromUserId?'organize-msg-r':'organize-msg-l'">
                <h1>项目办结消息提醒</h1>
                <p>尊敬的客户您好,您的项目已经完成,请对我们的服务做出评价。</p>
                <div v-if="type!=='history'">
                  <a v-if="item.toUser===getfromUser.fromUserId" @click="evaluate(item)" href="javascript:void(0)" >点击评价</a>
                  <!-- <a  v-else href="javascript:void(0)" >点击评价</a> -->
                </div>
              </div>
              <!-- 消息功能键 -->
              <div v-if="type!=='history'" :class="item.fromUser === getfromUser.fromUserId?'msg-tools-l':'msg-tools-r'"
                v-show="item.istools">
                <!-- 以前   v-if="!(item.msgType>=20&&item.msgType<=22)&&!(item.msgType>=40&&item.msgType<=42)&&item.msgType!==30"-->
                <div @click="revoke(item)" v-if="!item.isJson&&item.msgType!==30"
                  v-show="item.fromUser === getfromUser.fromUserId&&item.withdraw">撤 回</div>
                <div v-show="item.msgType==2" @click="translate(item)">翻 译</div>
                <div @click="forward(item)" v-if="!item.isJson&&item.msgType!==30">
                  转 发</div>
                <div v-if="item.msgType==1" @click="downloadFile(item)">下 载</div>
                <div v-if="item.msgType==1" @click="imagesEdit(item)">编 辑</div>
              </div>
              <!-- 点击按钮 -->
              <div @click="chatItemShowTools(item)" v-show="item.setToolsShow" :class="item.fromUser === getfromUser.fromUserId?'chatItemShowTools-r':'chatItemShowTools-l'"><i
                  class="el-icon-more"></i></div>
            </div>
            <!-- 翻译内容 -->
            <div v-show="item.translate" class="message-translate txt-l">
              <i class="el-icon-success"></i>{{item.content||'无法翻译'}}</div>
            <!-- 消息已读状态 -->
            <div class="message-status txt-r" v-if="getfromUser.fromUserId===item.fromUser">{{getUnread(item.readCount)}}</div>
            <!-- <div class="message-status txt-l" v-else>{{item.readStatus?'已读':'未读'}}</div> -->
          </div>
        </div>
        <!-- 撤回消息 -->
        <div v-else-if="item.cmd=='1'" class="message-time">{{item.fromUserName}}撤回了一条消息</div>
        <!-- 系统推送消息 -->
        <div v-else-if="item.cmd=='2'" class="message-time">{{item.content}}</div>
        <!-- 时间 -->
        <div v-else-if="item.cmd=='time'" class="message-time">{{item.content}}</div>
        <!-- 需求提醒 -->
        <div v-else-if="item.cmd=='999'" class="message-time">
          {{item.msgTemplate||'无'}}
          <p><a  @click="demandPromptcancel(item)" v-if="getfromUser.fromUserId===item.content.createUser&&type!=='history'" class="demand-msg"  href="javascript:void(0)" >取消提醒</a></p> 
        </div>
        <!-- 已取消提醒 -->
        <div v-else-if="item.cmd=='1000'" class="message-time">
          {{item.msgTemplate||'无'}}
        </div>
      </div>
    </div>
    <!-- 消息加载进度 -->
    <div class="msg-progress" v-show="isMsgProgress"><span class="el-icon-loading"></span></div>
    <!-- 消息转发 -->
    <forward-msg ref="forwardMsg"></forward-msg>
    <!-- 评价 -->
    <evaluate ref="evaluate"></evaluate>
    <!-- 需求确认 -->
    <demand-suer ref="demandSuer" :type="type" @editDemand="editDemand"></demand-suer>
    <!-- 修改需求 -->
    <demand-edit ref="demandEdit" @demandEditBack="demandEditBack"></demand-edit>
    <!-- 图片预览 -->
    <picture-preview ref="picturePreview"></picture-preview>
    <!-- 取消需求到期提醒 -->
    <demand-cancel ref="demandCancel"></demand-cancel>
    <!-- 压图确认 -->
    <press-image-suer ref="pressImageSuer" :type="type" @pressImageEdit="pressImageEdit"></press-image-suer>
    <!-- 压图编辑 -->
    <press-image-edit ref="pressImageEdit"  @pressEditClose="pressEditClose"></press-image-edit>
    <!-- 压图已完成 -->
    <press-image-complete ref="pressImageComplete"></press-image-complete>
  </div>
</template>
<script>
  import audio from '../../toolClass/audio'
  import {
    downloadFileUrl,
    getGroupMsg,
    getHisGroupMsg,
    demandConfirm,
    msgForward,
    reviewAdd
  } from '../../api/index.js'
  import {
    mapGetters,
    mapMutations
  } from 'vuex'
  import evaluate from '../funToast/evaluate'
  import forwardMsg from '../funToast/forwardMsg'
  import demandSuer from '../funToast/demandSuer'
  import demandEdit from '../funToast/demandEdit'
  import picturePreview from '../funToast/picturePreview'
  import demandCancel from '../funToast/demandCancel.vue'
  import pressImageSuer from '../funToast/pressImageSuer.vue'
  import pressImageEdit from '../funToast/pressImageEdit.vue'
  import pressImageComplete from '../funToast/pressImageComplete.vue'
  export default {
    data() {
      return {
        bottomNum: '200px', //容器对于底部的距离
        isSrollGo: false, //是否开启滚动检查
        currVoice: null, //当前音频
        currMsg: null, //当前消息
        scrollBarData: { //自定义滚动条配置
          scrollBgColor: "transparent",
          scrollbarColor: "#D6D6D6",
          isScrollBottom: true
        },
        isScrollBottom: true,
        isMsgProgress:false,
        isScrollBottomTime: null
      }
    },
    props: ['type', 'groupData'],
    computed: {
      ...mapGetters([
        'getfromUser',
        'getwebSocket'
      ])
    },
    activated() { //初始化滚动条
      this.initScrollBar();
    },
    mounted() { //数据更新时操作
      this.initScrollBar();
      if (this.type === 'history') {
        this.bottomNum = 0;
      }
    },
    methods: {
      ...mapMutations(['setGroupData']),
      imagesEdit(data){//图片编辑
      const aLink = document.createElement('a')
            aLink.href = localStorage.getItem('boardUrl')+ '?'+data.attachUrl
            aLink.target = '_blank'
            aLink.dispatchEvent(new MouseEvent('click', {}));
      },
      dataInit() { //初始化
        this.isSrollGo = false;
      },
      setdemandState(data, msgId) { //需求相关
        this.$confirm('是否确定该条需求?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          demandConfirm({
            Vue: this,
            params: {
              demandId: data.demandId,
              fromUser: this.getfromUser.fromUserId,
              fromUserName: this.getfromUser.fromUserName,
              groupId: this.groupData.groupId,
              groupName: this.groupData.groupName,
              headImgUrl: this.getfromUser.fromUserImg,
              msgId,
              position: this.getfromUser.fromUserPosition
            }
          });
        }).catch(() => {
          data.demandState = false;
        });
      },
      getUrl() { //获取资源访问地址
        return localStorage.getItem('jcChatPort');
      },
      setAate(text) { //艾特展示处理
        if (!text) {
          return '';
        }
        let result = '';
        let arr = text.split('(@`-`@)');
        let len = arr.length - 1;
        arr.forEach((item, index) => {
          if (index !== len) {
            result += `<span class="link-you">${item}</span>`
          }
        })
        return result += arr[len];
      },
      imgLoad() { //图片加载完重置滚动条
        if (this.$refs['myScroll']) {
          this.scrollBarData.isScrollBottom = false;
          this.$refs['myScroll'].initScrollBar();
        }
      },
      getUnread(count) { //未读数量
        let result = this.groupData.groupUsers.length - 1 - count;
        if (result <= 0) {
          return '全部已读'
        }
        return result + '人未读';
      },
      translate(item) {
        this.$set(item, 'translate', true);
      },
      receipt(list, grop) { //回执
        let groupData = this.groupData;
        if (!this.getwebSocket) {
          return alert('系统异常')
        }
        let result = [];
        for (let i = 0; i < list.length; i++) {
          let index = list[i].dataset.index;
          let data = groupData.msgData[index];
          if ((data.cmd === 0||data.cmd===100||data.cmd===1000||data.cmd===999) && this.getfromUser.fromUserId !== data.fromUser && data.readStatus != 1 && this.isElementInViewport(
              list[i], grop)) {
            result.push(index);
          }
        }
        console.log(result);
        result.forEach(data => {
          try {
            this.getwebSocket.send(JSON.stringify({ //消息回执
              cmd: '3',
              groupId: groupData.msgData[data].groupId,
              fromUser: groupData.msgData[data].fromUser,
              msgId: groupData.msgData[data].msgId
            }));
            groupData.msgData[data].readStatus = 1;
            groupData.unreadCount--;
          } catch (error) {
            console.log(error)
          }
        })
      },
      isElementInViewport(el, grop) { //‘你’在我的眼睛里吗？
        if (el.offsetTop >= grop.scrollTop && el.offsetTop < grop.scrollTop + grop.offsetHeight) {
          return true;
        }
      },
      msgScroll($event) { //滚动起来吧！
        if (!this.isSrollGo) {
          return
        }
        //滚动加载历史数据
        let target = $event.srcElement || $event.currentTarget;
        if (target.scrollTop === 0 && !this.groupData.isBottom) { //开始加载数据
          this.groupData.pageNum++;
          this.isMsgProgress = true;
          let getMsg = this.type === 'history' ? getHisGroupMsg : getGroupMsg;
          clearTimeout(this.isScrollBottomTime);
          getMsg({
            Vue: this,
            params: {
              groupId: this.groupData.groupId,
              openId: this.getfromUser.fromUserId,
              pageSize: this.groupData.pageSize,
              pageNum: this.groupData.pageNum
            }
          }).then(data => {
            let result = data.data.rows;
            let size = target.scrollHeight;
            setTimeout(()=>{
              this.isMsgProgress = false;
            },200)
            if (result.length > 0) { //是否还有数据
              this.isScrollBottom = false; //禁止滚动条到底部
              //数据处理
              result.forEach(item => {
              //  let  msgType = item.msgType;
              //  if ((msgType>=20&&msgType<=24)||(msgType>=40&&msgType<=42))this.$set(item, 'content', JSON.parse(item.content));
              if (item.isJson)this.$set(item, 'content', JSON.parse(item.content));
              })
              this.groupData.msgData = result.concat(this.groupData.msgData);
              this.$nextTick(() => { //dom渲染完后
               if(this.$refs['myScroll']){
                  this.$refs['myScroll'].initScrollBar();
                  size = target.scrollHeight - size; //之前content位置
                  this.$refs['myScroll'].scrollTop(size); //定位
                  this.isScrollBottomTime = setTimeout(() => { //延迟释放
                    this.isScrollBottom = true; //允许滚动条到底部
                  }, 100)
               }
              })
            } else {
              this.groupData.isBottom = true; //禁止数据请求
            }
          })
        }
        //回执处理
        let msgList = document.getElementsByClassName('message-info');
        let grop = document.getElementById('ca-content');
        this.receipt(msgList, grop);
      },
      setTextURL(text) { //挑选出链接
        if (!text) {
          return '';
        }
        text = text.replace(/\(@`-`@\)/g, '');
        var reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
        return text.replace(reg, '<a href="$1$2" target="_blank">$1$2</a>');
      },
      revoke(item) { //撤回
        this.getwebSocket.send(JSON.stringify({
          msgId: item.msgId,
          groupId: item.groupId,
          fromUser: item.fromUser,
          fromUserName: item.fromUserName,
          cmd: '1'
        }))
        setTimeout(() => {
          this.$refs['myScroll'].initScrollBar();
        }, 200)
      },
      chatItemShowTools(item) {//消息是否显示撤回按钮
        this.currMsg = item;
        this.scrollBarData.isScrollBottom = false;
        this.$set(item, 'istools', !item.istools);
        if (new Date().getTime() > new Date(item.createAt).getTime() + 1000 * 60 * 2) {
          this.$set(item, 'withdraw', false);
        } else {
          this.$set(item, 'withdraw', true);
        }
      },
      chatItemEnter(item) { //鼠标移入显示操作按钮
        this.$set(item, 'setToolsShow', true);
      },
      chatItemLeave(item) { //鼠标移出隐藏操作按钮
        this.$set(item, 'istools', false);
        this.$set(item, 'setToolsShow', false);
      },
      playVoice(item) { //播放语音
        this.$set(item, 'isplay', true); //调整为播放状态
        audio.setUrl(item.attachUrl, this.currVoice, item); //设置资源
        this.currVoice = item; //保持当前播放实例
        audio.play(); //播放
        audio.onEnded(() => {
          this.$set(item, 'isplay', false); //调整为关闭状态
        })
      },
      downloadFile(item) {//文件下载
            const aLink = document.createElement('a')
            aLink.download = item.content 
            aLink.href = item.attachUrl 
            aLink.target = '_blank'
            aLink.dispatchEvent(new MouseEvent('click', {}));
      },
      initScrollBar() { //初始化滚动条
        this.$nextTick(() => {
          if (this.$refs['myScroll']) {
            this.$refs['myScroll'].initScrollBar();
            let msgList = document.getElementsByClassName('message-info');
            let grop = document.getElementById('ca-content');
            this.receipt(msgList, grop);
            this.isSrollGo = true;
          };
        })
      },
      demandPromptcancel(item){//取消到期提醒
        this.$refs.demandCancel.show(item);
      },
      forward(item) { //转发
        this.$refs.forwardMsg.show();
      },
      evaluate(data) { //评价
        this.$refs.evaluate.show(data);
      },
      demandSuer(data){//需求
        this.$refs.demandSuer.show(data);
      },
      demandEditBack() {//编辑需求回调
        this.$refs.demandSuer.close();
      },
      editDemand(data, listData) {//编辑需求
        this.$refs.demandEdit.show(data, listData);
      },
      diagram(data){//压图相关
         this.$refs.pressImageSuer.show(data);
      },
      pressImageEdit(data){//压图编辑
          this.$refs.pressImageEdit.show(data);
      },
      pressEditClose(){//压图编辑回调关闭
          this.$refs.pressImageSuer.close();
      },
      pressImageComplete(data){//压图完成
           this.$refs.pressImageComplete.show(data);
      },
      picturePreview(url) { //预览图片
        this.$refs.picturePreview.show(url);
      }
    },
    watch: { //听说watch用多了不好,我就要用咋的？
      'groupData.msgData.length': function () {
        this.scrollBarData.isScrollBottom = this.isScrollBottom;
        this.initScrollBar();
      },
      'groupData.groupId': function () {
        this.initScrollBar();
      }
    },
    components: {
      evaluate,
      forwardMsg,
      demandSuer,
      demandEdit,
      picturePreview,
      demandCancel,
      pressImageSuer,
      pressImageEdit,
      pressImageComplete
    }
  }

</script>
<style lang="less">
  .chat-area {
    position: absolute;
    top: 54px;
    width: 100%;
    background-color: #F3F3F3;

    .el-card__header {
      padding: 10px 20px;
    }

    .text-item {
      overflow: hidden;
      margin-bottom: 10px;

      .title {
        float: left;
        width: 280px;
        text-indent: -17px;
        padding-left: 30px;
        padding-right: 5px;
        text-align: justify;
      }

      .el-checkbox {
        float: left;
      }

    }

    .message-container {
      overflow: hidden;
      height: 100%;
      box-sizing: border-box;
      padding: 40px 4px;
      user-select: text;
    }

    .organize-msg {
      p {
        line-height: 1.5em;
      }

      div {
        text-align: center;
        line-height: 30px;
      }
      .demand-msg{
        color: #67C23A;
      }
    }
    .organize-msg-l{
      color: #333;
    }
    .organize-msg-r{
      color: white;
    }
    .message-info {
      margin-bottom: 20px;

      &>div {
        position: relative;
      }
    }

    .user-img {
      width: 40px;
      height: 40px;
      margin: 0 20px;
      border-radius: 2px;
    }

    .user-info {
      font-size: 14px;
      color: #333333;

      span {
        color: #999999;
        font-size: 12px;
        margin-left: 8px;
      }
    }

    .message-box {
      padding: 9px 13px;
      border-radius: 2px;
      font-size: 14px;
      color: #333;
      margin-top: 5px;
      position: relative;
      max-width: 250px;
      word-wrap: break-word;

      a {
        color: #409EFF;
      }

      .message-box-text {
        user-select: text;
      }
    }

    .msg-tools-r,
    .msg-tools-l {
      background-color: white;
      position: absolute;
      text-align: left;
      bottom: 20px;
      line-height: 25px;
      font-size: 14px;
      padding: 0 10px;
      color: #999;
      cursor: pointer;

      div:first-child {
        // border-bottom: 1px solid #E5E5E5;
        border-radius: 2px;
      }
    }

    .msg-tools-r {
      right: -60px;
    }

    .msg-tools-l {
      left: -60px;
    }

    .chatItemShowTools-r,
    .chatItemShowTools-l {
      position: absolute;
      border: 1px solid #e4e4e4;
      padding: 0 2px;
      color: #606266;
      font-size: 12px;
      line-height: 1;
      border-radius: 3px;
      cursor: pointer;
      background-color: white;
    }

    .chatItemShowTools-l {
      right: -25px;
      bottom: 0;
    }

    .chatItemShowTools-r {
      left: -25px;
      bottom: 0;
    }

    .chatItemShowTools-r:active,
    .chatItemShowTools-l:active {
      background-color: #dcdfe6;
    }

    .r-left {
      background-color: white;
    }

    .l-left {
      background-color: #267AFC;
      color: white;
    }

    .r-left::after {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      border-width: 6px;
      border-color: transparent white transparent transparent;
      border-style: solid;
      left: -12px;
      top: 13px;
    }

    .l-left::after {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      border-width: 6px;
      border-color: transparent transparent transparent #267AFC;
      border-style: solid;
      right: -12px;
      top: 13px;
    }

    .need {
      background-color: white;
    }

    .l-left.need {
      &::after {
        border-color: transparent transparent transparent white;
      }
    }

    .txt-r {
      text-align: right;
    }

    .txt-l {
      text-align: left;
    }

    .message-status {
      font-size: 12px;
      color: #999999;
    }

    .message-translate {
      font-size: 12px;
      color: #999999;
      background-color: white;
      margin-top: 5px;
      padding: 5px;
      max-width: 250px;
      text-align: justify;

      .el-icon-success:before {
        font-size: 12px;
        margin-right: 2px;
        color: #67C23A;
      }
    }

    .message-time {
      padding: 5px 7px;
      border-radius: 2px;
      background-color: #DADADA;
      font-size: 12px;
      color: white;
      float: left;
      position: relative;
      float: left;
      left: 50%;
      transform: translate(-50%, 0);
      text-align: center;
      max-width: 300px;
      .demand-msg{
        color: #67C23A;
      }
    }

    .message-images {
      max-width: 250px;
      background-color: white;
    }

    .message-voice {
      width: 23px;
      height: 23px;
      background-repeat: no-repeat;
      cursor: pointer;
    }

    .message-file {
      width: 250px;
      overflow: hidden;
      font-size: 14px;

      p {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-wrap: normal;
        max-width: 200px;
        margin-top: 10px;
      }

      div {
        margin-top: 15px;
      }

      a {
        text-decoration: none;
      }
    }

    .message-file-icon {
      width: 76px;
      height: 76px;
      float: left;
      padding-right: 10px;
    }

    .mf-right {

      //  p{
      //    color: #35ac2f;
      //  }
      div {
        color: #35ac2f;
        cursor: pointer;
      }
    }

    .mf-left {

      //  p{
      //    color: white;
      //  }
      div {
        color: white;
        cursor: pointer;
      }
    }

    .link-you {
      color: #00ec2a;
    }

    .new-tools-header {
      font-size: 14px;
      width: 200px;
      padding-bottom: 5px;
      border-bottom: 1px solid #EFEFEF;
      cursor: pointer;

      &.text-cr {
        color: #267AFC;
      }

      &.text-cl {
        color: #4EBF62;
      }
    }

    .new-tools-content {
      margin-top: 12px;
      cursor: pointer;

      .bg-Group_6_Copy_2 {
        margin-right: 12px;
      }

      .ndc-p1 {
        font-size: 14px;
        color: #2D3132;
        max-width: 152px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      .ndc-p2 {
        font-size: 12px;
        color: #8B969C;
        max-width: 152px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      span {
        color: #FF9D44;
      }
    }
    .msg-progress{
      position: absolute;
      top: 0;
      width: 100%;
      text-align: center;
    }
    .yatuIcon{
      margin-right: 10px;
    }
  }

  //   /*滚动条样式*/
  // .message-container::-webkit-scrollbar {/*滚动条整体样式*/
  //     width: 8px;     /*高宽分别对应横竖滚动条的尺寸*/
  //     height: 4px;
  // }
  // .message-container::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  //     border-radius: 5px;
  //     -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  //     background: #D6D6D6;
  // }
  // .message-container::-webkit-scrollbar-track {/*滚动条里面轨道*/
  //     -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
  //     border-radius: 0;
  //     background: #6c6e71;
  // }

</style>
