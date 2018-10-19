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

  await propertyToken.mint(owner, 10000, { from: owner })
  await propertyToken.mint(bob, 10000, { from: owner })
  await propertyToken.mint(alice, 10000, { from: owner })

  const totalSupply = await propertyToken.totalSupply({ from: owner })
  console.log('totalSupply', totalSupply);

  const balanceBob = await propertyToken.balanceOf(bob)
  console.log('balanceBob', balanceBob);

  done()
}