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
        await treasury.setDAOTokenAddress(token.address);
        await token.setupBurnerRole(treasury.address);

        return { token, treasury, owner, otherAccount, otherAccount2 };
    }

    describe("getBalance", function () {
        it("初期のトレジャリーのETH保有量は「0 ether」である", async function () {
            const { token, treasury, owner, otherAccount, otherAccount2 } = await loadFixture(deploy);
            const expectedValue = 0;
            expect(await treasury.getBalance()).to.equal(expectedValue);
        });

        it("ETHを「1 ether」送金して送金後のトレジャリーのETH保有量を確認する", async function () {
            const { token, treasury, owner, otherAccount, otherAccount2 } = await loadFixture(deploy);

            // トレジャリーへ送金
            //console.log("otherAccount.getBalance = %s", await otherAccount.getBalance());
            await treasury.connect(otherAccount).deposit({ value: ethers.utils.parseEther("1.0") });
            //console.log("otherAccount.getBalance = %s", await otherAccount.getBalance());

            // 単体テスト
            const expectedValue = ethers.utils.parseEther("1.0");
            expect(await treasury.getBalance()).to.equal(expectedValue);
            //console.log("treasury.getBalance = %s", await treasury.getBalance());
        });

    });

    describe("requestForTokenToEth", function () {
        it("指定が0トークンの場合はエラーとなること", async function () {
            const { token, treasury, owner, otherAccount, otherAccount2 } = await loadFixture(deploy);
            await expect(treasury.connect(otherAccount).requestForTokenToEth(0)).revertedWith("Token(amount) must be at least 1");
        });
        it("DAOトークンが0のアカウントはエラーとなること", async function () {
            const { token, treasury, owner, otherAccount, otherAccount2 } = await loadFixture(deploy);
            await expect(treasury.connect(otherAccount).requestForTokenToEth(1)).revertedWith("Not enough tokens");
        });
        it("DAOトークンが足りないアカウントはエラーとなること", async function () {
            const { token, treasury, owner, otherAccount, otherAccount2 } = await loadFixture(deploy);

            // DAOトークンをownerからテストアカウントへ送付
            await token.connect(owner).batchTransfer(
                [otherAccount.address, otherAccount2.address],
                [10, 20]);

            // 単体テスト
            await expect(treasury.connect(otherAccount).requestForTokenToEth(11)).revertedWith("Not enough tokens");
            await expect(treasury.connect(otherAccount2).requestForTokenToEth(21)).revertedWith("Not enough tokens");
        });
        it("DAOトークンの換金（残トークン数を確認）", async function () {
            const { token, treasury, owner, otherAccount, otherAccount2 } = await loadFixture(deploy);

            // トレジャリーへ送金
            await treasury.connect(otherAccount).deposit({ value: ethers.utils.parseEther("0.0000005") });
            await treasury.connect(otherAccount).deposit({ value: ethers.utils.parseEther("0.0000005") });

            // DAOトークンをownerからテストアカウントへ送付
            await token.connect(owner).batchTransfer(
                [otherAccount.address, otherAccount2.address],
                [30, 40]);

            // 30トークンを換金(otherAccount)
            console.log("treasury.getBalance = %s", await treasury.getBalance());
            let rtn1 = await treasury.connect(otherAccount).requestForTokenToEth(30);
            console.log("treasury.getBalance = %s", await treasury.getBalance());
            // 20トークンを換金(otherAccount2)
            let rtn2 = await treasury.connect(otherAccount2).requestForTokenToEth(20);
            console.log("treasury.getBalance = %s", await treasury.getBalance());

            // 単体テスト（残トークン数を確認）
            const expectedValue1 = 0;
            const expectedValue2 = 20;
            expect(await token.balanceOf(otherAccount.address)).to.equal(expectedValue1);
            expect(await token.balanceOf(otherAccount2.address)).to.equal(expectedValue2);
        });
    });
});