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
  contracts1:{},
  account: 0x0,
  DOonce: true,
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
    //find the appropriate infromation for the smart contract like ab
    $.getJSON("Blockchaincasino.json", function(casino) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Blockchaincasino = TruffleContract(casino);
      // Connect provider to interact with contract
      App.contracts.Blockchaincasino.setProvider(App.web3Provider);
      App.listenforEvents();
      return App.initContract1();
    });

  },
  initContract1: function(){
    $.getJSON("Bank.json", function(bank) {
      // Instantiate a new truffle contract from the artifact
      App.contracts1.Bank = TruffleContract(bank);
      // Connect provider to interact with contract

      App.contracts1.Bank.setProvider(App.web3Provider);


      App.listenerforEvents1();
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
            alert(err);
          }
        })
      }else{
        alert('broken');
        $("#accountAddress").html("Your Account: " + err);
        $("#accountamount").html("Account Ballance: error");

      }
    });
    App.getChips();
    App.getWinnings();
    App.getBetPlaced();

  },
  getBetPlaced: function(){
  //  alert('sss')

    App.contracts.Blockchaincasino.deployed().then(function(instance){
try{
      instance.betsplaced().then(function(bets){
        //alert(bets+ " bets");
        $("#amountBet").html(bets+"  ");
      });
    }
    catch(err){
      alert(err + " dd" )
    }
    });

  },
  test: function(){

try{
    App.contracts.Blockchaincasino.deployed().then(function(instance){

      instance.test({from:App.account}).then(function(bets){
        alert(bets + 'test');
      });

    });
}
catch(err){
  alert(err);
}

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
    listenerforEvents1: function(){
      App.contracts1.Bank.deployed().then(function(instance){

         instance.ReRender({},{

           toBlock: 'latest',
           fromBlock:0,
         }).watch(function(error, event)
         {
           if(!error){
             App.render();
           }else
           {
            App.render();
            alert(error);
           }
          });

         });

    },
    BetsPlaced:function(money,bet,number){
    //  alert("hello");
      App.contracts.Blockchaincasino.deployed().then(function(instance){

        instance.setbet(money,bet,number,{from:App.account});
          });
    },
  Getmorechips: function(moreChips){

    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {

        App.account = account;

        web3.eth.getBalance(account,function(err,balance){
          if(err===null){


            if((moreChips/100) <= balance){

                App.contracts1.Bank.deployed().then(function(bankinst){
                return  bankinst.Pay(moreChips,{from:App.account,value: web3.toWei((moreChips/100), 'ether')});
                alert('chips payed')

                //instance.MoreChips(moreChips,{from:App.account});
                })
            }
            else{
              alert("Insufficent Funds");
            }
          }
        });
      }
    });
},

  placeBet: function(bet,number){
    var betplaced = document.getElementById("amountBet");
    App.contracts.Blockchaincasino.deployed().then(function(instance) {
      App.contracts1.Bank.deployed().then(function(bankinst){

      return bankinst.chips().then(function(chip){

        instance.betsplaced().then(function(bets){

        if( (document.getElementById("one").checked) ){
        if( chip >= 1)
        {
          instance.setbet(1,bet,number,{from:App.account});
        //bankinst.AdjustChips(1,bet,number,{from:App.account});

        betplaced.innerHTML = (bets);
        }else{

        alert("not enough chips");
        }
        }else{
          if(chip >= 5){
            instance.setbet(5,bet,number,{from:App.account});
          //  bankint.AdjustChips(5,bet,number,{from:App.account});
            betplaced.innerHTML = (bets);

          }else{
            alert("not enough chips");
          }
        }
    });

  });
  });

  });
},
getChips: function(){
  try{
  App.contracts1.Bank.deployed().then(function(instance){

      try{
      instance.chips().then(function(chip){
        $("#numchips").html("" + Number(chip));

    });

  }catch(err){
  alert(err + " chipppp");
  }

  });

}
catch(err){
  alert(err + "cjoppsdf");
}
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
              return instance.winnings().then(function(wins){
                instance.ClearWinnings({from:App.account});
                alert(wins);
                 if( wins != 0){
try{
            App.contracts1.Bank.deployed().then(function(bnkinst){
              bnkinst.withdraw(web3.toWei((wins/100),'ether'),{from:App.account});
            })
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
}


};

$(window).load(function() {
    App.init();


  });
