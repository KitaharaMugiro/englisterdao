import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("DAOToken", function () {
    async function deployFixture() {
        const [owner, otherAccount, otherAccount2] = await ethers.getSigners();

        const EnglisterToken = await ethers.getContractFactory("DAOToken");
        const NAME = "Englister"
        const SYMBOL = "ENG"
        const INITIAL_SUPPLY = ethers.utils.parseEther("100");
        const token = await EnglisterToken.deploy(NAME, SYMBOL, INITIAL_SUPPLY);

        return { token, owner, otherAccount, otherAccount2 };
    }

    describe("Deployment", function () {
        it("初期発行枚数は100枚である", async function () {
            const { token } = await loadFixture(deployFixture);
            const expectedBalance = ethers.utils.parseEther("100");
            expect(await token.totalSupply()).to.equal(expectedBalance);
        });

        it("初期発行トークンはownerが保有している", async function () {
            const { token, owner } = await loadFixture(deployFixture);
            const expectedBalance = ethers.utils.parseEther("100");
            expect(await token.balanceOf(owner.address)).to.equal(expectedBalance);
        });
    });

    describe("Send", function () {
        it("複数のアカウントに対して1度に送金することができる", async function () {
            const { token, owner, otherAccount, otherAccount2 } = await loadFixture(deployFixture);

            await token.connect(owner).transfer(otherAccount.address, ethers.utils.parseEther("10"));
            await token.connect(owner).transfer(otherAccount2.address, ethers.utils.parseEther("20"));

            expect(await token.balanceOf(otherAccount.address)).to.equal(ethers.utils.parseEther("10"));
            expect(await token.balanceOf(otherAccount2.address)).to.equal(ethers.utils.parseEther("20"));
        });

    });


    describe("Role Setting", function () {
        it("ownerでなければロールをつけることはできない", async function () {
            const { token, owner, otherAccount, otherAccount2 } = await loadFixture(deployFixture);
            await expect(token.connect(otherAccount).setupMinterRole(otherAccount.address)).to.be.revertedWith("DAOToken: must have admin role to setup minter");
        });

        it("MINTER_ROLEは通貨を新規発行することができる", async function () {
            const { token, otherAccount, otherAccount2 } = await loadFixture(deployFixture);
            await token.setupMinterRole(otherAccount.address);
            await token.connect(otherAccount).mint(otherAccount2.address, ethers.utils.parseEther("10"));
            expect(await token.balanceOf(otherAccount2.address)).to.equal(ethers.utils.parseEther("10"));
        });

        it("MINTER_ROLEでなければ新規発行することができない", async function () {
            const { owner, token, otherAccount, otherAccount2 } = await loadFixture(deployFixture);
            await expect(token.connect(otherAccount2).mint(otherAccount2.address, ethers.utils.parseEther("10"))).revertedWith("ERC20PresetMinterPauser: must have minter role to mint");
        });

        it("MINTER_ROLEでなければownerでも新規発行することができない", async function () {
            const { owner, token, otherAccount, otherAccount2 } = await loadFixture(deployFixture);
            await token.revokeMinterRole(owner.address)
            await expect(token.mint(otherAccount2.address, ethers.utils.parseEther("10"))).revertedWith("ERC20PresetMinterPauser: must have minter role to mint");
        });
    })
});
