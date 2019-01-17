<template>
  <div class="app">
    <div class="sidebar">
      <div class="user-header">
        <img :src="getfromUser.fromUserImg">
      </div>
      <div class="sidebar-tools">
        <div :class="toolsActive==='chatRoom'?'bg-msgBoxActive':'bg-Group_38'" @click="setTools('chatRoom')"></div>
        <div  :class="toolsActive==='historyRoom'?'bg-Group_37':'bg-lishi'" @click="setTools('historyRoom')"></div>
        <div v-if="getfromUser.canBuildGroup"  :class="toolsActive==='newlyGroup'?'bg-Group_32_Copy_10':'bg-Group_32_Copy_3'" @click="setTools('newlyGroup')"></div>
      </div>
    </div>
    <!-- 缓存 -->
    <keep-alive>
      <component :is="toolsActive"></component>
    </keep-alive>
    <!-- loading -->
    <loading></loading>
  </div>
</template>

<script>
import {getUserInfo,fileUploadUrl} from './api/index'
import {mapGetters,mapMutations} from 'vuex' 
import chatRoom from './page/chatRoom.vue'
import historyRoom from './page/historyRoom.vue'
import newlyGroup from './page/newlyGroup.vue'
  export default {
    props: ['jcChatPort','boardUrl','fromUserId', 'qrCode'],
    data () {
      return {
         toolsActive:'',
      }
    },
    computed:{
      ...mapGetters(['getfromUser'])
    },
    created() {
      localStorage.setItem('jcChatPort', this.jcChatPort);
      localStorage.setItem('boardUrl',this.boardUrl);

      /** 测试代码开始 */
      this.setfromUser({
        fromUserId:"oc6Hd1BHJF55T1jIWr2eC2AEYoUQ",
        fromUserName: '乔飞',
        fromUserPosition: "",
        fromUserImg: "http://thirdwx.qlogo.cn/mmopen/hJBryIicTnFT1E8QTicPlpmNezShFEVFr0RNXsGcRicibWib9JHNsZ0iaxcibicU1yAMT3ToMJrib6gxIoCAIe6hVmtXccHPrzdYevpMia/132",
        canBuildGroup: true,
        isGroupManager: true
      });
      this.toolsActive = 'chatRoom';
      /** 测试代码结束 */
      fileUploadUrl({//获取上传接口
          Vue: this
        }).then(data => {
          if (data.status === 200) {
            window.localStorage.setItem('uploadUrl',data.data.uploadUrl);
          }
      })
      //获取用户信息
      // getUserInfo({
      //   Vue: this
      // }).then(data => {
      //   this.setfromUser({
      //     fromUserId: data.data.openId,
      //     fromUserName: data.data.username,
      //     fromUserPosition: data.data.position,
      //     fromUserImg: data.data.headImgUrl,
      //     isGroupManager: data.data.isGroupManager,
      //     canBuildGroup:data.data.canBuildGroup
      //   });
      //   this.toolsActive = 'chatRoom';
      // })
    },
    methods:{
     ...mapMutations([
        'setfromUser'
      ]),
      setTools(type){
        this.toolsActive = type;
      }
    },
    components: {
      chatRoom,
      historyRoom,
      newlyGroup
    }
  }

</script>

<style lang="less">
  @import './assets/less/reset.less';
  @import './assets/less/tools.less';
  @import './assets/less/sprites';
  body {
    // background-image: url(./assets/bg.jpg);
    background-size: cover;
    background-color: #D8D8D8;
    .mix-flex-center();
  }

  .app {
    min-width: 950px;
    min-height: 700px; 
    width: 950px;
    height: 700px;
    box-sizing: border-box;
    position: relative;
    .sidebar {
      width: 60px;
      height: 100%;
      background-color: #267AFC;
      position: absolute;
      z-index: 1;
      .user-header {
        height: 80px;
        .mix-flex-center();
        img {
          height: 40px;
          width: 40px;
          border-radius: 4px;
        }
        border-bottom: 1px solid #418CFF;
      }
      .sidebar-tools {
        padding: 30px 15px;
        div {
          cursor: pointer;
        }
        .bg-lishi,.bg-Group_37 {
          margin: 28px 0 30px 0;
        }
      }
    }
  }

</style>
