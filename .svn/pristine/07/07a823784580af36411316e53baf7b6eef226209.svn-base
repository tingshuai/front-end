<template>
    <chat-toast :config="demandCancelData" @cancel="demandCancelData.dialogVisible=false"  @demandCancel="demandCancel">
         <div class="retreatGroup-toast">确定取消提醒？</div>
    </chat-toast>
</template>
<script>
import {demandPromptcancel} from '../../api/index.js'
import {mapGetters,mapMutations} from 'vuex'
export default {
    data () {
        return {
                demandCancelData:{//退群
                    title:'需求提醒取消确定',//弹窗标题
                    dialogVisible:false,//弹窗显示
                    width:'340px',//弹窗宽
                    btnData:[{
                        name:'取消',//按钮名
                        method:'cancel',//回调函数
                        bgColor:'dialog-white'//按钮背景
                    },{
                        name:'确定',
                        method:'demandCancel',
                        bgColor:'dialog-bule'
                    }]
            },
            msgData:null
        }
    },
    computed:{
       ...mapGetters(['getfromUser','getGroupData'])
    },
    methods:{
         ...mapMutations(['setGroupData']),
         close(){
            this.demandCancelData.dialogVisible = false;
         },
         show(data){
            this.demandCancelData.dialogVisible = true;
            this.msgData = data;
         },
        demandCancel() { //取消提醒
        console.log('发起取消');
           demandPromptcancel({Vue:this,params:{
               msgId:this.msgData.msgId,
               demandId:this.msgData.content.demandId,
               groupId:this.getGroupData.groupId,
               groupName:this.getGroupData.groupName,
               fromUser:this.getfromUser.fromUserId,
               fromUserName:this.getfromUser.fromUserName,
               headImgUrl:this.getfromUser.fromUserImg,
               position:this.getfromUser.fromUserPosition
           }}).then(data=>{
              this.$message({
                type: 'success',
                message: data.message
                }); 
           })
           this.close(); 
      }
    }
}
</script>
<style lang="less">
    .retreatGroup-toast{
        font-size: 14px;
        color: #5C6466;
        margin-bottom: 40px;
    }
</style>

