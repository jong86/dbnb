import getAddress from './getAddress'

export default function() {
  return new Promise(async (resolve, reject) => {
    try {
      const address = await getAddress()
      resolve({
        from: address,
        gas: 200000,
      })
    } catch (e) {
      reject(address)
    }
  })
}