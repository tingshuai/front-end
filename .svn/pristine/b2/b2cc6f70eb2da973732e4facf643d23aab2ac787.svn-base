<template>
  <div class="chat-record-body">
    <!-- 头部 -->
    <div class="chat-record-header clearfix">
      <span class="left">聊天记录</span>
      <div class="right bg-back" @click="recordBack"></div>
    </div>
    <!-- 条件查询 -->
    <div class="chat-record-search">
      <el-date-picker size="small" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
        v-model="fromSearch.dataTime" value-format="yyyy-MM-dd HH-mm-ss" @change="searchS">
      </el-date-picker>
      <el-input size="small" @change="searchS" placeholder="搜索关键词" prefix-icon="el-icon-search" v-model="fromSearch.keywords">
      </el-input>
    </div>
    <!-- 消息类型  -->
    <el-tabs v-model="msgType" @tab-click="msgTypeSelect">
      <el-tab-pane label="全部" name="0"></el-tab-pane>
      <el-tab-pane label="文件" name="6"></el-tab-pane>
      <el-tab-pane label="图片" name="1"></el-tab-pane>
    </el-tabs>
    <!-- 消息展示 -->
    <div class="chat-record-list">
      <!-- 自定义滚动条 -->
      <scroll-bar :config="scrollBarData" ref="myScroll"></scroll-bar>
      <!-- 全部消息展示 -->
      <div class="message-container" @scroll="msgScroll($event)">
        <!-- 消息 -->
        <div v-for="item in msgData" class="message-info clearfix">
          <!-- 数据勾选 -->
          <div v-if="item.cmd=='0'" class="grop-check-r">
            <el-checkbox v-model="item.check" @change="msgCheck(item)" :disabled="item.msgType==30||item.isJson"></el-checkbox>
          </div>
          <!-- 普通消息 -->
          <div v-if="item.cmd=='0'||item.cmd=='100'" class="left">
            <!-- 头像 -->
            <img class="user-img left" :src="item.headImgUrl||(getUrl()+'/images/headimg.png')">
            <div class="left">
              <!-- 个人简介 -->
              <div class="user-info txt-l">
                {{item.fromUserName||'无'}}
                <span>{{item.position||'无'}}</span>
              </div>
              <!-- 对话框 -->
              <div class="message-box" :class="[getfromUser.fromUserId===item.fromUser?'l-left':'r-left',{'need':item.isJson}]">
                <!-- text -->
                <span v-if="item.msgType==0||item.msgType==''" v-html="setTextURL(item.content)"></span>
                <!-- img -->
                <img v-else-if="item.msgType==1" v-lazy="item.attachUrl" @load="imgLoad" @click.stop="$emit('picturePreview',item.attachUrl)" class="message-images" />
                <!-- 语音 -->
                <div v-else-if="item.msgType==2&&getfromUser.fromUserId===item.fromUser" class="message-voice user-rotate "
                  @click="playVoice(item)" :style="{'background-image':item.isplay?'url('+getUrl()+'/images/yy.gif)':'url('+getUrl()+'/images/yy.png)'}"></div>
                <div v-else-if="item.msgType==2" class="message-voice" @click="playVoice(item)" :style="{'background-image':item.isplay?'url('+getUrl()+'/images/1Rw0-Kq.gif)':'url('+getUrl()+'/images/huise.png)'}"></div>
                <!-- 文件 -->
                <div v-else-if="item.msgType==6" class="message-file" :class="getfromUser.fromUserId===item.fromUser?'mf-left':'mf-right'">
                  <img src="../../assets/images/file.png" class="message-file-icon">
                  <p>{{item.content}}</p>
                  <div @click="downloadFile(item)" style="color:#67C23A;">下载</div>
                </div>
                <!-- @功能 -->
                <div v-else-if="item.msgType==7" class="message-box-text" v-html="setAate(item.content)"></div>
                <!-- 需求 -->
                <div v-else-if="item.msgType==20" @click="$emit('showDemand',item)">
                  <div class="new-tools-header text-cl">需求待确认</div>
                  <div class="new-tools-content">
                    <div class="left bg-Group_6_Copy_2"></div>
                    <p class="ndc-p1">需求单{{item.content.demandNum}}</p>
                    <p class="ndc-p2">对接人
                      <span>@{{item.content.confirmUserName}}</span>
                    </p>
                  </div>
                </div>
                <!-- 已确认 -->
                <div v-else-if="item.msgType==21" @click="$emit('showDemand',item)">
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
                <div v-else-if="item.msgType==22" @click="$emit('showDemand',item)">
                  <div class="new-tools-header text-cr">修改需求待确认</div>
                  <div class="new-tools-content">
                    <div class="left bg-Group_6_Copy_2"></div>
                    <p class="ndc-p1">需求单{{item.content.demandNum}}</p>
                    <p class="ndc-p2">对接人
                      <span>@{{item.content.confirmUserName}}</span>
                    </p>
                  </div>
                </div>
                <!-- 需求到期取消 -->
                <!-- <div v-else-if="item.msgType==24" class="organize-msg" :class="item.fromUser === getfromUser.fromUserId?'organize-msg-r':'organize-msg-l'">
                  <h1>需求提醒取消</h1>
                  <p class="ndc-p1">{{item.content.msgTemplate}}</p>
                </div> -->
                <!-- 压图相关开始 -->
                <!-- 待确认 -->
                <div v-else-if="item.msgType==40" @click="$emit('diagram',item)">
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
                <div v-else-if="item.msgType==42" @click="$emit('pressImageComplete',item)">
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
                <div v-else-if="item.msgType==41" @click="$emit('diagram',item)">
                  <div class="new-tools-header text-cr">修改</div>
                  <div class="new-tools-content">
                    <div class="left yatuIcon">
                      <img src="../../assets/images/yatuIcon.png" alt="">
                    </div>
                    <p class="ndc-p1">压图单{{item.content.diagramNum}}</p>
                    <p class="ndc-p2">对接人
                      <span@ {{item.content.signUserName}} </span> </p> </div> </div> <!-- 压图相关结尾 -->
                        <!-- 办结 -->
                        <div v-else-if="item.msgType==30" class="organize-msg" :class="item.fromUser === getfromUser.fromUserId?'organize-msg-r':'organize-msg-l'">
                          <h1>项目办结消息提醒</h1>
                          <p>尊敬的客户您好,您的项目已经完成,请对我们的服务做出评价。</p>
                          <!-- <div v-if="type!=='history'">
                    <a href="javascript:void(0)" @click="evaluate(item)">点击评价</a>
                  </div> -->
                        </div>
                  </div>
                </div>
              </div>
              <!-- 撤回消息 -->
              <div v-else-if="item.cmd=='1'" class="message-time">{{item.fromUserName}}撤回了一条消息</div>
              <!-- 系统推送消息 -->
              <div v-else-if="item.cmd=='2'">系统推送消息</div>
              <!-- 时间 -->
              <div v-else-if="item.cmd=='time'" class="message-time">{{item.content}}</div>
              <!-- 需求提前 -->
              <div v-else-if="item.cmd=='999'" class="message-time">
                {{item.msgTemplate||'无'}}
                <a @click="$emit('demandPromptcancel',item)" v-if="getfromUser.fromUserId===item.content.creatUser"
                  class="demand-msg" href="javascript:void(0)">取消提醒</a>
              </div>
              <!-- 已取消提醒 -->
              <div v-else-if="item.cmd=='1000'" class="message-time">
                {{item.msgTemplate||'无'}}
              </div>
            </div>
          </div>
        </div>
        <!-- 底部 -->
        <div class="chat-record-bottom clearfix">
          <el-checkbox class="left" v-model="checkAll" @change="checkAlls"></el-checkbox>
          <button class="btn-forward right" :class="{'btn-disabed':msgCheckData.length===0}" v-show="msgType==0||msgType==1"
            @click="forward()" :disabled="msgCheckData.length==0">消息转发</button>
          <button class="btn-forward right" :class="{'btn-disabed':msgCheckData.length===0}" v-show="msgType==6" @click="forward()"
            :disabled="msgCheckData.length==0">转发</button>
          <button class="btn-down right" :class="{'btn-disabed':msgCheckData.length===0}" v-show="msgType==6" @click="downloadFileAll()"
            :disabled="msgCheckData.length==0">下载</button>
        </div>
      </div>
</template>
<script>
  import {
    downloadFileUrl,
    getGroupMsg
    // demandGet
  } from '../../api/index.js'
  import audio from '../../toolClass/audio'
  import {
    mapGetters,
    mapMutations
  } from "vuex"
  import forwardMsg from './forwardMsg'
  export default {
    data() {
      return {
        msgData: [],
        fromSearch: {
          keywords: '',
          dataTime: []
        },
        msgType: '0',
        pageNum: 1,
        pageSize: 20,
        scrollBarData: { //自定义滚动条配置
          scrollBgColor: "transparent",
          scrollbarColor: "#D6D6D6",
          isScrollBottom: true
        },
        checkAll: false,
        msgCheckData: [],
        isScrollMsg: true //是否允许滚动加载数据
      }
    },
    computed: {
      ...mapGetters([
        'getGroupData',
        'getfromUser',
        'getwebSocket'
      ])
    },
    mounted() {
      this.pageNum = 1;
      this.isScrollMsg = false;
      this.scrollBarData.isScrollBottom = true;
      this.search();
    },
    methods: {
      ...mapMutations(['setIsChatRecord']),
      getUrl() { //获取资源访问地址
        return localStorage.getItem('jcChatPort');
      },
      msgScroll($event) { //滚动数据加载
        //滚动加载历史数据
        let target = $event.srcElement;
        if (target.scrollTop === 0 && this.isScrollMsg) {
          this.pageNum++;
          this.isScrollMsg = false;
          this.search(target);
        }
      },
      imgLoad() { //图片加载完重置滚动条
        if (this.$refs['myScroll']) {
          this.scrollBarData.isScrollBottom = false;
          this.$refs['myScroll'].initScrollBar();
        }
      },
      recordBack() { //返回聊天
        this.setIsChatRecord(false);
      },
      checkAlls() { //全选
        this.msgCheckData = [];
        this.msgData.forEach(item => {
          if (item.cmd == 0 && item.msgType !== 30 && !item.isJson) {
            item.check = this.checkAll;
            if (item.check) this.msgCheckData.push(item);
          }
        })
      },
      msgCheck(data) { //消息勾选
        let len = 0;
        this.msgData.forEach(item => {
          if (item.cmd == 0) {
            len++;
          }
        })
        let index = this.msgCheckData.findIndex(item => {
          return item.msgId === data.msgId;
        })
        if (data.check && index === -1) {
          this.msgCheckData.push(data);
        } else {
          this.msgCheckData.splice(index, 1);
        }
        this.checkAll = len === this.msgCheckData.length;
      },
      setTextURL(text) { //挑选出链接
        if (!text) {
          return '';
        }
        text = text.replace(/\(@`-`@\)/g, '');
        var reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
        return text.replace(reg, '<a href="$1$2" target="_blank">$1$2</a>');
      },
      msgTypeSelect() { //tabs切换
        this.resetData();
        setTimeout(() => {
          this.search();
        }, 0)
      },
      resetData() { //数据重置
        this.msgData = [];
        this.msgCheckData = [];
        this.checkAll = false;
        this.pageNum = 1;
        this.pageSize = 20;
        this.scrollBarData.isScrollBottom = true;
        this.isScrollMsg = false;
        // this.fromSearch = {
        //   keywords: '',
        //   dataTime: []
        // }
      },
      setAate(text) {
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
      forward() { //转发
        this.$emit('forward', this.msgCheckData);
      },
      searchS() {
        this.resetData();
        this.search();
      },
      search(target = {}) {
        //参数
        let params = {
          keywords: this.fromSearch.keywords,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          openId: this.getfromUser.fromUserId,
          groupId: this.getGroupData.groupId,
          msgType: this.msgType === '0' ? null : this.msgType
        };
        if (this.fromSearch.dataTime && this.fromSearch.dataTime.length > 0) {
          params.startAt = this.fromSearch.dataTime[0];
          params.endAt = this.fromSearch.dataTime[1];
        }
        getGroupMsg({
          params: params
        }).then(data => {
          if (data.data.rows.length === 0) {
            this.isScrollMsg = false;
            return
          }
          let size = target.scrollHeight;
          if (this.pageNum !== 1) {
            this.scrollBarData.isScrollBottom = false;
            this.msgData = data.data.rows.concat(this.msgData);
          } else {
            this.msgData = data.data.rows;
          }
          this.$nextTick(() => {
            this.isScrollMsg = true;
            if (this.$refs['myScroll']) this.$refs['myScroll'].initScrollBar();
            if (this.pageNum !== 1) {
              size = target.scrollHeight - size; //之前content位置
              this.$refs['myScroll'].scrollTop(size); //定位
            }
          })
          //数据处理  
          this.msgData.forEach(item => {
            console.log(item.isJson, item.msgType);
            if (item.isJson) {
              if (typeof item.content === 'string')
                item.content = JSON.parse(item.content);
            }
          })
        })

      },
      downloadFile(item) {
        var iFrame = document.createElement('iframe');
        iFrame.src = item.attachUrl;
        iFrame.style.display = 'none';
        document.body.appendChild(iFrame);
      },
      downloadFileAll() {
        this.msgData.forEach((item, index) => {
          if (item.check) {
            this.downloadFile(item)
          }
        })
      },
      playVoice(item) { //播放语音
        this.$set(item, 'isplay', true); //调整为播放状态
        audio.setUrl(item.attachUrl, this.currVoice); //设置资源
        this.currVoice = item; //保持当前播放实例
        audio.play(); //播放
        audio.onEnded(() => {
          this.$set(item, 'isplay', false); //调整为关闭状态
        })
      }
    }
  }

</script>
<style lang="less">
  @import '../../assets/less/tools';

  .chat-record-body {
    .chat-record-header {
      padding: 14px 30px 13px 22px;
      font-size: 20px;
      color: #2D3132;
      background-color: white;
      border-bottom: 1px solid #EFEFEF;
    }

    .chat-record-search {
      padding: 5px 30px;
      background-color: white;

      .el-date-editor {
        width: 300px;
        vertical-align: middle;
      }

      .el-input {
        width: 240px;
        vertical-align: middle;
        margin-left: 13px;
      }
    }

    .el-tabs {
      padding: 0 0 0 64px;
      background-color: white;
    }

    .el-tabs__item {
      font-size: 14px;
      color: #353535;
    }

    .el-tabs__item.is-active {
      color: #409EFF;
    }

    .el-tabs__nav-wrap::after {
      position: relative;
    }

    .chat-record-list {
      padding-left: 30px;
      height: 508px;
      overflow: hidden;
      position: relative;
    }

    .cr-list-item {
      height: 75px;
      padding-right: 40px;
      border-bottom: 1px solid#EFEFEF;

      .el-checkbox {
        margin-top: 29px;
      }

      img {
        width: 40px;
        height: 40px;
        margin: 16px 10px 0 12px;
        border-radius: 4px;
      }

      .msg-info {
        margin-top: 16px;
      }

      .user-name {
        font-size: 12px;
        color: #8B969C;
        .mix-text-overflow();
      }

      .info {
        font-size: 14px;
        color: #2D3132;
        letter-spacing: 0;
        .mix-text-overflow();
      }

      .time {
        font-size: 12px;
        color: #8B969C;
        margin-top: 28px;
      }
    }

    .grop-check-l,
    .grop-check-r {
      position: absolute;
      top: 0;
    }

    .grop-check-l {
      left: 0px;
    }

    .message-container {
      overflow: hidden;
      height: 100%;
      box-sizing: border-box;
      user-select: none;
    }

    .message-info {
      margin-bottom: 20px;
      position: relative;

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
    }

    .user-img {
      width: 50px;
      height: 50px;
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
      max-width: 350px;
      word-break: break-all;
    }

    .msg-tools {
      background-color: white;
      position: absolute;
      text-align: left;
      left: -60px;
      top: 0;
      line-height: 25px;
      font-size: 14px;
      padding: 0 10px;
      cursor: pointer;

      div:first-child {
        border-bottom: 1px solid #E5E5E5;
        border-radius: 2px;
      }
    }

    .r-left {
      background-color: white;
    }

    .l-left {
      background-color: #267AFC;
      color: white;
    }

    .need {
      background-color: white;
    }

    .message-box.l-left.need {
      &::after {
        border-color: transparent white transparent transparent;
      }
    }

    .message-box.r-left::after,
    .message-box.l-left::after {
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

    .message-box.l-left::after {
      border-color: transparent #267AFC transparent transparent; // border-style: solid;
    }

    .txt-r {
      text-align: right;
    }

    .txt-l {
      text-align: left;
    }

    .message-status {
      text-align: right;
      font-size: 12px;
      color: #999999;
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

    .organize-msg {
      color: #333;

      p {
        line-height: 1.5em;
      }

      div {
        text-align: center;
        line-height: 30px;
      }
    }

    .organize-msg-l {
      color: #333;
    }

    .organize-msg-r {
      color: white;
    }

    .message-images {
      max-width: 350px;
      max-height: 400px;
    }

    .message-voice {
      width: 23px;
      height: 23px;
      background-repeat: no-repeat;
      cursor: pointer;
    }

    .user-rotate {
      transform: rotate(180deg);
      transform-origin: center 45%;
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
      div {
        color: #35ac2f;
        cursor: pointer;
      }
    }

    .mf-left {
      div {
        color: white;
        cursor: pointer;
      }
    }

    .chat-record-bottom {
      padding: 5px 30px;
      background-color: white;

      .btn-forward,
      .btn-down {
        width: 100px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 14px;
        margin-left: 20px;
        border-radius: 2px;
        box-sizing: border-box;
        cursor: pointer;
        outline: none;
        border: none;
      }

      .btn-down {
        background-color: #FFFFFF;
        border: 1px solid #CCCDD0;
        color: #5C6466;
      }

      .btn-forward {
        background-color: #267AFC;
        color: white;
      }

      .btn-disabed {
        color: #bcbec2;
        background-color: #f4f4f5;
        border-color: #e9e9eb;
        cursor: no-drop;
      }
    }

    .bg-back {
      cursor: pointer;
    }
    .yatuIcon{
      margin-right: 10px;
    }
  }

</style>
