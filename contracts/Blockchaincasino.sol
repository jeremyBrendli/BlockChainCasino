pragma solidity ^0.4.18;

contract Blockchaincasino {
  string PIE;

  function Welcome() public {
    PIE = "Hello this will give you PIE";
  }
  function setPI(string _PIE) public {
    PIE = _PIE;
  }
  function getPI() public view returns (string) {
    return PIE;
  }
}
