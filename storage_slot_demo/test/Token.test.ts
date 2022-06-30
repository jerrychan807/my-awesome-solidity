// We import Chai to use its asserting functions here.
import {expect} from "./chai-setup";

// we import our utilities
import {setupUsers, setupUser} from './utils';

import {ethers, deployments, getNamedAccounts, getUnnamedAccounts} from 'hardhat';
import {getDefaultProvider} from "ethers";

// we create a stup function that can be called by every test and setup variable for easy to read tests
async function setup() {
    // it first ensure the deployment is executed and reset (use of evm_snaphost for fast test)
    await deployments.fixture(["JToken"]);

    // we get an instantiated contract in teh form of a ethers.js Contract instance:
    const contracts = {
        Token: (await ethers.getContract('JToken')),
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

    describe("test storage slot", function () {
        it("test single storage slot", async function () {
            const {Token, users, tokenOwner} = await setup();

            // Returns the Bytes32 value of the position pos at address addr
            // 从存储槽中取值
            const totalSupplyDataBytes32 = await ethers.provider.getStorageAt(Token.address, 2);
            console.log('totalSupplyDataBytes32: ' + totalSupplyDataBytes32);
            // decode存储槽中的值
            let totalSupplyDecode = await Token.interface.decodeFunctionResult("totalSupply", totalSupplyDataBytes32);
            console.log(totalSupplyDecode)
            // [ BigNumber { _hex: '0x3635c9adc5dea00000', _isBigNumber: true } ]
            const totalSupplyString = totalSupplyDecode[0].toString()
            console.log('totalSupplyString: ' + totalSupplyString);

            const queryTotalSupply = await Token.totalSupply();
            console.log('queryTotalSupply: ' + queryTotalSupply);

            expect(queryTotalSupply).to.equal(totalSupplyString);

        });
    });

    it("test shared storage slot", async function () {
        const {Token, users, tokenOwner} = await setup();

        // Returns the Bytes32 value of the position pos at address addr
        // 从存储槽中取值
        const slotNum = 5;

        const storageData = await ethers.provider.getStorageAt(Token.address, slotNum);
        console.log('slotNum: ' + slotNum + 'storageData: ' + storageData);
        // 右对齐，从右边开始往左取值
        const storageOwnerAddress = storageData.slice(-40);       // Take the last 20 bytes
        console.log("storageOwnerAddress: " + storageOwnerAddress);

        const decimalsData = storageData.slice(-42, -40);  // Take 1 byte before that
        console.log("decimalsData: " + decimalsData);
        const decimalsInt = parseInt(decimalsData, 16);
        console.log("decimalsInt: " + decimalsInt);

        const pauseableData = storageData.slice(-44, -42);  // Take 1 byte before that
        console.log("pauseableData: " + pauseableData);
        const pauseableBoolean = Boolean(parseInt(pauseableData, 16));
        console.log("pauseableBoolean: " + pauseableBoolean);

        const isAdminData = storageData.slice(-46, -44);  // Take 1 byte before that
        console.log("isAdminData: " + isAdminData);
        const isAdminDataBoolean = Boolean(parseInt(isAdminData, 16));
        console.log("isAdminDataBoolean: " + isAdminDataBoolean);

        const ownerAddress = await Token.ownerAddress();
        console.log("Query Token address: " + ownerAddress);

        const queryDecimal = await Token.decimals();
        console.log("queryDecimal: " + queryDecimal);

        const queryPauseable = await Token.pauseable();
        console.log("queryPauseable: " + queryPauseable);

        const queryIsAdmin = await Token.isAdmin();
        console.log("queryIsAdmin: " + queryIsAdmin);

        expect(storageOwnerAddress).to.equal(ownerAddress.slice(2).toLowerCase());
        expect(queryDecimal).to.equal(decimalsInt);
        expect(queryPauseable).to.equal(pauseableBoolean);
        expect(queryIsAdmin).to.equal(isAdminDataBoolean);
    });

    it("test string storage slot", async function () {
        const {Token, users, tokenOwner} = await setup();

        // 从存储槽中取值 读取_name
        const slotNum = 3;

        const storageData = await ethers.provider.getStorageAt(Token.address, slotNum);
        console.log('slotNum: ' + slotNum + ' storageData: ' + storageData);

        const len2 = parseInt(storageData.slice(-2), 16); // Last 1 byte = length * 2
        console.log('len2: ' + len2);

        // Read the text (skip "0x")
        const nameText = Buffer.from(storageData.slice(2, 2 + len2), "hex").toString("utf8");
        console.log('nameText: ' + nameText);

        const queryName = await Token.name();
        console.log("queryName: " + queryName);

        expect(nameText).to.equal(queryName);
    });

    it.only("test mapping storage slot", async function () {
        const {Token, users, tokenOwner} = await setup();

        // Storage slot 0 contains "balances" (mapping(address => uint256))
        // Derive slot position for the key k
        // 1.从存储槽直接读取用户tokenOwner的余额
        const k = tokenOwner.address.slice(2).toLowerCase().padStart(64, "0");
        console.log('k: ' + k);
        const p = "0".padStart(64, "0");
        console.log('p: ' + p);
        const valueSlotPos = ethers.utils.keccak256("0x" + k + p);
        console.log('valueSlotPos: ' + valueSlotPos);

        const tokenOwnerBalanceAtStorage = await ethers.provider.getStorageAt(Token.address, valueSlotPos);
        console.log('tokenOwnerBalanceAtStorage: ' + tokenOwnerBalanceAtStorage);

        // 2.对取出的存储槽的值进行类型转换
        // 0x00000000000000000000000000000000000000000000003635c9adc5dea00000
        // 去掉0x 去掉前面的0然后 加上0x
        const tokenOwnerBalanceAtStorageFormat = '0x' + tokenOwnerBalanceAtStorage.slice(2).replace(/\b(0+)/gi, "")
        console.log(tokenOwnerBalanceAtStorageFormat)

        const tokenOwnerBalanceAtStorageInt = parseInt(tokenOwnerBalanceAtStorageFormat, 16);
        console.log('tokenOwnerBalanceAtStorageInt: ' + tokenOwnerBalanceAtStorageInt);
        // console.log(typeof tokenOwnerBalanceAtStorageInt); // number

        const tokenOwnerBalanceAtStorageSring = BigInt(tokenOwnerBalanceAtStorageInt).toString();
        console.log('tokenOwnerBalanceAtStorageSring: ' + tokenOwnerBalanceAtStorageSring);

        // 3.通过合约查询tokenOwner余额
        const ownerBalance = await Token.balanceOf(tokenOwner.address);
        console.log('ownerBalance: ' + ownerBalance);
        // console.log(typeof ownerBalance);
        // const check = await ethers.BigNumber.isBigNumber(ownerBalance);
        // console.log(check); // is bignumber
        const ownerBalanceNumber = ownerBalance.toString();
        console.log('ownerBalanceNumber: ' + ownerBalanceNumber);
        // console.log("ownerBalance Readable: " + ethers.utils.formatUnits(ownerBalance, 18));

        // 4.比对
        expect(ownerBalanceNumber).to.equal(tokenOwnerBalanceAtStorageSring);
    });

});