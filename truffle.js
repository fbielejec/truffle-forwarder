'use strict';

module.exports = {
  networks: {
    ganache: {
      host: 'localhost',
      port: 8549,
      gas: 5000000,
      gasPrice: 5e9,
      network_id: '*'
    } 
  }
};
