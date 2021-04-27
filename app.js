App = {
  web3Provider: null,
  contracts: {},
  contracts1:{},
  account: 0x0,
  turns: 0,

  init: function(){

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
      $.getJSON("slots.json", function(slots) {
        // Instantiate a new truffle contract from the artifact
        App.contracts.slots = TruffleContract(slots);
        // Connect provider to interact with contract
        App.contracts.slots.setProvider(App.web3Provider);

        return App.initContract1();
      });
    },
    initContract1: function() {
        $.getJSON("Bank.json", function(bank) {
          // Instantiate a new truffle contract from the artifact
          App.contracts1.bank = TruffleContract(bank);
          // Connect provider to interact with contract
          App.contracts1.bank.setProvider(App.web3Provider);

          return App.render();
        });
      },

    render: function() {
      var slots;
      // following code will retrive the main account.
      // call back function takes two arguments: error & account. It is asynchronous function.
      web3.eth.getCoinbase(function(err, account) {
        if (err === null) {
          App.account = account;
        //  alert(account)
          $("#account").html("Your Account: " + account);
        }
        web3.eth.getBalance(account,function(err, balance) {
          if (err === null) {
            $('#accountBalance').text(web3.fromWei(balance, "ether") + " ETH");
          }
        //else{
          //  alert(err);
        //  }
        });
      });

      App.contracts.slots.deployed().then(function(instance) {
          slots = instance;
          return slots.playing()
        }).then(function(playing) {
           $("#playing").html(" " + playing);
          //chips.empty();
          //if(turnsResults == 0){

          //}
        }).catch(function(error) {
          console.warn(error +" line 76");
        });
      },
    //  subtractChips: function(uint turns){

    //  },
    //  getTurns: function(uint turns){

      //},
      playing: function(){
        // checks if player is playing
        App.contracts.slots.deployed().then(function(instance) {
          return instance.getPlaying().then(function(playing){
            if(!playing){
              playing = true;
              //there error comes because of line 94 and 95, if you comment it out the error is gone
              //however for some reason the turns is always 0 which is impossible because of the if statement in the setTurns
              App.contracts1.bank.deployed().then(function(bkInstance){
                  bkInstance.AdjustChips({from: App.account, value: web3.toWei(1, 'ether')});
              })
              App.render();
              instance.setTurns(0,{from: App.account}).then(function(turns){
                alert(turns);
                App.turns = turns;
              });
            }else{
              alert("You are still playing");
            }
          }).catch (function(error){
            alert(error + " line 109");
          });
        })
      },

    /*  playing: function(){
        // checks if player is playing
        App.contracts.slots.deployed().then(function(instance) {
          return instance.getPlaying().then(function(playing){
            if(!playing){
              //instance.getChips().then(function(chips){
              //  $("#chips").html(chips);
              //})
              playing = true;
            //  alert("before instance setTurns");
             instance.setTurns(0, {from: App.account}).then(function(turns){
               $("#turns").html( " " + turns);
              //   App.turns = turns;
              //   alert("after app.turns");
              })
            }else{
              alert("You are still playing");
            }
          }).catch (function(error){
            alert(error + "playing");
          });
        })
      },*/
      turn: function(){
        // checks if player is playing
        App.contracts.slots.deployed().then(function(instance) {
        //  alert( App.turns);
        //var numOfTurns = App.turns;
          return instance.updateTurns(Number(App.turns), {from: App.account} ).then(function(turns){
              alert("Turns left: " + turns);
              App.turns = turns;
              App.render();
           return instance.setTurns( Number(App.turns), {from: App.account}).then(function(turns){
              // $("#turns").html( turns);
            })
          }).catch (function(error){
            alert(error + "turns ");
          });
        })
      },
      winnings: function(){
        // checks if player is playing
        App.contracts.slots.deployed().then(function(instance) {
          var x = document.getElementById("won").innerHTML;

          //alert(Number(x));
          try {
            App.contracts1.bank.deployed().then(function(bkInstance){
                bkInstance.Pay({from: App.account, value: web3.toWei(x, 'ether')});
            })
         }
         catch(error){
             alert(error);
         }
        })
      },
    /*  getChips: function(){
        try{
          App.contracts1.Bank.deployed().then(functon(bkInstance){
            try{
              bkInstance.chips().then(function(chip){
                $("Chips").html("" + Number(chip));
              });
            }catch(err){
              alert(err + " chipppp");
            }
          });
        }
        catch(err){
          alert(err + "cjoppsdf");
        }
      }*/
      getChips: function(){
        try{
          App.contracts1.bank.deployed().then(function(bkInstance){
            try{
              bkInstance.chips().then(function(chip){
                $("Chips").html(" " + Number(chips));
              });
            }catch(error){
              alert(error +"Chipppp");
            }
          });
        }catch(error){
          alter(error + "Chip");
        }
      }
    };

$(function() {
  $(window).load(function() {
    App.init();
  });
});
