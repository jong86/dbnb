pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Basic.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract PropertyRegistry {
  ERC721Basic property;
  ERC20 propertyToken;

  uint[] public allRegProps;

  mapping (uint => RegProp) public regProps;

  struct RegProp {
    uint price;
    address[] requested;
    mapping(address => Request) requests;
    mapping(address => bool) hasActiveRequest;
    mapping(address => bool) isApproved;
    address occupant;
  }

  struct Request {
    uint checkIn;
    uint checkOut;
  }

  constructor(address _property, address _propertyToken) public {
    property = ERC721Basic(_property);
    propertyToken = ERC20(_propertyToken);
  }


  // Events

  event Registered(uint indexed _tokenId, uint _price);
  event Requested(uint indexed _tokenId);
  event Approved(uint indexed _tokenId, address _address);
  event CheckIn(uint indexed _tokenId);
  event CheckOut(uint indexed _tokenId);


  // Modifiers

  modifier onlyOwner(uint _tokenId) {
    require(property.ownerOf(_tokenId) == msg.sender, "You must be the owner");
    _;
  }


  // Business functions

  function registerProperty(uint _tokenId, uint _price) external onlyOwner(_tokenId) {
    regProps[_tokenId] = RegProp(_price, new address[](0), address(0));
    allRegProps.push(_tokenId);
    emit Registered(_tokenId, _price);
  }

  function request(uint _tokenId, uint _checkIn, uint _checkOut) external {
    require(now <= _checkIn, "Check-in time must be in the future");
    require(_checkIn < _checkOut, "Check-out time must be after check-in time");
    regProps[_tokenId].requested.push(msg.sender);
    regProps[_tokenId].requests[msg.sender] = Request(_checkIn, _checkOut);
    emit Requested(_tokenId);
    regProps[_tokenId].hasActiveRequest[msg.sender] = true;
  }

  function approveRequest(uint _tokenId, address _address) external onlyOwner(_tokenId) {
    regProps[_tokenId].isApproved[_address] = true;
    emit Approved(_tokenId, _address);
  }

  function checkIn(uint _tokenId) external {
    require(regProps[_tokenId].isApproved[msg.sender], "You are not approved");
    require(regProps[_tokenId].requests[msg.sender].checkIn <= now, "It is not time to check-in yet");
    require(propertyToken.transferFrom(msg.sender, this, regProps[_tokenId].price), "Could not transfer funds");
    regProps[_tokenId].occupant = msg.sender;
  }

  function checkOut(uint _tokenId) external {
    require(regProps[_tokenId].occupant == msg.sender, "You are not the occupant");
    require(now <= regProps[_tokenId].requests[msg.sender].checkOut, "Time must be before or equal to agreed check-out time");
    require(propertyToken.transfer(property.ownerOf(_tokenId), regProps[_tokenId].price), "Could not transfer funds");
    regProps[_tokenId].occupant = address(0);
    regProps[_tokenId].isApproved[msg.sender] = false;
  }


  // External view functions

  function getRequest(uint _tokenId, address _address) external view onlyOwner(_tokenId) returns (uint, uint) {
    return (
      regProps[_tokenId].requests[_address].checkIn,
      regProps[_tokenId].requests[_address].checkOut
    );
  }

  function checkIfApproved(uint _tokenId) external view returns (bool) {
    return regProps[_tokenId].isApproved[msg.sender];
  }

  function checkIfAddressApproved(uint _tokenId, address _address) external view onlyOwner(_tokenId) returns (bool) {
    return regProps[_tokenId].isApproved[_address];
  }

  function getOccupant(uint _tokenId) external view onlyOwner(_tokenId) returns (address) {
    return regProps[_tokenId].occupant;
  }

  function getRegPropDataAsOwner(uint _tokenId) external view onlyOwner(_tokenId) returns(uint, address[], address) {
    return (regProps[_tokenId].price, regProps[_tokenId].requested, regProps[_tokenId].occupant);
  }

  function getRegPropDataAsCustomer(uint _tokenId) external view returns(uint, bool, bool, bool) {
    uint price = regProps[_tokenId].price;
    bool vacant;
    if (regProps[_tokenId].occupant != address(0)) {
      vacant = true;
    }
    bool hasActiveRequest = regProps[_tokenId].hasActiveRequest[msg.sender];
    bool isApproved = regProps[_tokenId].isApproved[msg.sender];
    return (price, vacant, hasActiveRequest, isApproved);
  }

  function getAllRegProps() external view returns(uint[]) {
    return allRegProps;
  }

  function haveIRequested(uint _tokenId) external view returns(bool) {
  }
}