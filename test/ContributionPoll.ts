import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { token } from "../typechain-types/@openzeppelin/contracts";

describe("ContributionPoll", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshopt in every test.
    async function deploy() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount, otherAccount2] = await ethers.getSigners();

        const ContributionPoll = await ethers.getContractFactory("ContributionPoll");
        const poll = await ContributionPoll.deploy();

        // Deploy Token
        const EnglisterToken = await ethers.getContractFactory("DAOToken");
        const NAME = "Englister"
        const SYMBOL = "ENG"
        const INITIAL_SUPPLY = ethers.utils.parseEther("100");
        const token = await EnglisterToken.deploy(NAME, SYMBOL, INITIAL_SUPPLY);

        // Deploy NFT
        const DaoNft = await ethers.getContractFactory("DAONFT");
        const nft = await DaoNft.deploy(NAME, SYMBOL);

        // 権限設定
        await poll.setPollAdminRole(owner.address);
        await token.setupMinterRole(poll.address);
        await poll.setDaoTokenAddress(token.address);
        await poll.setNftAddress(nft.address);

        //設定値
        await poll.setContributorAssignmentToken(ethers.utils.parseEther("5000"));
        await poll.setSupporterAssignmentToken(ethers.utils.parseEther("3000"));
        return { token, poll, nft, owner, otherAccount, otherAccount2 };
    }

    describe("Deployment", function () {
        it("poll Idの初期値は0", async function () {
            const { poll } = await loadFixture(deploy);
            expect(await poll.pollId()).to.equal(0);
        });
    });

    describe("settleCurrentPollAndCreateNewPoll", function () {
        it("Pollを終了すると、pollIdがインクリメントされる", async function () {
            const { poll } = await loadFixture(deploy);
            await poll.settleCurrentPollAndCreateNewPoll();
            expect(await poll.pollId()).to.equal(1);
        });
    });

    describe("Candidate", function () {
        it("最初は候補者は誰もいない", async function () {
            const { poll } = await loadFixture(deploy);
            const candidates = await poll.getCurrentCandidates();
            expect(candidates).to.lengthOf(0);
        });

        it("立候補すると候補者が追加される(1人)", async function () {
            const { poll } = await loadFixture(deploy);
            await poll.candidateToContributionPoll()
            const candidates = await poll.getCurrentCandidates();
            expect(candidates).to.lengthOf(1);
        });

        it("立候補すると候補者が追加される(2人)", async function () {
            const { poll, otherAccount } = await loadFixture(deploy);
            await poll.candidateToContributionPoll()
            await poll.connect(otherAccount).candidateToContributionPoll()
            const candidates = await poll.getCurrentCandidates();
            expect(candidates).to.lengthOf(2);
        });

        it("同じ人が立候補することはできない", async function () {
            const { poll } = await loadFixture(deploy);
            await poll.candidateToContributionPoll()
            await expect(poll.candidateToContributionPoll()).to.be.revertedWith("You are already candidate to the current poll.");
            const candidates = await poll.getCurrentCandidates();
            expect(candidates).to.lengthOf(1);
        });
    });

    describe("Vote", function () {
        it("候補者がいない状況で投票することはできない", async function () {
            const { poll, owner, token } = await loadFixture(deploy);

            await expect(poll.vote([owner.address], [1])).to.be.revertedWith("The candidate is not in the current poll.");
        });

        it("ゼロ投票はできない", async function () {
            const { poll, token } = await loadFixture(deploy);

            await expect(poll.vote([], [])).to.be.revertedWith("Candidates must not be empty.");
        });

        it("候補者がいれば投票をすることができる", async function () {
            const { poll, otherAccount, token } = await loadFixture(deploy);

            await poll.connect(otherAccount).candidateToContributionPoll()
            await expect(await poll.vote([otherAccount.address], [1])).to.be.not.revertedWith("The candidate is not in the current poll.");
        });

        it("2回投票することはできない", async function () {
            const { poll, otherAccount, token } = await loadFixture(deploy);

            await poll.connect(otherAccount).candidateToContributionPoll()

            await poll.vote([otherAccount.address], [1])
            await expect(poll.vote([otherAccount.address], [1])).to.be.revertedWith("You are already voted.");
        });

        it("投票で21ポイント以上をつけることはできない", async function () {
            const { poll, otherAccount, token } = await loadFixture(deploy);

            await poll.connect(otherAccount).candidateToContributionPoll()

            await expect(poll.vote([otherAccount.address], [21])).to.be.revertedWith("The points are not valid. (points < VOTE_MAX_POINT)");
        });

        it("投票者の数とポイントの数が一致している必要がある", async function () {
            const { poll, otherAccount, token } = await loadFixture(deploy);


            await poll.connect(otherAccount).candidateToContributionPoll()

            await expect(poll.vote([otherAccount.address], [1, 2])).to.be.revertedWith("The number of points is not valid.");
        });

        it("投票がされれば投票結果が保存される(1件)", async function () {
            const { poll, otherAccount, token } = await loadFixture(deploy);

            await poll.connect(otherAccount).candidateToContributionPoll()

            await poll.vote([otherAccount.address], [1])

            const votes = await poll.getCurrentVotes();
            expect(votes).to.lengthOf(1);

            const vote = votes[0];
            expect(vote.points[0]).to.equal(100);
        });

        it("投票がされれば投票結果が保存される(2件)", async function () {
            const { poll, otherAccount, otherAccount2, token } = await loadFixture(deploy);

            // ownerとotherAccount2がトークンを持つようにする
            await token.transfer(otherAccount2.address, 10);


            await poll.connect(otherAccount).candidateToContributionPoll()

            await poll.vote([otherAccount.address], [1])
            await poll.connect(otherAccount2).vote([otherAccount.address], [1])

            const votes = await poll.getCurrentVotes();
            expect(votes).to.lengthOf(2);


            expect(votes[0].points[0]).to.equal(100);
            expect(votes[1].points[0]).to.equal(100);
        });

        it("ポイントの合計は100になるように正規化される", async function () {
            const { poll, otherAccount, otherAccount2, token } = await loadFixture(deploy);


            await poll.connect(otherAccount).candidateToContributionPoll()
            await poll.connect(otherAccount2).candidateToContributionPoll()


            await poll.vote([otherAccount.address, otherAccount2.address], [2, 3])

            const votes = await poll.getCurrentVotes();
            expect(votes).to.lengthOf(1);

            expect(votes[0].points[0]).to.equal(40);
            expect(votes[0].points[1]).to.equal(60);
        });

        it("ポイントの合計は100になるように正規化される(割り切れない場合)", async function () {
            const { poll, otherAccount, otherAccount2, token } = await loadFixture(deploy);


            await poll.connect(otherAccount).candidateToContributionPoll()
            await poll.connect(otherAccount2).candidateToContributionPoll()


            await poll.vote([otherAccount.address, otherAccount2.address], [1, 2])

            const votes = await poll.getCurrentVotes();
            expect(votes).to.lengthOf(1);

            expect(votes[0].points[0]).to.equal(33);
            expect(votes[0].points[1]).to.equal(66);
        });

        it("自分自身への投票は0点となる", async function () {
            const { owner, poll, otherAccount, token } = await loadFixture(deploy);


            await poll.connect(otherAccount).candidateToContributionPoll()
            await poll.connect(owner).candidateToContributionPoll()


            await poll.vote([otherAccount.address, owner.address], [1, 2])

            const votes = await poll.getCurrentVotes();
            expect(votes).to.lengthOf(1);

            expect(votes[0].points[0]).to.equal(100);
            expect(votes[0].points[1]).to.equal(0);
        });

        it("投票の受付可否をownerが制御することができ、受付拒否している場合は投票できない", async function () {
            const { poll, otherAccount, token } = await loadFixture(deploy);


            await poll.connect(otherAccount).candidateToContributionPoll()
            await poll.setVotingEnabled(false);

            await expect(poll.vote([otherAccount.address], [1])).to.be.revertedWith("Voting is not enabled right now. Contact the admin to start voting.");
        });
    });

    describe("Settlement and Aggregate", function () {
        it("投票が実施されなかった場合は、誰にもトークンは送られない", async function () {
            const { poll, token, owner } = await loadFixture(deploy);

            await poll.settleCurrentPollAndCreateNewPoll();
            const balance = await token.balanceOf(owner.address);
            expect(balance).to.eq(ethers.utils.parseEther("100"));
        });

        it("投票が実施された場合、投票者と貢献者にトークンが送られる(1)", async function () {
            // パターン1: 
            // - 投票者が1人 (owner)
            // - 貢献者が1人 (otherAccount)
            const { token, owner, poll, otherAccount } = await loadFixture(deploy);

            await poll.connect(otherAccount).candidateToContributionPoll()
            await poll.vote([otherAccount.address], [5])

            await poll.settleCurrentPollAndCreateNewPoll();

            const balance = await token.balanceOf(owner.address);
            expect(balance).to.eq(ethers.utils.parseEther("3100"));
            const balance2 = await token.balanceOf(otherAccount.address);
            expect(balance2).to.eq(ethers.utils.parseEther("5000"));
        });

        it("投票が実施された場合、投票者と貢献者にトークンが送られる(2)", async function () {
            // パターン2: 
            // - 投票者が2人 (owner, otherAccount2)
            // - 貢献者が1人 (otherAccount)
            const { token, owner, poll, otherAccount, otherAccount2 } = await loadFixture(deploy);

            await token.transfer(otherAccount2.address, ethers.utils.parseEther("30"));
            await poll.connect(otherAccount).candidateToContributionPoll()
            await poll.vote([otherAccount.address], [5])
            await poll.connect(otherAccount2).vote([otherAccount.address], [10])


            await poll.settleCurrentPollAndCreateNewPoll();

            const balance = await token.balanceOf(owner.address);
            expect(balance).to.eq(ethers.utils.parseEther("1570"));
            const balance2 = await token.balanceOf(otherAccount2.address);
            expect(balance2).to.eq(ethers.utils.parseEther("1530"));
            const balance3 = await token.balanceOf(otherAccount.address);
            expect(balance3).to.eq(ethers.utils.parseEther("5000"));
        });

        it("投票が実施された場合、投票者と貢献者にトークンが送られる(3)", async function () {
            // パターン3: 
            // - 投票者が2人 (owner, otherAccount2)
            // - 貢献者が1人 (otherAccount)
            const { token, owner, poll, otherAccount, otherAccount2 } = await loadFixture(deploy);

            await poll.setSupporterAssignmentToken(ethers.utils.parseEther("5"));
            await token.transfer(otherAccount2.address, ethers.utils.parseEther("30"));
            await poll.connect(otherAccount).candidateToContributionPoll()
            await poll.vote([otherAccount.address], [5])
            await poll.connect(otherAccount2).vote([otherAccount.address], [10])


            await poll.settleCurrentPollAndCreateNewPoll();

            const balance = await token.balanceOf(owner.address);
            expect(balance).to.eq(ethers.utils.parseEther("72.5"));
            const balance2 = await token.balanceOf(otherAccount2.address);
            expect(balance2).to.eq(ethers.utils.parseEther("32.5"));
            const balance3 = await token.balanceOf(otherAccount.address);
            expect(balance3).to.eq(ethers.utils.parseEther("5000"));
        });

        it("投票が実施された場合、投票者と貢献者にトークンが送られる(4)", async function () {
            // パターン4: 
            // - 投票者が1人 (owner)
            // - 貢献者が2人 (otherAccount, otherAccount2)
            const { token, owner, poll, otherAccount, otherAccount2 } = await loadFixture(deploy);

            await poll.connect(otherAccount).candidateToContributionPoll()
            await poll.connect(otherAccount2).candidateToContributionPoll()
            await poll.vote([otherAccount.address, otherAccount2.address], [2, 3])

            await poll.settleCurrentPollAndCreateNewPoll();

            const balance = await token.balanceOf(owner.address);
            expect(balance).to.eq(ethers.utils.parseEther("3100"));
            const balance2 = await token.balanceOf(otherAccount.address);
            expect(balance2).to.eq(ethers.utils.parseEther("2000"));
            const balance3 = await token.balanceOf(otherAccount2.address);
            expect(balance3).to.eq(ethers.utils.parseEther("3000"));
        });

        it("投票が実施された場合、投票者と貢献者にトークンが送られる(5)", async function () {
            // パターン5: 
            // - 投票者が2人 (owner, otherAccount)
            // - 貢献者が2人 (otherAccount, otherAccount2)
            const { token, owner, poll, otherAccount, otherAccount2 } = await loadFixture(deploy);

            await token.transfer(otherAccount.address, ethers.utils.parseEther("30"));
            await poll.connect(otherAccount).candidateToContributionPoll()
            await poll.connect(otherAccount2).candidateToContributionPoll()
            await poll.vote([otherAccount.address, otherAccount2.address], [1, 1])
            await poll.connect(otherAccount).vote([otherAccount.address, otherAccount2.address], [0, 1])

            await poll.settleCurrentPollAndCreateNewPoll();

            const balance = await token.balanceOf(owner.address);
            expect(balance).to.eq(ethers.utils.parseEther("1570"));
            const balance2 = await token.balanceOf(otherAccount.address);
            expect(balance2).to.eq(ethers.utils.parseEther("2780"));
            const balance3 = await token.balanceOf(otherAccount2.address);
            expect(balance3).to.eq(ethers.utils.parseEther("3750"));
        });

        it("誰も投票しなかった場合(貢献者は存在する)", async function () {
            // - 投票者が0人
            // - 貢献者が2人 (otherAccount, otherAccount2)
            const { token, owner, poll, otherAccount, otherAccount2 } = await loadFixture(deploy);

            await token.transfer(otherAccount.address, ethers.utils.parseEther("40"));

            // 初期状態を確認
            const balanceOwner = await token.balanceOf(owner.address);
            expect(balanceOwner).to.eq(ethers.utils.parseEther("60"));
            const balanceAccount1 = await token.balanceOf(otherAccount.address);
            expect(balanceAccount1).to.eq(ethers.utils.parseEther("40"));
            const balanceAccount2 = await token.balanceOf(otherAccount2.address);
            expect(balanceAccount2).to.eq(0);

            // 貢献者が2人 (otherAccount, otherAccount2)
            await poll.connect(otherAccount).candidateToContributionPoll();
            await poll.connect(otherAccount2).candidateToContributionPoll();

            // 集計(誰も投票しなかった状態)
            await poll.settleCurrentPollAndCreateNewPoll();

            // 変わっていないことを確認
            const balance = await token.balanceOf(owner.address);
            expect(balance).to.eq(ethers.utils.parseEther("60"));
            const balance2 = await token.balanceOf(otherAccount.address);
            expect(balance2).to.eq(ethers.utils.parseEther("40"));
            const balance3 = await token.balanceOf(otherAccount2.address);
            expect(balance3).to.eq(0);
        });

        it("投票者が全員を投票しなかった場合", async function () {
            // - 投票者が2人 (owner, otherAccount)
            // - 貢献者が2人 (otherAccount, otherAccount2)
            const { token, owner, poll, otherAccount, otherAccount2 } = await loadFixture(deploy);

            await token.transfer(otherAccount.address, ethers.utils.parseEther("30"));

            // 初期状態を確認
            const balanceOwner = await token.balanceOf(owner.address);
            expect(balanceOwner).to.eq(ethers.utils.parseEther("70"));
            const balanceAccount1 = await token.balanceOf(otherAccount.address);
            expect(balanceAccount1).to.eq(ethers.utils.parseEther("30"));
            const balanceAccount2 = await token.balanceOf(otherAccount2.address);
            expect(balanceAccount2).to.eq(0);

            // 貢献者が2人
            await poll.connect(otherAccount).candidateToContributionPoll();
            await poll.connect(otherAccount2).candidateToContributionPoll();

            // 投票者が2人(別々に1人ずつ)
            await poll.vote([otherAccount.address], [10])
            await poll.connect(otherAccount).vote([otherAccount2.address], [8])

            // 集計
            await poll.settleCurrentPollAndCreateNewPoll();

            // 貢献者への報酬
            const assignmentTokenAccount = (10 * 100 / 10) * 5000 / 200;
            const assignmentTokenAccount2 = (8 * 100 / 8) * 5000 / 200;
            // 投票得点は、投票者がどの割合で候補者へ報酬を割り振りたいかなので、得点は異なるが報酬は同じになる
            // 投票者への報酬
            const voterAssignmentToken = 1500; // (3000 / 投票者2人)

            // 結果
            const balance = await token.balanceOf(owner.address);
            expect(balance).to.eq(ethers.utils.parseEther(String(70 + voterAssignmentToken)));
            const balance2 = await token.balanceOf(otherAccount.address);
            expect(balance2).to.eq(ethers.utils.parseEther(String(30 + voterAssignmentToken + assignmentTokenAccount)));
            const balance3 = await token.balanceOf(otherAccount2.address);
            expect(balance3).to.eq(ethers.utils.parseEther(String(assignmentTokenAccount2)));
        });

    });

    describe("投票の権利", function () {
        it("投票に必要なトークン量を持っていないと投票できない", async function () {
            const { owner, token, nft, poll, otherAccount, otherAccount2 } = await loadFixture(deploy);

            await poll.setRequiredTokenForVote(1);
            await poll.candidateToContributionPoll()

            // 投票権を持っているotherAccountとそうでないotherAccount2で投票を行う
            await nft.safeMint(otherAccount.address);

            await poll.connect(otherAccount).vote([owner.address], [1])
            await expect(poll.connect(otherAccount2).vote([owner.address], [1])).to.be.revertedWith("You are not eligible to vote.");
        });
    })
});
