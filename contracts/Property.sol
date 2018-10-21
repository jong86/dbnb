pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

contract Property is ERC721Token {
  constructor (string _name, string _symbol) public ERC721Token(_name, _symbol) {
  }

  event Created(uint _tokenId, string _uri);

  modifier onlyOwner(uint _tokenId) {
    require(tokenOwner[_tokenId] == msg.sender, "You must be the token owner");
    _;
  }

  function createProperty() external returns (bool) {
    _mint(msg.sender, allTokens.length + 1);
    return true;
  }

  function setURI(uint _tokenId, string _uri) external onlyOwner(_tokenId) {
    _setTokenURI(_tokenId, _uri);
  }

  function createWithURI(string _uri) external {
    uint _tokenId = allTokens.length + 1;
    _mint(msg.sender, _tokenId);
    _setTokenURI(_tokenId, _uri);
    emit Created(_tokenId, _uri);
  }


  // View functions

  function getURI(uint _tokenId) external view returns (string) {
    return tokenURIs[_tokenId];
  }

  function getProperties() external view returns (uint[]) {
    return ownedTokens[msg.sender];
  }
}