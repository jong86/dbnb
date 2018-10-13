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



export async function getContract(json, web3 = window.web3) {
  const contract = truffleContract(json)
  contract.setProvider(web3.currentProvider)
  return contract.deployed()
}


let propertyContract

async function initPropertyListening() {
  propertyContract = await getContract(jsonProperty);

  const event = propertyContract.allEvents({ fromBlock: 0, toBlock: 'latest' });
  event.watch((err, res) => {
    if (err)
      console.log('watch error', err)
    else
      console.log('got an event', res)
  })
}

initPropertyListening()

