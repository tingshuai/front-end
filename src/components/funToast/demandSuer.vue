/*
* @Author: 小黑
* @Date: 2018-12-11 10:02:39
 * @Last Modified by: 小黑
 * @Last Modified time: 2018-12-24 17:20:27
*/
<template>
  <chat-toast :config="demandSuerData" @close="close" @save="save" @handleClose="handleClose">
    <el-form ref="ruleForm" :model="demandData.content" :rules="rules" label-width="110px" class="demand-suer">
      <el-form-item label="发起时间">
        <span class="left">{{demandData.content.createAt}}</span>
        <div class="right edit-click" v-show="getfromUser.fromUserId===demandData.toUser&&demandData.msgType!==21&&demandData.content.editable"
          @click="editDemand" v-if="type!='history'">
          <div class="bg-eidt"></div>
          <span class="eidt-blue">修改需求</span>
        </div>
      </el-form-item>
      <!-- 输入 -->
      <el-form-item label="计划完成时间" v-if="getfromUser.fromUserId===demandData.toUser&&demandData.msgType!==21&&demandData.content.editable"
        prop="planCompleteAt">
        <el-date-picker v-model="demandData.content.planCompleteAt" :disabled="type=='history'" type="datetime" placeholder="选择日期时间" format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm">
        </el-date-picker>
      </el-form-item>
      <!-- 显示 -->
      <el-form-item label="计划完成时间" v-else-if="demandData.content.planCompleteAt">
        <div>{{demandData.content.planCompleteAt||'无'}}</div>
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
      <el-form-item label="需求内容">
        <div class="ds-list-item ds-text-info clearfix">
          {{demandData.content.demandText}}
        </div>
      </el-form-item>
      <el-form-item label="附件">
        <div class="ds-list-itemp clearfix">
          <template v-for="item in demandAttach">
            <div class="enclosure" v-if="item.name" @click="downloadFile(item.url)">
              <div class="bg-fujian"></div>{{item.name}}
            </div>
            <img class="left img-pp" v-else :src="item.url" @click="downloadFile(item.url)">
          </template>
        </div>
      </el-form-item>
    </el-form>
  </chat-toast>
</template>
<script>
  import {
    downloadFileUrl,
    demandConfirm
  } from '../../api/index'
  import {
    mapGetters
  } from 'vuex'
  export default {
    computed: {
      ...mapGetters([
        'getfromUser',
        'getGroupData'
      ])
    },
    props: {
      type: { //区别是历史模式还是正常模式
        type: String,
        default: ''
      }
    },
    data() {
      let planCompleteAt = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请选择计划完成时间'));
        } else if (new Date(value) - new Date() <= 0) {
          callback(new Error('不能小于当前时间!'));
        } else {
          callback();
        }
      };
      return {
        demandData: {
          content: {
            planCompleteAt: ''
          }
        },
        rules: {
          planCompleteAt: [{
            required: true,
            validator: planCompleteAt,
            trigger: ['blur', 'change']
          }]
        },
        demandAttach: [],
        demandSuerData: { //评价弹窗
          title: "需求单", //弹窗标题
          dialogVisible: false, //弹窗显示
          width: "420px", //弹窗宽
          btnData: []
        }
      }
    },
    methods: {
      editDemand() {
        this.$emit('editDemand', JSON.parse(JSON.stringify(this.demandData)), this.demandAttach);
      },
      handleClose(){
           this.demandData={
            content: {
              planCompleteAt: ''
            }
          }
      },
      show(data) {
          let result = JSON.parse(JSON.stringify(data));
          if (typeof result.content === 'string') {
            this.$set(result,'content',JSON.parse(result.content));
          }
          result.content.planCompleteAt = result.content.planCompleteAt||'';
          this.setDemandAttach(result.content);
          //弹出窗数据处理
          this.demandSuerData.title = '需求单' + result.content.demandNum;
          if (result.toUser === this.getfromUser.fromUserId && result.msgType !== 21 && result.content.editable&&this.type!='history') {
            this.demandSuerData.btnData = [{
              name: '取消', //按钮名
              bgColor: 'dialog-white', //按钮背景
              method: 'close' //回调函数
            }, {
              name: '确认需求', //按钮名
              method: 'save', //回调函数
              bgColor: 'dialog-bule' //按钮背景
            }]
          } else {
            this.demandSuerData.btnData = [{
              name: '取消', //按钮名
              bgColor: 'dialog-white', //按钮背景
              method: 'close' //回调函数
            }]
          }
         this.demandSuerData.dialogVisible = true;
         this.demandData = result;
      },
      setDemandAttach(data) {
        if (data.demandAttach === '') {
          this.demandAttach = [];
          return
        }
        let demandAttach = [];
        let demandAttachUrl = data.demandAttach.substring(0, data.demandAttach.length).split(',');
        let demandAttachName = null;
        if (data.demandAttachName) demandAttachName = data.demandAttachName.substring(0, data.demandAttachName.length).split(
          ',');
        demandAttachUrl.forEach((item, index) => {
          let name = 'images' + (index + 1);
          if (demandAttachName) {
            name = demandAttachName[index]
          }
          demandAttach.push({
            url: item,
            name
          });
        });
        this.demandAttach = demandAttach;
      },
      downloadFile(url) {
        const aLink = document.createElement('a')
        aLink.download = 'test'
        aLink.href = url
        aLink.target = '_blank'
        aLink.dispatchEvent(new MouseEvent('click', {}));
      },
      close() {
        this.demandSuerData.dialogVisible = false;
      },
      save() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            demandConfirm({
              Vue: this,
              params: {
                demandId: this.demandData.content.demandId,
                fromUser: this.getfromUser.fromUserId,
                fromUserName: this.getfromUser.fromUserName,
                groupId: this.demandData.groupId,
                groupName: this.getGroupData.groupName,
                headImgUrl: this.getfromUser.fromUserImg,
                msgId: this.demandData.msgId,
                position: this.getfromUser.fromUserPosition,
                planCompleteAt: this.demandData.content.planCompleteAt + ':00'
              }
            }).then(data => {
              this.$message({
                message: data.message,
                type: 'success'
              });
            })
            this.close();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
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
    }

    .edit-click {
      cursor: pointer;
    }

    .bg-eidt {
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
