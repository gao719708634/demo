import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/views/homePage'
import History from '@/views/History'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/index',
      name: 'homaPage',
      component: HomePage
    },
    {
      path: '/History',
      name: 'History',
      component: History
    }
  ]
})
