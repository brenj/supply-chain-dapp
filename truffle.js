var HDWalletProvider = require('truffle-hdwallet-provider');

var mnemonic = 'avocado pig blur fence sister meat pull ticket say doctor nation gorilla';

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: "*"
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/v3/03be52a746334006bebef2d1c4bb6f87')
      },
      network_id: 4,
      gas: 4500000,
      gasPrice: 10000000000,
    }
  }
};
