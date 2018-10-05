const Property = artifacts.require('./Property.sol')

contract('Property Contract tests', accounts => {
  const owner = accounts[0];
  const alice = accounts[1];
  const bob = accounts[2];
  const eve = accounts[3];

  it('should be deployed', async () => {
    const property = await Property.deployed()
    assert(property !== undefined, 'Property was NOT deployed')
  })

  it('should allow alice to create a property', async () => {
    const property = await Property.new('A', 'A', { from: owner })

    try {
      await property.createProperty({ from: alice })
      assert(true)
    } catch (e) {
      assert(false, 'error creating property')
    }
  })

  it('should return alice a tokenId when she creates a property', async () => {
    const property = await Property.new('A', 'A', { from: owner })
    const response = await property.createProperty({ from: alice })
    const tokenId = response.logs[0].args._tokenId.toString()
    assert(tokenId, 'did not receive a tokenId')
  })

  it('should allow alice to set the URI of her token', async () => {
    const property = await Property.new('A', 'A', { from: owner })
    const response = await property.createProperty({ from: alice })
    const tokenId = response.logs[0].args._tokenId
    await property.setURI(tokenId, 'http://someuri.com', { from: alice })
    const uriGot = await property.getURI(tokenId)
    assert(uriGot === 'http://someuri.com', 'did not set the URI')
  })

  it('should not allow someone else to set the URI of alice\'s token', async () => {
    const property = await Property.new('A', 'A', { from: owner })
    const response = await property.createProperty({ from: alice })
    const tokenId = response.logs[0].args._tokenId
    try {
      await property.setURI(tokenId, 'http://someuri.com', { from: eve })
    } catch (e) {}
    const uriGot = await property.getURI(tokenId)
    assert(uriGot !== 'http://someuri.com', 'could set the url')
  })
})