function test(){
  window.alert("test");
}

App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function() {
    window.alert("0");
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional

    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);

    } else {
      // Specify default instance if no web3 instance provided

      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Blockchaincasino.json", function(casino) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Blockchaincasino = TruffleContract(casino);
      // Connect provider to interact with contract
      App.contracts.Blockchaincasino.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contractsBlockchaincasino.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.votedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Rfdeload when a new vote is recorded
        App.render();
      });
    });
  },

  render: function() {
    var casino;
  //  var loader = $("#loader");
  //  var content = $("#content");

  //  loader.show();
  //  content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        window.alert("yes");
        $("#accountAddress").html("Your Account: " + account);
      }else{
        $("#accountAddress").html("Your Account: " + err);
      }
    });

    // Load contract data
    App.contracts.Blockchaincasino.deployed().then(function(instance) {
      casino = instance;
      return casino.chips();
    }).then(function(chips) {
      var chips = $("#numchips");
      chips.empty();

      var candidatesSelect = $('#candidatesSelect');
      candidatesSelect.empty();
    });
/*
      for (var i = 1; i <= candidatesCount; i++) {
        casino.candidates(i).then(function(candidate) {
          var id = candidate[0];
          var name = candidate[1];
          var voteCount = candidate[2];

          // Render candidate Result
          var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
          candidatesResults.append(candidateTemplate);

          // Render candidate ballot option
          var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
          candidatesSelect.append(candidateOption);
        });
      }

      return casino.voters(App.account);

    }).then(function(hasVoted) {
      // Do not allow a user to vote
      if(hasVoted) {
        $('form').hide();
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
    */
  },
/*
  castVote: function() {
    var candidateId = $('#candidatesSelect').val();
    App.contracts.Blockchaincasino.deployed().then(function(instance) {
      return instance.vote(candidateId, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  }
};
*/
$(function() {
  $(window).load(function() {
    window.alert("no");
    App.init();
  });
});

/*
var contract;
var ints = 3;


$(document).ready(function()
{
  web3 = new Web3(web3.currentProvider);
  var address = "0x5eA4391E186481Fe4eEb0C43a99b8002735BD472";
  var abi = [
    {
      "payable": true,
      "stateMutability": "payable",
      "type": "fallback"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "MoreChips",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_money",
          "type": "uint256"
        },
        {
          "name": "bet",
          "type": "string"
        },
        {
          "name": "number",
          "type": "uint256"
        }
      ],
      "name": "setbet",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "bet",
          "type": "string"
        },
        {
          "name": "number",
          "type": "uint256"
        }
      ],
      "name": "getbet",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "a",
          "type": "uint256"
        }
      ],
      "name": "test",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "draw",
          "type": "uint256"
        }
      ],
      "name": "play",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  contract = new web3.eth.Contract(abi, address);

  contract.methods.getBalance().call().then(function(bal){
    $("#win").html(bal);

  })
});
*/
