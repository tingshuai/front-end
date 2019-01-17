// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// import router from './router'
import store from './store/index'
import 'url-search-params-polyfill' //兼容formData数据格式转化
import ElementUI  from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import scrollBar from './common/scrollBar'
import Toast from './common/Toast'
import loading from './common/loading'
import VueLazyload from 'vue-lazyload'

// Vue.use(VueLazyload)
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: 'https://www.comayi.com/group1/M00/00/0F/cBFtDlwa4diAG-8_AAAH4sRLq2E144.png',
  loading: 'https://www.comayi.com/group1/M00/00/0F/cBFtDlwa5gGAKO0ZAACwTRsTaqk186.gif',
  attempt: 1
})

// import axios from 'axios'
Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.component('chatToast',Toast)
Vue.component('scrollBar',scrollBar);
Vue.component('loading',loading);
// 拖动指令
Vue.directive('drag', {
  // 当绑定的元素插入到 DOM 时调用此函数……
  bind: function (el) {
    el.style.position = 'absolute'
    el.style.cursor = 'pointer'
    el.style['z-index'] = '10'
    var currX = 0;
    var currY = 0;
     el.addEventListener('mousedown',function(e){
        currX =   e.clientX - el.offsetLeft;
        currY =   e.clientY - el.offsetTop;
       document.addEventListener('mousemove',move)
     })
    el.addEventListener('mouseup',function(e){
      document.removeEventListener('mousemove',move)
    })
    function move(e){
      e.preventDefault()
      el.style.left = e.clientX - currX + 'px';
      el.style.top = e.clientY - currY + 'px';
     }
  }
})

// 数字输入框
Vue.directive('number-input', {
  // 当绑定的元素插入到 DOM 时调用此函数……
  bind: function (el) {
    el.addEventListener('keydown', function (e) {
       if((e.keyCode===110||e.keyCode===190)&&this.value.indexOf(".")!=-1){
         e.preventDefault();
         return;
       }
    })
    el.addEventListener('keyup', function (e) {
     if (this.value.length == 1) {
       this.value = this.value.replace(/[^0-9/.]/g, '')
     } else {
       this.value = this.value.replace(/[^0-9/.]/g, '')
     }
   })
    el.addEventListener('afterpaste', function (e) {
      if (this.value.length == 1) {
        this.value = this.value.replace(/[^0-9]/g, '')
      } else {
        this.value = this.value.replace(/\D/g, '')
      }
    })
  }
})

new Vue({
  el: '#app',
  // router,
  store,
  components: {
    App
  }
})
// // http请求拦截器
// axios.interceptors.request.use(config => {
//   //开始请求(拦截开始)
//   app.store.commit('setLoading',true);
//   return config
// }, error => {
//   //加载超时
//   app.store.commit('setLoading',false);
//   return Promise.reject(error)
// })
// // http响应拦截器
// axios.interceptors.response.use(data => { // 响应成功关闭loading
//   //响应拦截
//   app.store.commit('setLoading',false);
//   return data
// }, error => {
//   app.store.commit('setLoading',false);
//   return Promise.reject(error)
// })

