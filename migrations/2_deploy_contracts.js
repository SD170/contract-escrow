const EscrowWithAgent = artifacts.require("EscrowWithAgent");

module.exports = function (deployer, network, accounts) {
  // this is where the contract is deployed: the constructor is called
  deployer.deploy(EscrowWithAgent, accounts[1], accounts[2], 20);
  // we can have a third variable, which contains all the accounts.
  
};
