var Migrations = artifacts.require("./Migrations.sol");
var HelloWorld = artifacts.require("./HelloWorld.sol");
var Property = artifacts.require("./Property.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(HelloWorld);
  deployer.deploy(Property);
};
