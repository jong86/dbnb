const Property = artifacts.require('./Property.sol')
const Web3 = require('web3');
const web3 = new Web3('http://localhost:7545');
const ethTx = require('ethereumjs-tx');
const BN = web3.utils.BN;


contract('Property Contract tests', async accounts => {
  let property

  const alice = accounts[0];
  const bob = accounts[1];
  const carol = accounts[2];

  it('should be deployed', async () => {
    property = await Property.deployed()
    assert(property !== undefined, 'Property was NOT deployed')
  })

  it('should allow alice to create a property', async () => {
    try {
      await property.createProperty({ from: alice })
      assert(true)
    } catch (e) {
      assert(false, 'could not create property')
    }
  })
})