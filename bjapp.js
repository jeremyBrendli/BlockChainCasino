//Name of the file is changed since there can only be one "app.js". Revert back if there is an error.
//Arrays to hold the cards in a deck.
var suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
var values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
var deck = new Array();
var players = new Array();
var currentPlayer = 0;

//This create the deck and assigns the weighted values
function createDeck()
{
    deck = new Array();
    for (var i = 0 ; i < values.length; i++)
    {
        for(var x = 0; x < suits.length; x++)
        {
            var weight = parseInt(values[i]);
            if (values[i] == "J" || values[i] == "Q" || values[i] == "K")
                weight = 10;
            if (values[i] == "A")
                weight = 11;
            var card = { Value: values[i], Suit: suits[x], Weight: weight };
            deck.push(card);
        }
    }
}


//This create the players. First one is always player 1 and second is player 2
function createPlayers(num)
{
    players = new Array();
    for(var i = 1; i <= num; i++)
    {
        var hand = new Array();
        var player = { Name: 'Player ' + i, ID: i, Points: 0, Hand: hand };
        players.push(player);
    }
}

//UI implementation
function createPlayersUI()
{
    document.getElementById('players').innerHTML = '';
    for(var i = 0; i < players.length; i++)
    {
        var div_player = document.createElement('div');
        var div_playerid = document.createElement('div');
        var div_hand = document.createElement('div');
        var div_points = document.createElement('div');

        div_points.className = 'points';
        div_points.id = 'points_' + i;
        div_player.id = 'player_' + i;
        div_player.className = 'player';
        div_hand.id = 'hand_' + i;

        div_playerid.innerHTML = 'Player ' + players[i].ID;
        div_player.appendChild(div_playerid);
        div_player.appendChild(div_hand);
        div_player.appendChild(div_points);
        document.getElementById('players').appendChild(div_player);
    }
}
//Function to shuffle the cards
function shuffle()
{
    //Switches the values for two random cards for 1000 turns
    for (var i = 0; i < 1000; i++)
    {
      //Used math function to do the randomization
        var location1 = Math.floor((Math.random() * deck.length));
        var location2 = Math.floor((Math.random() * deck.length));
        var tmp = deck[location1];
        // This is to swap the locations of the cards
        deck[location1] = deck[location2];
        deck[location2] = tmp;
    }
}

//Function to start the game
function startblackjack()
{
    document.getElementById('btnStart').value = 'Restart';
    document.getElementById("status").style.display="none";

    currentPlayer = 0;
    createDeck();
    shuffle();
    //Creates two players and deals out the hands to the players
    createPlayers(2);
    createPlayersUI();
    dealHands();
    document.getElementById('player_' + currentPlayer).classList.add('active');
}

//Deals the cards to both players
function dealHands()
{
    //Cards are dealt by alternating between players, but will show up all at once
    for(var i = 0; i < 2; i++)
    {
        for (var x = 0; x < players.length; x++)
        {
            var card = deck.pop();
            players[x].Hand.push(card);
            renderCard(card, x);
            updatePoints();
        }
    }
    //Update the count on the left to show card amount
    updateDeck();
}

//Renders the UI of the cards
function renderCard(card, player)
{
    var hand = document.getElementById('hand_' + player);
    hand.appendChild(getCardUI(card));
}

//UI of the cards
function getCardUI(card)
{
    var el = document.createElement('div');
    var icon = '';
    if (card.Suit == 'Hearts')
    icon='&hearts;';
    else if (card.Suit == 'Spades')
    icon = '&spades;';
    else if (card.Suit == 'Diamonds')
    icon = '&diams;';
    else
    icon = '&clubs;';

    el.className = 'card';
    el.innerHTML = card.Value + '<br/>' + icon;
    return el;
}

// Shows how much each player has in points
function getPoints(player)
{
    var points = 0;
    for(var i = 0; i < players[player].Hand.length; i++)
    {
        points += players[player].Hand[i].Weight;
    }
    players[player].Points = points;
    return points;
}
//Updates the points when they get other cards
function updatePoints()
{
    for (var i = 0 ; i < players.length; i++)
    {
        getPoints(i);
        document.getElementById('points_' + i).innerHTML = players[i].Points;
    }
}

//Function to get another card
function hitMe()
{
    // Pop a card from the deck to the current player
    var card = deck.pop();
    players[currentPlayer].Hand.push(card);
    renderCard(card, currentPlayer);
    //Update the current player's points and checks if it is over 21
    updatePoints();
    updateDeck();
    check();
}

//Move on to next player
function stay()
{
    if (currentPlayer != players.length-1) {
        document.getElementById('player_' + currentPlayer).classList.remove('active');
        currentPlayer += 1;
        document.getElementById('player_' + currentPlayer).classList.add('active');
    }

    else {
        end();
    }
}
// Checks who won if both the player has less than 22 points
function end()
{
    var winner = -1;
    var score = 0;

    for(var i = 0; i < players.length; i++)
    {
        if (players[i].Points > score && players[i].Points < 22)
        {
            winner = i;
            if (i = 0){
              App.setWinnings(true);
            }
            else{
              App.setWinnings(false);
            }
        }

        score = players[i].Points;
    }

    //Displays the winner
    document.getElementById('status').innerHTML = 'Winner: Player ' + players[winner].ID;
    document.getElementById("status").style.display = "inline-block";
}

//Checks if the player has over 21 points
function check()
{
    if (players[currentPlayer].Points > 21)
    {
        document.getElementById('status').innerHTML = 'Player: ' + players[currentPlayer].ID + ' LOST';
        document.getElementById('status').style.display = "inline-block";
        end();
    }
    //If player 1 is over 21, they lose and player 2 wins
    if(players[0] .Points > 21){
      App.setWinnings(false);
    }
    if(players[1].Points > 21){
      App.setWinnings(true);
    }
}

//Updates the deck with the count
function updateDeck()
{
    document.getElementById('deckcount').innerHTML = deck.length;
}

window.addEventListener('load', function(){
    createDeck();
    shuffle();
    createPlayers(1);
});

//DApp part of the code
App = {
  web3Provider: null,
  contracts: {},
  contracts1:{},
  account: 0x0,

  //Gets called when the player presses the place bet button and deploys the contract
placeBet: function(){
    App.contracts.Blackjack.deployed().then(function(instance){
      //Calls the placedBet function
      try{instance.placedBet(1, {from: App.account});
      //The try catch and alert were used for debugging
    }catch(err){
      alert(err);
    }
    });
},

//Gets called when a winner is determined
setWinnings: function(won){
  //Deploys the smart contract
  App.contracts.Blackjack.deployed().then(function(instance){
    instance.setWinnings(won, {from: App.account});
  });
},

//Gets called the the player wants to get more chips
getChips: function(){
  try{
    web3.eth.getCoinbase(function(err, account) { //Gets the address
      if (err === null) {
        App.account = account; //Saves the account number
        web3.eth.getBalance(account,function(err,balance){
          if(err===null){
            //Checks if you have sufficient balance
            if(web3.toWei((5/100),"ether") <= balance){
                App.contracts1.bank.deployed().then(function(bankinst){
                return  bankinst.Pay(5,{from:App.account,value: web3.toWei((5/100), 'ether')}).then(function(){
                });

                })
            }
            else{
              alert("Insufficent Funds");
            }
          }
        });
      }
    });
  }catch(err){
    alert(err);
  }

},

//Gets called when the player presses the withdraw button to cash out
withdraw: function(){
  //Deploys the contract
  App.contracts.Blackjack.deployed().then(function(instance){
    //Shows the winnings
    instance.winnings().then(function(wins){
      //Clears the winnings
    instance.clearWinnings({from: App.account}).then(function(clear){
  App.contracts1.bank.deployed().then(function(bankinst){
  //return  bankinst.Pay(5,{from:App.account,value: web3.toWei((5/100), 'ether')}).then(function(){
  bankinst.withdraw(web3.toWei((wins/100), "ether"), {from: App.account})
  });
})
});
})
},



  init: function(){
// Calls initWeb3
    return App.initWeb3();
  },
  //Sets up the web3
  initWeb3: function() {
    // If already provided
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(App.web3Provider);
    } else {
      //Use localhost
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    //Calls the contract
    return App.initContract();
  },
  //Calls the blackjack contract
  initContract: function() {
      $.getJSON("Blackjack.json", function(blackjack) {
        //New truffle is made
        App.contracts.Blackjack = TruffleContract(blackjack);
        //Interacts with the contract
        App.contracts.Blackjack.setProvider(App.web3Provider);

        return App.initContract1();
      });
    },

    initContract1: function() {
      //Calls the bank contract
        $.getJSON("Bank.json", function(bank) {
          //New truffle contract
          App.contracts1.bank = TruffleContract(bank);
          App.contracts1.bank.setProvider(App.web3Provider);
          return App.render();
        });
      },

//
    render: function() {
      //Variable bj
      var bj;
      //Gets the account from MetaMask
      web3.eth.getCoinbase(function(err, account) {
        if (err === null) {
          App.account = account;
          //Prints account number on html
         $("#AccountNumber").html("Your Account: " + account);
        }
        //Gets the balance and prints it
        web3.eth.getBalance(account,function(err, balance) {
          if (err === null) {
            $('#Balance').text(web3.fromWei(balance, "ether") + " ETH"); // prints accoutn balance on the html
          }
        });
      });
      //Deploys the blackjack contract
        App.contracts.Blackjack.deployed().then(function(instance){
          instance.winnings().then(function(wins){
            //Prints the winning amount
            $('#Winnings').text(" Winnings: " + wins);
          })
        });

        //Deploys the blackjack contract
        App.contracts.Blackjack.deployed().then(function(instance){
          //Prints the chip amount
          instance.getChips().then(function(chip){
            $('#Chips').text(" Chips: " + chip);
        })
      });
      },

      //Start function to start the game, calls the other functions to create and deal the deck
      start: function(){
        App.contracts.Blackjack.deployed().then(function(instance){
          document.getElementById('btnStart').value = 'Restart';
          document.getElementById("status").style.display="none";
          currentPlayer = 0;
          createDeck();
          shuffle();
          createPlayers(2);
          createPlayersUI();
          dealHands();
          document.getElementById('player_' + currentPlayer).classList.add('active');
        })
      }

    };
    $(window).load(function() {
  //inialies the app when the website opens
    App.init();


  });
