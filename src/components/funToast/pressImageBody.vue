<template>
  <div class="spi-body">
    <div class="spi-body-header">
      出图汇总: 新图 <span>{{dataList[0].data.length}}</span> 修改 <span>{{dataList[1].data.length}}</span> 辅助设计 <span>{{dataList[2].data.length}}</span>
    </div>
    <!-- 新图 -->
    <div class="spi-body-content" v-for="item in dataList" :class="item.isOpen?'open-menu':'close-menu'">
      <div class="spi-bc-header">
        <span class="pressure-type left">{{item.name}}</span>
        <div class="pressure-price left">
          <span>价格小计(元):</span>
          <span>{{item.total}}</span>
        </div>
        <div class="pressure-tools right" @click="setMenu(item)">
          {{item.isOpen?'收起':'展开'}}
          <span class="el-icon-d-arrow-left"></span>
        </div>
      </div>
      <div class="spi-bc-list">
        <div class="spi-bc-items" v-for="_item in item.data" :class="{'spi-active':currActive===_item.seq}">
          <div class="abbreviation-images">
            <img :src="_item.attachUrl" @click.stop="picturePreview(_item.attachUrl)">
          </div>
          <span v-if="isEditImage" class="abbreviation-images-close el-icon-circle-close" @click="removeImages(item,_item)"></span>
          <input type="text" v-number-input v-model="_item.quote" :disabled="!isEditImage" @keyup="totalAll(item)" @focus="currActive=_item.seq">
        </div>
        <label class="spi-bc-items add-plus-img el-icon-plus" v-if="isEditImage">
          <input type="file" accept="image/*" style="display:none" @change="update($event,item)" />
        </label>
      </div>
    </div>
    <!-- 图片预览 -->
    <picture-preview ref="picturePreview"></picture-preview>
  </div>
</template>
<script>
  import {
    chatAttachUpdate
  } from "../../api/index.js";
  import picturePreview from './picturePreview'
  import {
    mapGetters,
    mapMutations
  } from 'vuex'
  export default {
    data() {
      return {
        dataList: [{
          id: 1,
          data: [],
          height: 31,
          name: '新图',
          total: 0,
          isOpen: true
        }, {
          id: 2,
          data: [],
          height: 31,
          name: '修改',
          total: 0,
          isOpen: false
        }, {
          id: 3,
          data: [],
          height: 31,
          name: '辅助设置',
          total: 0,
          isOpen: false
        }],
        isEditImage:true,
        uploadUrl: '',
        currActive:null
      }
    },
    methods: {
      ...mapMutations(['setLoading', 'setIsProgress']),
      setMenu(item) {
        this.$set(item, 'isOpen', !item.isOpen);
      },
      update(e, item) {
        this.setLoading(true)
        let target = e.srcElement;
        this.compressedUpload(target.files[0], item);
        target.value = '';
      },
      removeImages(data, curr) {
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let index = data.data.findIndex(item => {
            return curr.seq === item.seq
          })
          data.data.splice(index, 1);
          this.totalAll(data);
        }).catch(() => {});
      },
      totalAll(curr) {
        let total = 0,totalAll = 0;
        if( curr.data.length == 0 ){
          this.dataList[curr.id-1].total = 0;
        }else{
          curr.data.forEach((item,i,arr)=>{
            if( item.quote != 0 ){
              item.quote = item.quote.replace(/^(0+)/gi,"");
            }
            total += parseFloat(item.quote) || 0;
          })
          curr.total = total.toFixed(2);
          this.dataList[curr.id-1].total = curr.total;
        }
        this.dataList.forEach(it => {
          totalAll += parseFloat(it.total);
        })      
        this.$emit('totalAll', totalAll.toFixed(2));
      },
      compressedUpload(flie, item) { //图片压缩上传
        let originalImg = new Image();
        let uploadUrl = localStorage.getItem('uploadUrl');
        originalImg.src = this.getObjectURL(flie);
        originalImg.onload = () => {
          let width = originalImg.width,
            height = originalImg.height;
          var canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(originalImg, 0, 0, width, height);
          canvas.toBlob((blob) => {
            blob.name = 'image.png'
            var data = new FormData();
            data.append('file', blob, Date.now() + '.png');
            //上传
            chatAttachUpdate({
              Vue: this,
              params: data
            }, uploadUrl, (event) => {
              let progress = Math.floor(event.loaded / event.total * 100);
              this.setIsProgress({
                show: true,
                text: progress + '%'
              })
            }).then(data => {
              item.data.push({
                seq: item.name+(item.data.length + 1),
                attachUrl: data.model,
                quote: 0
              })
              this.setLoading(false);
            })
          }, "image/jpeg", 0.7);
        }
      },
      getObjectURL(file) {
        var url = null;
        // 下面函数执行的效果是一样的，只是需要针对不同的浏览器执行不同的 js 函数而已
        if (window.createObjectURL != undefined) { // basic
          url = window.createObjectURL(file);
        } else if (window.URL != undefined) { // mozilla(firefox)
          url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) { // webkit or chrome
          url = window.webkitURL.createObjectURL(file);
        }
        return url;
      },
      picturePreview(url) { //预览图片
        this.$refs.picturePreview.show(url);
      },
      reset(data,flag) {
        this.dataList = data||[{
          id: 1,
          data: [],
          height: 31,
          name: '新图',
          total: 0,
          isOpen: true
        }, {
          id: 2,
          data: [],
          height: 31,
          name: '修改',
          total: 0,
          isOpen: false
        }, {
          id: 3,
          data: [],
          height: 31,
          name: '辅助设置',
          total: 0,
          isOpen: false
        }]
        this.isEditImage = !flag;
      }
    },
    components: {
      picturePreview
    }
  }

</script>
<style lang="less">
  .spi-body {

    .spi-body-header {
      font-size: 12px;
      color: #8B969C;
    }

    .spi-body-content {
      border: 1px solid #EFEFEF;
      border-bottom: none;
      box-shadow: 0 1px 6px 0 rgba(53, 53, 53, 0.08);
      margin: 16px 0;
      overflow: hidden;

    }

    .abbreviation-images-close {
      position: absolute;
      right: -6px;
      top: -6px;
      color: #267AFC;
      cursor: pointer;
      background-color: white;
      border-radius: 50%;
    }

    .open-menu {
      height: auto;

      .pressure-tools>span {
        transition: 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
        transform: rotate(90deg);
      }
    }

    .close-menu {
      height: 31px;

      .pressure-tools>span {
        transition: 0.2s cubic-bezier(0.075, 0.82, 0.165, 1);
        transform: rotate(270deg);
      }

    }

    .pressure-tools {
      color: #3F6AAB;
      font-size: 12px;
      cursor: pointer;
    }

    .spi-bc-header {
      height: 30px;
      padding: 0 12.8px 0 20px;
      background-color: #FBFBFB;
      border-bottom: 1px solid #EFEFEF;
      line-height: 30px;

      .pressure-type {
        font-size: 14px;
        color: #5C6466;
        width: 56px;
      }

      .pressure-price {
        font-size: 12px;
        color: #888888;
        margin-left: 42px;

        &>span:last-child {
          font-size: 14px;
          color: #2D3132;
        }
      }
    }

    .spi-bc-list {
      padding: 12px 20px 0;
      display: flex;
      flex-wrap: wrap;
      margin-right: -12px;

      .spi-bc-items {
        height: 82px;
        width: 62px;
        margin-right: 10px;
        margin-bottom: 10px;
        border: 1px solid #EBECEF;
        position: relative;
        &.spi-active{
          border-color: #6BA5FF;
        }
        .abbreviation-images {
          height: 56px;

          img {
            width: 100%;
            vertical-align: middle;
            max-height: 56px;
            cursor: pointer;
          }
        }

        input {
          width: 100%;
          border: none;
          outline: none;
          height: 26px;
          vertical-align: middle;
          box-sizing: border-box;
          padding: 2px 5px;
        }
      }

      .add-plus-img {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 30px;
        height: 62px;
        cursor: pointer;
      }
    }
  }

</style>
