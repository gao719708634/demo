//路由权限控制
import Vue from 'vue';
import router from './router/index';
import store from './store';

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import defaultSetting from '@/config/default-setting';

const { access_token } = defaultSetting;

NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false }); //加载进度条
const whites = ['index', '3i-school', '3i-course', '3i-teacher', 'about'];

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  if (Vue.ls.get(access_token)) {
    //登录页直接跳到home
    if (to.path === '/index') {
      next({ path: '/' });
      // store.commit('app/SET_NAV', true);
      // NProgress.done();
    } else {
      //如果需要做用户权限判断就要....
      if (store.getters.roles.length === 0) {
        const res = await store.dispatch('user/getInfo', {role: Vue.ls.get('userType')}/*测试权限用，最后会删除*/);
        if (res === '') { //请求出错
          Vue.ls.remove('access_token');
          next({ path: '/' });
          return;
        }
        const roles = res && res.roles;
        if (roles) {
          try {
            await store.dispatch('permission/generateRoutes', { roles });
            router.addRoutes(store.getters.addRouters);
            const redirect = decodeURIComponent(from.query.redirect || to.path);
            if (to.path === redirect) {
              next({ ...to, replace: true });
            } else {
              // 跳转到目的路由
              next({ path: redirect });
            }
          } catch (err) {
            console.log('请求用户信息失败，请重试', err);
          }
        } else {
          // 用户没有权限
          next({ path: '/404' });
        }
      } else {
        //通过判断用户角色是否有权限进入页面,暂时一个用户只能是一个角色
        const rolesName = store.getters.roles[0];
        if (to.path !== '/404') {
          // 是否要考虑管理员？
          const matchs = to.path.match(/\/([^\/|?]*)/);
          if (matchs && matchs.length > 1) {
            if (rolesName !== matchs[1]) {
              next({ path: '/'+rolesName });
            }
          }
        }
        // if (to.path === '/404') {
        //   store.commit('app/SET_NAV', false);
        // } else {
        //   console.log(store.state.permission.routers.length);
        //   const isRoute = store.state.permission.routers.some(item => {
        //     console.log(item.path, '----------', to.path);
        //     return item.path === to.path;
        //   });
        //   if (!isRoute) {
        //     console.log('------no-router-----');
        //   }
        // }
        // console.log('-----4', store.state.permission);
        next();
      }
    }
  } else {
    if (whites.includes(to.name)) {
      next();
    } else {
      // 调用app登录
      next({ path: '/' });
    }
  }
});

router.afterEach(() => {
  NProgress.done(); // finish progress bar
});
