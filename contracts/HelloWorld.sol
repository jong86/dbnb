pragma solidity ^0.4.24;
import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract HelloWorld is Ownable {
    // Log string
    event Hello(string _msg);

    uint creationDate;

    constructor() public {
        creationDate = now;
    }

    function hello(string _msg) external onlyOwner {
        emit Hello(_msg); // Note emit keyword
    }

    function transferOwnership(address _owner) public onlyOwner {
        super.transferOwnership(_owner);
    }

    function withdraw() external onlyOwner {
        msg.sender.transfer(address(this).balance);
    }
}