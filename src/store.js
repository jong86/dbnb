import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isLoading: false,
    loadingMessage: '',
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

    startLoading(state, { message }) {
      state.isLoading = true
      state.loadingMessage = message || ''
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