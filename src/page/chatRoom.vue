<template>
    <div class="chatRoom">
          <chat-sidebar ref="sidebar"></chat-sidebar>
          <!-- 聊天内容 -->
          <div class="chat-content" v-if="getGroupData">
              <chat-header v-if="getGroupData" :groupData="getGroupData"></chat-header>
              <chat-area ref="chatArea" v-if="getGroupData" :groupData="getGroupData"></chat-area>
              <chat-tools v-if="getGroupData" :groupData="getGroupData"></chat-tools>
          </div>
          <!-- 空白页面 -->
          <div class="chat-content wuliao" v-if="!getGroupData">
               <div class="wuliao-info">
                    <img src="../assets/images/wuliao.png" alt="">
                    <p>哎哟喂，当前不在任何群组哦</p>
                </div>
          </div>
          <!-- 聊天记录 -->
          <template>
            <div class="chat-record" :class="{'chat-record-show':isRecordShow}" v-if="getIsChatRecord||isRecordShow">
                <chat-record @showDemand="showDemand" 
                             @forward="forward" 
                             @diagram="diagram" 
                             @pressImageComplete="pressImageComplete" 
                             @demandPromptcancel="demandPromptcancel" 
                             @picturePreview="picturePreview"
                             ref="chatRecord"></chat-record>
            </div>    
            <!-- 消息转发 与聊天滴略微不同所以没复用 chat-area里引用滴-->
            <forward-msg ref="forwardMsg"  @forwardingSaveBack="forwardingSaveBack"></forward-msg>
          </template>
          <!-- 聊天记录结束 -->
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
import chatRecord from "../components/funToast/chatRecord.vue"
import forwardMsg from "../components/funToast/forwardMsg"
import {mapGetters} from "vuex"
export default {
    components:{
        chatTools,
        chatArea,
        chatSidebar,
        chatHeader,
        chatRecord,
        forwardMsg
    },
    computed: {
      ...mapGetters([
        'getGroupData',
        'getIsChatRecord'
      ])
    },
    data () {
        return {
          isRecordShow:false,  
          msgCheckData:[]
        }
    },
    methods:{
        showDemand(data){//聊天记录相关
            this.$refs.chatArea.demandSuer(data);
        },
        editDemand(data, listData) {//聊天记录相关
             this.$refs.chatArea.editDemand(data, listData);
          },
        demandEditBack() {//聊天记录相关
            this.$refs.chatArea.demandEditBack();
          },
        forwardingSaveBack() { //聊天记录相关
            this.$refs.forwardMsg.forwardingSave(this.msgCheckData);
            this.$refs.chatRecord.resetData();
            this.$refs.chatRecord.search();
        },
        diagram(data){//压图相关
            this.$refs.chatArea.diagram(data);
        },
        pressImageComplete(data){//压图完成
        this.$refs.chatArea.pressImageComplete(data);
        },
        pressImageEdit(data){//压图编辑
        this.$refs.chatArea.pressImageEdit(data);
        },
        pressEditClose(){//压图编辑回调关闭
            this.$refs.chatArea.pressEditClose();
        },
        demandPromptcancel(data){//取消到期提醒
           this.$refs.chatArea.demandPromptcancel(data);
        },
        picturePreview(url) { //预览图片
         this.$refs.chatArea.picturePreview(url);
        },
        forward(data){
            this.msgCheckData = data;
            this.$refs.forwardMsg.show();
        }
    },
    watch: {
        'getIsChatRecord':function(){
            if(this.getIsChatRecord){
                setTimeout(()=>{
                this.isRecordShow = true;
                },0)
            }else{
                this.isRecordShow = false;
            }

        }
    }
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
      .chat-record{
        background-color: #FAFAFA;
        z-index: 3;
        position: absolute;
        top: 0;
        transform: translateX(100%);
        transition: 0.5s;
      }
      .chat-record-show{
          transform: translateX(0);
      }
  }
</style>

