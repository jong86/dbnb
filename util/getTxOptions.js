import store from '../src/store'

function getTxOptions() {
  return new Promise(async (resolve, reject) => {
    try {
      let address
      await store.state.web3.eth.getAccounts((err, result) => {
        address = result[0]
      })
      resolve({
        from: address,
        gas: 200000,
      })
    } catch (e) {
      reject(address)
    }
  })
}

export default getTxOptions