const Property = artifacts.require('./Property.sol')
const PropertyRegistry = artifacts.require('./PropertyRegistry.sol')

// Note: Caught errors are ignored in some negative test cases so function still reaches assert()

contract('Property Contract tests', async accounts => {
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


  // Property registry

  it('should allow the owner to register a property', async () => {
    const property = await Property.new('A', 'A', { from: owner})
    const propertyRegistry = await PropertyRegistry.new(property.address, { from: alice })
    const response = await property.createProperty({ from: owner })
    const tokenId = response.logs[0].args._tokenId
    await propertyRegistry.registerProperty(tokenId, 123456, { from: owner })
    const registeredProperty = await propertyRegistry.registeredProperties(tokenId)
    assert(registeredProperty[0].toString() === '123456', 'could not register property')
  })

  it('should not allow a non-owner to register a property', async () => {
    const property = await Property.new('A', 'A', { from: owner})
    const propertyRegistry = await PropertyRegistry.new(property.address, { from: alice })
    const response = await property.createProperty({ from: owner })
    const tokenId = response.logs[0].args._tokenId
    try {
      await propertyRegistry.registerProperty(tokenId, 123456, { from: alice })
    } catch (e) {}
    const registeredProperty = await propertyRegistry.registeredProperties(tokenId)
    assert(registeredProperty[0].toString() !== '123456', 'could register property')
  })


  // Request creation

  it('should allow bob to submit a request', async () => {
    const property = await Property.new('A', 'A', { from: owner})
    const propertyRegistry = await PropertyRegistry.new(property.address, { from: alice })
    const response = await property.createProperty({ from: owner })
    const blockNumber = response.receipt.blockNumber
    const tokenId = response.logs[0].args._tokenId
    await propertyRegistry.request(tokenId, blockNumber + 1, blockNumber + 3, { from: bob })
    const registeredProperty = await propertyRegistry.registeredProperties(tokenId)
    assert(registeredProperty[2].toString() === String(blockNumber + 1), 'could not make a request')
  })

  it('should not allow eve to submit request after bob has submitted one', async () => {
    const property = await Property.new('A', 'A', { from: owner})
    const propertyRegistry = await PropertyRegistry.new(property.address, { from: eve })
    const response = await property.createProperty({ from: owner })
    const blockNumber = response.receipt.blockNumber
    const tokenId = response.logs[0].args._tokenId
    await propertyRegistry.request(tokenId, blockNumber + 1, blockNumber + 3, { from: bob })
    try {
      await propertyRegistry.request(tokenId, blockNumber + 6, blockNumber + 8, { from: eve })
    } catch (e) {}
    const registeredProperty = await propertyRegistry.registeredProperties(tokenId)
    assert(registeredProperty[1].toString() === bob, 'eve could make a request')
  })


  // Request approvals

  it('should allow owner to approve bob\'s request', async () => {
    const property = await Property.new('A', 'A', { from: owner})
    const propertyRegistry = await PropertyRegistry.new(property.address, { from: owner })
    const response = await property.createProperty({ from: owner })
    const blockNumber = response.receipt.blockNumber
    const tokenId = response.logs[0].args._tokenId
    await propertyRegistry.request(tokenId, blockNumber + 1, blockNumber + 3, { from: bob })
    await propertyRegistry.approveRequest(tokenId, { from: owner })
    const registeredProperty = await propertyRegistry.registeredProperties(tokenId)
    assert(registeredProperty[4] === true, 'could not approve')
  })

  it('should not let eve approve bob\'s request', async () => {
    const property = await Property.new('A', 'A', { from: owner})
    const propertyRegistry = await PropertyRegistry.new(property.address, { from: owner })
    const response = await property.createProperty({ from: owner })
    const blockNumber = response.receipt.blockNumber
    const tokenId = response.logs[0].args._tokenId
    await propertyRegistry.request(tokenId, blockNumber + 1, blockNumber + 3, { from: bob })
    try {
      await propertyRegistry.approveRequest(tokenId, { from: eve })
    } catch (e) {}
    const registeredProperty = await propertyRegistry.registeredProperties(tokenId)
    assert(registeredProperty[4] === false, 'could approve')
  })


  // Checking in

  it('bob can check-in after owner has approved and the approved time has come', async () => {
    const property = await Property.new('A', 'A', { from: owner})
    const propertyRegistry = await PropertyRegistry.new(property.address, { from: owner })
    const response = await property.createProperty({ from: owner })
    const blockNumber = response.receipt.blockNumber
    const tokenId = response.logs[0].args._tokenId
    await propertyRegistry.request(tokenId, blockNumber, blockNumber + 2, { from: bob })
    await propertyRegistry.approveRequest(tokenId, { from: owner })
    await propertyRegistry.checkIn(tokenId, { from: bob })
    const registeredProperty = await propertyRegistry.registeredProperties(tokenId)
    assert(registeredProperty[5] === true, 'could not check-in')
  })

  it('eve cannot check into property, even if correct time has come', async () => {
    const property = await Property.new('A', 'A', { from: owner})
    const propertyRegistry = await PropertyRegistry.new(property.address, { from: owner })
    const response = await property.createProperty({ from: owner })
    const blockNumber = response.receipt.blockNumber
    const tokenId = response.logs[0].args._tokenId
    await propertyRegistry.request(tokenId, blockNumber, blockNumber + 2, { from: bob })
    await propertyRegistry.approveRequest(tokenId, { from: owner })
    try {
      await propertyRegistry.checkIn(tokenId, { from: eve })
    } catch (e) {}
    const registeredProperty = await propertyRegistry.registeredProperties(tokenId)
    assert(registeredProperty[5] === false, 'could check-in')
  })

  it('bob CANNOT check-in after owner has approved but approved time has NOT come', async () => {
    const property = await Property.new('A', 'A', { from: owner})
    const propertyRegistry = await PropertyRegistry.new(property.address, { from: owner })
    const response = await property.createProperty({ from: owner })
    const blockNumber = response.receipt.blockNumber
    const tokenId = response.logs[0].args._tokenId
    await propertyRegistry.request(tokenId, blockNumber + 5, blockNumber + 8, { from: bob })
    await propertyRegistry.approveRequest(tokenId, { from: owner })
    try {
      await propertyRegistry.checkIn(tokenId, { from: bob })
    } catch (e) {}
    const registeredProperty = await propertyRegistry.registeredProperties(tokenId)
    assert(registeredProperty[5] === false, 'could check-in')
  })

  // it('bob CANNOT check-in after owner has approved, and check-out time has passed', async () => {
  //   const property = await Property.new('A', 'A', { from: owner})
  //   const propertyRegistry = await PropertyRegistry.new(property.address, { from: owner })
  //   const response = await property.createProperty({ from: owner })
  //   const blockNumber = response.receipt.blockNumber
  //   const tokenId = response.logs[0].args._tokenId
  //   await propertyRegistry.request(tokenId, blockNumber - 2, blockNumber - 1, { from: bob })
  //   await propertyRegistry.approveRequest(tokenId, { from: owner })
  //   try {
  //     await propertyRegistry.checkIn(tokenId, { from: bob })
  //   } catch (e) {}
  //   const registeredProperty = await propertyRegistry.registeredProperties(tokenId)
  //   assert(registeredProperty[5] === false, 'could check-in')
  // })


  // Checking out

  it('bob can check-out', async () => {
    const property = await Property.new('A', 'A', { from: owner})
    const propertyRegistry = await PropertyRegistry.new(property.address, { from: owner })
    const response = await property.createProperty({ from: owner })
    const blockNumber = response.receipt.blockNumber
    const tokenId = response.logs[0].args._tokenId
    await propertyRegistry.request(tokenId, blockNumber, blockNumber + 2, { from: bob })
    await propertyRegistry.approveRequest(tokenId, { from: owner })
    await propertyRegistry.checkIn(tokenId, { from: bob })
    await propertyRegistry.checkOut(tokenId, { from: bob })
    const registeredProperty = await propertyRegistry.registeredProperties(tokenId)
    assert(registeredProperty[1] === '0x0000000000000000000000000000000000000000', 'occupant address not deleted')
    assert(registeredProperty[2].toString() === '0', 'check-in time not deleted')
    assert(registeredProperty[3].toString() === '0', 'check-out time not deleted')
    assert(registeredProperty[4] === false, 'isApproved not falsified')
    assert(registeredProperty[5] === false, 'isCheckedIn not falsified')
  })

  it('a new request can be submitted after bob has checked out', async () => {
    const property = await Property.new('A', 'A', { from: owner})
    const propertyRegistry = await PropertyRegistry.new(property.address, { from: owner })
    const response = await property.createProperty({ from: owner })
    const blockNumber = response.receipt.blockNumber
    const tokenId = response.logs[0].args._tokenId
    await propertyRegistry.request(tokenId, blockNumber, blockNumber + 2, { from: bob })
    await propertyRegistry.approveRequest(tokenId, { from: owner })
    await propertyRegistry.checkIn(tokenId, { from: bob })
    await propertyRegistry.checkOut(tokenId, { from: bob })
    await propertyRegistry.request(tokenId, blockNumber + 57, blockNumber + 58, { from: alice })
    const registeredProperty = await propertyRegistry.registeredProperties(tokenId)
    assert(registeredProperty[2].toString() === String(blockNumber + 57), 'could not make another request')
  })
})