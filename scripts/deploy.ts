import { ethers } from "hardhat";

async function main() {
  const [owner] = await ethers.getSigners();
  console.log("Owner address:", owner.address);

  // Deploy DaoToken
  const EnglisterToken = await ethers.getContractFactory("DAOToken");
  const NAME = "Englister"
  const SYMBOL = "ENG"
  const INITIAL_SUPPLY = 100;
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

  // 権限設定
  await token.setupBurnerRole(treasury.address);
  await token.setupMinterRole(poll.address);

  await treasury.setDAOTokenAddress(token.address);

  await poll.setDaoTokenAddress(token.address);
  await poll.setPollAdminRole(owner.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
