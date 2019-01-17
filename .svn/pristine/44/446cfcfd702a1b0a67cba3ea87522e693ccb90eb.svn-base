<template>
    <chat-toast :config="retreatGroupToastData" @cancel="retreatGroupToastData.dialogVisible=false"  @retreatGroup="retreatGroup">
         <div class="retreatGroup-toast">是否要退出该群？</div>
    </chat-toast>
</template>
<script>
import {groupsQuit} from '../../api/index.js'
import {mapGetters,mapMutations} from 'vuex'
export default {
    data () {
        return {
                retreatGroupToastData:{//退群
                    title:'退群确定',//弹窗标题
                    dialogVisible:false,//弹窗显示
                    width:'340px',//弹窗宽
                    btnData:[{
                        name:'取消',//按钮名
                        method:'cancel',//回调函数
                        bgColor:'dialog-white'//按钮背景
                    },{
                        name:'确定退出',
                        method:'retreatGroup',
                        bgColor:'dialog-bule'
                    }]
            }
        }
    },
    computed:{
       ...mapGetters(['getfromUser','getGroupData'])
    },
    methods:{
         ...mapMutations(['setGroupData']),
         close(){
            this.retreatGroupToastData.dialogVisible = false;
         },
         show(){
            this.retreatGroupToastData.dialogVisible = true;
         },
        retreatGroup() { //退群
            let groupId = this.getGroupData.groupId;
            let openId = this.getfromUser.fromUserId;
            let fromUserName = this.getfromUser.fromUserName;
            groupsQuit({
                Vue: this,
                params: {
                groupId,
                openId,
                fromUserName
                }
            }).then(data => {
                this.$message({
                type: 'success',
                message: data.message
                });
                this.setGroupData('');
            })
            this.close();//防止用户多次调用接口
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

