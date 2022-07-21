import { ethers } from "hardhat";

async function main() {
  const EnglisterToken = await ethers.getContractFactory("DAOToken");
  const NAME = "Englister"
  const SYMBOL = "ENG"
  const INITIAL_SUPPLY = 100;
  const token = await EnglisterToken.deploy(NAME, SYMBOL, INITIAL_SUPPLY);
  await token.deployed();
  console.log("Englister DAOToken deployed to", token.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
