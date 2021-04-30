App = {
  web3Provider: null,
  contracts: {},
  contracts1:{},
  account: 0x0,
  turns: 0,
  Playerplaying :false,
  chips:0,
  turn2:0,

  init: function(){

    return App.initWeb3(); // calls the initWeb3
  },
  initWeb3: function() { // sets the web3 so we can do transactions
    if (typeof web3 !== 'undefined') {  // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(App.web3Provider);
    } else {  // use the local host if no meta mask
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract(); // calls the contract
  },

  initContract: function() {
      $.getJSON("slots.json", function(slots) { // calls the slots contract

        App.contracts.slots = TruffleContract(slots);  // Instantiate a new truffle contract from the artifact

        App.contracts.slots.setProvider(App.web3Provider);  // Connect provider to interact with contract

        return App.initContract1();
      });
    },
    initContract1: function() {
        $.getJSON("Bank.json", function(bank) {  // calls Bank contract
          App.contracts1.bank = TruffleContract(bank); // Instantiate a new truffle contract from the artifact

          App.contracts1.bank.setProvider(App.web3Provider);  // Connect provider to interact with contract
          return App.render(); // calls render function
        });
      },

    render: function() {
      var slots; // creates variable slots
      web3.eth.getCoinbase(function(err, account) { // gets the account from metamask
        if (err === null) {
          App.account = account; // sets the account
          $("#account").html("Your Account: " + account); // prints account number on the html
        }
        web3.eth.getBalance(account,function(err, balance) { // gets account balance
          if (err === null) {
            $('#accountBalance').text(web3.fromWei(balance, "ether") + " ETH"); // prints accoutn balance on the html
          }
        });
      });
      App.getChips(); // calls the chips function
      App.contracts.slots.deployed().then(function(instance) { // deploys the slots contract
          slots = instance; // saves it to slots
          return slots.playing() //  returns the playing variable
        }).then(function(playing) {
           $("#playing").html(" " + playing); // prints if you are playing

        }).catch(function(error) {
          console.warn(error +" line 76");
        });
      },
      playing: function(){ // is called when the player presses the get turns button
        App.contracts.slots.deployed().then(function(instance) { // deploys the contract
          return instance.Playing().then(function(playing){ // calls the playing function of the slots sol
            if(!playing && (Number(App.chip)) > 0){ // checks if the player has chips
                App.contracts1.bank.deployed().then(function(bkInstance){ //  deploys the bank contract
                   bkInstance.AdjustChips(1,{from: App.account }); //value: web3.toWei(1, 'ether')
                    App.getChips();//  calls the get getChips function
                    return bkInstance.getchips({from: App.account}).then(function(_chips){ // gall the getchip from the bank sol
                      App.chips = _chips // update
                      App.render();
                     })
                })
                App.Playerplaying = true; // updates the player
               return instance.setTurns(0,{from: App.account}).then(function(turns){ // calls the setTurns fucntion in the slots sol
                $("#turns").html(" " + Number(turns)); // prints the turns on the html
                App.turns = turns; //updates the app turns var
              });
            }else{
              alert("You are still playing or need to buy chips"); // the error if you didnt buy chips or you still have turns left
            }
          }).catch (function(error){
            alert(error + " line 109");
          });
          App.render(); // calls render to update values

        })
      },
      turn: function(){ // is called when the player press the play button, sets and updates the turns
        if ( App.Playerplaying ){ // checks if thw player is playing
          App.contracts.slots.deployed().then(function(instance) { // deploys the slots sol
          return instance.updateTurns(Number(App.turns), {from: App.account} ).then(function(turns){ // calls the update turns funtion in the slots sol and passes the turns
              App.turns = turns; // updates the app turn variable
              App.turn2 =Number(App.turns);
            //  alert(Number(App.turn2));
              App.render(); // calls the rerender function
           return instance.setTurns( Number(App.turns), {from: App.account}).then(function(turns){ // calls the setTurns function from the slots sol and passes teh turns
              if(App.turn2 != 0){
                $("#turns").html( Number(turns)); // prints the turns
              }
              else{
                App.Playerplaying = false; // sets player to false
                $("#turns").html( 0); // prints the turns
              }
            })
          }).catch (function(error){
            alert(error + "turns ");
          });
        })
      }
        else {
        alert("You need to buy turns"); // if you dont have turns
        }
      /*  alert(Number(App.turns))
        if(App.turns == 0){ // checks if you have turns
          App.Playerplaying == false; // sets player to false
          $("#turns").html( 0); // prints the turns
        }*/
      },
      winnings: function(){ // is called after the turns function after the images show, setss and gets the winnings
          if ( App.Playerplaying ){ // checks if you are playing
            App.contracts.slots.deployed().then(function(instance) { // deploy the slots contract
              var x = document.getElementById("won").innerHTML; // gets the winnings from the html
              try {
                App.contracts1.bank.deployed().then(function(bkInstance){ // deploys the bank contract
                    bkInstance.withdraw(web3.toWei((x/50), 'ether'),{from: App.account}).then(function(){
                      App.render();
                    }); // calls the withdraw function sends the winning to their acount
                })
             }
             catch(error){
                 alert(error);
             }
            })
          }
          else {
            alert("You need to buy turns"); // you need turns
          }
      },
    Getmorechips: function(moreChips){ // has the player buy more chips
    web3.eth.getCoinbase(function(err, account) {// get the address
      if (err === null) {
        App.account = account; // saves the account number
          web3.eth.getBalance(account,function(err,balance){ // gets the balance
          if(err===null){
            if((moreChips/100) <= balance){ // checks if the amount you are buying is less than your balance
              try{
                App.contracts.slots.deployed().then(function(instance){ // deploys the slots contract
                App.contracts1.bank.deployed().then(function(bankinst){ // deploys the bank contract
                  try{
                      return  bankinst.Pay(2,{from:App.account,value: web3.toWei( 1, 'ether')}).then(function(){
                        App.chip = moreChips; // chips get updated
                        App.render();
                      }); // calls te pay function from the bank sol.
                  }catch(err){
                    alert(err)
                  }
                });
              });
            }catch(err){
              alert(err);
            }
            }
            else{
              alert("Insufficent Funds"); // prints this is you dont have enough money
            }
          }
        });
      }
    });
},
      getChips: function(){ // gets the chips from the bank
        try{
          App.contracts1.bank.deployed().then(function(bkInstance){ // deploys the bank contract
            try{
              bkInstance.chips().then(function(chip){ // gets the chips from the bank sol
                App.chip = chip; // updates the chips
                $("#Chips").html(" " + Number(chip)); // prints the chips
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
