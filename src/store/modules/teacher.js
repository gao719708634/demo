// 老师
export default {
  namespaced: true,
  // 局部状态
  state: {
    teacherId: '1', //ID
    teacher: '', //teacher
    subjects: []
  },
  // 局部读取
  getters: {

  },
  // 局部变化
  mutations: {
    SET_EVENT_CONT(state, data){
      state.currentEvent = data;
    },
    SET_SUBJECT(state, data){
      state.subjects = data;
    }
  },
  // 局部动作
  actions: {
    //获取所有学科
    getSubject: ({ commit }, opts) => {
      return opts.scope.reqFilter('teacher.getSubject', opts.params|| {}).then( r => {
        if (r.state.code === opts.scope.successCode) {
          commit('SET_SUBJECT', r.data);
          return r.data;
        }
      });
    }
  }
};
