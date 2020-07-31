// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import Vue from 'vue'
import App from './App'
import router from './router'
import Utils from './utils/tool.js'
Vue.prototype.Utils = Utils;

// api 配置模块
import {API, httpApi} from  './utils/api'
// 请求插件
import axios from  './utils/axiosAjax'
//路由拦截
import "./router/routerVerification.js";
Vue.config.productionTip = false
Vue.prototype.API = API;
Vue.prototype.httpApi = httpApi;
Vue.prototype.axios = axios;
import loading from "./components/loading/loading.js";
Vue.use(loading);
//编辑器组件
import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import "./common/directive.js";

//按需引入 饿了么UI
import { Notification } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.prototype.$notify = Notification;
Vue.use(VueCodemirror)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
