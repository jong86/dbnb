pragma solidity ^0.4.24;

import "./HelloWorld.sol";

contract Property is HelloWorld {
    address public currentGuest;
    
    function inviteGuest(address _guest) external onlyOwner returns(address) {
        currentGuest = _guest;
        return currentGuest;
    }
}