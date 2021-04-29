
var r = document.querySelector(':root'); //used to set a css variable
function getRandomInt(min, max) { //used to find a random number between 0 and 37 to decide the number the ball will land on
    var byteArray = new Uint8Array(1);
    window.crypto.getRandomValues(byteArray);
    var range = max - min + 1;
    var max_range = 256;
    if (byteArray[0] >= Math.floor(max_range / range) * range)
        return getRandomInt(min, max);
    return min + (byteArray[0] % range);

}
//the animation function that starts the animation for the ball
function ani(num){
    document.getElementById("play").disabled = true; //disables the play button to prevent multiple clicks durring a game
    var el = document.getElementById('S'); //finds the ball
    el.classList.remove("sphere"); //removes the sphere class to reset the animations
    void el.offsetWidth; //resets the animations so it can play
    num = ((num * 9.47))+ (364.735+1080); //sets where the ball is going to land and what degrees it will spin
    r.style.setProperty('--value', num); //sets the css variable
    el.classList.add("sphere"); //adds the sphere class which starts the animation
    setTimeout(enable,10000); //starts a timer til the animation is removed and the winnings are shown
  }

//enables the winings to be showed after the wheel spins and enables the play button
function enable(){
  document.getElementById("play").disabled = false;
  App.render()
}
// Starts the game loop
function STARTGAME(){
  var order = [6,21,33,16,4,23,35,14,2,0,28,9,26,30,11,7,20,32,17,5,22,34,15,3,24,36,13,1,00,27,10,25,29,12,8,19,31,18];
  var randomnum = getRandomInt(0,37);
  App.playgame(order[randomnum]);
}

App = {
  web3Provider: null,
  contracts: {},
  contracts1:{},
  account: 0x0,
  DOonce: true,
  init: function() {
    return App.initWeb3();
  },
//inializes web3 with the app provider depending on what we have metamask or ganache
  initWeb3: function() {

    if (typeof web3 !== 'undefined') {
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
// this file is just the roulette solidity code
  initContract: function() {
    //find the appropriate infromation for the smart contract like ab
    $.getJSON("Blockchaincasino.json", function(casino) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Blockchaincasino = TruffleContract(casino);
      // Connect provider to interact with contract
      App.contracts.Blockchaincasino.setProvider(App.web3Provider);
      return App.initContract1();//inializes the bank function
    });

  },
//inializes the second solidity file bank
//bank is used to receive and send all money in the system
  initContract1: function(){
    $.getJSON("Bank.json", function(bank) {
      // Instantiate a new truffle contract from the artifact
      App.contracts1.Bank = TruffleContract(bank);
      // Connect provider to interact with contract
      App.contracts1.Bank.setProvider(App.web3Provider);
      return App.render();

    });
  },

  //renders the appropriate data like account balance number chips winnings bets placed
  render: function() {
  web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
         web3.eth.getBalance(account,function(err,balance){
          if(err===null){
            $("#accountamount").html("Account Ballance: "+ web3.fromWei(balance,"ether")+ " ETH");
          }else{
            alert(err + " getBalance");
          }
        })
      }else{
        $("#accountAddress").html("Your Account: " + err);
        $("#accountamount").html("Account Ballance: error");

      }
    });
    //calls other functions that render the data
    App.getChips();
    App.getWinnings();
    App.getBetPlaced();

  },
//renders the bets placed on the screen
  getBetPlaced: function(){
    App.contracts.Blockchaincasino.deployed().then(function(instance){
try{
      instance.betsplaced().then(function(bets){
        $("#amountBet").html(bets+"  ");
      });
    }
    catch(err){
      alert(err + " betsplaced failed" )
    }
    });

},

//gives the player more chips if there are an appropriate balance in their accountamount
  Getmorechips: function(moreChips){
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        web3.eth.getBalance(account,function(err,balance){
          if(err===null){
            //if the chips are more than the account then we don't send a request
            if(web3.toWei((moreChips/100),"ether") <= balance){
                App.contracts1.Bank.deployed().then(function(bankinst){
                return  bankinst.Pay(moreChips,{from:App.account,value: web3.toWei((moreChips/100), 'ether')}).then(function(){
                  App.render();
                });
                //sends a request to put more chips in the account depening on what button is pressed.
                //this value sent is the amount of ether that a group of chips cost this is also the money that will be
                //part of the bank
                })
            }
            else{
              alert("Insufficent Funds");
              App.render();
            }
          }
        });
      }
    });
},
//places the bet depending on what button you pressed
//aslo checks to see if you have chips in your account if not no bets
  placeBet: function(bet,number){
    var betplaced = document.getElementById("amountBet");
    App.contracts.Blockchaincasino.deployed().then(function(instance) {
      App.contracts1.Bank.deployed().then(function(bankinst){

      return bankinst.chips().then(function(chip){

        instance.betsplaced().then(function(bets){

        if( (document.getElementById("one").checked) ){
        if( chip >= 1)
        {
          //sets the value of your bet
          //param1 amount bet; param2 type of bet single double; param 3 the array index that belongs to the button pressed
          instance.setbet(1,bet,number,{from:App.account}).then(function(){
            App.render();
          }); //sets the value of your bet
          }else{
            alert("not enough chips");
        }
        }else{
          if(chip >= 5){
            instance.setbet(5,bet,number,{from:App.account}).then(function(){
              App.render();
            });

          }else{
            alert("not enough chips");
          }
        }
    });

  });
  });

  });
},
//prints the amount of chips you have to the screen
getChips: function(){
  try{
  App.contracts1.Bank.deployed().then(function(instance){

      try{
      instance.chips().then(function(chip){
        $("#numchips").html("" + Number(chip));
    });
  }catch(err){
  alert(err + " chips");
  }
  });
}
catch(err){
  alert(err + "bank deployed");
}
},
//prints the amount of winnings to the screen
getWinnings: function(){
  App.contracts.Blockchaincasino.deployed().then(function(instance) {
      return instance.winnings().then(function(chip){
        $("#win").html("" + chip);
      });

    });

},
//runs the play game function in the solidity
//param1 the number that the ball will land on
  playgame: function(number){
    App.contracts.Blockchaincasino.deployed().then(function(instance) {
      //param1 the number the ball lands on;
    return instance.play(number,{from: App.account, gas: 3000000}).then(function(win){
      //calls the animation function once the player accepts the transaction
      ani(number);
    }).catch(function(err){
      alert(err + "Possible rejection");
    });
  })
  },
//pays the player their winnings
Payout: function(){
            App.contracts.Blockchaincasino.deployed().then(function(instance){
              //gets the winings that the player has
              return instance.winnings().then(function(wins){
                //clears the winnings so you can only cash out once for each winning
                //will only clear if the bank has enough money will revert otherwise
                instance.ClearWinnings({from:App.account}).then(function(){
                 if( wins != 0){
            App.contracts1.Bank.deployed().then(function(bnkinst){
              //calls withdraw function to send you your _money
              //sends the amount in wei so needs to be converted other wise we send .01 wei per winnings
              bnkinst.withdraw(web3.toWei((wins/100),'ether'),{from:App.account});

            })
}
else{
  alert("no Winnings")
}
            });

            });
});
}


};

$(window).load(function() {
  //inialies the app when the website opens
    App.init();


  });
