import Vue from 'vue';
import Vuex from 'vuex';
// import actions from './actions';
// import mutations from './mutations';
// import getters from './getters';
const DictKey = ['resource.type', 'resource.copyright', 'resource.sync.disk', 'resource.language', 'resource.open.level','teaching.grade.type'];

import app from './modules/app.js';
import permission from './modules/permission.js';
import user from './modules/user';
Vue.use(Vuex);
export default new Vuex.Store({
  modules: { app, user, permission},
  getters: {
    
  },
  state: {
    
  },
  mutations: {
    
  },
  actions: {
    
  },
  // actions,
  // mutations
});
