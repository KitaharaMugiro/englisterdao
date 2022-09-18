import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { DAONFT } from "../typechain-types/contracts/DAONFT";

describe("DAONFT", function () {
    async function deployFixture() {
        const [owner, otherAccount, otherAccount2] = await ethers.getSigners();

        const EnglisterToken = await ethers.getContractFactory("DAOToken");
        const token = await EnglisterToken.deploy("Englister", "ENG", ethers.utils.parseEther("100"));

        const DaoNft = await ethers.getContractFactory("DAONFT");
        const NAME = "EnglisterDAOMembership"
        const SYMBOL = "EDM"
        const BASE_URI = "https://raw.githubusercontent.com/KitaharaMugiro/englisterdao/main/contracts/metadata/daonft/"
        const nft = await DaoNft.deploy(NAME, SYMBOL) as DAONFT;

        const DaoNftCrowdSale = await ethers.getContractFactory("DAONFTCrowdSale");
        const nftCrowdSale = await DaoNftCrowdSale.deploy();
        await nftCrowdSale.setDAOTokenAddress(token.address);
        await nftCrowdSale.setDAONftAddress(nft.address);
        await nftCrowdSale.setPrice(ethers.utils.parseEther("10"));

        await nft.setupMinterRole(nftCrowdSale.address);
        await token.setupBurnerRole(nftCrowdSale.address);

        await nft.setBaseURI(BASE_URI);

        return { nft, nftCrowdSale, token, owner, otherAccount, otherAccount2 };
    }

    describe("Deployment", function () {
        it("初期発行枚数は0枚", async function () {
            const { nft } = await loadFixture(deployFixture);
            const expectedBalance = 0
            expect(await nft.totalSupply()).to.equal(expectedBalance);
        });
    });

    describe("DAO NFT", function () {
        it("Mintすることができる", async function () {
            const { nft, owner } = await loadFixture(deployFixture);
            await nft.safeMint(owner.address);
            const expectedBalance = 1
            expect(await nft.totalSupply()).to.equal(expectedBalance);
            expect(await nft.ownerOf(0)).to.equal(owner.address);
            expect(await nft.balanceOf(owner.address)).to.equal(expectedBalance);
            expect(await nft.tokenURI(0)).to.equal("https://raw.githubusercontent.com/KitaharaMugiro/englisterdao/main/contracts/metadata/daonft/0");
        });

        it("2回Mintすることができる", async function () {
            const { nft, owner } = await loadFixture(deployFixture);
            await nft.safeMint(owner.address);
            await nft.safeMint(owner.address);
            const expectedBalance = 2
            expect(await nft.totalSupply()).to.equal(expectedBalance);
            expect(await nft.ownerOf(1)).to.equal(owner.address);
            expect(await nft.balanceOf(owner.address)).to.equal(expectedBalance);
            expect(await nft.tokenURI(1)).to.equal("https://raw.githubusercontent.com/KitaharaMugiro/englisterdao/main/contracts/metadata/daonft/1");
        });
    });

    describe("DAO NFT Crowdsale", function () {
        it("ホワイトリストに追加することができる", async function () {
            const { nft, nftCrowdSale, owner, otherAccount } = await loadFixture(deployFixture);
            await nftCrowdSale.addWhitelist(otherAccount.address);
            expect(await nftCrowdSale.isWhitelisted(otherAccount.address)).to.equal(true);
        });

        it("ホワイトリストから削除することができる", async function () {
            const { nft, nftCrowdSale, owner, otherAccount } = await loadFixture(deployFixture);
            await nftCrowdSale.addWhitelist(otherAccount.address);
            await nftCrowdSale.removeWhitelist(otherAccount.address);
            expect(await nftCrowdSale.isWhitelisted(otherAccount.address)).to.equal(false);
        })

        it("ホワイトリストに追加されていないアドレスは購入できない", async function () {
            const { nft, nftCrowdSale, owner, otherAccount } = await loadFixture(deployFixture);
            await expect(nftCrowdSale.connect(otherAccount).buy()).to.be.revertedWith("You are not in the whitelist");
        })

        it("ホワイトリストに追加されているアドレスは購入できる", async function () {
            const { nft, nftCrowdSale, token, owner, otherAccount } = await loadFixture(deployFixture);
            await token.transfer(otherAccount.address, ethers.utils.parseEther("30"));
            await nftCrowdSale.addWhitelist(otherAccount.address);
            await nftCrowdSale.connect(otherAccount).buy();
            const expectedBalance = 1
            expect(await nft.totalSupply()).to.equal(expectedBalance);
            expect(await nft.ownerOf(0)).to.equal(otherAccount.address);
            expect(await nft.balanceOf(otherAccount.address)).to.equal(expectedBalance);
            expect(await nft.tokenURI(0)).to.equal("https://raw.githubusercontent.com/KitaharaMugiro/englisterdao/main/contracts/metadata/daonft/0");
        })

        it("ホワイトリストに追加されていてもDAOトークンを持っていなければ購入できない", async function () {
            const { nft, nftCrowdSale, token, owner, otherAccount } = await loadFixture(deployFixture);
            await nftCrowdSale.addWhitelist(otherAccount.address);
            await expect(nftCrowdSale.connect(otherAccount).buy()).to.be.revertedWith("You don't have enough dao tokens");
        })

        it("ホワイトリストに追加されていても2回は購入できない", async function () {
            const { nft, nftCrowdSale, token, owner, otherAccount } = await loadFixture(deployFixture);
            await nftCrowdSale.addWhitelist(otherAccount.address);
            await token.transfer(otherAccount.address, ethers.utils.parseEther("30"));
            await nftCrowdSale.addWhitelist(otherAccount.address);
            await nftCrowdSale.connect(otherAccount).buy();
            await expect(nftCrowdSale.connect(otherAccount).buy()).to.be.revertedWith("You are not in the whitelist");
        })
    });
});
