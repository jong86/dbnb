pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Basic.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract PropertyRegistry {
  ERC721Basic property;
  ERC20 propertyToken;

  mapping (uint => Stay) public stays;

  struct Stay {
    uint price;
    address guest;
    uint checkIn;
    uint checkOut;
    bool isApproved;
    bool isCheckedIn;
  }

  struct Request {
    uint256 checkIn;
    uint256 checkOut;
  }

  constructor(address _property, address _propertyToken) public {
    property = ERC721Basic(_property);
    propertyToken = ERC20(_propertyToken);
  }

  modifier onlyOwner(uint _tokenId) {
    require(property.ownerOf(_tokenId) == msg.sender, "You must be the owner");
    _;
  }

  function registerProperty(uint _tokenId, uint _price) external onlyOwner(_tokenId) {
    stays[_tokenId] = Stay(_price, address(0), 0, 0, false, false);
  }

  function request(uint _tokenId, uint _checkIn, uint _checkOut) external {
    require(stays[_tokenId].guest == address(0), "A request is already pending");
    require(now < _checkIn, "Check-in time must be in the future");
    require(_checkIn < _checkOut, "Check-out time must be after check-in time");
    stays[_tokenId].checkIn = _checkIn;
    stays[_tokenId].checkOut = _checkOut;
    stays[_tokenId].guest = msg.sender;
  }

  function approveRequest(uint _tokenId) external onlyOwner(_tokenId) {
    stays[_tokenId].isApproved = true;
  }

  function checkIn(uint _tokenId) external {
    require(stays[_tokenId].guest == msg.sender, "You are not the guest");
    require(stays[_tokenId].isApproved == true, "You are not approved to stay here");
    require(stays[_tokenId].checkIn <= now, "It is not time to check-in yet");
    require(propertyToken.transferFrom(msg.sender, this, stays[_tokenId].price));
    stays[_tokenId].isCheckedIn = true;
  }

  function checkOut(uint _tokenId) external {
    require(stays[_tokenId].guest == msg.sender, "You are not the guest");
    require(now <= stays[_tokenId].checkOut, "Time must be before or equal to agreed check-out time");
    require(propertyToken.transfer(property.ownerOf(_tokenId), stays[_tokenId].price), "Could not transfer funds");
    stays[_tokenId].guest = address(0);
    stays[_tokenId].checkIn = 0;
    stays[_tokenId].checkOut = 0;
    stays[_tokenId].isApproved = false;
    stays[_tokenId].isCheckedIn = false;
  }
}