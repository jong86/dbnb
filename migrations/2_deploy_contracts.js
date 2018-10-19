var Property = artifacts.require("./Property.sol");
var PropertyToken = artifacts.require("./PropertyToken.sol");
var PropertyRegistry = artifacts.require("./PropertyRegistry.sol");

module.exports = deployer => {
  deployer.deploy(Property, "Property", "dBNB").then(propertyDeployed => {
    return deployer.deploy(PropertyToken, "PropertyToken", "PPT", 8).then(tokenDeployed => {
      console.log('tokenDeployed', tokenDeployed.address);
      return deployer.deploy(PropertyRegistry, propertyDeployed.address, tokenDeployed.address);
    })
  })
};
