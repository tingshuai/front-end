<template>
  <el-dialog title="发起压图确认单" ref="dialog" :visible.sync="dialogVisible"  :close-on-click-modal="false" :append-to-body="true" width="440px" class="pressure-image-suer">
    <div slot="title">
      发起压图确认单<span class="states">(待签收)</span>
    </div>
    <press-image-body @totalAll="setTotalAll" ref="pressImageBody"></press-image-body>
    <!-- 价格总汇  非签收人可见-->
     <div class="price-confluence clearfix" v-if="getfromUser.fromUserId !== currData.content.signUser">
         <h3 class="left">价格汇总(元):</h3>
         <p class="right">{{totalAll}}</p>
     </div>
    <!-- 详情 -->
    <div class="pis-info clearfix">
        <div class="pis-info-item left pis-info-mr">
            <span class="pis-info-label">发起人:</span>
            <span class="pis-info-value">{{currData.content.createUserName||'无'}}</span>
        </div>
        <div class="pis-info-item left">
            <span class="pis-info-label">发起时间:</span>
            <span class="pis-info-value">{{currData.content.createAt||'无'}}</span>
        </div>
        <div class="pis-info-item left pis-info-mr">
            <span class="pis-info-label">客服签收人:</span>
            <span class="pis-info-value">{{currData.content.signUserName||'无'}}</span>
        </div>
        <div class="pis-info-item left">
            <span class="pis-info-label">签收时间:</span>
            <span class="pis-info-value">{{currData.content.signAt}}</span>
        </div>
    </div>
    <!-- 条款 签收人可见-->
    <div class="pis-clause" v-if="getfromUser.fromUserId === currData.content.signUser&&currData.content.editable">
        <h3>服务条款声明: </h3>
        <p>1. 本协议一经确认，即构成服务合同，未决事项依照相关法律。</p>
        <p>2. 在协方客户确认签收人保证自己有权代理所在单位，并承诺本人与单位共同承担连带责任。</p>
        <p>3. 如对交付图片（视频、多媒体等）内容有疑义，请即刻沟通。</p>
        <div class="pis-clause-agree" v-if="type!='history'"><el-checkbox v-model="isAgree">我已阅读并同意</el-checkbox></div>
    </div>
    <!-- 签收人可见 -->
    <div slot="footer" class="dialog-footer" v-if="getfromUser.fromUserId === currData.content.signUser&&currData.content.editable&&type!='history'">
      <div>价格汇总(元): <span>{{totalAll}}</span></div>
      <button class="dialog-bule" :disabled="!isAgree" :class="{'dialog-disabled':!isAgree}" @click="save">确认签收</button>
    </div>
    <!-- 发起人可见 -->
    <div slot="footer" class="btn-group" v-else-if="getfromUser.fromUserId === currData.content.createUser&&currData.content.editable&&type!='history'">
        <button class="dialog-white"  @click="close">关闭</button>
        <button class="dialog-bule"  @click="edit">编辑</button>
    </div>
    <!-- 其它人可以 -->
    <div slot="footer" v-else class="btn-group">
        <button class="dialog-white"  @click="close">关闭</button>
    </div>
  </el-dialog>
</template>
<script>
  import {
      diagramConfirm
  } from '../../api/index.js'
  import {
    mapGetters,
    mapMutations
  } from 'vuex'
  import pressImageBody from './pressImageBody.vue'
  export default {
    data() {
      return {
        dialogVisible: false,
        isAgree:false,
        totalAll:0,
        currData:{content:{}}
      }
    },
    props: {
      type: { //区别是历史模式还是正常模式
        type: String,
        default: ''
      }
    },
    computed: {
      ...mapGetters(['getfromUser', 'getGroupData'])
    },
    methods: {
      close() {
        this.dialogVisible = false;
      },
      show(data) {
        this.dialogVisible = true;
        let diagramText = JSON.parse(data.content.diagramText);
        this.currData = data;
        this.isAgree = false;
        setTimeout(()=>{
            console.log(document.body.blur());
             this.$refs.pressImageBody.reset(diagramText.dataList,true);
             this.totalAll = diagramText.totalAll;
        },0)
      },
      save() {//签收压图
               diagramConfirm({Vue:this,params:{
                   msgId:this.currData.msgId,
                   diagramId:this.currData.content.diagramId,
                   groupId:this.currData.groupId,
                   signerOpenId:this.getfromUser.fromUserId,
                   signerName:this.getfromUser.fromUserName
               }}).then(data=>{
                    this.$message({
                    message: data.message,
                    type: 'success'
                    });                       
               })
              this.close();
      },
      edit(){//编辑
         this.$emit('pressImageEdit',this.currData);
      },
      setTotalAll(all){
         this.totalAll = all;    
      }
    },
    components:{
        pressImageBody
    }
  }

</script>
<style lang="less">
  .pressure-image-suer {
    .states{
        color: #267AFC;
    }
    .dialog-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      color: #8B969C;

      span {
        color: #FF891E;
        font-size: 18px;
      }
    }
    .pis-info{
        padding: 16px 20px;
        background-color: #FBFBFB;
        .pis-info-item{
            margin-bottom: 5px;
        }
        .pis-info-mr{
            width: 135px;
        }
        .pis-info-label{
            font-size: 12px;
            color: #888888;
            width: 63px;
            display: inline-block;
            text-align: right;
            margin-right: 5px;
        }
        .pis-info-value{
            font-size: 12px;
            color: #2D3132;
        }
    }
    .pis-clause{
        margin: 30px 0 10px 0;
        h3{
            font-size: 14px;
            color: #5C6466;
            font-weight: 400;
        }
        p{
            font-size: 12px;
            color: #8B969C;
            line-height: 20px;
        }
        .pis-clause-agree{
            margin-top: 10px;
            font-size: 13px;
            color: #6F6F6F;
        }
    }
    .el-dialog__footer{
        box-shadow: 0 -1px 4px 0 rgba(53,53,53,0.08);
        overflow: hidden;
    }
    .price-confluence{
        background-color: #FBFBFB;
        padding: 6px 20px;
        margin-bottom: 30px;
        h3{
            font-size: 14px;
            color: #2D3132;
            font-weight: 400;
        }
        p{
            font-size: 14px;
            color: #FF891E;
        }
    }
  }

</style>
