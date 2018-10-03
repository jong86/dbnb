pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Basic.sol";

contract PropertyRegistry {
  ERC721Basic property;

  mapping (uint => RegisteredProperty) public registeredProperties;

  struct RegisteredProperty {
    uint price;
    address occupant;
    uint checkIn;
    uint checkOut;
    bool isApproved;
    bool isCheckedIn;
  }

  constructor(address _property) public {
    property = ERC721Basic(_property);
  }

  modifier onlyOwner(uint _tokenId) {
    require(property.ownerOf(_tokenId) == msg.sender, "You must be the owner");
    _;
  }

  function registerProperty(uint _tokenId, uint _price) external onlyOwner(_tokenId) {
    registeredProperties[_tokenId] = RegisteredProperty(_price, address(0), 0, 0, false, false);
  }

  function request(uint _tokenId, uint _checkIn, uint _checkOut) external {
    require(registeredProperties[_tokenId].occupant == address(0), "A request is already pending");
    registeredProperties[_tokenId].checkIn = _checkIn;
    registeredProperties[_tokenId].checkOut = _checkOut;
    registeredProperties[_tokenId].occupant = msg.sender;
  }

  function approveRequest(uint _tokenId) external onlyOwner(_tokenId) {
    registeredProperties[_tokenId].isApproved = true;
  }

  function checkIn(uint _tokenId) external {
    require(registeredProperties[_tokenId].occupant == msg.sender, "You are not the guest");
    require(registeredProperties[_tokenId].checkIn <= now, "It is not time to check-in yet");
    registeredProperties[_tokenId].isCheckedIn = true;
  }

  function checkOut(uint _tokenId) external {
    registeredProperties[_tokenId].occupant = address(0);
    registeredProperties[_tokenId].checkIn = 0;
    registeredProperties[_tokenId].checkOut = 0;
    registeredProperties[_tokenId].isApproved = false;
    registeredProperties[_tokenId].isCheckedIn = false;
  }
}