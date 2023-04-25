// We import Chai to use its asserting functions here.
import {expect} from "./chai-setup";

// we import our utilities
import {setupUsers, setupUser} from './utils';

import {ethers, deployments, getNamedAccounts, getUnnamedAccounts} from 'hardhat';

// we create a stup function that can be called by every test and setup variable for easy to read tests
async function setup() {
    // it first ensure the deployment is executed and reset (use of evm_snaphost for fast test)
    await deployments.fixture(["JToken", "Vault"]);

    // we get an instantiated contract in teh form of a ethers.js Contract instance:
    const contracts = {
        Token: (await ethers.getContract('JToken')),
    };

    const contracts1 = {
        Vault: (await ethers.getContract('Vault')),
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
        users,
        tokenOwner: await setupUser(tokenOwner, contracts),
    };
}

describe("Token contract", function () {
    describe("Deployment", function () {
        // 测试总供应量=合约拥有者余额
        it("Check TotalSupply", async function () {
            const {Token, users, tokenOwner} = await setup();
            const ownerBalance = await Token.balanceOf(tokenOwner.address);
            expect(await Token.totalSupply()).to.equal(ownerBalance);
        });

        it.only("Check Transfer", async function () {
            const {Token, Vault, users, tokenOwner} = await setup();
            const ownerBalance = await Token.balanceOf(tokenOwner.address);
            // 转账给普通用户
            let amount = ethers.utils.parseEther('100.0');
            await tokenOwner.Token.transfer(users[0].address, amount);
            expect(await Token.totalSupply()).to.equal(ownerBalance);
            let userBalance = await Token.balanceOf(users[0].address);
            console.log('userBalance: ' + ethers.utils.formatEther(userBalance));

            // 授权给合约
            let approveAmount = ethers.utils.parseEther('1000.0');
            await users[0].Token.approve(Vault.address, approveAmount);

            // 调用合约转移资产
            let moveAmount = ethers.utils.parseEther('10.0');
            await Vault.moveFund(Token.address, users[0].address, users[1].address, moveAmount);

            userBalance = await Token.balanceOf(users[0].address);
            console.log('userBalance: ' + ethers.utils.formatEther(userBalance));
            let user1Balance = await Token.balanceOf(users[1].address);
            console.log('user1Balance: ' + ethers.utils.formatEther(user1Balance));
        });
    });

});