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

  // Deploy DaoNft and CrowdSale
  const DaoNft = await ethers.getContractFactory("DAONFT");
  const NFT_NAME = "EnglisterDAOMembership"
  const NFT_SYMBOL = "EDM"
  const BASE_URI = "https://raw.githubusercontent.com/KitaharaMugiro/englisterdao/main/contracts/metadata/daonft/"
  const nft = await DaoNft.deploy(NFT_NAME, NFT_SYMBOL);
  await nft.deployed();
  console.log("DAONFT deployed to", nft.address);

  const DaoNftCrowdSale = await ethers.getContractFactory("DAONFTCrowdSale");
  const nftCrowdSale = await DaoNftCrowdSale.deploy();
  await nftCrowdSale.deployed();
  console.log("DAONFTCrowdSale deployed to", nftCrowdSale.address);


  // 権限設定
  console.log("token permission setting");
  await token.setupBurnerRole(treasury.address);
  console.log("token permission setting done");
  await token.setupMinterRole(poll.address);
  console.log("token permission setting done");
  await token.setupMinterRole(tokenSupplySystem.address);
  console.log("token permission setting done");
  await token.setupBurnerRole(nftCrowdSale.address);
  console.log("token permission setting done");
  await token.setupBurnerRole(tokenSupplySystem.address);
  console.log("token permission setting done");

  console.log("treasury permission setting");
  await treasury.setDAOTokenAddress(token.address);
  console.log("treasury permission setting done");

  console.log("poll permission setting");
  await poll.setDaoTokenAddress(token.address);
  console.log("poll permission setting done");
  await poll.setPollAdminRole(owner.address);
  console.log("poll permission setting done");
  await poll.setNftAddress(nft.address);
  console.log("poll permission setting done");
  await poll.setRequiredTokenForVote(1);
  console.log("poll permission setting done");

  console.log("tokenSupplySystem permission setting");
  await tokenSupplySystem.setDAOTokenAddress(token.address);
  console.log("tokenSupplySystem permission setting done");
  await tokenSupplySystem.setDAOTreasuryAddress(treasury.address);
  console.log("tokenSupplySystem permission setting done");

  console.log("nftCorwdSale permission setting");
  await nftCrowdSale.setDAOTokenAddress(token.address);
  console.log("nftCorwdSale permission setting done");
  await nftCrowdSale.setDAONftAddress(nft.address);
  console.log("nftCorwdSale permission setting done");

  console.log("nft permission setting");
  await nft.setupMinterRole(nftCrowdSale.address);
  console.log("nft permission setting done");

  console.log("nft price setting")
  await nftCrowdSale.setPrice(ethers.utils.parseEther("500"));
  console.log("nft price setting done")

  console.log("set BaseUri")
  await nft.setBaseURI(BASE_URI)
  console.log("set BaseUri done")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
