// Contracts
const Property = artifacts.require('./Property.sol')

// Tests
contract('Property Contract tests', async accounts => {
  let property

  it('should be deployed', async () => {
    property = await Property.deployed()
    assert(property !== undefined, 'Property was NOT deployed')
  })
})