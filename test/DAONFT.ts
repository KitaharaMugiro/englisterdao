import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("DAONFT", function () {
    async function deployFixture() {
        const [owner, otherAccount, otherAccount2] = await ethers.getSigners();

        const DaoNft = await ethers.getContractFactory("DAONFT");
        const NAME = "EnglisterDAOMembership"
        const SYMBOL = "EDM"
        const BASE_URI = "https://raw.githubusercontent.com/KitaharaMugiro/englisterdao/main/contracts/metadata/daonft/"
        const nft = await DaoNft.deploy(NAME, SYMBOL, BASE_URI);

        return { nft, owner, otherAccount, otherAccount2 };
    }

    describe("Deployment", function () {
        it("初期発行枚数は0枚", async function () {
            const { nft } = await loadFixture(deployFixture);
            const expectedBalance = 0
            expect(await nft.totalSupply()).to.equal(expectedBalance);
        });

    });
});
