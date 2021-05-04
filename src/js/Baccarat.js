function getRandomInt(min, max) { //used to find a random number between 0 and 37 to decide the winning number
    var byteArray = new Uint8Array(1);
    window.crypto.getRandomValues(byteArray);
    var range = max - min + 1;
    var max_range = 256;
    if (byteArray[0] >= Math.floor(max_range / range) * range)
        return getRandomInt(min, max);
    return min + (byteArray[0] % range);

}

App = {
  web3Provider: null,
  contracts: {},
  contracts1:{},
  account: 0x0,


  init: function() {
    return App.initWeb3();
  },

//inializes web3 with the app provider depending on what we have metamask or ganache
  initWeb3: function() {

    if(typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;

      web3 = new Web3(App.web3Provider);
    } else {
      // use the local host if no meta mask
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  //inializes the first contract of the blockchaincasion
  // this file is just the Baccarat solidity code
  initContract: function() {
    //find the appropriate infromation for the smart contract like ab
    $.getJSON('Baccarat.json', function(casino) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Baccarat = TruffleContract(casino);
      // set the provider for our contracts
      App.contracts.Baccarat.setProvider(App.web3Provider);

      return App.initContract1();  // this function need to define delow.
    });
  },

  //inializes the second solidity file bank
  //bank is used to receive and send all money in the system
  initContract1: function() {
    $.getJSON('Bank.json', function(bank) {
      // Instantiate a new truffle contract from the artifact
      App.contracts1.Bank = TruffleContract(bank);
      // set the provider for our contracts
      App.contracts1.Bank.setProvider(App.web3Provider);
      return App.render();
    });
  },

  //renders the appropriate data like account balance number chips winnings bets placed
  render: function() {
      web3.eth.getCoinbase(function(err, account) {
        if(err === null) {
          App.account = account;
          $('#accountAddress').html("Your Account: " + account);
          web3.eth.getBalance(account, function(err, balance) {
            if(err === null) {
              $('#accountBalance').text(web3.fromWei(balance, "ether") + " ETH");
            }
          })
        }
      });
      App.getChips();
      App.getWinnings();
    },

  //renders the bets placed on the screen
  getBetPlaced: function(){
    App.contracts.Baccarat.deployed().then(function(instance){
      try{
        instance.betsplaced().then(function(bets){
          $("#amountBet").html(bets+"  ");
        });
      }
      catch(err){
        alert(err + " dd" )
      }
    });

  },

    //gives the player more chips if there are an appropriate balance in their accountamount
   Getmorechips: function(){
     web3.eth.getCoinbase(function(err, account) {
       if (err === null) {
        App.account = account;
        web3.eth.getBalance(account,function(err,balance){
         if(err===null){
           //if the chips are more than the account then we don't send a request
           if((5/100) <= balance){
             try{
             App.contracts.Baccarat.deployed().then(function(instance){

               App.contracts1.Bank.deployed().then(function(bankinst){
                 try{
               return  bankinst.Pay(5,{from:App.account,value: web3.toWei((5/100), 'ether')}).then(function(){
                 App.render();
               });
               //sends a request to put more chips in the account depening on what button is pressed.
                //this value sent is the amount of ether that a group of chips cost this is also the money that will be
                //part of the bank

                }
                 catch(err){
                   alert(err)
                 }

               })
             });
           }
           catch(err){
             alert(err);
           }
           }
           else{
             alert("Insufficent Funds");
           }
         }
       });
     }
   });
},

// Withdraws all winnings to the bank
withdraw: function(){
  App.contracts.Baccarat.deployed().then(function(instance){
    instance.winnings().then(function(wins){
      instance.ClearWinnings({from: App.account}).then(function(clear){
      //  alert("Line 159");

        App.contracts1.Bank.deployed().then(function(bankinst){
          //alert("Line 161");
          bankinst.withdraw(web3.toWei((wins/100), "ether"),{from:App.account}).then(function(){
            App.render()
          })
        });
      })
    });
  })
},

//places the bet when you press the Place Bet button
placeBet: function(money){

  App.contracts1.Bank.deployed().then(function(bankinst){
    bankinst.chips().then(function(chips){
      if(chips != 0 ){



    App.contracts.Baccarat.deployed().then(function(instance) {
        // Sends 5 chips to be placed as a bet.
          instance.setBet(1,{from:App.account}).then(function(){
            App.render();
          })

});
}
else{
    alert("Insufficent chips");
}
})
})

},

//prints the amount of chips you have to the screen
getChips: function(){
  try{

  App.contracts1.Bank.deployed().then(function(instance){
      instance.chips().then(function(chip){

        $("#numChips").html("" + Number(chip));


    });
  });

}
catch(err){
  alert(err + "cjoppsdf");
}
},

//prints the amount of winnings to the screen
getWinnings: function(){
  App.contracts.Baccarat.deployed().then(function(instance) {
      return instance.winnings().then(function(chip){
        $("#win").html("" + chip);
      });

    });

},

//runs the play game function in the solidity
//The six parameters are used for drawing a random
//card from the deck for both the Player and the Banker
playgame: function(){
    var pdraw1 = getRandomInt(0, 12);
    var pdraw2 = getRandomInt(0, 12);
    var pdraw3 = getRandomInt(0, 12);
    var bdraw1 = getRandomInt(0, 12);
    var bdraw2 = getRandomInt(0, 12);
    var bdraw3 = getRandomInt(0, 12);
   App.contracts.Baccarat.deployed().then(function(instance) {

   return instance.play(pdraw1,pdraw2,pdraw3,bdraw1,bdraw2,bdraw3,{from: App.account, gas: 3000000}).then(function(win){
     instance.player().then(function(p1){
       $("#pHand").html("Player's Hand " + p1);

     })
     instance.banker().then(function(b1){
       $("#bHand").html("Banker's's Hand " + b1);

     })
     App.render();
   }).catch(function(err){
     alert(err + "Possible rejection");
   });
 })
 },



};



//$(function() {
  $(window).load(function() {
    App.init();
  });
//});
