const Property = artifacts.require('./Property.sol')
const PropertyRegistry = artifacts.require('./PropertyRegistry.sol')
import { now } from '../util/time'

contract('PropertyRegistry', accounts => {
  const owner = accounts[0];
  const alice = accounts[1];
  const bob = accounts[2];
  const eve = accounts[3];

  it('should allow the owner to register a property', async () => {
    const property = await Property.new('A', 'A', { from: owner })
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
    const tokenId = response.logs[0].args._tokenId
    await propertyRegistry.request(tokenId, now(), now(2, 'days'), { from: bob })
    const registeredProperty = await propertyRegistry.registeredProperties(tokenId)
    assert(registeredProperty[2].toString() === String(now()), 'could not make a request')
  })

  it('should not allow eve to submit request after bob has submitted one', async () => {
    const property = await Property.new('A', 'A', { from: owner})
    const propertyRegistry = await PropertyRegistry.new(property.address, { from: eve })
    const response = await property.createProperty({ from: owner })
    const tokenId = response.logs[0].args._tokenId
    await propertyRegistry.request(tokenId, now(), now(2, 'days'), { from: bob })
    try {
      await propertyRegistry.request(tokenId, now(), now(2, 'days'), { from: eve })
    } catch (e) {}
    const registeredProperty = await propertyRegistry.registeredProperties(tokenId)
    assert(registeredProperty[1].toString() === bob, 'eve could make a request')
  })


  // Request approvals

  it('should allow owner to approve bob\'s request', async () => {
    const property = await Property.new('A', 'A', { from: owner})
    const propertyRegistry = await PropertyRegistry.new(property.address, { from: owner })
    const response = await property.createProperty({ from: owner })
    const tokenId = response.logs[0].args._tokenId
    await propertyRegistry.request(tokenId, now(), now(2, 'days'), { from: bob })
    await propertyRegistry.approveRequest(tokenId, { from: owner })
    const registeredProperty = await propertyRegistry.registeredProperties(tokenId)
    assert(registeredProperty[4] === true, 'could not approve')
  })

  it('should not let eve approve bob\'s request', async () => {
    const property = await Property.new('A', 'A', { from: owner})
    const propertyRegistry = await PropertyRegistry.new(property.address, { from: owner })
    const response = await property.createProperty({ from: owner })
    const tokenId = response.logs[0].args._tokenId
    await propertyRegistry.request(tokenId, now(), now(2, 'days'), { from: bob })
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
    const tokenId = response.logs[0].args._tokenId
    await propertyRegistry.request(tokenId, now(), now(2, 'days'), { from: bob })
    await propertyRegistry.approveRequest(tokenId, { from: owner })
    await propertyRegistry.checkIn(tokenId, { from: bob })
    const registeredProperty = await propertyRegistry.registeredProperties(tokenId)
    assert(registeredProperty[5] === true, 'could not check-in')
  })

  it('eve cannot check into property, even if correct time has come', async () => {
    const property = await Property.new('A', 'A', { from: owner})
    const propertyRegistry = await PropertyRegistry.new(property.address, { from: owner })
    const response = await property.createProperty({ from: owner })
    const tokenId = response.logs[0].args._tokenId
    await propertyRegistry.request(tokenId, now(), now(2, 'days'), { from: bob })
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
    const tokenId = response.logs[0].args._tokenId
    await propertyRegistry.request(tokenId, now(5, 'days'), now(7, 'days'), { from: bob })
    await propertyRegistry.approveRequest(tokenId, { from: owner })
    try {
      await propertyRegistry.checkIn(tokenId, { from: bob })
    } catch (e) {}
    const registeredProperty = await propertyRegistry.registeredProperties(tokenId)
    assert(registeredProperty[5] === false, 'could check-in')
  })

  // Checking out

  it('bob can check-out', async () => {
    const property = await Property.new('A', 'A', { from: owner})
    const propertyRegistry = await PropertyRegistry.new(property.address, { from: owner })
    const response = await property.createProperty({ from: owner })
    const tokenId = response.logs[0].args._tokenId
    await propertyRegistry.request(tokenId, now(), now(2, 'days'), { from: bob })
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
    const tokenId = response.logs[0].args._tokenId
    await propertyRegistry.request(tokenId, now(), now(2, 'days'), { from: bob })
    await propertyRegistry.approveRequest(tokenId, { from: owner })
    await propertyRegistry.checkIn(tokenId, { from: bob })
    await propertyRegistry.checkOut(tokenId, { from: bob })
    await propertyRegistry.request(tokenId, now(3, 'days'), now(5, 'days'), { from: bob })
    const registeredProperty = await propertyRegistry.registeredProperties(tokenId)
    assert(registeredProperty[2].toString() === String(now(3, 'days')), 'could not make another request')
  })
})