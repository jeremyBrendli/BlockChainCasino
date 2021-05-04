pragma solidity ^0.4.22;

import "./Bank.sol";
contract Baccarat is Bank{
  uint public winnings; // Player's total winnings
  uint public betsplaced;// Player's placed bet.
  uint public player;// Player's total score from the cards
  uint public banker;// Player's total score from the cards
  uint draw;// Draws card from deck
  uint index; //Index used for array holding the cards
  uint[13] deck = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0, 0, 0]; // Deck of cards

  // Bank object for calling bank functions and variables
  Bank public Bankobj;

  //accepts the address to the bank smart contract
  constructor (address bankaddress) public{
    //initializes the bank object
    Bankobj = Bank(bankaddress);
  }

  // ClearWinnings function clears player's winnings
  // once the player withdraws their total winnings
  // to the bank.
  function ClearWinnings() public{
    winnings = 0;
  }

  // setBet function sets the bet for the Player.
  // The function calls for Bank.sol to exchange money for chips.
  function setBet(uint _money) public returns (uint){
    Bankobj.AdjustChips(_money);
    betsplaced += _money;
  }

  // getBet function returns double the player's bets
  function getBet() public returns(uint){
    return betsplaced * 2;
  }

  // Play function plays the game Baccarat between the Player and the Banker
  // parameters pdraw 1, 2, and 3 take in three random numbers for the index of the deck for the Player.
  // parameters bdraw 1, 2, and 3 take in three random numbers for the index of the deck for the Banker.
  function play(uint pdraw1, uint pdraw2, uint pdraw3,
    uint bdraw1, uint bdraw2, uint bdraw3) public returns(uint){
    uint flag = 0; // Flag is used if there is a tie between the Player and the Banker.
    player = 0; // Player's total score
    banker= 0; //Banker's total score
    //Banker draws two cards
		index = bdraw1;
		draw = deck[index];
		banker += draw;
    index = bdraw2;
		draw = deck[index];
		banker += draw;
    // If Banker score is 10 or above
    // then the score will be the second digit of the two digit Number
    // Ex: If the score of the cards is 11, the score is then 1.
		if(banker>=10)
			banker = banker%10;

    //Player draws two cards
		index = pdraw1;
		draw = deck[index];
		player += draw;
    index = pdraw2;
		draw = deck[index];
		player += draw;
    // If Player score is 10 or above
    // then the score will be the second digit of the two digit Number
    // Ex: If the score of the cards is 11, the score is then 1.
		if(player>=10)
			player = player%10;
		if(player >= 8||banker >= 8){//if either of them has a score more than 7 then both stand
			if(player >= 8)//the one with a greater score wins
				winnings += getBet();

			player = 9;
			banker = 9;//this is the value set so that other conditions are not executed and the last statement is reached straightaway
			flag = 1;//this flag doesn't prints the winner again
		}
		else if(player == 6||player == 7){//if player's score is 6 or 7
			if(banker <= 5){//and if banker's score is less than 6
				index = bdraw3;//he deals a third card
				draw = deck[index];
				banker += draw;

				if(banker >= 10)
					banker = banker%10;
		}
    //if player's score is less than 6
    //then player will draw a third card
    else if(player <= 5){
			index = pdraw3;
			draw = deck[index];
			player += draw;
			if(player >= 10)
				player = player%10;

      //if banker's score is less than 6
      //then banker will draw a third card
			if(banker <=2){
				index = bdraw3;
				draw = deck[index];
				banker += draw;
				if(banker >= 10)
					banker = banker%10;
			}
			else if(banker == 3 && player != 8){
				index = bdraw3;
				draw = deck[index];
				banker += draw;
				if(banker >= 10)
					banker = banker%10;
			}
			else if(banker == 4 && player >= 2 && player <= 7){
				index = bdraw3;
				draw = deck[index];
				banker += draw;
				if(banker >= 10)
					banker = banker%10;
			}
			else if(banker == 5 && player >= 4 && player <= 7){
				index = bdraw3;
				draw = deck[index];
				banker += draw;
				if(banker >= 10)
					banker = banker%10;
			}
			else if(banker == 6 && player >= 6 && player <= 7){
				index = bdraw3;
				draw = deck[index];
				banker += draw;
				if(banker >= 10)
					banker = banker%10;
			}
		}

    //if the winner was not announced before and player is more than banker
    //then player's bet gets added to their winnings
    if(player>banker && flag == 0){
			winnings += getBet();//bet is added to the player's amount
		}
        betsplaced = 0;


  }
}
}
