import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/views/homePage'

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
