<template>
  <chat-toast :config="organizeData" @save="organizeSave" @close="close">
    <div class="gm-toast-body">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
        <el-row>
          <el-col :span="24">
            <el-form-item label="评价人指定：" prop="toUser">
              <el-select v-model="ruleForm.toUser" filterable placeholder="请选择">
                <el-option v-for="item in getGroupData.groupUsers" v-if="item.openId !== getfromUser.fromUserId" :key="item.openId" :label="item.username" :value="item.openId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </chat-toast>
</template>
<script>
  import {reviewFinish} from '../../api/index.js'
  import {mapGetters} from 'vuex';
  export default {
    computed: {
      ...mapGetters(['getfromUser','getGroupData'])
    },
    data() {
      return {
        ruleForm: { //表单值
         toUser:''
        },
         //校验
        rules: {
            toUser:[{
                required: true,
                message: '请指评价人',
                trigger: ['blur', 'change']
            }]
        },
        organizeData: { //办结弹窗数据
          title: "发起办结", //弹窗标题
          dialogVisible: false, //弹窗显示
          width: "500px", //弹窗宽
          btnData: [{
            name: '取消', //按钮名
            method: 'close', //回调函数
            bgColor: 'dialog-white' //按钮背景
          }, {
            name: '确定', //按钮名
            method: 'save', //回调函数
            bgColor: 'dialog-bule' //按钮背景
          }]
        }
      }
    },
    methods: {
      close(){
        this.organizeData.dialogVisible = false;
      },
      show(){
        this.organizeData.dialogVisible = true;
        setTimeout(() => {
          this.resetForm();
        }, 0)
      },
      organizeSave(groupData) { //办结保存
        this.submitForm(() => {
          reviewFinish({
            Vue: this,
            params: {
              fromUser: this.getfromUser.fromUserId,
              fromUserName: this.getfromUser.fromUserName,
              position: this.getfromUser.fromUserPosition,
              headImgUrl: this.getfromUser.fromUserImg,
              groupId: this.getGroupData.groupId,
              toUser: this.ruleForm.toUser,
              groupName: this.getGroupData.groupName
            }
          }).then(data => {
            this.$message({
              message: '发起成功',
              type: 'success'
            });
          })
          this.close();
        })

      },
      submitForm(fun) {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            if (fun) {
              fun();
            }
          } else {
            return false;
          }
        });
      },
      resetForm() {
        this.$refs['ruleForm'].resetFields();
      }
    }
  }

</script>
<style lang="less">
  .gm-toast-body {
    padding: 0 40px;
    .el-form-item__content {
      color: #333;
      font-size: 14px;
    }
    .el-form-item__label {
      color: #666666;
      font-size: 14px;
    }
  }

</style>
