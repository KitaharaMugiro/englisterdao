import { ethers } from "hardhat";

async function main() {
    const [owner] = await ethers.getSigners();
    console.log("Owner address:", owner.address);

    const token = await ethers.getContractAt("DAOToken", "0x09b2a61a3492846116eb2f6D1Ba2d02EA6292c62");
    const treasury = await ethers.getContractAt("DAOTreasury", "0xeb818e6179C5e3A76764d25404F3C808E2422BeB");
    const poll = await ethers.getContractAt("ContributionPoll", "0x3e4268Bd9A4D5b9F66d80cAcA5E1D78c2AAeC118");
    const tokenSupplySystem = await ethers.getContractAt("TokenSupplySystem", "0xd4145D88B29A4d5f5E26712c918bA106F18C0A44");
    const nft = await ethers.getContractAt("DAONFT", "0xcEaE2618b70cacA636577994D75D72782358A99D");
    const nftCrowdSale = await ethers.getContractAt("DAONFTCrowdSale", "0xD0aB98BC1058789C0559FEDA0eD1eEC050B7fCEa");
    console.log("ContributionPoll was deployed to", treasury.address);
    const BASE_URI = "https://raw.githubusercontent.com/KitaharaMugiro/englisterdao/main/contracts/metadata/daonft/"


    // 権限設定

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
