<template>
      <div class="picturePreview" v-show="picturePreviewData.isShow">
        <el-slider v-model="picturePreviewWidth"></el-slider>
        <img :src="picturePreviewData.url" :width="picturePreviewWidth+'%'" v-drag />
        <i class="el-icon-close" @click="close"></i>
    </div>
</template>
<script>
export default {
    data () {
        return {
            picturePreviewData: {
            url: '',
            isShow: false
            },
            picturePreviewWidth: 30
        }
    },
    methods:{
        show(url){
            this.picturePreviewData = {
                url,
                isShow: true
            }
        },
        close(){
           this.picturePreviewData.isShow = false;
              
        }
    }
}
</script>
<style lang="less">
    .picturePreview {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1000;

      img {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }

      .el-icon-close {
        position: absolute;
        font-size: 70px;
        top: 10px;
        right: 10px;
        color: #DADADA;
        cursor: pointer;
        z-index: 11;
      }

      .el-slider {
        position: absolute;
        width: 40%;
        left: 50%;
        top: 30px;
        transform: translate(-50%, 0);
        z-index: 11;
      }
    }
</style>

