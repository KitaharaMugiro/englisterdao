import { ethers } from "hardhat";

async function main() {
    const contributionPollAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"

    const [owner, otherAccount, otherAccount2] = await ethers.getSigners();
    console.log("Owner address:", owner.address);
    console.log("OtherAccount address:", otherAccount.address);

    //Get ContributionPoll
    const poll = await ethers.getContractAt("ContributionPoll", contributionPollAddress);
    console.log("ContributionPoll was deployed to", poll.address);

    // 立候補
    await poll.connect(otherAccount).candidateToContributionPoll();
    await poll.connect(otherAccount2).candidateToContributionPoll();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
