pragma solidity ^0.4.23;
contract Bank{
  uint public chips;
  uint public tsting = 0;
event ReRender(uint money);

function Pay(uint amount) payable public{
  emit ReRender(3);
  chips += amount;
}

function withdraw(uint winnings) public{
  require(winnings <= this.balance);
  msg.sender.transfer(winnings);
  emit ReRender(1);
}
function getchips() public view returns (uint){
  return chips;
}
function Test() public returns (uint){
  return chips;
}
function AdjustChips(uint money/*,string bet,uint number*/) public {
    chips = chips - money;

    emit ReRender(money);
}

}
