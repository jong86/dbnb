<template>
  <div id="app">
    <Header />
    <atom-spinner
      :animation-duration="1000"
      :size="60"
      :color="'#ff1d5e'"
     />
    <router-view></router-view>
  </div>
</template>

<script>
import Header from './components/Header.vue'
import store from './store.js'

import {AtomSpinner} from 'epic-spinners'

import Web3 from 'web3'
import truffleContract from 'truffle-contract'
import jsonProperty from '../build/contracts/Property.json'
import jsonPropertyRegistry from '../build/contracts/PropertyRegistry.json'

export default {
  name: 'app',
  components: {
    Header,
    AtomSpinner,
  },
  methods: {

  },

  mounted() {
    let web3Provider
    if (typeof web3 !== "undefined") {
      web3Provider = web3.currentProvider
    } else {
      web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545')
    }
    window.web3 = new Web3(web3Provider)


    async function getContract(json, web3 = window.web3) {
      const contract = truffleContract(json)
      contract.setProvider(web3.currentProvider)
      return contract.deployed()
    }


    async function initProperty() {
      const instance = await getContract(jsonProperty)
      store.commit('setPropertyContract', instance)
      const propertyContract = store.state.propertyContract

      const event = propertyContract.allEvents({ fromBlock: 0, toBlock: 'latest' });
      event.watch((err, res) => {
        if (err)
          console.log('watch error', err)
        else
          console.log('got an event', res)
      })
    }

    async function initPropertyRegistry() {
      store.commit('setPropertyRegistryContract', await getContract(jsonPropertyRegistry))
      const propertyRegistryContract = store.state.propertyRegistryContract

      const event = propertyRegistryContract.allEvents({ fromBlock: 0, toBlock: 'latest' });
      event.watch((err, res) => {
        if (err)
          console.log('watch error', err)
        else
          console.log('got an event', res)
      })
    }

    initProperty()
    // initPropertyRegistry()
  },
}
</script>

<style>
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin: 0;
  padding: 0;
}
</style>
