import store from '../src/store'

export default function() {
  return new Promise(async (resolve, reject) => {
    try {
      let address
      await store.state.web3.eth.getAccounts((err, result) => {
        address = result[0]
      })
      resolve(address)
    } catch (e) {
      reject(e)
    }
  })
}