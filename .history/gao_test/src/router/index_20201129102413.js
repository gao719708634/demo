import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/views/homaPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'homaPage',
      component: HomePage
    }
  ]
})
