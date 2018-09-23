const Property = artifacts.require('./Property.sol')
const Web3 = require('web3');
const web3 = new Web3('http://localhost:9545');
const ethTx = require('ethereumjs-tx');
const BN = web3.utils.BN;


contract('Property Contract tests', async accounts => {
  let property

  const alice = accounts[0];
  const bob = "0xf17f52151ebef6c7334fad080c5704d77216b732";
  const bobPrivateKey = "ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f";
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
    const encodedFunctionCall = await web3.eth.abi.encodeFunctionCall({
      name: 'reserveRoom',
      type: 'function',
      inputs: [],
    }, []);

    const gasPrice = 420000000000;

    const txData = {
      nonce: await web3.eth.getTransactionCount(bob),
      gasPrice: Web3.utils.toHex(gasPrice),
      gasLimit: '0x30000',
      to: property.address,
      value: Web3.utils.toHex(Web3.utils.toWei('0.1', 'ether')),
      data: encodedFunctionCall,
    }

    const tx = new ethTx(txData);

    // Get the hash to use for getting receipt after
    const txHashHexString = String(web3.utils.bytesToHex([...tx.hash()]));

    // Sign the tx and prepare for sending
    const privKey = Buffer.from(bobPrivateKey, 'hex');
    tx.sign(privKey);
    const rawTx = '0x' + tx.serialize().toString('hex');

    // The 'before' balance
    const balance1 = new BN(await web3.eth.getBalance(bob));

    // Put this in a try/catch so the function continues after expected revert error
    try {
      await web3.eth.sendSignedTransaction(rawTx);
    } catch (e) {
      // Not worried about the error here
    }

    // The 'after' balance
    const balance2 = new BN(await web3.eth.getBalance(bob));  

    // At last, my oh-so sought-after transaction receipt
    const receipt = await web3.eth.getTransactionReceipt(txHashHexString);

    const etherUsed = new BN(String(receipt.gasUsed * gasPrice));

    const comparison = balance1.cmp(balance2.add(etherUsed)); // Evaluates to 0 if the values are equal

    return assert(!comparison, 'bob was not refunded money')
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