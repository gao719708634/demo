import Req from '@/api/user.js';
export default {
  namespaced: true,
  // 局部状态
  state: {
    roles: [],
    userinfo: ''
  },
  // 局部读取
  // getters: {
  //   desc: state => ":" + state.name
  // },
  // 局部变化
  mutations: {
    increment (state, payload) {
      state.age += payload.num;
    },
    SET_ROLES (state, p) {
      state.roles = p;
    },
    SET_INFO (state, user) {
      state.userinfo = user;
    }
  },
  // 局部动作
  actions: {
    // login( { commit }, params) {
      
    // },
    getInfo ( {commit}, params) {
      return Req.getUserInfo(params).then( r => {
        if (r.state.code === 2000000) {
          let {data} = r;
          commit('SET_INFO', data);
          data.roles = data.mainRoleType === 1 ? ['teacher'] : (data.mainRoleType === 2 ? ['student']: ['admin']);
          commit('SET_ROLES', data.roles);
          return data;
        } else {
          console.log('userinfo error');
          return '';
        }
      });
    }
  }
};
