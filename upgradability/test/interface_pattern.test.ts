// We import Chai to use its asserting functions here.
import {expect} from "./chai-setup";

// we import our utilities
import {setupUsers, setupUser} from './utils';

import {ethers, deployments, getNamedAccounts, getUnnamedAccounts} from 'hardhat';
import {getDefaultProvider} from "ethers";

// we create a stup function that can be called by every test and setup variable for easy to read tests
async function setup() {
    // it first ensure the deployment is executed and reset (use of evm_snaphost for fast test)
    await deployments.fixture(["MainContract", 'SatelliteContractV1', 'SatelliteContractV2']);
    // await deployments.fixture(["SatelliteContractV1"]);
    // we get an instantiated contract in teh form of a ethers.js Contract instance:
    const contracts = {
        MainContract: (await ethers.getContract('MainContract')),
    };

    const contracts1 = {
        SatelliteContractV1: (await ethers.getContract('SatelliteContractV1')),
    };
    const contracts2 = {
        SatelliteContractV2: (await ethers.getContract('SatelliteContractV2')),
    };
    // we get the tokenOwner
    const {Owner} = await getNamedAccounts();
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
        Owner: await setupUser(Owner, contracts),
    };
}


describe("Token contract", function () {
    describe("Transfer", function () {
        it("", async function () {
            const {MainContract, SatelliteContractV1, SatelliteContractV2, users, Owner} = await setup();
            // const satelliteContractV1 = await ethers.getContract('SatelliteContractV1')
            console.log('【Step 1】 MainContract upgradeTo SatelliteContractV1');
            await Owner.MainContract.upgradeTo(SatelliteContractV1.address);

            // 主合约设置 卫星合约v1的值
            // let firstNameBytes = ethers.utils.hexZeroPad("0xABe904f6A2661F36C8ABD3c5DBAEFF2C", 32)
            // let lastNameBytes = ethers.utils.hexZeroPad("0xABe904f6A2661F36C8ABD3c5DBAEFF2C", 32)
            let firstNameText = "Hello";
            let lastNameText = "Jerry";
            console.log('   firstNameText: ' + firstNameText);
            console.log('   lastNameText: ' + lastNameText);

            let firstNameBytes = ethers.utils.formatBytes32String(firstNameText);
            let lastNameBytes = ethers.utils.formatBytes32String(lastNameText);
            console.log(' transfer text 2 Bytes');
            console.log('   firstNameBytes: ' + firstNameBytes);
            console.log('   lastNameBytes: ' + lastNameBytes);

            await Owner.MainContract.setFirstName(firstNameBytes);
            await Owner.MainContract.setLastName(lastNameBytes);
            console.log('   MainContract setFirstName finished');

            // https://ethereum.stackexchange.com/questions/88119/i-see-no-way-to-obtain-the-return-value-of-a-non-view-function-ethers-js
            let firstNameBytes32 = await Owner.MainContract.callStatic.getFirstName();
            let lastNameBytes32 = await Owner.MainContract.callStatic.getLastName();

            console.log(' MainContract getFirstName finished');
            console.log('   firstNameBytes32: ' + firstNameBytes32)
            console.log('   lastNameBytes32: ' + lastNameBytes32)

            console.log('   SatelliteContractV1 firstName: ' + ethers.utils.parseBytes32String(firstNameBytes32));
            console.log('   SatelliteContractV1 lastName: ' + ethers.utils.parseBytes32String(lastNameBytes32));

            console.log('【Step 2】MainContract upgradeTo SatelliteContractV2');
            await Owner.MainContract.upgradeTo(SatelliteContractV2.address);
            let firstNameBytes32V2 = await Owner.MainContract.callStatic.getFirstName();
            let lastNameBytes32V2 = await Owner.MainContract.callStatic.getLastName();

            console.log(' firstNameBytes32V2: ' + firstNameBytes32V2)
            console.log(' lastNameBytes32V2: ' + lastNameBytes32V2)

            expect(1).to.equal(1);


        });
    });

});