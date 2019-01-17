<template>
    <chat-toast :config="dissolutionToastData" @cancel="close"  @dissolution="dissolution">
         <div class="dissolution-toast">是否要解散该群？</div>
    </chat-toast>
</template>
<script>
import {retreatGroup} from '../../api/index.js'
import {mapGetters,mapMutations} from 'vuex'
export default {
    data () {
        return {
          dissolutionToastData:{//解散
                title:'解散确定',//弹窗标题
                dialogVisible:false,//弹窗显示
                width:'340px',//弹窗宽
                btnData:[{
                    name:'取消',//按钮名
                    method:'cancel',//回调函数
                    bgColor:'dialog-white'//按钮背景
                },{
                    name:'确定解散',
                    method:'dissolution',
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
        show(){
           this.dissolutionToastData.dialogVisible = true;
        },
        close(){
          this.dissolutionToastData.dialogVisible = false;
        },
        dissolution() { //解散群
            retreatGroup({
                Vue: this
            }, this.getGroupData.groupId).then(data => {
                // this.$message({
                // type: 'success',
                // message: data.message
                // });
                // this.setGroupData('');  操作在websocket里实现
            })
            this.close();
        }
    }
}
</script>
<style lang="less">
    .dissolution-toast{
        font-size: 14px;
        color: #5C6466;
        margin-bottom: 40px;
    }
</style>

