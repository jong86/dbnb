pragma solidity ^0.4.24;

import "./HelloWorld.sol";

contract Property is HelloWorld {
    address currentGuest;
    
    function inviteGuest(address _guest) external view onlyOwner returns(address) {
        return _guest;
    }
}