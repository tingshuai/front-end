<template>
  <chat-toast :config="demandEditData" @close="close" @save="save">
    <el-form ref="demandForm" :model="demandData.content" :rules="demandRules" label-width="100px" class="demand-suer">
      <el-form-item label="发起时间">
        <span class="left">{{demandData.content.createAt}}</span>
        <div class="right edit-click" v-show="demandData.msgType!==22" @click="back">
          <div class="bg-back_blue"></div>
          <span class="eidt-blue">返回确认</span>
        </div>
      </el-form-item>
      <el-form-item label="发起人">
        <div class="ds-list-item clearfix">
          {{demandData.content.fromUserName}}
        </div>
      </el-form-item>
      <el-form-item label="对接人">
        <div class="ds-list-item clearfix">
          {{demandData.content.confirmUserName}}
        </div>
      </el-form-item>
      <el-form-item label="需求内容" prop="demandText">
        <div class="ds-list-item ds-text-info clearfix">
           <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" :maxlength="500" placeholder="请输入内容" v-model="demandData.content.demandText"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="附件">
        <el-upload class="upload-demo" multiple  :before-upload="UploadBefore" :file-list="fileList"  :action="uploadUrl" :on-remove="fileRemove"
           :on-success="UploadSuccess" :on-error="UploadRrror">
          <div class="demand-send-enclosure">请选择</div>
        </el-upload>
      </el-form-item>
    </el-form>
  </chat-toast>
</template>
<script>
  import {
    downloadFileUrl,
    demandConfirm,
    demandEdit
  } from '../../api/index'
  import {
    mapGetters
  } from 'vuex'
  import {
    notifiMsg
  } from '../../toolClass/notification.js'
  export default {
    computed: {
      ...mapGetters([
        'getfromUser',
        'getGroupData'
      ])
    },
    data() {
      return {
       uploadUrl:'',
       currUpDataNum:0,
       fileList:[],//上传文件数量
        demandData: {
          content: {}
        },
        demandRules: {
          demandText: [{
            required: true,
            message: '请添写需求描述',
            trigger: ['blur', 'change']
          }]
        },
        demandEditData: { //评价弹窗
          title: "需求单", //弹窗标题
          dialogVisible: false, //弹窗显示
          width: "420px", //弹窗宽
          btnData: [{
            name: '取消', //按钮名
            method: 'close', //回调函数
            bgColor: 'dialog-white' //按钮背景
          }, {
            name: '确认修改', //按钮名
            method: 'save', //回调函数
            bgColor: 'dialog-bule' //按钮背景
          }]
        }
      }
    },
    created(){
      //获取上传接口
        this.uploadUrl  = window.localStorage.getItem('uploadUrl');
    },
    methods: {
      UploadSuccess(res, file,fileList) { //发送图片
        if (res.result) {
          this.currUpDataNum--;
           this.fileList = fileList;
          notifiMsg('success', res.message);
        } else {
          notifiMsg('warn', res.message);
        }
      },
      fileRemove(file, fileList){
          this.fileList = fileList;
      },
      UploadBefore(file, type) {
        this.currUpDataNum++;
      },
      UploadRrror() {
        notifiMsg('error', '系统异常！')
      },
      back(){
         this.close();
      },
      show(data,listData) {
        this.demandData = data;
        this.fileList = listData;
        //弹出窗数据处理
        this.demandEditData.title = '需求单' + data.content.demandNum;
        this.demandEditData.dialogVisible = true;
      },
      close() {
        this.demandEditData.dialogVisible = false;
      },
      save() {
        if(this.currUpDataNum!==0){
            this.$message({
              message: '还有附件还未上传成功请稍后',
              type: 'warning'
            });
           return;
         }
          this.submitForm(()=>{
             let demandAttachName = '';
                let demandAttach = '';
                let len = this.fileList.length-1;
                this.fileList.forEach((element,index) => {
                    demandAttachName += len===index?element.name:element.name+',';
                    if(element.response){
                       demandAttach += len===index?element.response.model:element.response.model+',';
                    }else{
                       demandAttach += len===index?element.url:element.url+',';
                    }
                });
              demandEdit({Vue:this,params:{
                    demandId: this.demandData.content.demandId,
                    fromUser: this.getfromUser.fromUserId,
                    fromUserName: this.getfromUser.fromUserName,
                    groupId: this.demandData.groupId,
                    groupName: this.getGroupData.groupName,
                    headImgUrl: this.getfromUser.fromUserImg,
                    msgId: this.demandData.msgId,
                    position: this.getfromUser.fromUserPosition,
                    confirmUser:this.demandData.fromUser,
                    confirmUserName:this.demandData.fromUserName,
                    demandText:this.demandData.content.demandText,
                    demandAttachName:demandAttachName,
                    demandAttach:demandAttach
              }}).then(data=>{
                    this.$message({
                        message: data.message,
                        type: 'success'
                    });
              })
              this.close();
              this.$emit('demandEditBack');
          })
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
        this.$refs['demandForm'].resetFields();
      }
    }
  }

</script>
<style lang="less">
  .demand-suer {
    .eidt-blue {
      font-size: 14px;
      color: #267AFC;
    }
    .ds-text-info {
      white-space: pre-line;
      line-height: 18px;
      margin-top: -8px;
      word-wrap: break-word;
    }
    .edit-click {
      cursor: pointer;
    }
    .bg-back_blue   {
      margin-right: 4px;
      margin-top: -2px;
      display: inline-block;
      vertical-align: middle;
    }
    .enclosure {
      font-size: 14px;
      color: #267AFC;
      cursor: pointer;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .bg-fujian {
      display: inline-block;
      vertical-align: middle;
      margin-right: 4px;
    }
    .img-pp {
      width: 80px;
      float: left;
      margin-right: 5px;

    }
  }

</style>

