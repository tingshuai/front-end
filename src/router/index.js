import Vue from 'vue'
import Router from 'vue-router'
const chatRoom =  ()=> import('../page/chatRoom.vue');
const historyRoom = ()=> import('../page/historyRoom.vue');
const newlyGroup = ()=> import('../page/newlyGroup.vue');
Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      name:'chatRoom',
      component:chatRoom
    },
    {
      path:'/newlyGroup',
      name:'newlyGroup',
      component:newlyGroup
    },
    {
      path:'/historyRoom',
      name:'historyRoom',
      component:historyRoom
    }
  ]
})
