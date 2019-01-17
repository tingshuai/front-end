<template>
  <!-- 聊天工具栏 -->
  <div class="chat-tools" id="chatTools" @dragenter.stop="dragUpload=true" @paste="paste($event)">
    <!-- 工具与聊天记录 -->
    <div class="tools-list clearfix">
      <div class="tools-list-left left">
        <!-- 发送图片 -->
        <el-upload class="upload-demo" accept="image/*" multiple :data="{watermark}" :on-progress="progress" :action="uploadUrl"
          :show-file-list="false" :on-success="UploadSuccess" :before-upload="UploadBefore" :on-error="UploadRrror">
          <div class="bg-updateimg left tools-icon" title="发送图片"></div>
        </el-upload>
        <!-- 水印 -->
        <div class="left tools-icon" :class="watermark?'bg-shuiying2':'bg-shuiying'" @click="watermark=!watermark"
          title="图片水印"></div>
        <!-- 发送文件 -->
        <el-upload class="upload-demo" multiple :on-progress="progress" :data="{watermark}" :action="uploadUrl"
          :show-file-list="false" :on-success="UploadSuccess" :before-upload="UploadBefore" :on-error="UploadRrror">
          <div class="bg-flie left tools-icon" title="发送文件"></div>
        </el-upload>
        <!-- @@艾特 -->
        <div class="bg-aite left tools-icon" title="@艾特" @mouseenter="AateShow = true" @mouseleave="AateShow = false">
          <!-- @艾特人员列表 -->
          <transition name="fade">
            <div class="Aate-user-list" v-show="AateShow">
              <div class="aul-item" @click="AateUser('all')">
                @全部
              </div>
              <div class="aul-item" v-for="item in groupData.groupUsers" v-if="item.openId!==getfromUser.fromUserId"
                @click="AateUser(item)">
                {{item.username}}
              </div>
            </div>
          </transition>
        </div>
        <!-- 需求 -->
        <div class="bg-needsend left tools-icon" title="发起需求" @click="demand"></div>
        <!-- 结办 -->
        <div class="bg-more left tools-icon" @mouseenter="moreToolShow = true" @mouseleave="moreToolShow = false">
          <!-- 更多选项 -->
          <transition name="fade">
            <div class="more-tools" v-show="moreToolShow">
              <!-- 压图 -->
              <img src="../../assets/images/yatu.png" v-show="getfromUser.fromUserId===groupData.managerId" alt="发起压图" @click="sendPressureImage">
              <!-- 白板 -->
              <img src="../../assets/images/baiban.png" @click="goBaiban" alt="白板">
              <!-- 评价 -->
              <img src="../../assets/images/ping.png" v-show="getfromUser.fromUserId===groupData.managerId" @click="organize"
                alt="项目结办">
              <!-- 子群互通 -->
              <!-- <img src="../../assets/images/hutong.png" v-show="getfromUser.fromUserId===groupData.managerId" alt="子群互通"> -->
            </div>
          </transition>
        </div>

      </div>
      <div class="tools-list-right right" @click="chatRecord">
        聊天记录
      </div>
    </div>
    <!-- 聊天输出内容 -->
    <div class="chat-content-edit" id="cce-box" @keydown="eidtKeydown($event)" @keyup="eidtKeyup($event)">
      <!-- @的人 -->
      <div class="remind-user">
        <el-tag v-for="tag in remindData" :key="tag.openId" size="mini" closable @close="remindClose(tag)">
          {{tag.username}}
        </el-tag>
      </div>
      <!-- 文本输入框 -->
      <el-input type="textarea" class="cce-content" maxlength="200" :autosize="{ minRows: 2, maxRows: 3}" placeholder="请输入内容"
        resize='none' v-model="textarea">
      </el-input>
    </div>
    <!-- btn按钮 -->
    <div class="cce-send-btn">
      按下Ctrl+Enter换行
      <button @click="btnSend" :disabled="!textarea.trim()&&remindData.length<=0" :class="{'isBtnSend':remindData.length<=0&&!textarea.trim()}">发送</button>
    </div>
    <!-- 拖拽上传 -->
    <div class="drag-upload" @mouseleave="dragUpload=false" v-show="dragUpload">
      <el-upload drag multiple :data="{watermark}" class="drag-upload" :on-progress="progress" :action="uploadUrl"
        :show-file-list="false" :on-success="UploadSuccessDrag" :before-upload="UploadBefore" :on-error="UploadRrror">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或
          <em>点击上传</em>
        </div>
      </el-upload>
      <i @click="dragUpload = false" class="close-drag-upload el-icon-circle-close-outline"></i>
    </div>
    <!-- 项目办结 -->
    <organize ref="organize"></organize>
    <!-- 发起需求 -->
    <demand-send ref="demandSend"></demand-send>
    <!-- 拖拽与粘贴发送图片 -->
    <send-images ref="sendImages" :watermark="watermark"></send-images>
    <!-- 发起压图 -->
    <send-pressure-image ref="sendPressureImage"></send-pressure-image>
  </div>
</template>
<script>
  import {
    fileUploadUrl,
    chatRemind,
    reviewFinish,
    chatAttachUpdate,
    getWatermarkUrl,
    diagramCheck
  } from '../../api/index.js'
  import {
    notifiMsg
  } from '../../toolClass/notification.js'
  import {
    mapGetters,
    mapMutations
  } from 'vuex'
  import organize from '../funToast/organize'
  import demandSend from '../funToast/demandSend'
  import sendImages from '../funToast/sendImages'
  import sendPressureImage from '../funToast/sendPressureImage.vue'
  export default {
    props: ['groupData'],
    data() {
      return {
        AateShow: false, //艾特显示
        moreToolShow: false, //更多功能显示
        dragUpload: false, //拖拽上传显示
        watermark: false, //是否给图片加水印
        textarea: '', //发送文本
        uploadUrl: '', //上传接口
        isControlTouch: false, //键盘按键
        remindData: [], //艾特人员集合
        AateTime: null //艾特相关
      }
    },
    computed: {
      ...mapGetters(['getwebSocket', 'getfromUser'])
    },
    mounted() {

      this.uploadUrl = window.localStorage.getItem('uploadUrl'); //上传接口

      this.$nextTick(() => {
        document.getElementsByTagName('textarea')[0].focus(); //自动获取焦点
      })
    },
    methods: {
      ...mapMutations(['setLoading', 'setIsProgress', 'setIsChatRecord']),
      paste(e) {
        var cbd = e.clipboardData;
        let copyData = cbd.getData('text');
        if (/.{1,}\.(png|jpeg|jpg|gif)$/.test(copyData)) { //粘贴内容为图片链接时处理
          this.$refs.sendImages.setData(copyData);
          //  e.preventDefault()//是否保留链接文本
          return;
        }
        var ua = window.navigator.userAgent;
        // 如果是 Safari 直接 return  
        if (!(e.clipboardData && e.clipboardData.items)) {
          return;
        }
        // Mac平台下Chrome49版本以下 复制Finder中的文件的Bug Hack掉  
        if (cbd.items && cbd.items.length === 2 && cbd.items[0].kind === "string" && cbd.items[1].kind ===
          "file" &&
          cbd.types && cbd.types.length === 2 && cbd.types[0] === "text/plain" && cbd.types[1] ===
          "Files" &&
          ua.match(/Macintosh/i) && Number(ua.match(/Chrome\/(\d{2})/i)[1]) < 49) {
          return;
        }
        for (var i = 0; i < cbd.items.length; i++) {
          var item = cbd.items[i];
          if (item.kind == "file") {
            var blob = item.getAsFile();
            if (blob.size === 0) {
              return;
            }
            if (/^image\/.+/.test(item.type)){
              var data = new FormData();
              data.append('file', blob);
              data.append('watermark', this.watermark);
              chatAttachUpdate({
                Vue: this,
                params: data
              }, this.uploadUrl).then(data => {
                this.$refs.sendImages.setData(data.model);
              })
            }
          }
        }
      },
      sendPressureImage(){
         diagramCheck({Vue:this},this.groupData.groupId).then(data=>{
            if(data.data===0){
                this.$refs.sendPressureImage.show();
            }else{
                this.$message({
                  showClose: true,
                  message: '您已经发起过压图，不能重复发起',
                  type: 'warning'
                });
            }
         })
      },
      organize() { //办结
        this.$refs['organize'].show();
      },
      demand() { //需求
        this.$refs.demandSend.demandData.dialogVisible = true;
        setTimeout(() => {
          this.$refs.demandSend.resetForm();
        })
      },
      AateUser(data) { //艾特他
        if (data === 'all') {
          this.remindData = [].concat(this.groupData.groupUsers);
          let index = this.remindData.findIndex(item => {
            return item.openId === this.getfromUser.fromUserId;
          })
          this.remindData.splice(index, 1);
        } else {
          let index = this.remindData.indexOf(data);
          if (index === -1) {
            this.remindData.push(data);
          }
        }
        this.AateShow = false;
      },
      remindClose(tag) { //移除@人员
        this.remindData.splice(this.remindData.indexOf(tag), 1);
      },
      progress(event, file, fileList) { //进度管理
        this.setIsProgress({
          show: true,
          text: parseInt(event.percent) + '%'
        })
      },
      dragenter() {
        this.dragUpload = true;
      },
      chatRecord() { //聊天记录
        this.setIsChatRecord(true);
      },
      UploadSuccessDrag(res, file) { //拖拽上传  
        if (res.result) {
          if (/^image\/(png|jpeg|jpg|gif)$/.test(file.raw.type)) {
            this.$refs.sendImages.setData(res.model);
          } else {
            this.sendMsg({
              type: '6',
              attachUrl: res.model,
              content: file.name
            });
          }
        } else {
          notifiMsg('warn', res.message);
        }
        this.setLoading(false);
        this.setIsProgress({
          show: false
        })
        this.dragUpload = false;
      },
      UploadSuccess(res, file) { //发送图片
        if (res.result) {
          if (/^image\/(png|jpeg|jpg|gif)$/.test(file.raw.type)) {
            this.sendMsg({
              type: '1',
              attachUrl: res.model
            });
          } else {
            this.sendMsg({
              type: '6',
              attachUrl: res.model,
              content: file.name
            });
          }
        } else {
          notifiMsg('warn', res.message);
        }
        this.setLoading(false);
        this.setIsProgress({
          show: false
        })
        this.dragUpload = false;
      },
      UploadBefore(file, type) {
        let isJPG = /^image\/(png|jpeg|jpg|gif)$/.test(file.type);
        let msgType = '发送格式有误，请选择图片！';
        let msg = '图片超出发送大小，无法发送！';
        let types = 1;
        if (!isJPG) {
          isJPG = !isJPG;
          types = 2;
          msgType = '发送格式有误，请选择文件！';
          msg = '文件超出发送大小，无法发送！';
        }
        const isLt100M = file.size / 1024 / 1024 < 100;
        if (!isJPG) {
          notifiMsg('warn', msgType);
        }
        if (!isLt100M) {
          notifiMsg('warn', msg);
        }
        if (isJPG && isLt100M) {
          this.setLoading(true);
        }
        if (types === 1&&this.watermark) {
          // if (this.watermark) {
            this.setWatermarkData(file);
          // } else {
          //   this.compressedUpload(file);
          // }
          return false;
        }
        return isJPG && isLt100M;
      },
      UploadRrror() {
        notifiMsg('error', '系统异常！')
        this.setLoading(false);
      },
      btnSend() {
        if (this.remindData.length > 0) {
          this.sendAate();
          return;
        }
        this.sendMsg({
          type: '0',
          content: this.textarea
        });
        this.textarea = '';
      },
      sendAate() {
        let content = '';
        let toUser = '';
        let len = this.remindData.length - 1;
        this.remindData.forEach((item, index) => {
          toUser += index === len ? item.openId : item.openId + ',';
          content += '@' + item.username + '(@`-`@)';
        })
        this.sendMsg({
          type: '7',
          content: content + this.textarea,
          toUser: toUser
        });
        this.remindData = [];
        this.textarea = '';
      },
      eidtKeyup(e) {
        //释放
        this.isControlTouch = false;
        //重置滚动条
        setTimeout(() => {
          if (this.$refs['myScroll']) {
            this.$refs['myScroll'].initScrollBar();
            this.$refs['myScroll'].setBottom();
          };
        }, 0)
      },
      eidtKeydown(e) {
        if (e.key === "Enter" && e.ctrlKey) {
          let start = this.textarea.substring(0, e.target.selectionStart) + '\n';
          let end = this.textarea.substring(e.target.selectionStart, this.textarea.length);
          this.textarea = start + end;
        } else if (e.key === "Enter") {
          if (this.textarea.trim() != '') {
            //发送消息 
            this.btnSend();
            e.preventDefault();
          } else {
            this.textarea = '';
            e.preventDefault();
            this.$message({
              showClose: true,
              message: '不能发送空白消息',
              type: 'warning'
            });
          }
        }
      },
      sendMsg(option) { //发送消息
        try {
          this.getwebSocket.send(JSON.stringify({
            fromUser: this.getfromUser.fromUserId,
            fromUserName: this.getfromUser.fromUserName,
            position: this.getfromUser.fromUserPosition,
            headImgUrl: this.getfromUser.fromUserImg,
            cmd: option.cmd || '0',
            msgType: option.type || '0',
            groupId: this.groupData.groupId,
            toUser: option.toUser || '',
            content: option.content || '',
            attachUrl: option.attachUrl || '',
            groupName: this.groupData.groupName || ''
          }))
        } catch (error) {
          this.$message.error('您的网络异常,正在尝试重新连接');
        }
      },
      setWatermarkData(flie) { //处理水印数据
        let originalImg = new Image(),
          watermarkImg = new Image();
        originalImg.src = this.getObjectURL(flie);
        getWatermarkUrl({
          vue: this
        }).then(data => { //data.data.watermark
          watermarkImg.setAttribute('crossOrigin', 'anonymous');
          watermarkImg.src = data.data.watermark;
          watermarkImg.onload = () => {
            this.setWatermark(originalImg, watermarkImg); //设置水印
          }
        }).catch(error => {
          this.setLoading(false);
        })
      },
      // compressedUpload(flie) { 图片压缩上传
      //   let originalImg = new Image();
      //   originalImg.src = this.getObjectURL(flie);
      //   originalImg.onload = () => {
      //     let width = originalImg.width * 0.6,
      //       height = originalImg.height * 0.6;
      //     var canvas = document.createElement("canvas");
      //     canvas.width = width;
      //     canvas.height = height;
      //     var ctx = canvas.getContext("2d");
      //     ctx.drawImage(originalImg, 0, 0, width, height);
      //     canvas.toBlob((blob) => {
      //       blob.name = 'image.png'
      //       var data = new FormData();
      //       data.append('file', blob, Date.now() + '.png');
      //       //上传
      //       chatAttachUpdate({
      //         Vue: this,
      //         params: data
      //       }, this.uploadUrl, (event) => {
      //         let progress = Math.floor(event.loaded / event.total * 100);
      //         this.setIsProgress({
      //           show: true,
      //           text: progress + '%'
      //         })
      //       }).then(data => {
      //         this.sendMsg({ //发送图片
      //           type: '1',
      //           attachUrl: data.model
      //         });
      //         this.setLoading(false);
      //       })
      //     }, "image/jpeg", 0.6);
      //   }
      // },
      setWatermark(original, watermark) {
        let width = original.width,
          height = original.height,
          waterWidth = 0,
          waterHeight = 0;
        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        // 设置水印大小
        if (width > 0 && width <= 749) {
          waterWidth = 240;
          waterHeight = 240;
        } else if (width > 749 && width <= 999) {
          waterWidth = 280;
          waterHeight = 280;
        } else if (width > 999 && width <= 1499) {
          waterWidth = 360;
          waterHeight = 360;
        } else if (width > 1499 && width <= 1999) {
          waterWidth = 510;
          waterHeight = 510;
        } else if (width > 1999 && width <= 2499) {
          waterWidth = 680;
          waterHeight = 680;
        } else if (width > 2499 && width <= 2999) {
          waterWidth = 850;
          waterHeight = 850;
        } else if (width > 2999 && width <= 3999) {
          waterWidth = 1080;
          waterHeight = 1080;
        } else if (width > 3999 && width <= 4999) {
          waterWidth = 1360;
          waterHeight = 1360;
        } else if (width > 4999 && width <= 5999) {
          waterWidth = 1800;
          waterHeight = 1800;
        } else if (width > 5999 && width <= 6999) {
          waterWidth = 2100;
          waterHeight = 2100;
        } else {
          waterWidth = 2400;
          waterHeight = 2400;
        }
        let x = (width - waterWidth) / 2;
        let y = (height - waterHeight) / 2;
        ctx.drawImage(original, 0, 0, width, height);
        ctx.save();
        ctx.drawImage(watermark, x, y, waterWidth, waterHeight);
        ctx.restore();
        canvas.toBlob((blob) => {
          blob.name = 'image.png'
          var data = new FormData();
          data.append('file', blob, Date.now() + '.png');
          //上传
          chatAttachUpdate({
            Vue: this,
            params: data
          }, this.uploadUrl, (event) => {
            let progress = Math.floor(event.loaded / event.total * 100);
            this.setIsProgress({
              show: true,
              text: progress + '%'
            })
          }).then(data => {
            this.sendMsg({ //发送图片
              type: '1',
              attachUrl: data.model
            });
            this.setLoading(false);
          })
        }, "image/jpeg", 0.6)

      },
      // convertCanvasToImage(canvas) {
      //   let base64Data = canvas.toDataURL("image/png", 0.6);
      //   return this.dataURItoBlob(base64Data);
      // },
      // dataURItoBlob(base64Data) {
      //   var byteString;
      //   if (base64Data.split(',')[0].indexOf('base64') >= 0)
      //     byteString = atob(base64Data.split(',')[1]);
      //   else
      //     byteString = unescape(base64Data.split(',')[1]);
      //   var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
      //   var ia = new Uint8Array(byteString.length);
      //   for (var i = 0; i < byteString.length; i++) {
      //     ia[i] = byteString.charCodeAt(i);
      //   }
      //   return new Blob([ia], {
      //     type: mimeString
      //   });
      // },
      getObjectURL(file) {
        var url = null;
        // 下面函数执行的效果是一样的，只是需要针对不同的浏览器执行不同的 js 函数而已
        if (window.createObjectURL != undefined) { // basic
          url = window.createObjectURL(file);
        } else if (window.URL != undefined) { // mozilla(firefox)
          url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) { // webkit or chrome
          url = window.webkitURL.createObjectURL(file);
        }
        return url;
      },
      goBaiban() { //连接到白板
        const aLink = document.createElement('a')
        aLink.href = localStorage.getItem('boardUrl')
        aLink.target = '_blank'
        aLink.dispatchEvent(new MouseEvent('click', {}));
      }
    },
    components: {
      organize,
      demandSend,
      sendImages,
      sendPressureImage
    },
    watch: {
      'groupData.groupId': function () {
        this.AateShow = false;
        this.textarea = '';
        this.remindData = [];
      }
    }
  }

</script>
<style lang="less">
  .chat-tools {
    position: absolute;
    height: 200px;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #E5E5E5;
    background-color: #f3f3f3;
    padding-bottom: 40px;
    box-sizing: border-box;

    .tools-list {
      padding: 10px 30px 10px 0;
    }

    .upload-demo {
      float: left;
    }

    .tools-list-right {
      font-size: 16px;
      color: #8B969C;
      position: relative;
      cursor: pointer;

      &::after {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        border-width: 5px;
        border-style: solid;
        border-color: transparent transparent transparent #999999;
        right: -14px;
        top: 50%;
        margin-top: -5px;
      }
    }

    .chat-content-edit {
      padding-left: 20px;
      margin-right: 19px;
      height: 84px;
      position: relative;
      user-select: none;
    }

    .cce-content {
      height: 100%;
      width: 100%;
      margin-top: 5px;

      .el-textarea__inner {
        border: none;
        background-color: #f3f3f3;
        outline: none;
        font-size: 14px;
        font-family: Helvetica Neue, Helvetica, Hiragino Sans GB, Microsoft YaHei;
      }
    }

    .cce-send-btn {
      color: #888;
      font-size: 1px;
      position: absolute;
      bottom: 8px;
      right: 16px;

      button {
        box-sizing: border-box;
        width: 100px;
        height: 30px;
        background-color: #267AFC;
        border: none;
        outline: none;
        font-size: 14px;
        border-radius: 2px;
        color: white;
        cursor: pointer;
        transition: 0.2s;
        margin-left: 12px;

        &:active {
          background-color: #66b1ff;
        }
      }

      button.isBtnSend {
        background-color: #888;
        cursor: no-drop;
      }
    }

    .el-upload__input {
      display: none;
      outline: none;
    }

    .el-upload {
      outline: none;
    }

    .noRemind {
      color: #666;
      cursor: no-drop;
    }

    .drag-upload {
      position: absolute;
      left: 2px;
      top: 2px;
      bottom: 2px;
      right: 2px;
      background-color: white; // opacity: 0;

      .el-upload-dragger,
      .el-upload {
        height: 100%;
        width: 100%;
      }

      .close-drag-upload {
        font-size: 20px;
        position: absolute;
        right: 5px;
        top: 5px;
        cursor: pointer;
      }
    }

    .remind-user {
      max-height: 24px;
      overflow-y: auto;

      .el-tag {
        margin-left: 15px;
      }
    }

    .Aate-user-list {
      position: absolute;
      max-height: 220px;
      background-color: white;
      border-radius: 3px;
      box-shadow: 0 0 5px #c0c4cc;
      overflow: auto;
      left: 50%;
      transform: translate(-50%, -105%);

      .aul-item {
        font-size: 14px;
        padding: 0 30px;
        line-height: 25px;
        text-align: center;
        color: #666;
        cursor: pointer;
        max-width: 80px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;

        &:hover {
          background-color: #75b1ef;
          color: white;
        }
      }
    }

    .fade-enter-active,
    .fade-leave-active {
      transition: opacity .5s;
    }

    .fade-enter,
    .fade-leave-to

    /* .fade-leave-active below version 2.1.8 */
      {
      opacity: 0;
    }

    .tools-icon {
      margin-left: 31px;
      cursor: pointer;
    }

    .bg-flie,
    .bg-updateimg {
      margin-top: 3px;
    }

    .bg-aite {
      margin-top: 1px;
      position: relative;
    }

    .bg-more {
      width: 24px;
      height: 24px;
      background-image: url(../../assets/images/more.png);
      background-repeat: no-repeat;
      background-position: 0 10px;
      position: relative;
    }

    .more-tools {
      position: absolute;
      padding: 10px 15px;
      background-color: #fff;
      left: 50%;
      transform: translate(-50%, -50px);
      box-shadow: 0 2px 4px 0 rgba(53, 53, 53, 0.08);
      border-radius: 4px;
      display: flex;

      img {
        height: 24px;
        width: 24px;
        margin: 0 15px;
      }

      &::after {
        content: '';
        position: absolute;
        border-width: 7px;
        border-style: solid;
        border-color: white transparent transparent transparent;
        bottom: -13px;
        left: 50%;
        transform: translate(-50%, 0);
      }
    }

    .bg-banjie {
      margin-top: 2px;
    }
  }

</style>
