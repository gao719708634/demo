import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
//本地存储
import Storage from 'vue-ls';

// import './common/rem.js


Vue.use(Storage, {
  namespace: '3i__', // key键前缀
  name: 'ls', // 命名Vue变量.[ls]或this.[$ls],
  storage: 'local' // 存储名称: session, local, memory
});


// 全局混入
import { globalMixins } from '@/common/mixins.js';
Vue.mixin(globalMixins);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
