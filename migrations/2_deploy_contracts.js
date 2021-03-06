var SupplyChain = artifacts.require("./SupplyChain.sol");
var CompanyRole = artifacts.require("./CompanyRole.sol");
var ManufacturerRole = artifacts.require("./ManufacturerRole.sol");
var RetailerRole = artifacts.require("./RetailerRole.sol");
var ConsumerRole = artifacts.require("./ConsumerRole.sol");

module.exports = function(deployer) {
  deployer.deploy(SupplyChain);
  deployer.deploy(CompanyRole);
  deployer.deploy(ManufacturerRole);
  deployer.deploy(RetailerRole);
  deployer.deploy(ConsumerRole);
};
