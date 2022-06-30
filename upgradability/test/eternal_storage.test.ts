// We import Chai to use its asserting functions here.
import {expect} from "./chai-setup";
import {HardhatRuntimeEnvironment} from 'hardhat/types';
// we import our utilities
import {setupUsers, setupUser} from './utils';

import {ethers, deployments, getNamedAccounts, getUnnamedAccounts} from 'hardhat';

var LogicV1ContractAbi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "__storage",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "_storage",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getUserAge",
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
        "inputs": [],
        "name": "getUserName",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "age",
                "type": "uint256"
            }
        ],
        "name": "setUserAge",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            }
        ],
        "name": "setUserName",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

var LogicV2ContractAbi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "__storage",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "_storage",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getUserAge",
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
        "inputs": [],
        "name": "getUserName",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "age",
                "type": "uint256"
            }
        ],
        "name": "setUserAge",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            }
        ],
        "name": "setUserName",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// we create a stup function that can be called by every test and setup variable for easy to read tests
async function setup() {
    // it first ensure the deployment is executed and reset (use of evm_snaphost for fast test)
    await deployments.fixture(["EternalLogicV1", 'EternalLogicV2', "EternalStorage", 'EternalProxy']);
    // await deployments.fixture(["SatelliteContractV1"]);
    // we get an instantiated contract in teh form of a ethers.js Contract instance:
    const contracts = {
        EternalLogicV1: (await ethers.getContract('EternalLogicV1')),
    };

    const contracts1 = {
        EternalLogicV2: (await ethers.getContract('EternalLogicV2')),
    };
    const contracts2 = {
        EternalStorage: (await ethers.getContract('EternalStorage')),
    };
    const contracts3 = {
        EternalProxy: (await ethers.getContract('EternalProxy')),
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
        ...contracts3,
        users,
        proxyOwner: await setupUser(Owner, contracts3),
    };
}


describe("Token contract", function () {
    describe("test", function () {
        it("", async function () {
            const {
                EternalLogicV1,
                EternalLogicV2,
                EternalStorage,
                EternalProxy,
                users,
                proxyOwner
            } = await setup();

            // deploy_contracts
            console.log('Proxy try to upgrade ImplementationAddress To EternalLogicV1.address');
            await proxyOwner.EternalProxy.setImplementationAddress(EternalLogicV1.address);

            // test_proxy_pattern_owner_is_correct
            console.log('[*]test_proxy_pattern_owner_is_correct');
            expect(await proxyOwner.EternalProxy.getOwnerAddress()).to.equal(proxyOwner.address);

            // test_proxy_pattern_implementation_equals_to_logic_address
            console.log('[*]test_proxy_pattern_implementation_equals_to_logic_address');
            expect(await proxyOwner.EternalProxy.getImplementationAddress()).to.equal(EternalLogicV1.address);

            // test_can_set_and_get_val_from_logicv1
            console.log('[*]test_can_set_and_get_val_from_logicv1');
            const namedAccounts = await getNamedAccounts();
            let OwnerSigner = await ethers.provider.getSigner(namedAccounts.Owner);
            const proxyLogicV1Contract = new ethers.Contract(EternalProxy.address, LogicV1ContractAbi, OwnerSigner);
            await proxyLogicV1Contract.setUserAge(30);
            expect(await proxyLogicV1Contract.getUserAge()).to.equal(30);

            // test_can_set_and_get_names_from_logicv1
            console.log('[*]test_can_set_and_get_names_from_logicv1');
            await proxyLogicV1Contract.setUserName("Boom");
            expect(await proxyLogicV1Contract.getUserName()).to.equal("Boom");


            // test_proxy_pattern_implementation_equals_to_new_logic_address
            console.log('[*]test_proxy_pattern_implementation_equals_to_new_logic_address');
            console.log('Proxy try to upgrade ImplementationAddress To EternalLogicV2.address');
            await proxyOwner.EternalProxy.setImplementationAddress(EternalLogicV2.address);
            expect(await proxyOwner.EternalProxy.getImplementationAddress()).to.equal(EternalLogicV2.address);

            // test_can_set_and_get_val_from_logicv2
            console.log('[*]test_can_set_and_get_val_from_logicv2');
            const proxyLogicV2Contract = new ethers.Contract(EternalProxy.address, LogicV2ContractAbi, OwnerSigner);
            await proxyLogicV2Contract.setUserAge(31);
            expect(await proxyLogicV2Contract.getUserAge()).to.equal(31);

            // test_can_set_and_get_names_from_logicv2
            console.log('[*]test_can_set_and_get_names_from_logicv2');
            await proxyLogicV2Contract.setUserName("John");
            expect(await proxyLogicV2Contract.getUserName()).to.equal("John");
        });
    });

});