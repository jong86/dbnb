import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isLoading: false,
    loadingMessage: '',

    web3: {},
    propertyContract: {},
    propertyRegistryContract: {},
    isInitialized: false,

    myProperties: [],

    rentals: [],
  },
  mutations: {
    startLoading(state, { message }) {
      state.isLoading = true
      state.loadingMessage = message || ''
    },
    stopLoading(state) {
      state.isLoading = false
    },

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

    setMyProperties(state, myProperties) {
      state.myProperties = myProperties
    },
    addMyNewProperty(state, myNewProperty) {
      state.myProperties.push(myNewProperty)
    },
    editMyProperty(state, { id, key, value }) {
      const index = state.myProperties.findIndex(element => element.id === id)
      Vue.set(state.myProperties[index], key, value)
    },
    setPropertyRequestAsApproved(state, { propertyId, address }) {
      const propertyIndex = state.myProperties.findIndex(element => element.id === propertyId)
      const addressIndex = state.myProperties[propertyIndex].requested.findIndex(element => element === address)
      Vue.set(state.myProperties[propertyIndex].requested[addressIndex], 'isApproved', true)
    },

    setRentals(state, rentals) {
      state.rentals = rentals
    },
    editRental(state, { id, key, value }) {
      const index = state.myProperties.findIndex(element => element.id === id)
      Vue.set(state.rentals[index], key, value)
    },
  },
})

export default store