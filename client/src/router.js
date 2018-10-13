import Vue from 'vue'
import Router from 'vue-router'
import FindARental from './components/FindARental.vue'
import CreateProperty from './components/CreateProperty.vue'
import ViewMyProperties from './components/ViewMyProperties.vue'
import ViewMyRequests from './components/ViewMyRequests.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'FindARental',
      component: FindARental
    },
    {
      path: '/create',
      name: 'CreateProperty',
      component: CreateProperty
    },
    {
      path: '/my-properties',
      name: 'ViewMyProperties',
      component: ViewMyProperties
    },
    {
      path: '/my-requests',
      name: 'ViewMyRequests',
      component: ViewMyRequests
    },
  ]
})