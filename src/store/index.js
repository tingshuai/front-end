import Vue from 'vue'
import Vuex from 'Vuex'
import getters from './getter'
import mutations from './mutations'
import actions from './action'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        isChatRecord:false,
        isloading:false,//加载loading
        isProgress:{show:false,text:'0%'},
        fromUser:{},//用户信息
        groupData:null,
        groupHisData:null,
        webSocket:{},//当前webSocket
    },
    actions,
    mutations,
    getters
})