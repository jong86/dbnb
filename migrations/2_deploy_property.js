var Property = artifacts.require("./Property.sol");
var PropertyToken = artifacts.require("./PropertyToken.sol");
var PropertyRegistry = artifacts.require("./PropertyRegistry.sol");

module.exports = deployer => {
  deployer.deploy(Property, "Property", "dBNB").then(() => {
    return deployer.deploy(PropertyToken, "PropertyToken", "PPT", 8).then(() => {
      return deployer.deploy(PropertyRegistry, Property.address, PropertyToken.address);
    })
  })
};
