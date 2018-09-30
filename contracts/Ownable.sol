pragma solidity ^0.4.24;

contract Ownable {
  // Track the owner
  address internal owner;

  constructor() public {
    owner = msg.sender; // Deployer of contract
  }

  modifier onlyOwner {
    require(msg.sender == owner, "You must be the contract owner");
    _;
  }

  function transferOwnership(address _owner) external onlyOwner returns(address) {
    owner = _owner;
    return owner;
  }
}