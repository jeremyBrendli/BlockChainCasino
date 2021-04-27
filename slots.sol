pragma solidity ^0.4.18;
import "./Bank.sol";
contract slots {

  uint public winnings;
  //address player;
  bool public playing ;
  uint public turns;
  uint public chips;
  // they only get winning if the numbers are the same
//  Bank public Bankobj;
   function slots () public{
      //player = _player;
      winnings = 100;

      playing = false;

    }
    //function setWinnings(uint win) external {
      //  msg.sender.transfer(win);
      //}

    function getPlaying()public view returns (bool _playing){
        return(playing);
    }
    function getChips()public view returns (uint _chips){
        return(chips);
    }
    function getmoney() public payable {

    }

    function setTurns(uint _turns) public  view returns (uint numofTurns){
      if(_turns == 0){
        turns = 5;
        return turns;
      }
      else{
        turns = _turns;
        return turns;

      }


    }
    function Settingturns(uint times) public view returns (uint _times){
      if ( times == 0){
        _times = 5;
        return _times;
      }
      else {
        _times = times;
        return _times;
      }
    }
    function updateTurns( uint _turns )public view returns(uint _turn){

        if(_turns > 0){
          _turns = _turns - 1;
          return _turns;
        }
        else {
          return _turns;
        }
    }

    function setValues (uint _winnings,bool _playing,  uint _chips, uint _turns)public {
    //  player = _player;
      winnings = _winnings;
      chips = _chips;
      playing = _playing;
      turns = _turns;

    }


    function getValues()public view returns(uint _winnings, bool _playing, uint _chips ,uint _turns){

      return ( winnings, playing, chips, turns);
    }
}
