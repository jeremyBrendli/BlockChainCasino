var r = document.querySelector(':root'); //used to set a css variable
function getRandomInt(min, max) { //used to find a random number between 0 and 37 to decide the winning number
    var byteArray = new Uint8Array(1);
    window.crypto.getRandomValues(byteArray);
    var range = max - min + 1;
    var max_range = 256;
    if (byteArray[0] >= Math.floor(max_range / range) * range)
        return getRandomInt(min, max);
    return min + (byteArray[0] % range);

}
function Test(){
  document.getElementById("win").innerHTML = document.getElementById("win").innerHTML + "hello";
}
//the animation function that starts the animation for the ball
function ani(){
    document.getElementById("play").disabled = true;
    setTimeout(enable,10000); //waits 10s before enabling the button and running the play game function in the App
    var el = document.getElementById('S'); //finds the ball
    el.classList.remove("sphere"); //removes the sphere class to reset the animations
    void el.offsetWidth; //resets the animations so it can play
    var num = getRandomInt(0,37);
    var spin = num;
    num = ((num * 9.47))+ (355.28+1080); //sets where the ball is going to land and what degrees it will spin
    r.style.setProperty('--value', num);
    el.classList.add("sphere");


  }
function enable(value){
  document.getElementById("play").disabled = false;
  App.playgame(value);
}
App = {
  web3Provider: null,
  contracts: {},
  account: 0x0,

  init: function() {
    return App.initWeb3();
  },

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

  initContract: function() {
    //find the appropriate infromation for the smart contract like abi
    $.getJSON("Blockchaincasino.json", function(casino) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Blockchaincasino = TruffleContract(casino);
      // Connect provider to interact with contract

      App.contracts.Blockchaincasino.setProvider(App.web3Provider);

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
          }
        })
      }else{

        $("#accountAddress").html("Your Account: " + err);
        $("#accountamount").html("Account Ballance: error");

      }
    });
    App.getChips();
    App.getWinnings();
    App.getBetPlaced();
  },
  getBetPlaced: function(){
    App.contracts.Blockchaincasino.deployed().then(function(instance){
      instance.betsplaced().then(function(bets){
        $("#amountBet").html(bets+"");
      });
    });

  },
  Getmorechips: function(moreChips){

    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {

        App.account = account;
        web3.eth.getBalance(account,function(err,balance){
          if(err===null){
            if(web3.fromWei( (moreChips/100),"ether") <= web3.fromWei(balance,"ether")){
              App.contracts.Blockchaincasino.deployed().then(function(instance){
                web3.eth.sendTransaction({from:App.account,to:"0x8a12E78859A2C22BA7C82Faf13cdd007aA13E544",value:web3.toWei( (moreChips/100),"ether")});
                instance.MoreChips(moreChips,{from: App.account});
                App.render();


              });

            }
            else{
              alert("Insufficent Funds");
            }
          }
        });
      }
    });

    App.render();
},

  placeBet: function(bet,number){
    var betplaced = document.getElementById("amountBet");
    App.contracts.Blockchaincasino.deployed().then(function(instance) {
      return instance.chips().then(function(chip){
        instance.betsplaced().then(function(bets){

        if( (document.getElementById("one").checked) ){
        if( chip >= 1)
        {
        instance.setbet(1,bet,number,{from: App.account});
        betplaced.innerHTML = (bets);
        App.render();
        }else{

        alert("not enough chips");
        }
        }else{
          if(chip >= 5){
            instance.setbet(5,bet,number,{from: App.account});
            betplaced.innerHTML = (bets);
            App.render();

          }else{
            alert("not enough chips");
          }
        }
    });
  });
  });
  App.render();
},
getChips: function(){
  App.contracts.Blockchaincasino.deployed().then(function(instance) {
      return instance.chips().then(function(chip){
        $("#numchips").html("" + chip);
      });

    });

},
getWinnings: function(){
  App.contracts.Blockchaincasino.deployed().then(function(instance) {
      return instance.winnings().then(function(chip){
        $("#win").html("" + chip);
      });

    });

},
  playgame: function(number){
    App.contracts.Blockchaincasino.deployed().then(function(instance) {
    return instance.play(number,{from: App.account, gas: 3000000}).then(function(win){
      instance.winnings().then(function(winnings){
        $("#win").html(winnings+"");
        $("#amountBet").html("0");
      })

    }).catch(function(err){
      alert(err);
    });
  })
  App.render();
  },
  getBet: function(){
    App.contracts.Blockchaincasino.deployed().then(function(instance) {
    return instance.getbet("single",5,{from: App.account, gas: 3000000}).then(function(win){
    }).catch(function(err){
      alert(err);
    });
  })
},
Payout: function(){
      web3.eth.getBalance("0x8a12E78859A2C22BA7C82Faf13cdd007aA13E544",function(err,balance){
       if(err === null){
            App.contracts.Blockchaincasino.deployed().then(function(instance){
              instance.winnings().then(function(winnings){
               if( web3.toWei(balance,"ether") >= web3.toWei( (winnings/100),"ether")){
                 if( winnings != 0){
                    web3.eth.sendTransaction({from:"0x8a12E78859A2C22BA7C82Faf13cdd007aA13E544",to:App.account,value:web3.toWei( (winnings/100),"ether")});
                    document.getElementById("win").innerHTML = 0;
                    instance.ClearWinnings({from: App.account});
                  }
                  else{
                    alert("no winnings");
                  }
            }
            else{
              alert("We have insufficent funds please call help desk");
            }

            });

          });
        }else{
          alert("error on our system");
        }
});
App.render();
}



};

$(window).load(function() {
    App.init();


  });
