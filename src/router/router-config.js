/**
 * 动态路由
 * @type { *[] }
 */

export const asyncRouterMap = [
];

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/',
    name: 'index',
    alias: '/home',
    hidden: true,
    component: () => import('../views/Home.vue'),
    meta: {
      title: '首页',
      enTitle: 'Index',
      keepAlive: true
    }
  }
];
