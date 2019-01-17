// 历史群和聊天群是一样的只是数据不用，没用发送控件
<template>
    <div class="chatRoom">
          <chat-sidebar ref="sidebar" type="history"></chat-sidebar>
          <!-- 聊天内容 -->
          <div class="chat-content" v-if="getGroupHisData">
              <chat-header v-if="getGroupHisData" type="history" :groupData="getGroupHisData"></chat-header>
              <chat-area v-if="getGroupHisData" type="history" :groupData="getGroupHisData" :sidebarData="$refs.sidebar?$refs.sidebar.chatData:[]"></chat-area>
              <!-- <chat-tools v-if="getGroupData"></chat-tools> -->
          </div>
          <div class="chat-content wuliao" v-if="!getGroupHisData">
               <div class="wuliao-info">
                    <img src="../assets/images/wuliao.png" alt="">
                    <p>哎哟喂，当前不在任何群组哦</p>
                </div>
          </div>
          <!-- 其它 未来咨询或其它窗口 -->
          <!-- 列
            <div class="chat-content">
                <slot></slot>
            </div>
           -->
    </div>
</template>
<script>
import chatTools from "../components/chatRoom/chatTools";
import chatArea from "../components/chatRoom/chatArea";
import chatSidebar from "../components/chatRoom/chatSidebar";
import chatHeader from "../components/chatRoom/chatHeader";
import {mapGetters} from "vuex"
export default {
    components:{
        chatTools,
        chatArea,
        chatSidebar,
        chatHeader
    },
    computed: {
      ...mapGetters([
        'getGroupHisData'
      ])
    },
}
</script>
<style lang="less">
  @import '../assets/less/tools';
  .chatRoom{
      height: 100%;
      box-sizing: border-box;
      padding-left: 332px;
      position: relative;
      overflow: hidden;
      .chat-content{
       height: 100%;
       position: relative;
      }
      .wuliao{
        background-color: #ffffff;
      }
      .wuliao-info{
         text-align: center;
         position: absolute;
         left: 50%;
         top: 50%;
         transform: translate(-50%,-50%);
         font-size: 14px;
         color:#BCC2C6;
         p{
             margin-top: 20px;
         }
      }
  }
</style>