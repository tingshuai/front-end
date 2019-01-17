<template>
  <div class="chat-header">
    <h1>
      <div class="chat-h-l left">{{groupData.groupName}}({{groupData.groupUsers.length}})</div>
      <div class="chat-h-r bg-groups right" @click="showDown"></div>
    </h1>
    <div class="cr-drop-down-content" :class="{'show-down':isShowDown}">
      <!-- 群信息与成员列表 -->
      <div class="cr-group-members clearfix">
        <!-- 自定义滚动条 -->
        <scroll-bar :config="scrollBarData" ref="myScroll"></scroll-bar>
        <!-- 群成员容器 -->
        <div class="scroll-wrapper">
          <div class="cr-member-item left" v-for="item in groupData.groupUsers" :class="{'is-manager':item.openId===groupData.managerId}">
            <img :src="item.headImgUrl||(getUrl()+'/images/headimg.png')"
            />
            <p :title="item.username">{{item.username||'无'}}</p>
          </div>
          <div class="cr-member-item pull-user left" v-if="ispullUser&&type!=='history'" @click="pullUser">
            <div class="el-icon-plus"></div>
          </div>
        </div>
      </div>
      <!-- 分割线 -->
      <div class="cr-line"></div>
      <div class="cr-info">群描述：{{groupData.groupDesc||'无'}}
          <div class="bg-eidt" v-if="getfromUser.fromUserId === groupData.managerId&&type!=='history'" @click="modify"></div>
      </div>
      <!-- 分割线 -->
      <div class="cr-line"></div>
      <div class="retreat-group" v-if="type!=='history'">
        <!-- <el-button v-if="getfromUser.fromUserId === groupData.managerId" type="primary" size="mini" @click="modify">修改</el-button> -->
        <button class="btn-dissolution" v-if="getfromUser.fromUserId === groupData.managerId" @click="dissolution" plain>解散</button>
        <button class="btn-retreatGroup" v-else @click="withdrawGroup">退群</button>
      </div>
    </div>
    <!-- 群解散 -->
    <group-dissolution ref="dissolution"></group-dissolution>
    <!-- 退群 -->
    <withdraw-group ref="withdraw"></withdraw-group>
    <!-- 拉人 -->
    <pull-people ref="pullPeople"></pull-people>
    <!-- 编辑修改 -->
    <edit-modifica ref="editModifica"></edit-modifica>
  </div>
</template>
<script>
  import {
    mapGetters,
    mapMutations
  } from 'vuex'
  import pullPeople from '../funToast/pullPeople'
  import editModifica from '../funToast/editModifica'
  import groupDissolution from '../funToast/groupDissolution.vue'
  import withdrawGroup from '../funToast/withdrawGroup.vue'
  export default {
    props: ['type','groupData'],
    data() {
      return {
        isShowDown: false,//群详情下拉展示
        scrollBarData: {//滚动条样式
          scrollBgColor: "transparent",
          scrollbarColor: "#c3c3c3"
        }
      }
    },
    computed: {
      ...mapGetters(['getfromUser']),
      ispullUser() { //是否可以拉群
        let index = this.groupData.addMemberOpenIds.indexOf(this.getfromUser.fromUserId);
        return index !== -1;
      }
    },
    updated() {
      this.$nextTick(() => {
        setTimeout(() => {
          if (this.$refs['myScroll']) this.$refs['myScroll'].initScrollBar();
        }, 0)
      })
    },
    methods: {
      ...mapMutations(['setGroupData']),
      showDown() { //下拉
        this.isShowDown = !this.isShowDown;
      },
      setOpenIds(arr) { //处理群成员ID
        let _arr = [];
        arr.forEach(element => {
          _arr.push(element.openId);
        });
        return _arr;
      },
      modify(){//修改
         this.$refs.editModifica.show();
      },
      pullUser() {//拉人保存
        this.$refs.pullPeople.show();
      },
      withdrawGroup() { //退群
        this.$refs.withdraw.show();
      },
      dissolution() { //解散群
           this.$refs.dissolution.show();
      },
      getUrl() { //获取资源访问地址
        return localStorage.getItem('jcChatPort');
      },
    },
    watch: {
      'groupData.groupId':function(){
          this.isShowDown = false;
      }
    },
    components:{
      pullPeople,
      editModifica,
      groupDissolution,
      withdrawGroup
    }
  }

</script>
<style lang="less">
  .chat-header {
    height: 54px;
    box-sizing: border-box;
    background-color: #FBFBFB;
    position: relative;
    &>h1{
        position: relative;
        z-index: 3;
        background-color: #FBFBFB;
        padding: 13px 21px 13px 30px;
        overflow: hidden;
        font-weight: 400;
        font-size: 20px;
        color: #2D3132;
    }
    .chat-h-l {
      font-size: 20px;
      color: #2D3132;
    }
    .chat-h-r {
      cursor: pointer;
    }
    .cr-drop-down-content {
      box-shadow: 0px 0px 8px rgba(61, 66, 73, 0.07);
      background-color: #FAFAFA;
      position: absolute;
      top: -300px;
      opacity: 0;
      left: 0;
      width: 100%;
      transition: all cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.5s;
      z-index: 2;
    }
    .cr-drop-down {
      color: #999;
      font-size: 12px;
      transition: 0.5s;
      position: absolute;
      z-index: 1;
      top: 25px;
      cursor: pointer;
    }
    .direction-top {
      transform: rotate(-180deg);
    }
    .cr-line {
      background-color: #E5E5E5;
      height: 1px;
      width: 95%;
      margin: auto;
    }
    .cr-group-members {
      position: relative;
      user-select: none;
    }
    .scroll-wrapper {
      margin-right: -25px;
      margin-left: -10px;
      max-height: 250px;
      padding: 10px 4px 8px 17px;
      overflow: hidden;
    }
    .cr-member-item {
      margin-right: 8px;
      margin-left: 8px;
      position: relative;
      text-align: center;
    }
    .cr-member-item>img {
      display: block;
      cursor: pointer;
      width: 40px;
      height: 40px;
      background-color: #ccc;
    }
    .cr-member-item>p {
      color: #888;
      width: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-wrap: normal;
      font-size: 12px;
      vertical-align: middle;
      line-height: 30px;
    }
    .retreat-group {
      text-align: right;
      margin: 5px 0;
      padding-right: 15px;
    }
    .pull-user {
      div {
        display: block;
        cursor: pointer;
        width: 40px;
        height: 40px;
        font-size: 35px;
        line-height: 40px;
        color: #999;
        box-sizing: border-box;
        border: 1px solid;
      }
    }


    .cr-info {
      word-break:break-all;
      font-size: 14px;
      line-height: 30px;
      color: #666666;
      padding: 10px 24px;
      text-align: left;
      .bg-eidt{
          display: inline-block;
          margin-left: 10px;
          vertical-align: middle;
          cursor: pointer;
      }
    }
    .cr-drop-down-content.show-down {
      opacity: 1;
      top: 54px;
      left: 0;
    }

    .btn-dissolution,.btn-retreatGroup{
      width: 100px;
      height: 30px;
      box-sizing: border-box;
      font-size: 14px;
      text-align: center;
      border-radius: 2px;
      outline: none;
      cursor: pointer;
    }
    .btn-dissolution{
      color: #5C6466;
      border: 1px solid #CCCDD0;
      background-color: white;
    }
    .btn-retreatGroup{
      color: #267AFC ;
      border: 1px solid #267AFC;
      background-color: white;
    }
    .is-manager::after{
        content: '';
        position: absolute;
        display: block;
        width: 22px;
        height: 22px;
        background-image: url(../../assets/images/groupz.png);
        top: -8px;
        left: -8px;
    }
  }

</style>
