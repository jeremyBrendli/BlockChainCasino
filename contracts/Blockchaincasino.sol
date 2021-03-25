pragma solidity ^0.4.18;

contract Blockchaincasino {
  int chips;
  int Passbet;
  int dice;
  string PIE;
  int pointnum = 0;
  bool firstthrow;
  string loose;
  string win;
  function Blockchaincasino() public {
    loose = "loose";
    win = "win";
    firstthrow = true;
  }
  function setPassBet(int _bet) public
  {
    if(chips >= _bet){
      Passbet = _bet;
    }
    Passbet = 0;
  }
  function getPassBet() public view returns(int){
    return Passbet;
  }
  //starts a game of craps
  function startcraps() public view returns (int)
{
    int d1 = rollDice();
    int d2 = rollDice();
    int DiceTot = d1 + d2;

  if(firstthrow)
  {
    if ( DiceTot == 7 || DiceTot == 11)
    {
      firstthrow = true;
      pointnum = 0;
      return 1;
    }else if(!firstthrow && DiceTot == 7)
    {
      firstthrow = true;
      pointnum = 0;
      return 0;
    }
    else if(DiceTot == 2 || DiceTot == 3 || DiceTot == 12)
    {
      firstthrow = false;
      pointnum = 0;
      return 0;
    }
    else
    {
      firstthrow = false;
      pointnum = DiceTot;
      return 7;
    }
  }
  else
  {
      if(DiceTot == 7)
      {
        firstthrow = true;
        pointnum = 0;
        return 0;
      }
      else if(DiceTot == pointnum)
      {
        firstthrow = true;
        pointnum = 0;
        return 1;

      }else
      {
        firstthrow = false;
        return 8;
      }
  }

}
  function test() public view returns(bool){
    if(firstthrow){
      firstthrow = false;
      return true;
    }
    else{
      firstthrow = true;
      return false;
    }
  }
  function play() public view returns (int)
  {
    // 0 = loose; 1= win; 2 = re-roll
    int point = startcraps();
    if(point == 1){
      chips += getPassBet() * 2;
      return 6;
    }else if(point == 2){
      return 1;
      //startcraps();
    }
  }

  function rollDice() public view returns (int)
  {
    int randomHash = int(keccak256(block.difficulty, now));
    if(randomHash % 7 == 0){
      return 1;
    }else{

      return (randomHash % 7);
    }
  }
}
