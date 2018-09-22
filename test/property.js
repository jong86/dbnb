// Contracts
const Property = artifacts.require('./Property.sol')

// Tests
contract('Property Contract tests', async accounts => {
  let property;
  const message = 'hello world'
  const alice = accounts[0]
  const bob = accounts[1]

  it('should be deployed, Property', async () => {
    property = await Property.deployed()
    assert(property !== undefined, 'Property was NOT deployed')
  })
})