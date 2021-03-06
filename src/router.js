import Vue from 'vue'
import Router from 'vue-router'
import FindARental from './components/sections/FindARental.vue'
import ViewMyProperties from './components/sections/ViewMyProperties.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'FindARental',
      component: FindARental
    },
    {
      path: '/my-properties',
      name: 'ViewMyProperties',
      component: ViewMyProperties
    },
  ]
})