import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-gas-reporter";

require('dotenv').config();

// hardhat-gas-reporter
const COINMARKETCAP = process.env.COINMARKETCAP || ''
let PRIVATE_KEY = process.env.PRIVATE_KEY
if (PRIVATE_KEY?.length !== 66) {
  PRIVATE_KEY = '0x0000000000000000000000000000000000000000000000000000000000000000'
}
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
      accounts: [PRIVATE_KEY],
    },
    maticmum: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [PRIVATE_KEY]
    },
    polygon: {
      url: "https://polygon-rpc.com",
      accounts: [PRIVATE_KEY]
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
      polygonMumbai: process.env.POLIGONSCAN_API_TOKEN!,
      polygon: process.env.POLIGONSCAN_API_TOKEN!
    }
  }
};

export default config;
