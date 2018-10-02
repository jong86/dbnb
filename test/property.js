const Property = artifacts.require('./Property.sol')
const PropertyRegistry = artifacts.require('./PropertyRegistry.sol')

contract('Property Contract tests', async accounts => {
  let property

  const owner = accounts[0];
  const alice = accounts[1];
  const bob = accounts[2];

  it('should be deployed', async () => {
    property = await Property.deployed()
    assert(property !== undefined, 'Property was NOT deployed')
  })

  it('should allow alice to create a property', async () => {
    const property = await Property.new('A', 'A', {from: owner})
    try {
      await property.createProperty({ from: alice })
      assert(true)
    } catch (e) {
      assert(false, 'error creating property')
    }
  })

  it('should return alice a tokenId when she creates a property', async () => {
    const property = await Property.new('A', 'A', {from: owner})
    const response = await property.createProperty({ from: alice })
    const tokenId = response.logs[0].args._tokenId.toString()
    assert(tokenId, 'did not receive a tokenId')
  })

  it('should allow alice to set the URI of her token', async () => {
    const property = await Property.new('A', 'A', {from: owner})
    const response = await property.createProperty({ from: alice })
    const tokenId = response.logs[0].args._tokenId
    try {
      await property.setURI(tokenId, 'http://someuri.com', { from: alice })
      assert(true)
    } catch (e) {
      assert(false, 'could not set uri')
    }
  })

  it('should not allow someone else to set the URI of alice\'s token', async () => {
    const property = await Property.new('A', 'A', {from: owner})
    const response = await property.createProperty({ from: alice })
    const tokenId = response.logs[0].args._tokenId
    try {
      await property.setURI(tokenId, 'http://someuri.com', { from: bob })
      assert(false, 'could set uri')
    } catch (e) {
      assert(true)
    }
  })

  it('should allow the owner to register a property', async () => {
    const property = await Property.new('A', 'A', {from: owner})

  })

  it('should not allow a non-owner to register a property', async () => {

  })
})