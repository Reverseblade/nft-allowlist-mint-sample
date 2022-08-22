/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-toolbox");
require("hardhat-gas-reporter");
require('dotenv').config();

const COINMARKETCAP = process.env.COINMARKETCAP

module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      accounts: {
          count: 2000 
      },
        blockGasLimit: 500000000000 
    }
  },
  mocha: {
    timeout: 100000000
  },
  gasReporter: {
    enabled: true,
    currency: 'ETH',
    coinmarketcap: COINMARKETCAP,
    gasPrice: 50,
  },
};
