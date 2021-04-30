pragma solidity ^0.4.23;
contract Bank{
  uint public chips;


//accepts payment to increase the number of chips
function Pay(uint amount) payable public{
  chips += amount;
}
//sends the mesage sender their winnings or some amount of money
function withdraw(uint winnings) public{
  //require(winnings <= this.balance);
  msg.sender.transfer(winnings);
}
//returns the amount of chips
function getchips() public view returns (uint){
  return chips;
}
//adjusts the amount of chips that are in the account
function AdjustChips(uint money) public {
    chips = chips - money;
}

}
