import { ethers } from "hardhat";

async function main() {
    const [owner] = await ethers.getSigners();
    console.log("Owner address:", owner.address);

    const tokenAddress = "0x4966f4b22AA708905ddc7c040777647698f72FfE"
    const contributionPollAddress = "0x09b2a61a3492846116eb2f6D1Ba2d02EA6292c62"


    // Deploy DaoToken
    const poll = await ethers.getContractAt("ContributionPoll", contributionPollAddress);
    console.log("ContributionPoll was deployed to", poll.address);
    const token = await ethers.getContractAt("DAOToken", tokenAddress);


    // 権限設定
    await token.setupMinterRole(poll.address);

    await poll.setDaoTokenAddress(token.address);
    await poll.setPollAdminRole(owner.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
