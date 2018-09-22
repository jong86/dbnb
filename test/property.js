// Contracts
const Property = artifacts.require('./Property.sol')

// Tests
contract('Property Contract tests', async accounts => {
  let property
  const alice = accounts[0];
  const bob = accounts[0];

  it('should be deployed', async () => {
    property = await Property.deployed()
    assert(property !== undefined, 'Property was NOT deployed')
  })

  it('alice (the owner) can invite bob (the guest)', async () => {
    property = await Property.deployed()

    try {
      await property.inviteGuest(bob, { from: alice })
      const currentGuest = await property.currentGuest.call();
      assert(currentGuest === bob, 'alice can invite bob')
    } catch (e) {
      assert(false, 'alice could not invite bob')
    }
  })
})