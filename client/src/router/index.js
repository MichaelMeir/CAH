import Vue from 'vue'
import Router from 'vue-router'

import Index from '@/views/Index'
import Register from '@/views/Register'
import Login from '@/views/Login'

import Logout from '@/views/Logout'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/logout',
      name: 'Logout',
      component: Logout
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    }
  ]
})
