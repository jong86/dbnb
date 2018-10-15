import store from '../src/store'

function getAddress() {
  return new Promise(async (resolve, reject) => {
    try {
      let address
      await store.state.web3.eth.getAccounts((err, result) => {
        address = result[0]
      })
      resolve(address)
    } catch (e) {
      reject(address)
    }
  })
}

export default getAddress