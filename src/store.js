import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isLoading: false,
    isInitialized: false,
    web3: {},
    propertyContract: {},
    propertyRegistryContract: {},
  },
  mutations: {
    setWeb3(state, web3) {
      state.web3 = web3
    },
    setPropertyContract(state, instance) {
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