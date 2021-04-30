var Roulette = artifacts.require("./Blockchaincasino.sol");
var Slots = artifacts.require("./slots.sol");
var Bank = artifacts.require("./Bank.sol");
var BJ = artifacts.require("./Blackjack.sol");
var Bac = artifacts.require("./Baccarat.sol");
module.exports = function(deployer){
  deployer.deploy(Bank).then(function(){
    deployer.deploy(Bac,Bank.address);
    deployer.deploy(Slots, Bank.address);
    deployer.deploy(BJ,Bank.address);
    return deployer.deploy(Roulette,Bank.address);


  });


};
