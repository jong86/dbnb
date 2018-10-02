pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Basic.sol";

contract PropertyRegistry {
  ERC721Basic property;

  mapping (uint => Stay) public stays;

  struct Stay {
    uint price;
    address occupant;
    uint checkIn;
    uint checkOut;
    bool isApproved;
    bool isCheckedIn;
  }

  // Set up the property contract as minimum interface to prove ownership ERC721Basic
  constructor(address _property) public {
    property = ERC721Basic(_property);
  }

  modifier onlyOwner(uint _tokenId) {
    require(property.ownerOf(_tokenId) == msg.sender, "You must be the owner");
    _;
  }

  function registerProperty(uint _tokenId, uint _price) external onlyOwner(_tokenId) {
    stays[_tokenId] = Stay(_price, address(0), 0, 0, false, false);
  }


  function request(uint _tokenId, uint _checkIn, uint _checkOut) external {
    stays[_tokenId].checkIn = _checkIn;
    stays[_tokenId].checkOut = _checkOut;
    stays[_tokenId].occupant = msg.sender;
  }

  function approveRequest(uint _tokenId) external onlyOwner(_tokenId) {
    stays[_tokenId].isApproved = true;
  }

  function checkIn(uint _tokenId) external {
    stays[_tokenId].isCheckedIn = true;
  }

  function checkOut(uint _tokenId) external {
    stays[_tokenId].checkIn = 0;
    stays[_tokenId].checkOut = 0;
    stays[_tokenId].occupant = address(0);
    stays[_tokenId].isApproved = false;
    stays[_tokenId].isCheckedIn = false;
  }
}