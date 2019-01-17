<template>
  <chat-toast :config="toastForwarding" @save="forwardingSaveBack" @close="toastForwarding.dialogVisible=false">
    <el-form :model="groupForm" status-icon :rules="groupRules" ref="groupForm" label-width="100px">
      <el-form-item label="转发群" prop="groupId">
        <el-cascader expand-trigger="hover" :options="sidebarData" change-on-select :props="{value:'groupId',label:'groupName'}"
          v-model="groupForm.groupId">
        </el-cascader>
      </el-form-item>
    </el-form>
  </chat-toast>
</template>
<script>
  import {
    mapGetters
  } from 'vuex'
  import {chatGroupsTree}  from '../../api/index'
  export default {
    computed: {
      ...mapGetters([
        'getfromUser',
        'getwebSocket'
      ])
    },
    data() {
      return {
        sidebarData:[],
        toastForwarding: { //消息转发
          title: "消息转发", //弹窗标题
          dialogVisible: false, //弹窗显示
          width: "440px", //弹窗宽
          btnData: [{
            name: '取消', //按钮名
            method: 'close', //回调函数
            bgColor: 'dialog-white' //按钮背景
          }, {
            name: '确定转发', //按钮名
            method: 'save', //回调函数
            bgColor: 'dialog-bule'
          }]
        },
        groupForm: {groupId:[]}, //消息转发相关
        groupRules: { //消息转发相关
          groupId: [{
            required: true,
            message: '请选择你需要转发的群',
            trigger: ['blur', 'change']
          }]
        }
      }
    },
    methods: {
      show(){
        this.toastForwarding.dialogVisible = true;
        chatGroupsTree({//数据更新
          Vue: this,
          params: {
            openId: this.getfromUser.fromUserId,
            pageSize: 0
          }
        }).then((data) => {
          this.sidebarData = data.data.rows;
        })  
        setTimeout(()=>{
            this.$refs.groupForm.resetFields();
        },0)
      },
      forwardingSaveBack() {
        if(this.$parent.currMsg){
           this.forwardingSave(this.$parent.currMsg);
        }else{
          this.$emit('forwardingSaveBack');
        }
      },
      forwardingSave(msgData) { //转发
        this.$refs.groupForm.validate((valid) => {
          if(valid){
          let groupId = this.groupForm.groupId[this.groupForm.groupId.length - 1];
          let groupName = this.getGroupName(this.sidebarData, groupId);
          if (!Array.isArray(msgData)) {
            msgData = new Array(msgData);
          };
          msgData.reverse();
          msgData.forEach(item => {
            switch (item.msgType) {
              case 7:
              case 0:
                this.sendMsg({
                  type: '0',
                  content: item.content
                }, groupId, groupName);
                break;
              case 6:
                this.sendMsg({
                  type: '6',
                  attachUrl: item.attachUrl,
                  content: item.content
                }, groupId, groupName);
                break;
              case 1:
                this.sendMsg({
                  type: '1',
                  attachUrl: item.attachUrl
                }, groupId, groupName);
                break;
              case 2:
                this.sendMsg({
                  type: '2',
                  attachUrl: item.attachUrl,
                  content:item.content
                }, groupId, groupName);
                break;
            }
          })
          this.toastForwarding.dialogVisible = false;
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      sendMsg(option, groupId, groupName) { //发送消息
        try {
          this.getwebSocket.send(JSON.stringify({
            fromUser: this.getfromUser.fromUserId,
            fromUserName: this.getfromUser.fromUserName,
            position: this.getfromUser.fromUserPosition,
            headImgUrl: this.getfromUser.fromUserImg,
            cmd: '0',
            msgType: option.type,
            groupId: groupId,
            toUser: option.toUser || '',
            content: option.content || '',
            attachUrl: option.attachUrl || '',
            groupName: groupName
          }))
        } catch (error) {
          this.$message.error('您的网络异常,正在尝试重新连接');
        }
      },
      getGroupName(list, groupId) { //通过groupId 拿到群名称;
        for (let i = 0; i < list.length; i++) {
          if (list[i].groupId === groupId) {
            return list[i].groupName;
          }
          if (list[i].children && list[i].children.length > 0) {
            let groupName = this.getGroupName(list[i].children, groupId);
            if (groupName) {
              return groupName;
            }
          }
        }
      }
    }
  }

</script>
