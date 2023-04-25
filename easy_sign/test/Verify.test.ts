// We import Chai to use its asserting functions here.
import {expect} from "../../sign/test/chai-setup";

// we import our utilities
import {setupUsers, setupUser} from '../../sign/test/utils';

import {ethers, deployments, getNamedAccounts, getUnnamedAccounts} from 'hardhat';
import {getDefaultProvider} from "ethers";

// we create a stup function that can be called by every test and setup variable for easy to read tests
async function setup() {
    // it first ensure the deployment is executed and reset (use of evm_snaphost for fast test)
    await deployments.fixture(["Verify"]);

    // we get an instantiated contract in teh form of a ethers.js Contract instance:
    const contracts = {
        Verify: (await ethers.getContract('Verify')),
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
    describe("Verify sign", function () {
        // 生成签名
        it("generate sign", async function () {
            const {Verify, users, tokenOwner} = await setup();
            // let balance = await user.getBalance();

            let account = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"
            let tokenId = 0
            let messageHash = await Verify.getMessageHash(account, tokenId);
            console.log("messageHash: " + messageHash);

            let signedMessageHash = await Verify.toEthSignedMessageHash(messageHash);
            console.log("signedMessageHash: " + signedMessageHash);
        });

        // 生成签名
        it.only("generate sign", async function () {
            const {Verify, users, tokenOwner} = await setup();

            const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
            let privateKey = '0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0';
            let wallet = new ethers.Wallet(privateKey);
            const message = "hello";
            console.log("message: " + message);
            // 打包签名
            const messageHash = ethers.utils.solidityKeccak256(["string"], [message]);
            const messageHashByte = ethers.utils.arrayify(messageHash);
            // 消息进行签名
            let signature = await wallet.signMessage(messageHashByte);
            console.log("signature: " + signature);
            let sig = ethers.utils.splitSignature(signature);
            let result = await Verify.verify(wallet.address, message, sig.v, sig.r, sig.s);
            console.log(result);
        });

        // 生成签名
        it("generate sign", async function () {
            const {Verify, users, tokenOwner} = await setup();

            const message = "hello";
            // const messageHash = ethers.utils.solidityKeccak256(["string"], [message]);
            // console.log("messageHash: " + messageHash);

            let messageHash = await Verify.getSingleMessageHash(message);
            console.log("messageHash: " + messageHash);

            let sig = await Verify.toEthSignedMessageHash(messageHash);
            console.log("sig: " + sig);
        });
    });
});