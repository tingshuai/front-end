//小黑自定义滚动条
<template>
  <div :id="scrollBgID" class="scrollBg" v-show="isscroll">
    <div :id="scrollBarID" class="scrollBar" :style="{'height':scrollBarHeight+'px'}"></div>
  </div>
</template>
<script>
  import addEvent from '../toolClass/addEvent.js'
  export default {
    props: ['config'],
    data() {
      return {
        scrollBgID: '',//滚动背景ID
        scrollBarID: '',//滚动条ID
        scrollBarHeight:10,//滚动条高度
        box:null,//父容器
        content:null,//滚动内容容器
        scrollBg:null,//滚动背景
        scrollbar:null,//滚动条
        scrollSpeed:10,//滚动速度
        curr:0,//鼠标当前位置
        isscroll:true,//是否展现滚动条
        base:0//滚动条定位位置与内容高度的系数
      }
    },
    updated(){//数据改变，dom渲染完执行
          this.initScrollBar();
    },
    created () {
          this.scrollBgID = Math.ceil(Math.random() * 10) + '_' + new Date().getTime();
          this.scrollBarID = Math.ceil(Math.random() * 10) + 10 + '_' + new Date().getTime();
    },
    mounted() {
      this.$nextTick(() => {
        this.scrollBg = document.getElementById(this.scrollBgID);
        this.scrollbar = document.getElementById(this.scrollBarID); 
        if(!this.scrollBg||!this.scrollbar)return;
        this.box = this.scrollBg.parentNode;
        this.content = this.scrollBg.nextElementSibling;
        this.setScrollStyle();//背景
        this.initScrollBar();//初始化滚动条数据
        this.setScrollEvent();//初始化事件
      })
    },
    methods: {
      initScrollBar() {//初始化滚动条数据
        if (this.content.scrollHeight <= this.content.offsetHeight) {
          this.isscroll = false;
          return;
        }else{
          this.isscroll = true;
        }
        let scrollBarHeight = Math.floor(this.scrollBg.offsetHeight * this.scrollBg.offsetHeight / this.content.scrollHeight);
        this.scrollBarHeight = scrollBarHeight >= 80 ? scrollBarHeight : 80;
        this.curr = 0; //鼠标按下时滚动条当前定位位置 
        //滚动条定位位置与内容高度的关系
        this.base =(this.content.scrollHeight - this.content.offsetHeight) / (this.scrollBg.offsetHeight -
        this.scrollBarHeight);
        if(this.config.isScrollBottom){
            this.setBottom();
        }
      },
      setScrollEvent(){//初始化事件
         let y;
         this.scrollbar.onmousedown = (e) => {
          e = e || window.event;
          y = e.clientY; //鼠标按下时的位置
          this.curr = this.getStyle(this.scrollbar, 'top'); //获取鼠标按下时滚动条当前定位位置
          document.addEventListener('mousemove',mousemoveFun);
        }
        //滚动事件
        addEvent(this.box, "mousewheel", (event)=>{
            let scrollSpeed = Math.abs(event.deltaY||125)*(event.delta < 0?1:-1);
            this.content.scrollTop += scrollSpeed;
            let top = this.content.scrollTop / this.base;
            if (top <= 0) {
              top = 0;
            } else if (top >= this.scrollBg.offsetHeight - this.scrollBarHeight) {
              top = this.scrollBg.offsetHeight - this.scrollBarHeight;
            }
            this.scrollbar.style.top = top + 'px';
            event.preventDefault();
        });
        //事件移除机制
        document.addEventListener('mouseup',function () {
          document.removeEventListener('mousemove',mousemoveFun);
        });
        let _this = this;
        function mousemoveFun(e){ //开启鼠标移动事件
            e = e || window.event;
            let top = e.clientY - y + _this.curr; //滚动条定位位置
            //临界点处理
            if (top <= 0) {
              top = 0;
            } else if (top >= _this.scrollBg.offsetHeight - _this.scrollBarHeight) {
              top =_this.scrollBg.offsetHeight - _this.scrollBarHeight;
            }
            //滚动条定位
            _this.scrollbar.style.top = top + 'px';
            //内容区域滚动
            _this.content.scrollTop = _this.base * top;
          }
      },
      setScrollStyle(){//设置滚动条样式
         this.scrollbar.style.backgroundColor=this.config.scrollbarColor;
         this.scrollBg.addEventListener('mouseenter',()=>{
              this.scrollBg.style.backgroundColor=this.config.scrollBgColor;
         })
         this.scrollBg.addEventListener('mouseleave',()=>{
              this.scrollBg.style.backgroundColor='transparent';
         })
      },
      setBottom(){
            let top = this.scrollBg.offsetHeight - this.scrollBarHeight;
            //滚动条定位
            this.scrollbar.style.top =top+ 'px';
            //内容区域滚动
            this.content.scrollTop = this.base * top;
      },
      scrollTop(size){
            this.content.scrollTop = size;
            this.scrollbar.style.top = size/this.base + 'px';
      },
      getStyle(obj, attr) {
        if (obj.currentStyle) {
          return parseInt(obj.currentStyle[attr]);
        } else {
          return parseInt(getComputedStyle(obj, false)[attr]);
        }
      }
    }
  }

</script>
<style lang="less">
  //  自定义滚动条
  .scrollBg {
    position: absolute;
    right: 1px;
    top: 0;
    width: 8px;
    bottom: 0;
    z-index: 1;
    transition: all 0.5s;
  }

  .scrollBar {
    position: absolute;
    width: 8px;
    height: 100px;
    top: 0;
    left: 0;
    border-radius: 3px;
    cursor: pointer;
  }

  .scrollBg:hover {
    border-radius: 3px;
  }

  .scroll-content {
    height: 100%;
    overflow: hidden;
  }

</style>
