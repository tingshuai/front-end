<template>
  <el-dialog title="发起压图确认单"  :visible.sync="dialogVisible" :close-on-click-modal="false" :append-to-body="true" width="440px" class="pressure-image-complete">
    <div slot="title">
      发起压图确认单<span class="states">(已签收)</span>
    </div>
    <press-image-body @totalAll="setTotalAll" ref="pressImageBody"></press-image-body>
     <div class="price-confluence clearfix">
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
    <div slot="footer" class="btn-group">
        <button class="dialog-white"  @click="close">关闭</button>
        <button class="dialog-bule"  v-if="getfromUser.fromUserId === currData.content.signUser||getfromUser.fromUserId === currData.content.createUser" @click="downPDF">下载PDF</button>
    </div>
  </el-dialog>
</template>
<script>
//   import {
//       diagramConfirm
//   } from '../../api/index.js'
  import {
    mapGetters,
    mapMutations
  } from 'vuex'
  import pressImageBody from './pressImageBody.vue'
  export default {
    data() {
      return {
        dialogVisible: false,
        totalAll:0,
        currData:{content:{}}
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
        setTimeout(()=>{
             this.$refs.pressImageBody.reset(diagramText.dataList,true);
             this.totalAll = diagramText.totalAll;
        },0)
      },
      downPDF() {//签收压图

              this.close();
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
  .pressure-image-complete {
    .states{
        color: #BCC2C6;
        font-size: 14px;
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
