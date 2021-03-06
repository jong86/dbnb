const Property = artifacts.require('./Property.sol')
const PropertyToken = artifacts.require('./PropertyToken.sol')
const PropertyRegistry = artifacts.require('./PropertyRegistry.sol')

function now(multiple = 1, unit) {
  /* Returns time in seconds, with optional extra time */

  let extraTime = 0
  switch (unit) {
    case 'week':
    case 'weeks':
      extraTime = multiple * 604800
      break
    case 'day':
    case 'days':
      extraTime = multiple * 86400
      break
    case 'hour':
    case 'hours':
      extraTime = multiple * 3600
      break
    case 'minute':
    case 'minutes':
      extraTime = multiple * 60
      break
  }

  return parseInt((Date.now() / 1000) + extraTime)
}

contract('PropertyRegistry', accounts => {
  const owner = accounts[0];
  const alice = accounts[1];
  const bob = accounts[2];
  const eve = accounts[3];
  let property, propertyToken, propertyRegistry

  beforeEach(async () => {
    property = await Property.new('A', 'A', { from: owner })
    propertyToken = await PropertyToken.new('A', 'A', 8, { from: owner })
    propertyRegistry = await PropertyRegistry.new(property.address, propertyToken.address, { from: owner })

    await propertyToken.mint(owner, 8000000000, { from: owner })
    await propertyToken.mint(bob, 8000000000, { from: owner })
    await propertyToken.mint(alice, 8000000000, { from: owner })
  })

  it('should allow the owner to register a property', async () => {
    const response = await property.createProperty({ from: owner })
    const tokenId = response.logs[0].args._tokenId
    await propertyRegistry.registerProperty(tokenId, 123456, { from: owner })
    const registeredProperty = await propertyRegistry.regProps(tokenId)
    assert(registeredProperty[0].toString() === '123456', 'could not register property')
  })

  it('should not allow a non-owner to register a property', async () => {
    const response = await property.createProperty({ from: owner })
    const tokenId = response.logs[0].args._tokenId
    try {
      await propertyRegistry.registerProperty(tokenId, 123456, { from: alice })
    } catch (e) {}
    const registeredProperty = await propertyRegistry.regProps(tokenId)
    assert(registeredProperty[0].toString() !== '123456', 'could register property')
  })


  // Request creation

  it('should allow bob to submit a request', async () => {
    const response = await property.createProperty({ from: owner })
    const tokenId = response.logs[0].args._tokenId
    const nowTime = now()
    await propertyRegistry.request(tokenId, nowTime, now(2, 'days'), { from: bob })
    const request = await propertyRegistry.getRequest(tokenId, bob, { from: owner })
    assert(request[0].toString() === String(nowTime), 'could not make a request')
  })

  it('should allow alice to submit request after bob has submitted one', async () => {
    const response = await property.createProperty({ from: owner })
    const tokenId = response.logs[0].args._tokenId
    const nowTime = now()
    await propertyRegistry.request(tokenId, nowTime, now(2, 'days'), { from: bob })
    await propertyRegistry.request(tokenId, nowTime, now(2, 'days'), { from: alice })
    const requestBob = await propertyRegistry.getRequest(tokenId, bob, { from: owner })
    const requestAlice = await propertyRegistry.getRequest(tokenId, alice, { from: owner })
    assert(requestBob[0].toString() === String(nowTime), 'bob could not make a request')
    assert(requestAlice[0].toString() === String(nowTime), 'alice could not make a request')
  })


  // Request approvals

  it('should allow owner to approve bob\'s request', async () => {
    const response = await property.createProperty({ from: owner })
    const tokenId = response.logs[0].args._tokenId
    await propertyRegistry.request(tokenId, now(), now(2, 'days'), { from: bob })
    await propertyRegistry.approveRequest(tokenId, bob, { from: owner })
    const isApproved = await propertyRegistry.checkIfApproved(tokenId, { from: bob })
    assert(isApproved, 'was not approved')
  })

  it('should not let eve approve bob\'s request', async () => {
    const response = await property.createProperty({ from: owner })
    const tokenId = response.logs[0].args._tokenId
    await propertyRegistry.request(tokenId, now(), now(2, 'days'), { from: bob })
    try {
      await propertyRegistry.approveRequest(tokenId, bob, { from: eve })
    } catch (e) {}
    const isApproved = await propertyRegistry.checkIfApproved(tokenId, { from: bob })
    assert(!isApproved, 'was approved')
  })


  // Checking in

  it('bob can check-in after owner has approved and the approved time has come', async () => {
    const response = await property.createProperty({ from: owner })
    const tokenId = response.logs[0].args._tokenId
    await propertyRegistry.request(tokenId, now(), now(2, 'days'), { from: bob })
    await propertyRegistry.approveRequest(tokenId, bob, { from: owner })
    await propertyRegistry.checkIn(tokenId, { from: bob })
    const occupant = await propertyRegistry.getOccupant(tokenId, { from: owner })
    assert(occupant === bob, 'could not check in')
  })

  it('eve cannot check into property, even if correct time has come', async () => {
    const response = await property.createProperty({ from: owner })
    const tokenId = response.logs[0].args._tokenId
    await propertyRegistry.request(tokenId, now(), now(2, 'days'), { from: bob })
    await propertyRegistry.approveRequest(tokenId, bob, { from: owner })
    try {
      await propertyRegistry.checkIn(tokenId, { from: eve })
    } catch (e) {}
    const occupant = await propertyRegistry.getOccupant(tokenId, { from: owner })
    assert(occupant !== eve, 'could check in')
  })

  it('bob CANNOT check-in after owner has approved but approved time has NOT come', async () => {
    const response = await property.createProperty({ from: owner })
    const tokenId = response.logs[0].args._tokenId
    await propertyRegistry.request(tokenId, now(2, 'days'), now(4, 'days'), { from: bob })
    await propertyRegistry.approveRequest(tokenId, bob, { from: owner })
    try {
      await propertyRegistry.checkIn(tokenId, { from: bob })
    } catch (e) {}
    const occupant = await propertyRegistry.getOccupant(tokenId, { from: owner })
    assert(occupant !== bob, 'could check in')
  })


  // Checking out

  it('bob can check-out', async () => {
    const response = await property.createProperty({ from: owner })
    const tokenId = response.logs[0].args._tokenId
    await propertyRegistry.request(tokenId, now(), now(2, 'days'), { from: bob })
    await propertyRegistry.approveRequest(tokenId, bob, { from: owner })
    await propertyRegistry.checkIn(tokenId, { from: bob })
    await propertyRegistry.checkOut(tokenId, { from: bob })
    const occupant = await propertyRegistry.getOccupant(tokenId, { from: owner })
    assert(occupant !== bob, 'could not check out')
  })

  it('bob has less propertyToken after checking out', async () => {
    const response = await property.createProperty({ from: owner })
    const tokenId = response.logs[0].args._tokenId
    await propertyRegistry.registerProperty(tokenId, 20000000)
    await propertyRegistry.request(tokenId, now(), now(2, 'days'), { from: bob })
    await propertyRegistry.approveRequest(tokenId, bob, { from: owner })
    await propertyRegistry.checkIn(tokenId, { from: bob })
    const balanceBefore = await propertyToken.balanceOf(bob)
    try {
      await propertyRegistry.checkOut(tokenId, { from: bob })
    } catch (e) {
      console.log("***************************", e)
    }
    // await propertyToken.transfer(alice, 2131241, { from: bob })
    const balanceAfter = await propertyToken.balanceOf(bob)
    console.log('balanceBefore, balanceAfter', balanceBefore, balanceAfter);
    assert(balanceAfter < balanceBefore, '')
  })

  it('eve cannot check-out for bob', async () => {
    const response = await property.createProperty({ from: owner })
    const tokenId = response.logs[0].args._tokenId
    await propertyRegistry.request(tokenId, now(), now(2, 'days'), { from: bob })
    await propertyRegistry.approveRequest(tokenId, bob, { from: owner })
    await propertyRegistry.checkIn(tokenId, { from: bob })
    try {
      await propertyRegistry.checkOut(tokenId, { from: eve })
    } catch (e) {}
    const occupant = await propertyRegistry.getOccupant(tokenId, { from: owner })
    assert(occupant === bob, 'eve could check out for bob')
  })
})