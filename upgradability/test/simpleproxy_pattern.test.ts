// We import Chai to use its asserting functions here.
import {expect} from "./chai-setup";
import {HardhatRuntimeEnvironment} from 'hardhat/types';
// we import our utilities
import {setupUsers, setupUser} from './utils';

import {ethers, deployments, getNamedAccounts, getUnnamedAccounts} from 'hardhat';

var contractAbi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "getMyInt",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_myInt",
                "type": "uint256"
            }
        ],
        "name": "setMyInt",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// we create a stup function that can be called by every test and setup variable for easy to read tests
async function setup() {
    // it first ensure the deployment is executed and reset (use of evm_snaphost for fast test)
    await deployments.fixture(["Logic", 'SimpleProxy']);
    // await deployments.fixture(["SatelliteContractV1"]);
    // we get an instantiated contract in teh form of a ethers.js Contract instance:
    const contracts = {
        Logic: (await ethers.getContract('Logic')),
    };

    const contracts1 = {
        SimpleProxy: (await ethers.getContract('SimpleProxy')),
    };

    // we get the tokenOwner
    const {Owner} = await getNamedAccounts();
    // get fet unnammedAccounts (which are basically all accounts not named in the config, useful for tests as you can be sure they do not have been given token for example)
    // we then use the utilities function to generate user object/
    // These object allow you to write things like `users[0].Token.transfer(....)`
    const users = await setupUsers(await getUnnamedAccounts(), contracts1);
    // finally we return the whole object (including the tokenOwner setup as a User object)
    return {
        ...contracts,
        ...contracts1,
        users,
        Owner: await setupUser(Owner, contracts1),
        Owner1: await setupUser(Owner, contracts),
    };
}


describe("Token contract", function () {
    describe("test setImplementationAddress", function () {
        // 错误测试脚本
        it("", async function () {
            const {Logic, SimpleProxy, users, Owner, Owner1} = await setup();

            console.log('SimpleProxy try to set ImplementationAddress');
            await Owner.SimpleProxy.setImplementationAddress(Logic.address);

            let implementationAddress = await Owner.SimpleProxy.getImplementationAddress();
            console.log('implementationAddress: ' + implementationAddress);

            expect(implementationAddress).to.equal(Logic.address);
            console.log('SimpleProxy setImplementationAddress successfully');

            // 从logic合约查询Int
            let logicMyInt = await Owner1.Logic.getMyInt();
            console.log('logicMyInt: ' + logicMyInt);
            expect(10).to.equal(logicMyInt);

            // test_can_set_value_from_proxy
            await Owner1.Logic.setMyInt(20);
            let newlogicMyInt = await Owner1.Logic.getMyInt();
            console.log('newlogicMyInt: ' + newlogicMyInt);

            expect(20).to.equal(newlogicMyInt);

        });
    });

    describe.only("test", function () {
        it("", async function () {
            const {Logic, SimpleProxy, users, Owner, Owner1} = await setup();

            console.log('SimpleProxy try to set ImplementationAddress');
            await Owner.SimpleProxy.setImplementationAddress(Logic.address);

            let implementationAddress = await Owner.SimpleProxy.getImplementationAddress();
            console.log('implementationAddress: ' + implementationAddress);

            expect(implementationAddress).to.equal(Logic.address);
            console.log('SimpleProxy setImplementationAddress successfully');

            // 查询存储槽位置0的值
            const storageData = await ethers.provider.getStorageAt(SimpleProxy.address, 0);
            console.log('slotNum: 0 ' + 'storageData: ' + storageData);

            // 从logic合约查询Int
            // test_can_get_value_from_implementation
            const namedAccounts = await getNamedAccounts();
            let OwnerSigner = await ethers.provider.getSigner(namedAccounts.Owner);
            const proxyLogicContract = new ethers.Contract(SimpleProxy.address, contractAbi, OwnerSigner);
            let logicMyInt = await proxyLogicContract.getMyInt();
            console.log('expect logicMyInt = 10 ');
            console.log('logicMyInt: ' + logicMyInt);
            expect(10).not.to.equal(logicMyInt);

            // test_can_set_value_from_proxy
            await proxyLogicContract.setMyInt(20);
            // 查询存储槽位置0的值
            const storageData1 = await ethers.provider.getStorageAt(SimpleProxy.address, 0);

            implementationAddress = await Owner.SimpleProxy.getImplementationAddress();
            console.log('implementationAddress: ' + implementationAddress);
            console.log('slotNum: 0 ' + 'storageData: ' + storageData);
            console.log('logic Address: ' + Logic.address);
            expect(implementationAddress).not.to.equal(Logic.address);
        });
    });

});