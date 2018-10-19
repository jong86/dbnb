<template>
  <div id="app">
    <Header />
    <div
      class="loader"
      v-if="$store.state.isLoading"
    >
      <self-building-square-spinner
        :animation-duration="5000"
        :size="40"
        color="#0a0"
      />
      <h4>{{ $store.state.loadingMessage }}</h4>
    </div>
    <router-view v-show="!$store.state.isLoading" />
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

  methods: {
    initWeb3() {
      let web3Provider
      if (typeof web3 !== "undefined") {
        web3Provider = web3.currentProvider
      } else {
        web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545')
      }

      this.$store.commit('setWeb3', new Web3(web3Provider))
    },

    getContract(json, web3 = window.web3) {
      // Helper for initializing contracts
      const contract = truffleContract(json)
      contract.setProvider(web3.currentProvider)
      return contract.deployed()
    },

    async initProperty() {
      return new Promise(async (resolve, reject) => {
        const instance = await this.getContract(jsonProperty)
        this.$store.commit('setPropertyContract', instance)
        const propertyContract = this.$store.state.propertyContract

        const event = propertyContract.allEvents({ fromBlock: 0, toBlock: 'latest' })
        event.watch((err, res) => {
          if (err) {
            console.log('watch error', err)
          }
          else {
            console.log('got an event', res)
            switch(res.event) {
              case 'Created': {
                this.$store.commit('addMyNewProperty', {
                  id: res.args._tokenId.toString(),
                  uri: res.args._uri,
                  requested: [],
                })
                this.$store.commit('stopLoading')
                break
              }
              default: {
                this.$store.commit('stopLoading')
              }
            }
          }
        })

        resolve()
      })
    },

    async initPropertyRegistry() {
      return new Promise(async (resolve, reject) => {
        const instance = await this.getContract(jsonPropertyRegistry)
        this.$store.commit('setPropertyRegistryContract', instance)
        const propertyRegistryContract = this.$store.state.propertyRegistryContract

        const event = propertyRegistryContract.allEvents({ fromBlock: 0, toBlock: 'latest' })
        event.watch((err, res) => {
          if (err) {
            console.log('watch error', err)
          }
          else {
            console.log('got an event', res)
            switch(res.event) {
              case 'Registered': {
                this.$store.commit('editMyProperty', {
                  id: res.args._tokenId.toString(),
                  key: 'price',
                  value: res.args._price.toString(),
                })
                this.$store.commit('stopLoading')
                break
              }
              case 'Requested': {
                this.$store.commit('editRental', {
                  id: res.args._tokenId.toString(),
                  key: 'hasSentRequest',
                  value: true,
                })
                this.$store.commit('stopLoading')
                break;
              }
              // Making this simpler since it was taking a long time:
              case 'Approved':
              case 'CheckIn':
              case 'CheckOut':
                location.reload()
                break;
              default: {
                this.$store.commit('stopLoading')
              }
            }
          }
        })

        resolve()
      })
    },
  },

  async mounted() {
    this.initWeb3()
    await this.initProperty()
    await this.initPropertyRegistry()
    this.$store.commit('isInitialized')
  },
}
</script>

<style lang="scss">
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin: 0;
  padding: 0;
}
.loader {
  width: fill-available;
  height: fill;
  margin: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.property {
  display: flex;
  align-items: flex-start;
  border-radius: 4px;
  margin: 4px;
  background-color: white;
  .property-col {
    padding: 4px;
    margin: 2px;
    background-color: white;
    border: 1px solid gainsboro;
  }
}
</style>
