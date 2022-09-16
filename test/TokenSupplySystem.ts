import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("TokenSupplySystem", function () {
    async function deployFixture() {
        const [owner, otherAccount, otherAccount2] = await ethers.getSigners();

        const EnglisterToken = await ethers.getContractFactory("DAOToken");
        const NAME = "Englister"
        const SYMBOL = "ENG"
        const INITIAL_SUPPLY = ethers.utils.parseEther("0");
        const token = await EnglisterToken.deploy(NAME, SYMBOL, INITIAL_SUPPLY);

        // Deploy Treasury
        const DAOTreasury = await ethers.getContractFactory("DAOTreasury");
        const treasury = await DAOTreasury.deploy();
        await treasury.deposit({ value: ethers.utils.parseEther("1000") });

        const TokenSupplySystem = await ethers.getContractFactory("TokenSupplySystem");
        const tokenSupplySystem = await TokenSupplySystem.deploy();

        await tokenSupplySystem.setDAOTokenAddress(token.address);
        await tokenSupplySystem.setDAOTreasuryAddress(treasury.address);
        await token.setupMinterRole(tokenSupplySystem.address);
        await token.setupBurnerRole(tokenSupplySystem.address)
        await token.setupBurnerRole(treasury.address)
        await treasury.setDAOTokenAddress(token.address);

        return { token, tokenSupplySystem, owner, otherAccount, otherAccount2 };
    }

    describe("deploy", function () {
        it("最初はDAOトークンを保有していない", async function () {
            const { tokenSupplySystem } = await loadFixture(deployFixture);
            const expectedBalance = ethers.utils.parseEther("0");
            expect(await tokenSupplySystem.unclaimedBalance()).to.equal(expectedBalance);
        });
    });

    describe("mint", function () {
        it("ownerはDAOトークンを発行して、コントラクトにトークンを保持することができる", async function () {
            const { tokenSupplySystem } = await loadFixture(deployFixture);
            const expectedBalance = ethers.utils.parseEther("10");
            await tokenSupplySystem.mint(expectedBalance);
            expect(await tokenSupplySystem.unclaimedBalance()).to.equal(expectedBalance);
        });
    });

    describe("burn", function () {
        it("コントラクトに保持されているトークンをバーンできる", async function () {
            const { tokenSupplySystem } = await loadFixture(deployFixture);
            const expectedBalance = ethers.utils.parseEther("10");
            await tokenSupplySystem.mint(expectedBalance);
            await tokenSupplySystem.burn(expectedBalance);
            expect(await tokenSupplySystem.unclaimedBalance()).to.equal(0);
        });

        it("コントラクトにないトークンはバーンできない", async function () {
            const { tokenSupplySystem } = await loadFixture(deployFixture);
            const expectedBalance = ethers.utils.parseEther("10");
            await expect(tokenSupplySystem.burn(expectedBalance)).to.revertedWith("ERC20: burn amount exceeds balance")
        });
    });

    describe("pay", function () {
        it("unclaimed tokenから指定したアドレスにトークンを送る", async () => {
            const { token, tokenSupplySystem, otherAccount } = await loadFixture(deployFixture);
            const fee = ethers.utils.parseEther("0");
            await tokenSupplySystem.mint(ethers.utils.parseEther("10"));
            await tokenSupplySystem.pay(otherAccount.address, ethers.utils.parseEther("2"), fee);

            expect(await tokenSupplySystem.unclaimedBalance()).to.equal(ethers.utils.parseEther("8"));
            expect(await token.balanceOf(otherAccount.address)).to.equal(ethers.utils.parseEther("2"));
        })

        it("不正なアドレスが指定されば場合はエラーが起きる", async () => {
            const { token, tokenSupplySystem, otherAccount } = await loadFixture(deployFixture);
            const fee = ethers.utils.parseEther("0");

            const invalidAddress = "0x123131";
            await tokenSupplySystem.mint(ethers.utils.parseEther("10"));
            await expect(tokenSupplySystem.pay(invalidAddress, ethers.utils.parseEther("2"), fee)).rejectedWith("invalid address");
        })

        it("unclaimed以上のトークンを送ろうとするとエラーになる", async () => {
            const { token, tokenSupplySystem, otherAccount } = await loadFixture(deployFixture);
            const fee = ethers.utils.parseEther("0");
            await tokenSupplySystem.mint(ethers.utils.parseEther("10"));
            await expect(tokenSupplySystem.pay(otherAccount.address, ethers.utils.parseEther("12"), fee)).revertedWith("insufficient balance");
        })

        it("手数料を指定することが可能で、手数料はオーナーのウォレットに行く", async () => {
            const { token, tokenSupplySystem, otherAccount, owner } = await loadFixture(deployFixture);
            await tokenSupplySystem.mint(ethers.utils.parseEther("100"));
            await tokenSupplySystem.pay(
                otherAccount.address, ethers.utils.parseEther("50"), ethers.utils.parseEther("10")
            );

            expect(await tokenSupplySystem.unclaimedBalance()).to.equal(ethers.utils.parseEther("40"));
            expect(await token.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("10"));
        })
    })

    describe("batch pay", function () {
        it("unclaimed tokenから指定した複数のアドレスにトークンを送る", async () => {
            const { token, tokenSupplySystem, otherAccount, owner } = await loadFixture(deployFixture);
            const fee = ethers.utils.parseEther("0");

            await tokenSupplySystem.mint(ethers.utils.parseEther("10"));
            await tokenSupplySystem.batchPay(
                [otherAccount.address, owner.address],
                [ethers.utils.parseEther("2"), ethers.utils.parseEther("5")],
                [fee, fee]);

            expect(await tokenSupplySystem.unclaimedBalance()).to.equal(ethers.utils.parseEther("3"));
            expect(await token.balanceOf(otherAccount.address)).to.equal(ethers.utils.parseEther("2"));
            expect(await token.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("5"));
        })

        it("不正なアドレスが１つでも指定されば場合はエラーが起きる", async () => {
            const { token, tokenSupplySystem, otherAccount } = await loadFixture(deployFixture);
            const invalidAddress = "0x123131";
            const fee = ethers.utils.parseEther("0");

            const result = tokenSupplySystem.batchPay(
                [otherAccount.address, invalidAddress],
                [ethers.utils.parseEther("2"), ethers.utils.parseEther("5")],
                [fee, fee]);

            await expect(result).rejectedWith("invalid address");
        })


        it("アドレスとamountの配列の長さが違う場合はエラーになる", async () => {
            const { token, tokenSupplySystem, otherAccount } = await loadFixture(deployFixture);
            const fee = ethers.utils.parseEther("0");

            const result = tokenSupplySystem.batchPay(
                [otherAccount.address],
                [ethers.utils.parseEther("2"), ethers.utils.parseEther("5")],
                [fee, fee]);

            await expect(result).revertedWith("length mismatch");
        })

        it("unclaimed以上のトークンを送ろうとするとエラーになる", async () => {
            const { token, tokenSupplySystem, otherAccount, owner } = await loadFixture(deployFixture);
            const fee = ethers.utils.parseEther("0");
            const result = tokenSupplySystem.batchPay(
                [otherAccount.address, owner.address],
                [ethers.utils.parseEther("2"), ethers.utils.parseEther("9")],
                [fee, fee]);

            await expect(result).revertedWith("insufficient balance");
        })

        it("手数料を指定することが可能で、手数料はオーナーのウォレットに行く", async () => {
            const { token, tokenSupplySystem, otherAccount, otherAccount2, owner } = await loadFixture(deployFixture);
            const fee = ethers.utils.parseEther("10");
            await tokenSupplySystem.mint(ethers.utils.parseEther("100"));
            const result = tokenSupplySystem.batchPay(
                [otherAccount.address, otherAccount2.address],
                [ethers.utils.parseEther("20"), ethers.utils.parseEther("30")],
                [fee, fee]);


            expect(await tokenSupplySystem.unclaimedBalance()).to.equal(ethers.utils.parseEther("30"));
            expect(await token.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("20"));
        })
    })

    describe("payWithNative", function () {
        it("native tokenと引き換えることも可能", async () => {
            const { token, tokenSupplySystem, otherAccount } = await loadFixture(deployFixture);
            const ownerBalanceBefore = await ethers.provider.getBalance(otherAccount.address);

            await tokenSupplySystem.mint(ethers.utils.parseEther("100"));
            await tokenSupplySystem.payWithNative(
                otherAccount.address,
                ethers.utils.parseEther("50"),
                ethers.utils.parseEther("0"));

            const ownerBalanceAfter = await ethers.provider.getBalance(otherAccount.address);
            expect(await tokenSupplySystem.unclaimedBalance()).to.equal(ethers.utils.parseEther("50"));
            expect(await token.balanceOf(otherAccount.address)).to.equal(ethers.utils.parseEther("0"));
            expect(ownerBalanceAfter).to.equal(ethers.utils.parseEther("500").add(ownerBalanceBefore));
        })

        it("unclaimed以上のトークンを送ろうとするとエラーになる", async () => {
            const { token, tokenSupplySystem, otherAccount, owner } = await loadFixture(deployFixture);
            await tokenSupplySystem.mint(ethers.utils.parseEther("100"));
            const result = tokenSupplySystem.payWithNative(
                otherAccount.address, ethers.utils.parseEther("500"), ethers.utils.parseEther("0")
            );

            await expect(result).revertedWith("insufficient balance");
        })

        it("手数料を指定することが可能で、手数料はオーナーのウォレットに行く", async () => {
            const { token, tokenSupplySystem, otherAccount, owner } = await loadFixture(deployFixture);
            await tokenSupplySystem.mint(ethers.utils.parseEther("100"));
            await tokenSupplySystem.payWithNative(
                otherAccount.address, ethers.utils.parseEther("50"), ethers.utils.parseEther("10")
            );

            expect(await tokenSupplySystem.unclaimedBalance()).to.equal(ethers.utils.parseEther("40"));
            expect(await token.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("10"));
        })
    })

    describe("payAndPayWithNative", function () {
        it("native tokenとDAOトークン両方に引き換えることも可能", async () => {
            const { token, tokenSupplySystem, otherAccount } = await loadFixture(deployFixture);
            const ownerBalanceBefore = await ethers.provider.getBalance(otherAccount.address);

            await tokenSupplySystem.mint(ethers.utils.parseEther("100"));
            await tokenSupplySystem.payAndPayWithNative(
                otherAccount.address,
                ethers.utils.parseEther("50"),
                ethers.utils.parseEther("50"),
                ethers.utils.parseEther("0"));

            const ownerBalanceAfter = await ethers.provider.getBalance(otherAccount.address);
            expect(await tokenSupplySystem.unclaimedBalance()).to.equal(ethers.utils.parseEther("0"));
            expect(await token.balanceOf(otherAccount.address)).to.equal(ethers.utils.parseEther("50"));
            expect(ownerBalanceAfter).to.equal(ethers.utils.parseEther("500").add(ownerBalanceBefore));
        })

        it("手数料を指定することが可能で、手数料はオーナーのウォレットに行く", async () => {
            const { token, tokenSupplySystem, otherAccount, owner } = await loadFixture(deployFixture);
            await tokenSupplySystem.mint(ethers.utils.parseEther("100"));
            await tokenSupplySystem.payAndPayWithNative(
                otherAccount.address,
                ethers.utils.parseEther("50"),
                ethers.utils.parseEther("20"),
                ethers.utils.parseEther("10")
            );

            expect(await tokenSupplySystem.unclaimedBalance()).to.equal(ethers.utils.parseEther("20"));
            expect(await token.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("10"));
        })

        it("いずれかがゼロでもエラーが起きない", async () => {
            const { token, tokenSupplySystem, otherAccount, owner } = await loadFixture(deployFixture);
            await tokenSupplySystem.mint(ethers.utils.parseEther("100"));
            const balanceBefore = await ethers.provider.getBalance(otherAccount.address);

            await tokenSupplySystem.payAndPayWithNative(
                otherAccount.address,
                ethers.utils.parseEther("10"),
                ethers.utils.parseEther("0"),
                ethers.utils.parseEther("0")
            );
            await tokenSupplySystem.payAndPayWithNative(
                otherAccount.address,
                ethers.utils.parseEther("0"),
                ethers.utils.parseEther("10"),
                ethers.utils.parseEther("0")
            );
            await tokenSupplySystem.payAndPayWithNative(
                otherAccount.address,
                ethers.utils.parseEther("0"),
                ethers.utils.parseEther("0"),
                ethers.utils.parseEther("10")
            );
            await tokenSupplySystem.payAndPayWithNative(
                otherAccount.address,
                ethers.utils.parseEther("0"),
                ethers.utils.parseEther("0"),
                ethers.utils.parseEther("0")
            );
            const balanceAfter = await ethers.provider.getBalance(otherAccount.address);

            expect(await tokenSupplySystem.unclaimedBalance()).to.equal(ethers.utils.parseEther("70"));
            expect(await token.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("10"));
            expect(await token.balanceOf(otherAccount.address)).to.equal(ethers.utils.parseEther("10"));
            expect(balanceAfter).to.equal(ethers.utils.parseEther("100").add(balanceBefore));
        })
    })
});
