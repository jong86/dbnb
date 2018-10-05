var Property = artifacts.require("./Property.sol");
var PropertyToken = artifacts.require("./PropertyToken.sol");
var PropertyRegistry = artifacts.require("./PropertyRegistry.sol");

module.exports = deployer => {
  deployer.deploy(Property, "Property", "dBNB", { gas: 6000000 }).then(() => {
    return deployer.deploy(PropertyToken, "PropertyToken", "PPT", 8, { gas: 6000000 }).then(() => {
      return deployer.deploy(PropertyRegistry, Property.address, PropertyToken.address, { gas: 6000000 });
    })
  })
};
