import Vue from 'vue'
import Router from 'vue-router'

const Сalculator = () => import('./views/Сalculator.vue')
const Websocket = () => import('./views/Websocket.vue')

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: 'calculator'
    },
    {
      path: '/calculator',
      name: 'calculator',
      component: Сalculator
    },
    {
      path: '/websocket',
      name: 'websocket',
      component: Websocket
    }
  ]
})
