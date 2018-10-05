const Property = artifacts.require('./Property.sol')
const PropertyToken = artifacts.require('./PropertyToken.sol')
const PropertyRegistry = artifacts.require('./PropertyRegistry.sol')

contract('PropertyToken', accounts => {
  const owner = accounts[0];
  const alice = accounts[1];
  const bob = accounts[2];
  const eve = accounts[3];

  it('should deploy', async () => {
    const propertyToken = await PropertyToken.new('A', 'A', '8', { from: owner })
    assert(propertyToken !== undefined, 'was not deployed')
  })

  it('should allow alice to mint Property Token for bob', async () => {
    const propertyToken = await PropertyToken.new('A', 'A', 8, { from: owner })
    const allocation = 1000
    const tx = await propertyToken.mint(bob, allocation)
    const balance = await propertyToken.balanceOf.call(bob)
    assert(balance.toNumber() === allocation, 'balance')
  })

  it('should allow bob to approve the property registry to use his tokens', async () => {
    const property = await Property.new('A', 'A', { from: owner })
    const propertyToken = await PropertyToken.new('A', 'A', 8, { from: owner })
    const propertyRegistry = await PropertyRegistry.new(property.address, propertyToken.address, { from: owner })
    const tx = await propertyToken.approve(propertyRegistry.address, 100, { from: bob });
    assert(tx !== undefined, 'property registry has not been approved');
  });
})