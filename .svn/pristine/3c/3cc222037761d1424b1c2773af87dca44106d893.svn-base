<template>
    <chat-toast :config="toastAddData" @save="modifySave" @close="close">
      <eidt-group v-if="toastAddData.dialogVisible" ref='eidtGroup'></eidt-group>
    </chat-toast>
</template>
<script>
import {
    chatGroups
} from '../../api/index'
import eidtGroup from './eidtGroup'
import {mapGetters} from 'vuex'
export default {
    data () {
        return {
            toastAddData: {
                title: "编辑群组", //弹窗标题
                dialogVisible: false, //弹窗显示
                width: "440px", //弹窗宽
                btnData: [{
                    name: '取消', //按钮名
                    bgColor:'dialog-white',//按钮背景
                    method: 'close' //回调函数
                },{
                    name: '保存', //按钮名
                    method: 'save', //回调函数
                    bgColor: 'dialog-bule' //按钮背景
                }]
            }
        }
    },
   computed:{
       ...mapGetters(['getGroupData'])
    },
    methods:{
        close(){
          this.toastAddData.dialogVisible = false;
        },
        show(){
          this.toastAddData.dialogVisible = true;
          let data = JSON.parse(JSON.stringify(this.getGroupData));
          setTimeout(() => {
              let eidtGroup = this.$refs['eidtGroup'];
              //清除校验
              eidtGroup.resetForm();
              eidtGroup.types = 'edit';
              let {
                groupName,
                groupId,
                // deadline,
                parentId,
                groupDesc,
                managerId,
                addMemberOpenIds
              } = data;
              let openIds = this.setOpenIds(data.groupUsers);
              this.$set(eidtGroup, 'ruleForm', {
                groupName,
                groupId,
                // deadline:deadline,
                parentId: parentId === '0' ? '' : parentId,
                groupDesc,
                openIds,
                managerId,
                addMemberOpenIds
              });
              if (parentId !== '0') {
                eidtGroup.parentChange()
              } else {
                eidtGroup.getData()
              };
            }, 0)
        },
       modifySave() { //修改保存
       let eidtGroup = this.$refs['eidtGroup'];
        eidtGroup.submitForm(() => {
          let groupId = '';
          if (eidtGroup.types == 'add') {
            delete eidtGroup.ruleForm['groupId']
            delete eidtGroup.ruleForm['eGroupName']
          } else {
            groupId = eidtGroup.ruleForm['groupId']
            let eGroupName = eidtGroup.ruleForm['eGroupName']
            delete eidtGroup.ruleForm['eGroupName']
            if (eGroupName) {
              eidtGroup.ruleForm['groupName'] = eGroupName;
            }
          }
          chatGroups({
            params: eidtGroup.ruleForm,
            Vue: this
          }, groupId).then(data => {
            this.$message({
              message: data.message,
              type: 'success'
            });
          })
          this.close();
        })
      },
      setOpenIds(arr) { //处理群成员ID
        let _arr = [];
        arr.forEach(element => {
          _arr.push(element.openId);
        });
        return _arr;
      }
    },
    components:{
        eidtGroup
    }
}
</script>
<style lang="less">

</style>

