<template>
  <div id="app">
    <Header />
    <div
      class="spinner"
      v-if="isLoading"
    >
      <self-building-square-spinner
        :animation-duration="5000"
        :size="40"
        color="#0a0"
      />
    </div>
    <router-view v-else />
  </div>
</template>

<script>
import Header from './components/Header.vue'

import { SelfBuildingSquareSpinner } from 'epic-spinners'

import Web3 from 'web3'
import truffleContract from 'truffle-contract'
import jsonProperty from '../build/contracts/Property.json'
import jsonPropertyRegistry from '../build/contracts/PropertyRegistry.json'

export default {
  name: 'app',
  components: {
    Header,
    SelfBuildingSquareSpinner,
  },
  computed: {
    isLoading() {
      return this.$store.state.isLoading
    }
  },

  methods: {
    initWeb3() {
      let web3Provider
      if (typeof web3 !== "undefined") {
        web3Provider = web3.currentProvider
      } else {
        web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545')
      }
      window.web3 = new Web3(web3Provider)
    },

    getContract(json, web3 = window.web3) {
      const contract = truffleContract(json)
      contract.setProvider(web3.currentProvider)
      return contract.deployed()
    },

    async initProperty() {
      const instance = await this.getContract(jsonProperty)
      this.$store.commit('setPropertyContract', instance)
      const propertyContract = this.$store.state.propertyContract

      propertyContract.allEvents({ fromBlock: 0, toBlock: 'latest' }, (err, res) => {
        if (err)
          console.log('watch error', err)
        else
          console.log('got an event', res)
      });
    },

    async initPropertyRegistry() {
      const instance = await this.getContract(jsonPropertyRegistry)
      this.$store.commit('setPropertyRegistryContract', instance)
      const propertyRegistryContract = this.$store.state.propertyRegistryContract

      propertyRegistryContract.allEvents({ fromBlock: 0, toBlock: 'latest' }, (err, res) => {
        if (err)
          console.log('watch error', err)
        else
          console.log('got an event', res)
      });
    },
  },

  mounted() {
    this.initWeb3()
    this.initProperty()
    this.initPropertyRegistry()
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

.spinner {
  width: fill-available;
  height: fill;
  margin: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
