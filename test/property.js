const Property = artifacts.require('./Property.sol')
const PropertyRegistry = artifacts.require('./PropertyRegistry.sol')

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

    try {
      await property.setURI(tokenId, 'http://someuri.com', { from: alice })
      assert(true)
    } catch (e) {
      assert(false, 'could not set uri')
    }
  })

  it('should not allow someone else to set the URI of alice\'s token', async () => {
    const property = await Property.new('A', 'A', { from: owner })
    const response = await property.createProperty({ from: alice })
    const tokenId = response.logs[0].args._tokenId

    try {
      await property.setURI(tokenId, 'http://someuri.com', { from: bob })
      assert(false, 'could set uri')
    } catch (e) {
      assert(true)
    }
  })


  // Property registry

  it('should allow the owner to register a property', async () => {
    const property = await Property.new('A', 'A', { from: owner})
    const propertyRegistry = await PropertyRegistry.new(property.address, { from: alice })

    const response = await property.createProperty({ from: owner })
    const tokenId = response.logs[0].args._tokenId

    try {
      await propertyRegistry.registerProperty(tokenId, 10000, { from: owner })
      assert(true)
    } catch (e) {
      assert(false, 'could not register property')
    }
  })

  it('should not allow a non-owner to register a property', async () => {
    const property = await Property.new('A', 'A', { from: owner})
    const propertyRegistry = await PropertyRegistry.new(property.address, { from: alice })

    const response = await property.createProperty({ from: owner })
    const tokenId = response.logs[0].args._tokenId

    try {
      await propertyRegistry.registerProperty(tokenId, 10000, { from: alice })
    } catch (e) {
      return assert(true)
    }

    assert(false, 'could register property')
  })


  // Requests

  it('should allow bob to submit a request', async () => {
    const property = await Property.new('A', 'A', { from: owner})
    const propertyRegistry = await PropertyRegistry.new(property.address, { from: alice })

    const response = await property.createProperty({ from: owner })
    const blockNumber = response.receipt.blockNumber
    const tokenId = response.logs[0].args._tokenId

    try {
      await propertyRegistry.request(tokenId, blockNumber + 1, blockNumber + 3, { from: bob })
      assert(true)
    } catch (e) {
      assert(false, 'bob could not submit request')
    }
  })

  it('should not allow eve to submit request after bob has submitted one', async () => {
    const property = await Property.new('A', 'A', { from: owner})
    const propertyRegistry = await PropertyRegistry.new(property.address, { from: eve })

    const response = await property.createProperty({ from: owner })
    const blockNumber = response.receipt.blockNumber
    const tokenId = response.logs[0].args._tokenId

    try {
      await propertyRegistry.request(tokenId, blockNumber + 1, blockNumber + 3, { from: bob })
    } catch (e) {
      // don't care about this error
    }

    try {
      await propertyRegistry.request(tokenId, blockNumber + 1, blockNumber + 3, { from: eve })
    } catch (e) {
      if (e.message === 'propertyRegistry.request is not a function') {
        return assert(false, e.message)
      } else {
        return assert(true)
      }
    }

    assert(false, 'eve could submit request')
  })

  it('owner can approve bob\'s request', async () => {
    const property = await Property.new('A', 'A', { from: owner})
    const propertyRegistry = await PropertyRegistry.new(property.address, { from: owner })

    const response = await property.createProperty({ from: owner })
    const blockNumber = response.receipt.blockNumber
    const tokenId = response.logs[0].args._tokenId

    try {
      await propertyRegistry.request(tokenId, blockNumber + 1, blockNumber + 3, { from: bob })
    } catch (e) {
      // don't care about this error
    }

    try {
      await propertyRegistry.approveRequest(tokenId, { from: owner })
      assert(true)
    } catch (e) {
      assert(false, 'owner could not approve bob\'s request')
    }
  })

  it('eve cannot approve bob\'s request', async () => {
    const property = await Property.new('A', 'A', { from: owner})
    const propertyRegistry = await PropertyRegistry.new(property.address, { from: owner })

    const response = await property.createProperty({ from: owner })
    const blockNumber = response.receipt.blockNumber
    const tokenId = response.logs[0].args._tokenId

    try {
      await propertyRegistry.request(tokenId, blockNumber, blockNumber + 2, { from: bob })
    } catch (e) {
      // don't care about this error
    }

    try {
      await propertyRegistry.approveRequest(tokenId, { from: eve })
    } catch (e) {
      if (e.message === 'propertyRegistry.approveRequest is not a function') {
        return assert(false, e.message)
      } else {
        return assert(true)
      }
    }

    assert(false, 'eve could approve bob\'s request')
  })

  it('eve cannot check into property, even if correct time has come', async () => {
    const property = await Property.new('A', 'A', { from: owner})
    const propertyRegistry = await PropertyRegistry.new(property.address, { from: owner })

    const response = await property.createProperty({ from: owner })
    const blockNumber = response.receipt.blockNumber
    const tokenId = response.logs[0].args._tokenId

    try {
      await propertyRegistry.request(tokenId, blockNumber, blockNumber + 2, { from: bob })
    } catch (e) {
      // don't care about this error
    }

    try {
      await propertyRegistry.checkIn(tokenId, { from: eve })
    } catch (e) {
      if (e.message === 'propertyRegistry.checkIn is not a function') {
        return assert(false, e.message)
      } else {
        return assert(true)
      }
    }

    assert(false, 'eve could check-in to the property')
  })

  it('bob can check-in after owner has approved and the approved time has come', async () => {
    const property = await Property.new('A', 'A', { from: owner})
    const propertyRegistry = await PropertyRegistry.new(property.address, { from: owner })

    const response = await property.createProperty({ from: owner })
    const blockNumber = response.receipt.blockNumber
    const tokenId = response.logs[0].args._tokenId

    try {
      await propertyRegistry.request(tokenId, blockNumber, blockNumber + 2, { from: bob })
    } catch (e) {
      // don't care about this error
    }

    try {
      await propertyRegistry.approveRequest(tokenId, { from: owner })
    } catch (e) {
      // don't care about this error
    }

    try {
      await propertyRegistry.checkIn(tokenId, { from: bob })
      assert(true)
    } catch (e) {
      assert(false, 'bob could not check-in')
    }
  })

  it('bob CANNOT check-in after owner has approved but approved time has NOT come', async () => {
    const property = await Property.new('A', 'A', { from: owner})
    const propertyRegistry = await PropertyRegistry.new(property.address, { from: owner })

    const response = await property.createProperty({ from: owner })
    const blockNumber = response.receipt.blockNumber
    const tokenId = response.logs[0].args._tokenId

    try {
      await propertyRegistry.request(tokenId, blockNumber + 5, blockNumber + 8, { from: bob })
    } catch (e) {
      // don't care about this error
    }

    try {
      await propertyRegistry.approveRequest(tokenId, { from: owner })
    } catch (e) {
      // don't care about this error
    }

    try {
      await propertyRegistry.checkIn(tokenId, { from: bob })
    } catch (e) {
      if (e.message === 'propertyRegistry.checkIn is not a function') {
        return assert(false, e.message)
      } else {
        return assert(true)
      }
    }

    assert(false, 'bob could check-in to the property')
  })

  it('bob can check-out', async () => {
    const property = await Property.new('A', 'A', { from: owner})
    const propertyRegistry = await PropertyRegistry.new(property.address, { from: owner })

    const response = await property.createProperty({ from: owner })
    const blockNumber = response.receipt.blockNumber
    const tokenId = response.logs[0].args._tokenId

    try {
      await propertyRegistry.request(tokenId, blockNumber, blockNumber + 2, { from: bob })
    } catch (e) {
      // don't care about this error
    }

    try {
      await propertyRegistry.approveRequest(tokenId, { from: owner })
    } catch (e) {
      // don't care about this error
    }

    try {
      await propertyRegistry.checkIn(tokenId, { from: bob })
    } catch (e) {
      // don't care about this error
    }

    try {
      await propertyRegistry.checkOut(tokenId, { from: bob })
      assert(true)
    } catch (e) {
      assert(false, 'bob could not check-out')
    }


    it('a new request can be submitted after bob has checked out', async () => {
      const property = await Property.new('A', 'A', { from: owner})
      const propertyRegistry = await PropertyRegistry.new(property.address, { from: owner })
  
      const response = await property.createProperty({ from: owner })
      const blockNumber = response.receipt.blockNumber
      const tokenId = response.logs[0].args._tokenId
  
      try {
        await propertyRegistry.request(tokenId, blockNumber, blockNumber + 2, { from: bob })
      } catch (e) {
        // don't care about this error
      }
  
      try {
        await propertyRegistry.approveRequest(tokenId, { from: owner })
      } catch (e) {
        // don't care about this error
      }
  
      try {
        await propertyRegistry.checkIn(tokenId, { from: bob })
      } catch (e) {
        // don't care about this error
      }

      try {
        await propertyRegistry.checkOut(tokenId, { from: bob })
      } catch (e) {
        // don't care about this error
      }

      try {
        await propertyRegistry.request(tokenId, { from: alice })
        assert(true)
      } catch (e) {
        assert(false, 'alice could not make another request')
      }
    })
  })
})