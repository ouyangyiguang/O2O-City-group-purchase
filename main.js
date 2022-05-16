import Vue from 'vue'
import App from './App'
import router from '@/common/router'
import store from '@/common/store'
import tools from '@/common/utils/tools'
import uView from "uview-ui";
import {
	RouterMount
} from 'uni-simple-router'
import api from '@/common/request/index'

Vue.prototype.$store = store;
Vue.prototype.$api = api;
Vue.prototype.$tools = tools;

//判断是否登录
import { judgeLogin } from '@/plugins/applogin';
Vue.prototype.judgeLogin = judgeLogin;

// ..加载动画....
import ourLoading from '@/components/our-loading/our-loading.vue'
Vue.component('ourLoading', ourLoading)
// ......

import publicModule from "@/components/common/public-module.vue";
Vue.component("public-module", publicModule);

// import  svg  from '@/static/svg.js';
// Vue.use(svg)


// 引入uView提供的对vuex的简写法文件
// let vuexStore = require('@/common/$u.mixin.js');
// Vue.mixin(vuexStore);

Vue.config.productionTip = false
App.mpType = 'app'
Vue.use(uView);

const app = new Vue({
    store,
    ...App
})

//v1.3.5起 H5端 你应该去除原有的app.$mount();使用路由自带的渲染方式
// #ifdef H5
	RouterMount(app,'#app');
// #endif

// #ifndef H5
	app.$mount(); //为了兼容小程序及app端必须这样写才有效果
// #endif

