var Roulette = artifacts.require("./Blockchaincasino.sol");
var Bank = artifacts.require("./Bank.sol");
module.exports = function(deployer){
  deployer.deploy(Bank).then(function(){
    return deployer.deploy(Roulette,Bank.address);

  });


};
