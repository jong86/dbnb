pragma solidity ^0.4.24;

import "./HelloWorld.sol";

contract Property is HelloWorld {
    address public currentGuest;

    modifier onlyGuest() {
        require(msg.sender == currentGuest, "Only the invited guest can make this action");
        _;
    }
    
    function inviteGuest(address _guest) external onlyOwner returns (address) {
        currentGuest = _guest;
        return currentGuest;
    }

    function reserveRoom() external payable onlyGuest returns (bool) {
        if (msg.value == 1 ether) {
            return true;
        } else {
            revert("Incorrect value sent in message");
        }
    }
}