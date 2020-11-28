//处理传入参数,当传入的参数没有hander之类，opts就作为一般参数传给服务器，当要设置hander就要{params:{}, config:{hander:{}}}
// function analyseParam (opts) {
//   let { params, config = {} } = opts;
//   if (!params) {
//     params = opts;
//   }
//   return {params, config};
// };

// app
export default {
  namespaced: true,
  // 局部状态
  state: {
    role: '',
    navState: false
  },
  // 局部读取
  getters: {
    desc: state => 'role:' + state.role,
    userList: state => state.userList
  },
  // 局部变化
  mutations: {
    getEmergency (state, opt) {
      state.emergencyDetail = opt;
    },
    SET_NAV (state, opt){
      state.navState = opt;
    },
    // 设置事件类型
    setEventType (state, opt) {
      state.eventType = opt;
    },
    //用户列表
    setUserList (state, opt) {
      state.userList = opt;
    }
  },
  // 局部动作
  actions: {
    getUserList: ({ commit }, opts) => {
      // const {params, config} = analyseParam(opts);
      return opts.scope.reqFilter('user.getUserList', {username: opts.username||''}).then( r => {
        if (r.success) {
          commit('setUserList', r.body);
          return r.body;
        }
      });
    }
  }
};