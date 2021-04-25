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
     //waits 10s before enabling the button and running the play game function in the App
    var el = document.getElementById('S'); //finds the ball
    el.classList.remove("sphere"); //removes the sphere class to reset the animations
    void el.offsetWidth; //resets the animations so it can play
    var num = getRandomInt(0,37);
    var spin = num;
    var order = [6,21,33,16,4,23,35,14,2,0,28,9,26,30,11,7,20,32,17,5,22,34,15,3,24,36,13,1,00,27,10,25,29,12,8,19,31,18];
    num = ((num * 9.47))+ (364.735+1080); //sets where the ball is going to land and what degrees it will spin
    r.style.setProperty('--value', num);
    el.classList.add("sphere");
    setTimeout(enable,10000,order[spin]);

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
      App.listenforEvents();
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
  listenforEvents: function(){
    App.contracts.Blockchaincasino.deployed().then(function(instance){
      instance.ReRender({},{
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
          // Reload when a new vote is recorded
          App.render();
        });
      });
    },
  Getmorechips: function(moreChips){

    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {

        App.account = account;
        web3.eth.getBalance(account,function(err,balance){
          if(err===null){


            if((moreChips/100) <= balance){
              try{
              App.contracts.Blockchaincasino.deployed().then(function(instance){
                instance.MoreChips(moreChips,{from: App.account, value: web3.toWei((moreChips/100), 'ether')});
                App.render();
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
            App.contracts.Blockchaincasino.deployed().then(function(instance){
              instance.winnings().then(function(winnings){
                 if( winnings != 0){
try{
                instance.Payout(web3.toWei((winnings/100),'ether'),{from:App.account});
    }
catch(err)
  {
  alert(err);
  }
              }
              else{
                alert("no winnings");
                  }
            });
});
App.render();
}



};

$(window).load(function() {
    App.init();


  });
