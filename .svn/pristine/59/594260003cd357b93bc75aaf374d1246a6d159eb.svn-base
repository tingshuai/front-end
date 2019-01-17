<template>
  <chat-toast :config="evaluateData" @save="evaluateSave" @close="close">
    <div class="evaluate-body">
      <div class="smiling-face clearfix">
        <div class="smiling-face-item left" :class="evaluateType===2?'smiling-face-active':''" @click="setEvaluateType(2)">
          <div class="expression_n xx" :class="evaluateType===2?'expression_nn':''">
          </div>
          <p>非常满意</p>
        </div>
        <div class="smiling-face-item left" :class="evaluateType===1?'smiling-face-active':''" @click="setEvaluateType(1)">
          <div class="expression_m xx" :class="evaluateType===1?'expression_mm':''">

          </div>
          <p>满意</p>
        </div>
        <div class="smiling-face-item left" :class="evaluateType===0?'smiling-face-active':''" @click="setEvaluateType(0)">
          <div class="expression_b xx" :class="evaluateType===0?'expression_bb':''">

          </div>
          <p>一般</p>
        </div>
        <div class="smiling-face-item left" :class="evaluateType===-1?'smiling-face-active':''" @click="setEvaluateType(-1)">
          <div class="expression_c xx" :class="evaluateType===-1?'expression_cc':''">

          </div>
          <p>不满意</p>
        </div>
      </div>
      <div class="evaluate-list">
        <div class="el-tag" v-for="item in evaluateLabel" :class="item.isActive?'active':''" @click="labelActive(item)">{{item.labelName}}</div>
      </div>
      <el-input type="textarea" :rows="5" v-model="reviewText" placeholder="请输入内容">
      </el-input>
    </div>
  </chat-toast>
</template>
<script>
  import {
    evaluateLabel,
    reviewAdd
  } from '../../api/index';
  import {mapGetters} from 'vuex'
  export default {
    data() {
      return {
        evaluateType: "",
        evaluateLabel: [],
        reviewText: '',
        evaluateData: { //评价弹窗
          title: "评价", //弹窗标题
          dialogVisible: false, //弹窗显示
          width: "650px", //弹窗宽
          btnData: [{
            name: '取消', //按钮名
            bgColor: 'dialog-white', //按钮背景
            method: 'close' //回调函数
          }, {
            name: '确定', //按钮名
            method: 'save', //回调函数
            bgColor: 'dialog-bule' //按钮背景
          }]
        }
      }
    },
    mounted() {
      //  this.setEvaluateType(2);
    },
    computed: {
      ...mapGetters([
        'getfromUser',
        'getGroupData'
      ])
    },
    methods: {
      setEvaluateType(type) {
        this.evaluateType = type;
        if (!type) {
          this.evaluateLabel = [];
          return
        }
        evaluateLabel({
          Vue: this,
          params: {
            labelType: type
          }
        }).then(data => {
          this.evaluateLabel = data.data.rows;
        })
      },
      labelActive(item) {
        this.$set(item, 'isActive', !item.isActive);
      },
      evaluateSave() { //评价保存
        let revaluate = this.$refs['evaluate'];
        let labels = '';
        if (!this.evaluateType) {
          this.$message('请选择评价类型！');
          return
        }
        this.evaluateLabel.forEach((item, index) => {
          if (item.isActive) {
            labels += item.labelId + ',';
          }
        })
        if (this.evaluateType == -1 && this.reviewText.trim() === '') {
          this.$message('请输入不满意原因！');
          return
        }
        reviewAdd({
          Vue: this,
          params: {
            groupId: this.getGroupData.groupId,
            labels,
            openId: this.getfromUser.fromUserId,
            reviewText: this.reviewText,
            reviewType: this.evaluateType
          }
        }).then(data => {
          this.$message({
            message: '评价完成,感谢您的评价',
            type: 'success'
          });
        })
        this.close();
      },
      show(data) { //评价
        if (data.toUser !== this.getfromUser.fromUserId) return;
        this.evaluateData.dialogVisible = true;
        setTimeout(() => {
          this.setEvaluateType('');
        }, 0)
      },
      close(){
        this.evaluateData.dialogVisible = false;
      }
    }
  }

</script>
<style lang="less">
  @styleColor: rgb(0, 0, 0);
  @styleWidth: 5px;
  @eyesWH: 10px;

  .evaluate-body {
    padding: 0 40px 40px;

    .evaluate-list {
      padding: 10px 0;

      .el-tag {
        margin: 5px;
        cursor: pointer;
        background-color: white;
        color: #999;
        border-color: #999;
        height: 25px;
        line-height: 25px;
      }

      .el-tag.active {
        color: #409EFF;
        border-color: #409EFF;
      }
    }

    .smiling-face {
      padding: 0 25px;
    }

    .expression_n {
      //非常满意灰
      width: 50px;
      height: 50px;
      background-image: url("../../assets/images/fcmyh.png");
    }

    .expression_nn {
      //非常满意
      width: 50px;
      height: 50px;
      background-image: url("../../assets/images/fcmy.png");
    }

    .expression_m {
      //满意灰
      width: 50px;
      height: 50px;
      background-image: url("../../assets/images/myh.png");
    }

    .expression_mm {
      //满意
      width: 50px;
      height: 50px;
      background-image: url("../../assets/images/my.png");
    }

    .expression_b {
      //一般灰
      width: 50px;
      height: 50px;
      background-image: url("../../assets/images/ybh.png");
    }

    .expression_bb {
      //一般
      width: 50px;
      height: 50px;
      background-image: url("../../assets/images/yb.png");
    }

    .expression_c {
      //不满意灰
      width: 50px;
      height: 50px;
      background-image: url("../../assets/images/bmyh.png");
    }

    .expression_cc {
      //不满意
      width: 50px;
      height: 50px;
      background-image: url("../../assets/images/bmy.png");
    }

    .xx {
      margin-bottom: 15px;
    }

    .expression {
      width: 80px;
      height: 80px;
      background-color: white;
      border: @styleWidth solid @styleColor;
      border-radius: 50%;
      position: relative;
      overflow: hidden;
    }

    .expression>span:nth-child(1),
    .expression>span:nth-child(2) {
      position: absolute;
      width: @eyesWH;
      height: @eyesWH;
      background-color: @styleColor;
      border-radius: 50%;
      z-index: 1;
    }

    .expression>span:nth-child(1) {
      top: 30px;
      left: 18px;
    }

    .expression>span:nth-child(2) {
      top: 30px;
      right: 18px;
    }

    .expression-b>span:nth-child(3) {
      position: absolute;
      width: 35px;
      height: @styleWidth;
      background-color: @styleColor;
      top: 58px;
      left: 50%;
      transform: translate(-50%, 0);
    }

    .expression-c>span:nth-child(3) {
      position: absolute;
      width: 40px;
      height: 40px;
      background-color: white;
      border-radius: 50%;
      border-style: solid;
      border-width: @styleWidth;
      border-color: @styleColor transparent transparent transparent;
      left: 15px;
      top: 55px;
    }

    .expression-a>span:nth-child(3) {
      position: absolute;
      width: 40px;
      height: 40px;
      background: red;
      background-color: white;
      border-radius: 50%;
      border-style: solid;
      border-width: @styleWidth;
      border-color: transparent transparent @styleColor transparent;
      left: 15px;
      top: 18px;
    }

    .smiling-face-item {
      margin-right: 75px;
      text-align: center;
      cursor: pointer;

      p {
        font-size: 16px;
        margin-top: 5px;
      }
    }

    .smiling-face-item:last-child {
      margin-right: 0;
    }

    .smiling-face-active {
      .expression {
        border-color: #409EFF;

        &>span:nth-child(1),
        &>span:nth-child(2) {
          background-color: #409EFF;
        }

        &>span:nth-child(3) {
          border-color: transparent transparent #409EFF transparent;
        }
      }

      .expression-b>span:nth-child(3) {
        background-color: #409EFF;
      }

      .expression-c>span:nth-child(3) {
        border-color: #409EFF transparent transparent transparent;
      }

      p {
        color: #409EFF;
      }
    }
  }

</style>
