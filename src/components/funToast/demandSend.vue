<template>
  <chat-toast :config="demandData" @save="demandSave" @close="close">
    <el-form :model="demandForm" status-icon :rules="demandRules" ref="demandForm" class="demand-send" label-width="110px">
      <el-form-item label="需求描述" prop="demandText">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" maxlength="150" placeholder="请输入内容" v-model="demandForm.demandText"></el-input>
      </el-form-item>
      <el-form-item label="对接人" prop="confirmUser">
        <el-select v-model="demandForm.confirmUser" filterable placeholder="请选择">
          <el-option v-for="item in getGroupData.groupUsers" v-if="item.openId !== getfromUser.fromUserId" :key="item.openId"
            :label="item.username" :value="item.username+','+item.openId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="附件">
        <el-upload class="upload-demo" ref="upload" multiple  :before-upload="UploadBefore" :action="uploadUrl" :on-remove="fileRemove"
          :on-success="UploadSuccess" :on-error="UploadRrror">
          <div class="demand-send-enclosure">请选择</div>
        </el-upload>
      </el-form-item>
    </el-form>
  </chat-toast>
</template>
<script>
  import {
    demandAdd
  } from '../../api/index'
  import {
    mapGetters
  } from 'vuex'
  import {
    notifiMsg
  } from '../../toolClass/notification.js'
  export default {
    computed: {
      ...mapGetters(['getwebSocket', 'getfromUser', 'getGroupData'])
    },
    data() {
      return {
        uploadUrl: '',
        currUpDataNum:0,
        demandForm: {
          demandText: '',
          confirmUser: '',
          demandAttach: []
        },
        demandRules: {
          demandText: [{
            required: true,
            message: '请添写需求描述',
            trigger: ['blur', 'change']
          }],
          confirmUser: [{
            required: true,
            message: '请选择对接人',
            trigger: ['blur', 'change']
          }],
        },
        demandData: { //办结弹窗数据
          title: "需求单", //弹窗标题
          dialogVisible: false, //弹窗显示
          width: "420px", //弹窗宽
          btnData: [{
            name: '取消', //按钮名
            method: 'close', //回调函数
            bgColor: 'dialog-white' //按钮背景
          }, {
            name: '提交需求', //按钮名
            method: 'save', //回调函数
            bgColor: 'dialog-bule' //按钮背景
          }]
        }
      }
    },
    created() {
      this.uploadUrl = window.localStorage.getItem('uploadUrl');
    },
    methods: {
      close(){
         this.demandData.dialogVisible=false;
      },
      demandSave() {
         if(this.currUpDataNum!==0){
            this.$message({
              message: '还有附件还未上传成功请稍后',
              type: 'warning'
            });
           return;
         }
        this.submitForm(() => {
          let demandAttachName = '';
          let demandAttach = '';
          let len = this.demandForm.demandAttach.length - 1;
          this.demandForm.demandAttach.forEach((element, index) => {
            demandAttachName += index === len ? element.name : element.name + ',';
            demandAttach += index === len ? element.response.model : element.response.model + ',';
          });
          let confirmUser = this.demandForm.confirmUser.split(',');
          demandAdd({
            Vue: this,
            params: {
              confirmUser: confirmUser[1],
              confirmUserName: confirmUser[0],
              demandAttachName: demandAttachName,
              demandAttach: demandAttach,
              demandText: this.demandForm.demandText,
              fromUser: this.getfromUser.fromUserId,
              fromUserName: this.getfromUser.fromUserName,
              groupId: this.getGroupData.groupId,
              groupName: this.getGroupData.groupName,
              headImgUrl: this.getfromUser.fromUserImg,
              position: this.getfromUser.fromUserPosition,
            }
          }).then(data => {
            this.$message({
              message: data.message,
              type: 'success'
            });
          })
          this.$refs['upload'].clearFiles();
          this.close();
        })
      },
      UploadSuccess(res, file, fileList) { //发送图片
        if (res.result) {
          this.currUpDataNum--;//统计正在上传数量
          this.demandForm.demandAttach = fileList;
          notifiMsg('success', res.message);
        } else {
          notifiMsg('warn', res.message);
        }
      },
      fileRemove(file, fileList) {
        this.demandForm.demandAttach = fileList;
      },
      UploadBefore(file, type) {
        this.currUpDataNum++;//统计正在上传数量
      },
      UploadRrror() {
        notifiMsg('error', '系统异常！')
      },
      submitForm(fun) {
        this.$refs['demandForm'].validate((valid) => {
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
        this.$refs.upload.clearFiles();
        this.$refs['demandForm'].resetFields();
        this.demandForm.demandAttach = [];
      }
    }
  }

</script>
<style lang="less">
  .demand-send {
    .el-upload-list__item-name {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      width: 230px;
    }

    .demand-send-enclosure {
      padding: 8px 68px 8px 10px;
      box-sizing: border-box;
      border: 1px solid #EFEFEF;
      border-radius: 2px;
      font-size: 14px;
      color: #409EFF;
      line-height: 1;

    }
  }

</style>
