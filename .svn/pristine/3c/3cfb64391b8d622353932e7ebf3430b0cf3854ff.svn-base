<template>
  <chat-toast :config="sendImgData" @save="save" @close="sendImgData.dialogVisible=false">
    <img :src="imgUrl" class="send-img">
  </chat-toast>
</template>
<script>
  import {
    mapGetters,
    mapMutations
  } from 'vuex'
  export default {
    data() {
      return {
        imgUrl: '',
        sendImgData: { //办结弹窗数据
          title: "是否发送？", //弹窗标题
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
    computed: {
      ...mapGetters(['getwebSocket', 'getfromUser', 'getGroupData'])
    },
    methods: {
      setData(data) {
        this.imgUrl = data;
        this.sendImgData.dialogVisible = true;
      },
      save() {
        this.sendMsg({
          type: '1',
          attachUrl: this.imgUrl
        });
        this.sendImgData.dialogVisible = false;
      },
      sendMsg(option) { //发送消息
        try {
          this.getwebSocket.send(JSON.stringify({
            fromUser: this.getfromUser.fromUserId,
            fromUserName: this.getfromUser.fromUserName,
            position: this.getfromUser.fromUserPosition,
            headImgUrl: this.getfromUser.fromUserImg,
            cmd: option.cmd || '0',
            msgType: option.type || '0',
            groupId: this.getGroupData.groupId,
            toUser: option.toUser || '',
            content: option.content || '',
            attachUrl: option.attachUrl || '',
            groupName: this.getGroupData.groupName || ''
          }))
        } catch (error) {
          this.$message.error('您的网络异常,正在尝试重新连接');
        }
      }
    }
  }

</script>
<style lang="less">
  .send-img {
    width: 80%;
    display: block;
    margin: 20px auto;
  }

</style>
