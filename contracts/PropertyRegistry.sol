pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Basic.sol";

contract PropertyRegistry {
  ERC721Basic property;

  mapping (uint256 => Data) public stayData;

  struct Data {
    uint256 price;
    uint256 stays;
    address occupant;
  }

  // Set up the property contract as minimum interface to prove ownership ERC721Basic
  constructor(address _property) public {
    property = ERC721Basic(_property);
  }

  modifier onlyOwner(uint256 _tokenId) {
    require(property.ownerOf(_tokenId) == msg.sender, "You must be the owner");
    _;
  }

  function registerProperty(uint256 _tokenId, uint256 _price) external onlyOwner(_tokenId) {
    stayData[_tokenId] = Data(_price, 0, address(0));
  }

  function request() external pure returns (uint) {
    return 5;
  }
}