const Property = artifacts.require('./Property.sol')
const PropertyToken = artifacts.require('./PropertyToken.sol')
const PropertyRegistry = artifacts.require('./PropertyRegistry.sol')

module.exports = async function(done) {
  const owner = "0x627306090abab3a6e1400e9345bc60c78a8bef57"
  const bob = "0xf17f52151ebef6c7334fad080c5704d77216b732"
  const alice = "0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef"

  const property = await Property.deployed('A', 'A', { from: owner})
  const propertyToken = await PropertyToken.deployed('A', 'A', 8, { from: owner })
  const propertyRegistry = await PropertyRegistry.deployed(property.address, propertyToken.address, { from: owner })

  let response
  response = await property.createWithURI('la la la', { from: owner })
  const tokenId = response.logs[0].args._tokenId
  await propertyRegistry.registerProperty(tokenId, 1, { from: owner })

  const now = Date.now() / 1000
  await propertyRegistry.request(tokenId, now, now + 100000, { from: bob })

  await propertyRegistry.approveRequest(tokenId, bob, { from: owner })

  done()
}