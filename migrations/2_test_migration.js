const {copy, linkBytecode} = require ("./utils.js");
const fs = require('fs');

const TestContract = artifacts.require("TestContract");

// copy artifact for placeholder replacements
copy ("MutableForwarder", "TestContractForwarder");
const TestContractForwarder = artifacts.require("TestContractForwarder");

const forwarderTargetPlaceholder = "beefbeefbeefbeefbeefbeefbeefbeefbeefbeef";

module.exports = function(deployer, network, accounts) {

  deployer.then (() => {
    console.log ("@@@ using Web3 version:", web3.version.api);
  });

  const address = accounts [0];
  const gas = 4612388;
  const opts = {gas: gas, from: address};

  // link bytecode
  deployer.deploy (TestContract, opts).then ((instance) => {
    linkBytecode(TestContractForwarder, forwarderTargetPlaceholder, instance.address);
  });

  // check
  deployer.deploy(TestContractForwarder, opts)
    .then ( (instance) => {
      return instance.target ();
    }).then ( (res) => {
      console.log ("@@@ TestContractForwarder target:",  res);
    });

  // call TestContract/construct via forwarder
  deployer.then (function () {
    return [TestContract.deployed (),
            TestContractForwarder.deployed ()]
  }).then ( (promises) => {
    return Promise.all(promises);
  }).then ((
    [testContract,
     testContractForwarder]) => {
       var payload = testContract.contract.construct.getData(1);
       return web3.eth.sendTransaction({
         from: address,
         to: testContractForwarder.address,
         data: payload,
         gas: gas
       });
     }).then ((tx) => {
       console.log ("@@@ TestContract/construct tx", tx, "successful");
     });

  // check
  deployer.then (() => {
    return TestContract.deployed ();
  }).then ((instance) => {
    return [instance.value (),
            instance.wasConstructed ()];
  }).then ((promises) => {
    return Promise.all (promises);
  }).then ( ([res1, res2]) => {
    console.log ("--- TestContract/value :", res1.c [0]);
    console.log ("--- TestContract/wasConstructed :", res2);
  });

  deployer.then (function () {
    console.log ("Done");
  });

}
