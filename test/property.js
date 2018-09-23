const Property = artifacts.require('./Property.sol')
var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider || 'http://localhost:9545');

contract('Property Contract tests', async accounts => {
  let property
  const alice = accounts[0];
  const bob = accounts[1];
  const carol = accounts[2];

  it('should be deployed', async () => {
    property = await Property.deployed()
    assert(property !== undefined, 'Property was NOT deployed')
  })

  it('the owner can invite a guest, bob', async () => {
    property = await Property.deployed()

    try {
      await property.inviteGuest(bob, { from: alice })
      const currentGuest = await property.currentGuest.call();
      assert(currentGuest === bob, 'alice can invite bob')
    } catch (e) {
      assert(false, 'alice could not invite bob')
    }
  })

  it('bob can reserve a room by sending correct amount of ether', async () => {
    try {
      await property.reserveRoom({ from: bob, value: Web3.utils.toWei('1', 'ether') })
      assert(true)
    } catch (e) {
      assert(false, 'bob could not reserve the room')
    }
  })

  it('bob cannot reserve room if sends wrong amount of ether', async () => {
    try {
      await property.reserveRoom({ from: bob, value: Web3.utils.toWei('0.1', 'ether') })
    } catch (e) {
      return assert(true)
    }

    assert(false, 'bob could reserve the room')
  })

  it('bob is refunded money if sends wrong amount of ether', async () => {
    const balance1 = await web3.eth.getBalance(bob);

    const encodedFunctionCall = await web3.eth.abi.encodeFunctionCall({
      name: 'reserveRoom',
      type: 'function',
      inputs: [],
    }, []);

    const txObject = {
      to: property.address,
      from: bob,
      data: encodedFunctionCall,
      value: Web3.utils.toWei('0.1', 'ether'),
    }

    var tx = new Tx(rawTx);
    tx.sign(privateKey);
    
    var serializedTx = tx.serialize();

    try {
      const response = await web3.eth.sendTransaction(txObject)
      console.log('response', response);

    } catch (e) {
      const balance2 = await web3.eth.getBalance(bob);  
      console.log('balance diff', balance1 - balance2);
      return assert(balance1 === balance2, 'bob was not refunded money')
    }

    assert(false, 'bob was not refunded money')
  })

  it('carol, an uninvited guest cannot reserve the room', async () => {
    try {
      await property.reserveRoom({ from: carol, value: Web3.utils.toWei('1', 'ether') })
    } catch (e) {
      return assert(true)
    }

    assert(false, 'carol could reserve the room')
  })
})