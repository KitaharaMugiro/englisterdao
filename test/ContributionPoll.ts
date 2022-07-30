import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ContributionPoll", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshopt in every test.
    async function deploy() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();

        const ContributionPoll = await ethers.getContractFactory("ContributionPoll");
        const poll = await ContributionPoll.deploy();

        return { poll, owner, otherAccount };
    }

    async function deployToken() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount, otherAccount2] = await ethers.getSigners();

        const EnglisterToken = await ethers.getContractFactory("DAOToken");
        const NAME = "Englister"
        const SYMBOL = "ENG"
        const INITIAL_SUPPLY = 100;
        const token = await EnglisterToken.deploy(NAME, SYMBOL, INITIAL_SUPPLY);

        return { token, owner, otherAccount, otherAccount2 };
    }

    describe("Deployment", function () {
        it("poll Idの初期値は0", async function () {
            const { poll } = await loadFixture(deploy);
            expect(await poll.pollId()).to.equal(0);
        });
    });

    describe("SettleAndCreateNewPoll", function () {
        it("Pollを終了すると、pollIdがインクリメントされる", async function () {
            const { poll } = await loadFixture(deploy);
            poll.settleAndCreateNewPoll();
            expect(await poll.pollId()).to.equal(1);
        });
    });

    describe("Candidate", function () {
        it("最初は候補者は誰もいない", async function () {
            const { poll } = await loadFixture(deploy);
            const candidates = await poll.getCandidates();
            expect(candidates).to.lengthOf(0);
        });

        it("立候補すると候補者が追加される(1人)", async function () {
            const { poll } = await loadFixture(deploy);
            await poll.candidateToContributionPoll()
            const candidates = await poll.getCandidates();
            expect(candidates).to.lengthOf(1);
        });

        it("立候補すると候補者が追加される(2人)", async function () {
            const { poll, otherAccount } = await loadFixture(deploy);
            await poll.candidateToContributionPoll()
            await poll.connect(otherAccount).candidateToContributionPoll()
            const candidates = await poll.getCandidates();
            expect(candidates).to.lengthOf(2);
        });

        it("同じ人が立候補することはできない", async function () {
            const { poll } = await loadFixture(deploy);
            await poll.candidateToContributionPoll()
            await expect(poll.candidateToContributionPoll()).to.be.revertedWith("You are already candidate to the current poll.");
            const candidates = await poll.getCandidates();
            expect(candidates).to.lengthOf(1);
        });
    });

    describe("Vote", function () {
        it("候補者がいない状況で投票することはできない", async function () {
            const { poll, owner } = await loadFixture(deploy);
            const { token } = await deployToken();
            await poll.setDaoTokenAddress(token.address);
            await expect(poll.vote(owner.address)).to.be.revertedWith("The candidate is not in the current poll.");
        });

        it("候補者がいれば投票をすることができる", async function () {
            const { poll, otherAccount } = await loadFixture(deploy);
            const { token } = await deployToken();
            await poll.setDaoTokenAddress(token.address);
            await poll.connect(otherAccount).candidateToContributionPoll()
            await expect(await poll.vote(otherAccount.address)).to.be.not.revertedWith("The candidate is not in the current poll.");
        });

        it("2回投票することはできない", async function () {
            const { poll, otherAccount } = await loadFixture(deploy);
            const { token } = await deployToken();
            await poll.setDaoTokenAddress(token.address);
            await poll.connect(otherAccount).candidateToContributionPoll()

            await poll.vote(otherAccount.address)
            await expect(poll.vote(otherAccount.address)).to.be.revertedWith("You are already voted.");
        });

        it("DAOトークンのTOP10の保有者でなければ投票できない", async function () {
            const { poll, otherAccount, owner } = await loadFixture(deploy);
            const { token } = await deployToken();
            await poll.setDaoTokenAddress(token.address);
            await poll.connect(owner).candidateToContributionPoll()

            await expect(poll.connect(otherAccount).vote(owner.address)).to.be.revertedWith("You are not in the top 10 holder.");
        });
    });
});
