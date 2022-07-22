import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-gas-reporter";

require('dotenv').config();

// hardhat-gas-reporter
const COINMARKETCAP = process.env.COINMARKETCAP || ''

const config: HardhatUserConfig = {
  solidity: "0.8.9",

  // hardhat-gas-reporter
  // https://github.com/cgewecke/hardhat-gas-reporter
  // try run: npm run test
  gasReporter: {
    enabled: true,
    currency: 'ETH',
    gasPrice: 20,
    token: 'ETH',
    coinmarketcap: COINMARKETCAP,
  },

  networks: {
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,      
      accounts: [`${process.env.PRIVATE_KEY}`]
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_TOKEN
  },
};

export default config;
