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

    myProperties: [],
    rentals: [],
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
    isInitialized(state) {
      state.isInitialized = true
    },

    startLoading(state, { message }) {
      state.isLoading = true
      state.loadingMessage = message || ''
    },
    stopLoading(state) {
      state.isLoading = false
    },

    setMyProperties(state, myProperties) {
      state.myProperties = myProperties
    },
    addMyNewProperty(state, myNewProperty) {
      state.myProperties.push(myNewProperty)
    },
    editMyProperty(state, { id, key, value }) {
      const index = state.myProperties.findIndex(element => element.id === id)
      Vue.set(state.myProperties[index], key, value) // Reactively sets object key
    },

    editRental(state, { id, key, value }) {
      const index = state.myProperties.findIndex(element => element.id === id)
      Vue.set(state.rentals[index], key, value) // Reactively sets object key
    },

    setKeyToValue(state, { key, value }) {
      Vue.set(state, key, value)
    }
  },
})

export default store