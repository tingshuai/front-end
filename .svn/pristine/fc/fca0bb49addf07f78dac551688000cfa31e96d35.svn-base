      /* toastData:{
          title:'啦啦啦',//弹窗标题
          dialogVisible:true,//弹窗显示
          width:'600px',//弹窗宽
          btnData:[{
            name:'确定',//按钮名
            method:'dialogSuer',//回调函数
            bgColor:'dialog-bule'//按钮背景
          },{
            name:'确定并继续',
            method:'savaAgain',
            bgColor:'dialog-deep-blue'
          }]
      }*/
<template>
    <el-dialog class="poc-toast" :title="config.title" :visible.sync="config.dialogVisible" :close-on-click-modal="false" :append-to-body="true" :width="config.width" @close="callBack('handleClose')">
        <!-- 内容   主题内容自定义部分-->
        <slot></slot>
        <!-- 按钮组 -->
        <div class="btn-group" v-if="config.btnData&&config.btnData.length>0">
            <button v-for="item in config.btnData" :class="item.bgColor" @click="callBack(item.method)">{{item.name}}</button>
        </div>
    </el-dialog>
</template>
<script>
export default {
  props: ["config"],
  methods: {
    callBack(method) {
      this.$emit(method);
    }
  }
};
</script>
<style lang="less">
 
</style>

