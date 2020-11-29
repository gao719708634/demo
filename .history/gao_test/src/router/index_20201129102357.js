import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/views/homaPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'homaPage',
      component: HelloWorld
    }
  ]
})
