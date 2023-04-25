// We import Chai to use its asserting functions here.
import {expect} from "./chai-setup";

// we import our utilities
import {setupUsers, setupUser} from './utils';

import {ethers, deployments, getNamedAccounts, getUnnamedAccounts} from 'hardhat';

// we create a stup function that can be called by every test and setup variable for easy to read tests
async function setup() {
    // it first ensure the deployment is executed and reset (use of evm_snaphost for fast test)
    await deployments.fixture(["JToken", "Permit2", "Permit2Vault"]);

    // we get an instantiated contract in teh form of a ethers.js Contract instance:
    const contracts = {
        Token: (await ethers.getContract('JToken')),
    };

    const contracts1 = {
        Permit2: (await ethers.getContract('Permit2')),
    };

    const contracts2 = {
        Permit2Vault: (await ethers.getContract('Permit2Vault')),
    };

    // we get the tokenOwner
    const {tokenOwner} = await getNamedAccounts();
    // get fet unnammedAccounts (which are basically all accounts not named in the config, useful for tests as you can be sure they do not have been given token for example)
    // we then use the utilities function to generate user object/
    // These object allow you to write things like `users[0].Token.transfer(....)`
    const users = await setupUsers(await getUnnamedAccounts(), contracts);
    // finally we return the whole object (including the tokenOwner setup as a User object)
    return {
        ...contracts,
        ...contracts1,
        ...contracts2,
        users,
        tokenOwner: await setupUser(tokenOwner, contracts),
    };
}

describe("Token contract", function () {
    describe("Deployment", function () {
        // 测试总供应量=合约拥有者余额
        it("Check TotalSupply", async function () {
            const {Token, Permit2, Permit2Vault, users, tokenOwner} = await setup();
            const ownerBalance = await Token.balanceOf(tokenOwner.address);
            expect(await Token.totalSupply()).to.equal(ownerBalance);
        });
    });

    describe("Test Permit2", function () {
        it("Test Permit2", async function () {
            const {Token, Permit2, Permit2Vault, users, tokenOwner} = await setup();
            const ownerBalance = await Token.balanceOf(tokenOwner.address);
            expect(await Token.totalSupply()).to.equal(ownerBalance);
            // approve
            let approveAmount = ethers.utils.parseEther("10000000");
            await Token.approve(Permit2.address, approveAmount);


        });
    });
});