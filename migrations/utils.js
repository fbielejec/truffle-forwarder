const fs = require('fs');

const utils = {

  copy: (srcName, dstName, network, address) => {
    const srcPath = __dirname + '/../build/contracts/' + srcName + '.json';
    const dstPath = __dirname + '/../build/contracts/' + dstName + '.json';
    const data = require(srcPath);
    data.contractName = dstName;

    // Save address when given
    if (network && address) {
      data.networks = {};

      // Copy existing networks
      if (fs.existsSync(dstPath)) {
        const existing = require(dstPath);
        data.networks = existing.networks;
      }

      data.networks[network.toString()] = {
        address: address
      };
    }
    fs.writeFileSync(dstPath, JSON.stringify(data, null, 2), { flag: 'w' });
  },
  linkBytecode: (contract, placeholder, replacement) => {
    var placeholder = placeholder.replace('0x', '');
    var replacement = replacement.replace('0x', '');
    var bytecode = contract.bytecode.split(placeholder).join(replacement);
    contract.bytecode = bytecode;
  }
};

module.exports = utils;
