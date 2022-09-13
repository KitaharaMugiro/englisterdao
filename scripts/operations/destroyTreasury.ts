import { ethers } from "hardhat";

async function main() {
    const [owner] = await ethers.getSigners();
    console.log("Owner address:", owner.address);

    const treasuryAddress = "0x80CF3dEdf0F03441bd47037Dfa8640eF9f35626a"

    // Deploy DaoToken
    const treasury = await ethers.getContractAt("DAOTreasury", treasuryAddress);
    console.log("ContributionPoll was deployed to", treasury.address);

    // 破壊 & MATICが返ってくることを確認
    await treasury.destroy()
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
