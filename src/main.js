import Vue from 'vue'
import App from './App.vue'
import router from './router'

import Vuex from 'vuex'
Vue.use(Vuex)

import storePlugin from './storePlugin'
Vue.use(storePlugin)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
