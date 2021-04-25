
App = {
  web3Provider: null,
  contracts: {},
  account: 0x0,


  init: function(){

    return App.initWeb3();
  },

  initWeb3: function() {
    if(typeof web3 !== 'undefined') {
      //so we are going to reuse the provider of the Web3 object injected by Metamask
      App.web3Provider = web3.currentProvider;
      alert('metamsk');
      web3 = new Web3(App.web3Provider);
    } else {
      //we are going to create a new provider and plug it directly into our local node
      // this is the strategy recommended by Metamask to initialize web3.
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
      alert('not');
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
    //    App.listenforEvents();
        return App.render();

      });
    },

    render: function() {
      var slots;
      alert('render');
      // following code will retrive the main account.
      // call back function takes two arguments: error & account. It is asynchronous function.
      web3.eth.getCoinbase(function(err, account) {

        if (err === null) {
          App.account = account;
          alert(account);
          $("#account").html("Your Account: " + account);
        }


      web3.eth.getBalance(account,function(err, balance) {
        if (err === null) {

          $("#accountBalance").html("balance " + balance);
        }
        else{
          alert(err);
        }
            });

      });
      App.contracts.Slots.deployed().then(function(instance) {
          slots = instance;
          return slots.turnCount();
        }).then(function(turnCount) {
          var turnsResults = $("#turns");
          turnsResults.empty();
        }).catch(function(error) {
          console.warn(error);
        });
      }
    };

$(function() {
  $(window).load(function() {
    App.init();
  });
});
