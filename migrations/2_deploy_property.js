var Property = artifacts.require("./Property.sol");

module.exports = function(deployer) {
  deployer.deploy(Property, "Property", "dBNB", { gas: 6000000 });
};
