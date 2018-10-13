<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
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

async function initListening() {
  const propertyContract = await getContract(jsonProperty);

  const event = propertyContract.allEvents({ fromBlock: 0, toBlock: 'latest' });
  event.watch((err, res) => {
    if (err)
      console.log('watch error', err)
    else
      console.log('got an event', res)
  })
}

initListening()



export default {
  name: 'app',
  components: {
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
