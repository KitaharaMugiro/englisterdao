import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-gas-reporter";

require('dotenv').config();

// hardhat-gas-reporter
const COINMARKETCAP = process.env.COINMARKETCAP || ''
const config: HardhatUserConfig = {
  solidity: "0.8.9",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      allowUnlimitedContractSize: true
    },
    localhost: {
      url: "http://localhost:8545",
      chainId: 31337,
      allowUnlimitedContractSize: true,
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [`${process.env.PRIVATE_KEY}`]
    },
    maticmum: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [`${process.env.PRIVATE_KEY}`]
    }
  },

  // hardhat-gas-reporter
  // https://github.com/cgewecke/hardhat-gas-reporter
  // try run: npm run test
  // gasReporter: {
  //   enabled: true,
  //   currency: 'ETH',
  //   gasPrice: 20,
  //   token: 'ETH',
  //   coinmarketcap: COINMARKETCAP,
  // },


  etherscan: {
    apiKey: {
      polygonMumbai: process.env.POLIGONSCAN_API_TOKEN!
    }
  }
};

export default config;
