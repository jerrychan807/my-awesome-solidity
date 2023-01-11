// We import Chai to use its asserting functions here.
import {expect} from "./chai-setup";

// we import our utilities
import {setupUsers, setupUser} from './utils';

import {ethers, deployments, getNamedAccounts, getUnnamedAccounts} from 'hardhat';

// we create a stup function that can be called by every test and setup variable for easy to read tests
async function setup() {
    // it first ensure the deployment is executed and reset (use of evm_snaphost for fast test)
    await deployments.fixture(["MyToken"]);

    // we get an instantiated contract in teh form of a ethers.js Contract instance:
    const contracts = {
        Token: (await ethers.getContract('MyToken')),
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
        users,
        tokenOwner: await setupUser(tokenOwner, contracts),
    };
}

describe("Token contract", function () {
    describe("Deployment", function () {
        // 设置uri
        it("set uri", async function () {
            const {Token, users, tokenOwner} = await setup();
            await Token.setBaseURI(0, "ipfs://QmavJyMNJiAz9hXTmZrEuFMi8yrpiNjUbFujHE57Z6avc3/");
            let baseUri = await Token.uri(0);
            console.log("baseUri:", baseUri.toString());

            await Token.setBaseURI(1, "ipfs://QmTwC69n8hPzWYw1wHXT8Dc8h7PnjtAfzLFHPLz423DadA/");
            let baseUri1 = await Token.uri(1);
            console.log("baseUri1:", baseUri1.toString());
            // expect(await Token.totalSupply()).to.equal(ownerBalance);
        });

        // mint
        it.only("mint", async function () {
            const {Token, users, tokenOwner} = await setup();
            // 铸造给用户1 100个
            await Token.mint(users[0].address, 0, 100, "0x");
            let balance = await Token.balanceOf(users[0].address, 0);
            console.log("balance:", balance.toString());

            let totalSupply = await Token.totalSupply(0);
            console.log("totalSupply:", totalSupply.toString());

        });
    });

});