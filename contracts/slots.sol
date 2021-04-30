pragma solidity ^0.4.18;
import "./Bank.sol"; // attaches the bank sol
contract slots {

  uint public winnings; // the winning you get
  bool public playing ; // if the player is playing
  uint public turns; // number of turns
  uint public chips; // how many chips they bought
  // they only get winning if the numbers are the same
//  Bank public Bankobj;
   constructor (address bank) public{

      winnings = 0; // sets winning value

      playing = false; // sets the player to false right away

    }

    function getPlaying()public view returns (bool _playing){ // get if the player is playing
        return(playing);
    }
    function getChips()public view returns (uint _chips){ // gets the number of chips
        return(chips);
    }
    function setTurns(uint _turns) public view  returns (uint numofTurns){ // sets the turns
      if(_turns == 0){ // checks if the turns is 0
        turns = 5; // if so set it to 5
        return turns; // returns the turns
      }
      else{
        turns = _turns; // sets the turns
        return turns;// returns the turns
      }
    }
    function Playing()public view returns (bool _playing){ // returns if the player is playing
        return(playing);
    }
    function updateTurns( uint _turns )public view returns(uint _turn){// updates the turns
        if(_turns > 0){ // checks if the turns is greater than 0
          _turns = _turns - 1; //decrements the turns
          return _turns; // returns the new turns
        }
        else {
          return _turns;
        }
    }

    function setValues (uint _winnings,bool _playing,  uint _chips, uint _turns)public { // sets the values
    //  player = _player;
      winnings = _winnings; // sets winnings
      chips = _chips; // sets chips
      playing = _playing; // sets the playing var
      turns = _turns; // sets the turns var
    }
    function getValues()public view returns(uint _winnings, bool _playing, uint _chips ,uint _turns){
      return ( winnings, playing, chips, turns); // returns the values
    }
}
