pragma solidity ^0.4.24;

//import "./proxy/MutableForwarder.sol"; // Keep it included despite not being used (for compiler)
 
contract TestContract {
  //address public target; // Keep it here, because this contract is deployed as MutableForwarder

  uint public value;
  bool public wasConstructed;

  /**
   * @dev Constructor for this contract.
   * Native constructor is not used, because we use a forwarder pointing to single instance of this contract,
   * therefore constructor must be called explicitly.
   */
  function construct(uint _value)
    external
  {
    value = _value; 
    wasConstructed = true;  
  }
 
}
