import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist';

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isLoading: false,
    isInitialized: false,
    propertyContract: {},
    propertyRegistryContract: {},
  },
  mutations: {
    setPropertyContract(state, instance) {
      console.log('setPropertyContract', instance, !!instance);
      state.propertyContract = instance
    },
    setPropertyRegistryContract(state, instance) {
      state.propertyRegistryContract = instance
    },

    startLoading(state) {
      state.isLoading = true
    },
    stopLoading(state) {
      state.isLoading = false
    },

    isInitialized(state) {
      state.isInitialized = true
    },
  },
  // plugins: [vuexLocalStorage.plugin],
})

export default store