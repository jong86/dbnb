<template>
  <div id="app">
    <Header />
    <!-- <div class="create-property" @click="stuff">create property</div> -->
    <router-view></router-view>
  </div>
</template>

<script>
import Header from './components/Header.vue'


// start contract listening stuff:
import Web3 from 'web3'
import truffleContract from 'truffle-contract'
import jsonProperty from '../../build/contracts/Property.json'

let web3Provider
if (typeof web3 !== "undefined") {
  web3Provider = web3.currentProvider
} else {
  web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545')
}
window.web3 = new Web3(web3Provider)

async function getContract(json, web3 = window.web3) {
  const contract = truffleContract(json);
  contract.setProvider(web3.currentProvider);
  return contract.deployed();
}

let propertyContract

async function initListening() {
  propertyContract = await getContract(jsonProperty);

  const event = propertyContract.allEvents({ fromBlock: 0, toBlock: 'latest' });
  event.watch((err, res) => {
    if (err)
      console.log('watch error', err)
    else
      console.log('got an event', res)
  })
}

initListening()

const { accounts } = web3.eth;
const alice = accounts[0];
const bob = accounts[1];
// end contract listening stuff





export default {
  name: 'app',
  components: {
    Header
  },
  methods: {
    stuff: async () => {
      try {
        const tx = await propertyContract.createProperty({
          from: alice,
          gas: 250000
        });
        console.log(tx);
        console.log('Property Created for Alice');
      } catch(e) {
        console.log(e);
        alert('Error creating property', e)
      }
    }
  }
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
.create-property {
  background-color: salmon;
  height: 50px;
  width: 120px;
}
</style>
