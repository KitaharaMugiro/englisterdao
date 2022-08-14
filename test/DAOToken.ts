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
        const INITIAL_SUPPLY = 100;
        const token = await EnglisterToken.deploy(NAME, SYMBOL, INITIAL_SUPPLY);

        return { token, owner, otherAccount, otherAccount2 };
    }

    describe("Deployment", function () {
        it("初期発行枚数は100枚である", async function () {
            const { token } = await loadFixture(deployFixture);
            const expectedBalance = 100
            expect(await token.totalSupply()).to.equal(expectedBalance);
        });

        it("初期発行トークンはownerが保有している", async function () {
            const { token, owner } = await loadFixture(deployFixture);
            const expectedBalance = 100
            expect(await token.balanceOf(owner.address)).to.equal(expectedBalance);
        });
    });

    describe("Deployment", function () {
        it("初期発行枚数は100枚である", async function () {
            const { token } = await loadFixture(deployFixture);
            const expectedBalance = 100
            expect(await token.totalSupply()).to.equal(expectedBalance);
        });

        it("初期発行トークンはownerが保有している", async function () {
            const { token, owner } = await loadFixture(deployFixture);
            const expectedBalance = 100
            expect(await token.balanceOf(owner.address)).to.equal(expectedBalance);
        });
    });

    describe("Send", function () {
        it("複数のアカウントに対して1度に送金することができる", async function () {
            const { token, owner, otherAccount, otherAccount2 } = await loadFixture(deployFixture);

            await token.connect(owner).transfer(otherAccount.address, 10);
            await token.connect(owner).transfer(otherAccount2.address, 20);

            expect(await token.balanceOf(otherAccount.address)).to.equal(10);
            expect(await token.balanceOf(otherAccount2.address)).to.equal(20);
        });

        it("複数アカウントに送金中に1つの送金先が不正だった場合", async function () {
            //NOT YET IMPLEMENTED
        });
    });

    describe("GetTopN", function () {
        it("トークンの上位3件を取得できる", async function () {
            const { token, owner, otherAccount, otherAccount2 } = await loadFixture(deployFixture);


            await token.connect(owner).transfer(otherAccount.address, 20);
            await token.connect(owner).transfer(otherAccount2.address, 10);


            const expected = [owner.address, otherAccount.address, otherAccount2.address]
            const result = await token.getTopHolders(3);
            expect(result[0]).to.equal(expected[0]);
            expect(result[1]).to.equal(expected[1]);
            expect(result[2]).to.equal(expected[2]);
        });

        it("トークンの上位2件を取得できる", async function () {
            const { token, owner, otherAccount, otherAccount2 } = await loadFixture(deployFixture);

            await token.connect(owner).transfer(otherAccount.address, 10);
            await token.connect(owner).transfer(otherAccount2.address, 20);

            const expected = [owner.address, otherAccount2.address]
            const result = await token.getTopHolders(2);
            expect(result[0]).to.equal(expected[0]);
            expect(result[1]).to.equal(expected[1]);
        });

        it("上位4件取ろうとすると最後はaddress(0)が入っている", async function () {
            const { token, owner, otherAccount, otherAccount2 } = await loadFixture(deployFixture);


            await token.connect(owner).transfer(otherAccount.address, 10);
            await token.connect(owner).transfer(otherAccount2.address, 20);


            const expected = [owner.address, otherAccount2.address, otherAccount.address, "0x0000000000000000000000000000000000000000"]
            const result = await token.getTopHolders(4);
            expect(result[0]).to.equal(expected[0]);
            expect(result[1]).to.equal(expected[1]);
            expect(result[2]).to.equal(expected[2]);
            expect(result[3]).to.equal(expected[3]);
        });
    })




    describe("Role Setting", function () {

        it("MINTER_ROLEは通貨を新規発行することができる", async function () {
            const { token, otherAccount, otherAccount2 } = await loadFixture(deployFixture);
            await token.setupMinterRole(otherAccount.address);
            await token.connect(otherAccount).mint(otherAccount2.address, 10);
            expect(await token.balanceOf(otherAccount2.address)).to.equal(10);
        });

        it("MINTER_ROLEでなければ新規発行することができない", async function () {
            const { token, otherAccount, otherAccount2 } = await loadFixture(deployFixture);
            await token.setupMinterRole(otherAccount.address);
            await expect(token.mint(otherAccount2.address, 10)).revertedWith("Caller is not a minter");
            await expect(token.connect(otherAccount2).mint(otherAccount2.address, 10)).revertedWith("Caller is not a minter");
        });

        it("BURNER_ROLEは通貨をバーンすることができる", async function () {
            const { token, otherAccount, owner } = await loadFixture(deployFixture);
            await token.setupBurnerRole(otherAccount.address);
            await token.connect(otherAccount).burn(owner.address, 10);
            expect(await token.balanceOf(owner.address)).to.equal(90);
        });

        it("BURNER_ROLEでなければバーンすることができない", async function () {
            const { token, owner, otherAccount, otherAccount2 } = await loadFixture(deployFixture);
            await token.setupBurnerRole(otherAccount.address);
            await expect(token.burn(owner.address, 10)).revertedWith("Caller is not a burner");
            await expect(token.connect(otherAccount2).burn(owner.address, 10)).revertedWith("Caller is not a burner");
        });

    })
});
