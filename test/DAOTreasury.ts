import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("DAOTreasury", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshopt in every test.
    async function deploy() {

        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount, otherAccount2] = await ethers.getSigners();

        // Deploy Treasury
        const DAOTreasury = await ethers.getContractFactory("DAOTreasury");
        const treasury = await DAOTreasury.deploy();

        // Deploy Token
        const EnglisterToken = await ethers.getContractFactory("DAOToken");
        const NAME = "Englister"
        const SYMBOL = "ENG"
        const INITIAL_SUPPLY = 1000;
        const token = await EnglisterToken.deploy(NAME, SYMBOL, INITIAL_SUPPLY);

        // 権限設定
        await treasury.setDAOTokenContractAddress(token.address);
        await token.setupMinterRole(treasury.address);
        await token.setupBurnerRole(treasury.address);

        return { token, treasury, owner, otherAccount, otherAccount2 };
    }

    describe("getBalance", function () {
        it("初期のETH保有量は「0 ether」である", async function () {
            const { token, treasury, owner, otherAccount, otherAccount2 } = await loadFixture(deploy);
            const expectedValue = 0;
            expect(await treasury.getBalance()).to.equal(expectedValue);
        });
        /*
        it("ETHを送金して送金後のETH保有量を確認する", async function () {
            const { token, treasury, owner, otherAccount, otherAccount2 } = await loadFixture(deploy);

            console.log("otherAccount.getBalance = %s", await otherAccount.getBalance());
            await otherAccount.sendTransaction({ to: treasury.address, value: 1 });

            const expectedValue = 1;
            expect(await treasury.getBalance()).to.equal(expectedValue);
        });
        */
    });
});