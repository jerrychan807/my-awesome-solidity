// We import Chai to use its asserting functions here.
import {expect} from "./chai-setup";
import {HardhatRuntimeEnvironment} from 'hardhat/types';
// we import our utilities
import {setupUsers, setupUser} from './utils';

import {ethers, deployments, getNamedAccounts, getUnnamedAccounts} from 'hardhat';

var LogicV1ContractAbi = [
    {
        "inputs": [],
        "name": "getVal",
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
                "name": "_newVal",
                "type": "uint256"
            }
        ],
        "name": "setVal",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

var LogicV2ContractAbi = [
    {
        "inputs": [],
        "name": "getVal",
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
                "name": "_newVal",
                "type": "uint256"
            }
        ],
        "name": "setVal",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// we create a stup function that can be called by every test and setup variable for easy to read tests
async function setup() {
    // it first ensure the deployment is executed and reset (use of evm_snaphost for fast test)
    await deployments.fixture(["UnstructuredLogicV1", 'UnstructuredLogicV2', "UnstructuredProxy"]);
    // await deployments.fixture(["SatelliteContractV1"]);
    // we get an instantiated contract in teh form of a ethers.js Contract instance:
    const contracts = {
        UnstructuredLogicV1: (await ethers.getContract('UnstructuredLogicV1')),
    };

    const contracts1 = {
        UnstructuredLogicV2: (await ethers.getContract('UnstructuredLogicV2')),
    };
    const contracts2 = {
        UnstructuredProxy: (await ethers.getContract('UnstructuredProxy')),
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
        ...contracts2,
        users,
        proxyOwner: await setupUser(Owner, contracts2),
    };
}


describe("Token contract", function () {
    describe("test", function () {
        it("", async function () {
            const {
                UnstructuredLogicV1,
                UnstructuredLogicV2,
                UnstructuredProxy,
                users,
                proxyOwner
            } = await setup();

            // deploy_contracts
            console.log('Proxy try to upgrade ImplementationAddress To UnstructuredLogicV1.address');
            await proxyOwner.UnstructuredProxy.setImplementationAddress(UnstructuredLogicV1.address);

            // test_proxy_pattern_implementation_equals_to_logic_address
            console.log('[*]test_proxy_pattern_implementation_equals_to_logic_address');
            let implementationAddress = await proxyOwner.UnstructuredProxy.getImplementationAddress();
            expect(implementationAddress).to.equal(UnstructuredLogicV1.address);
            console.log('Proxy setImplementationAddress successfully');

            // test_can_set_and_get_val_from_logicv1
            console.log('[*]test_can_set_and_get_val_from_logicv1');
            const namedAccounts = await getNamedAccounts();
            let OwnerSigner = await ethers.provider.getSigner(namedAccounts.Owner);
            const proxyLogicV1Contract = new ethers.Contract(UnstructuredProxy.address, LogicV1ContractAbi, OwnerSigner);
            await proxyLogicV1Contract.setVal(10);
            expect(await proxyLogicV1Contract.getVal()).to.equal(10);


            // test_proxy_pattern_implementation_equals_to_new_logic_address
            console.log('[*]test_proxy_pattern_implementation_equals_to_new_logic_address');
            console.log('Proxy try to upgrade ImplementationAddress To UnstructuredLogicV2.address');
            await proxyOwner.UnstructuredProxy.setImplementationAddress(UnstructuredLogicV2.address);
            let newImplementationAddress = await proxyOwner.UnstructuredProxy.getImplementationAddress();
            expect(newImplementationAddress).to.equal(UnstructuredLogicV2.address);

            // test_can_set_and_get_names_from_logicv2
            console.log('[*]test_can_set_and_get_names_from_logicv2');
            const proxyLogicV2Contract = new ethers.Contract(UnstructuredProxy.address, LogicV2ContractAbi, OwnerSigner);
            await proxyLogicV2Contract.setVal(20);
            expect(await proxyLogicV2Contract.getVal()).to.equal(20);

        });
    });

});