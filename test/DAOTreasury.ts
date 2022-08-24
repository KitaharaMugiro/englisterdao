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
        const INITIAL_SUPPLY = ethers.utils.parseEther("1000");
        const token = await EnglisterToken.deploy(NAME, SYMBOL, INITIAL_SUPPLY);

        // 権限設定
        await token.setupBurnerRole(treasury.address);
        await treasury.setDAOTokenAddress(token.address);

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
            await treasury.connect(otherAccount).deposit({ value: ethers.utils.parseEther("1.0") });

            // 単体テスト
            const expectedValue = ethers.utils.parseEther("1.0");
            expect(await treasury.getBalance()).to.equal(expectedValue);
        });
    });

    describe("getCurrentTokenRate", function () {
        it("初期のトークンレートは0", async function () {
            const { treasury, } = await loadFixture(deploy);
            const expectedValue = 0;
            expect(await treasury.getCurrentTokenRate()).to.equal(expectedValue);
        });

        it("1000トークンに対して1ETHがあるため、0.001がトークンレートになる", async function () {
            const { treasury, otherAccount } = await loadFixture(deploy);

            // トレジャリーへ送金
            await treasury.connect(otherAccount).deposit({ value: ethers.utils.parseEther("1.0") });

            // 1000トークンに対して1 etherがあるため、0.001がトークンレートになる
            const expectedValue = ethers.utils.parseEther("0.001");
            expect(await treasury.getCurrentTokenRate()).to.equal(expectedValue);
        });

        it("トークン総発行数が0の場合は0", async function () {
            const { treasury, token, owner } = await loadFixture(deploy);
            await treasury.withdraw(await token.balanceOf(owner.address));
            const expectedValue = 0;
            expect(await treasury.getCurrentTokenRate()).to.equal(expectedValue);
        });
    });

    describe("withdraw", function () {
        it("指定が0トークンの場合はエラーとなること", async function () {
            const { token, treasury, owner, otherAccount, otherAccount2 } = await loadFixture(deploy);
            await expect(treasury.connect(otherAccount).withdraw(0)).revertedWith("amount must be greater than 0");
        });


        it("DAOトークンが0のアカウントはエラーとなること", async function () {
            const { token, treasury, owner, otherAccount, otherAccount2 } = await loadFixture(deploy);
            await expect(treasury.connect(otherAccount).withdraw(1)).revertedWith("ERC20: burn amount exceeds balance");
        });


        it("DAOトークンが足りないアカウントはエラーとなること", async function () {
            const { token, treasury, owner, otherAccount, otherAccount2 } = await loadFixture(deploy);

            // DAOトークンをownerからテストアカウントへ送付
            await token.connect(owner).transfer(otherAccount.address, ethers.utils.parseEther("10"));
            await token.connect(owner).transfer(otherAccount2.address, ethers.utils.parseEther("20"));

            // 単体テスト
            await expect(treasury.connect(otherAccount).withdraw(ethers.utils.parseEther("11"))).revertedWith("ERC20: burn amount exceeds balance");
            await expect(treasury.connect(otherAccount2).withdraw(ethers.utils.parseEther("21"))).revertedWith("ERC20: burn amount exceeds balance");
        });


        it("DAOトークンの換金（残トークン数を確認）", async function () {
            const { token, treasury, owner, otherAccount, otherAccount2 } = await loadFixture(deploy);

            // トレジャリーへ送金
            await treasury.connect(otherAccount).deposit({ value: ethers.utils.parseEther("0.0000005") });
            await treasury.connect(otherAccount).deposit({ value: ethers.utils.parseEther("0.0000005") });

            // DAOトークンをownerからテストアカウントへ送付
            await token.connect(owner).transfer(otherAccount.address, ethers.utils.parseEther("30"));
            await token.connect(owner).transfer(otherAccount2.address, ethers.utils.parseEther("40"));

            // 30トークンを換金(otherAccount)
            let rtn1 = await treasury.connect(otherAccount).withdraw(ethers.utils.parseEther("30"));
            // トレジャリー残：970000000000 wei ( = 1000000000000 wei - (1000000000000 wei * 30 / 1000) )
            expect(await treasury.getBalance()).to.equal(970000000000);
            // DAOトークン総数：970 ( = 1000 - 30 )
            expect(await token.totalSupply()).to.equal(ethers.utils.parseEther("970"));

            // 20トークンを換金(otherAccount2)
            let rtn2 = await treasury.connect(otherAccount2).withdraw(ethers.utils.parseEther("20"));
            // トレジャリー残：950000000000 wei ( = 970000000000 wei - (970000000000 wei * 20 / 970) )
            expect(await treasury.getBalance()).to.equal(950000000000);
            // DAOトークン総数：950 ( = 970 - 20 )
            expect(await token.totalSupply()).to.equal(ethers.utils.parseEther("950"));

            // 単体テスト（残トークン数を確認）
            const expectedValue1 = 0;
            const expectedValue2 = ethers.utils.parseEther("20");
            expect(await token.balanceOf(otherAccount.address)).to.equal(expectedValue1);
            expect(await token.balanceOf(otherAccount2.address)).to.equal(expectedValue2);
        });
    });

    describe("destroy", function () {
        it("トレジャリーを破壊し、全てのETHを引き出すことができる", async function () {
            const { token, treasury, owner, otherAccount } = await loadFixture(deploy);

            await treasury.deposit({ value: ethers.utils.parseEther("1.0") });
            await treasury.connect(otherAccount).deposit({ value: ethers.utils.parseEther("1.0") });

            //ownerのETH残高を取得
            const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);
            expect(ownerBalanceBefore).to.gt(ethers.utils.parseEther("9998.0"));
            expect(ownerBalanceBefore).to.lt(ethers.utils.parseEther("9999.0"));

            //トレジャリーを破壊
            await treasury.destroy();

            //ownerのETH残高を取得
            const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);
            expect(ownerBalanceAfter).to.gt(ethers.utils.parseEther("10000.0"));
            expect(ownerBalanceAfter).to.lt(ethers.utils.parseEther("10001.0"));
        });

        it("トレジャリーを破壊すると預入等は出来なくなる", async function () {
            const { token, treasury, owner, otherAccount } = await loadFixture(deploy);

            //トレジャリーを破壊
            await treasury.destroy();

            //預入
            await expect(treasury.deposit({ value: ethers.utils.parseEther("1.0") })).revertedWith("Pausable: paused");
        });

    });
});