<template>
    <chat-toast :config="addUserToastData" @save="pullUserSave">
         <add-user  ref="addUser" type="pull" ></add-user>
    </chat-toast>
</template>
<script>
import addUser from './addUser.vue'
export default {
    data () {
        return {
            addUserToastData:{//拉人
                title:'添加群成员',//弹窗标题
                dialogVisible:false,//弹窗显示
                width:'900px',//弹窗宽
                btnData:[{
                    name:'保存',
                    method:'save',
                    bgColor:'dialog-bule'
                }]
            }
        }
    },
    methods:{
      close(){
        this.addUserToastData.dialogVisible = false;
      },
      show(){
        this.addUserToastData.dialogVisible = true;
        setTimeout(()=>{
          this.$refs.addUser.resetData();
        },0)
      },
      pullUserSave() {//拉人保存
        this.$refs.addUser.save();
        this.close();
      }
    },
    components:{
        addUser
    }
}
</script>
<style lang="less">

</style>

