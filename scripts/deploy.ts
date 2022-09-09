import { ethers } from "hardhat";

async function main() {
  const [owner] = await ethers.getSigners();
  console.log("Owner address:", owner.address);

  // Deploy DaoToken
  const EnglisterToken = await ethers.getContractFactory("DAOToken");
  const NAME = "Englister"
  const SYMBOL = "ENG"
  const INITIAL_SUPPLY = ethers.utils.parseEther("0");
  const token = await EnglisterToken.deploy(NAME, SYMBOL, INITIAL_SUPPLY);
  await token.deployed();
  console.log("Englister DAOToken deployed to", token.address);

  // Deploy Treasury
  const DAOTreasury = await ethers.getContractFactory("DAOTreasury");
  const treasury = await DAOTreasury.deploy();
  await treasury.deployed();
  console.log("DAOTreasury deployed to", treasury.address);

  //Deploy ContributionPoll
  const ContributionPoll = await ethers.getContractFactory("ContributionPoll");
  const poll = await ContributionPoll.deploy();
  await poll.deployed();
  console.log("ContributionPoll deployed to", poll.address);

  // Deploy TokenSupplySystem
  const TokenSupplySystem = await ethers.getContractFactory("TokenSupplySystem");
  const tokenSupplySystem = await TokenSupplySystem.deploy();
  await tokenSupplySystem.deployed();
  console.log("TokenSupplySystem deployed to", tokenSupplySystem.address);

  // 権限設定
  await token.setupBurnerRole(treasury.address);
  await token.setupMinterRole(poll.address);
  await token.setupMinterRole(tokenSupplySystem.address);

  await treasury.setDAOTokenAddress(token.address);

  await poll.setDaoTokenAddress(token.address);
  await poll.setPollAdminRole(owner.address);

  await tokenSupplySystem.setDAOTokenAddress(token.address);
  await tokenSupplySystem.setDAOTreasuryAddress(treasury.address);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
