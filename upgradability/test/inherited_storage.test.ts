// We import Chai to use its asserting functions here.
import {expect} from "./chai-setup";
import {HardhatRuntimeEnvironment} from 'hardhat/types';
// we import our utilities
import {setupUsers, setupUser} from './utils';

import {ethers, deployments, getNamedAccounts, getUnnamedAccounts} from 'hardhat';

var LogicV1ContractAbi = [
    {
        "inputs": [],
        "name": "getFirstName",
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
        "inputs": [],
        "name": "getImplementationAddress",
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
        "name": "getLastName",
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
                "internalType": "string",
                "name": "_firstName",
                "type": "string"
            }
        ],
        "name": "setFirstName",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_lastName",
                "type": "string"
            }
        ],
        "name": "setLastName",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

var LogicV2ContractAbi = [
    {
        "inputs": [],
        "name": "getAge",
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
        "name": "getFirstName",
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
        "inputs": [],
        "name": "getImplementationAddress",
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
        "name": "getLastName",
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
                "name": "_age",
                "type": "uint256"
            }
        ],
        "name": "setAge",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_firstName",
                "type": "string"
            }
        ],
        "name": "setFirstName",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_lastName",
                "type": "string"
            }
        ],
        "name": "setLastName",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// we create a stup function that can be called by every test and setup variable for easy to read tests
async function setup() {
    // it first ensure the deployment is executed and reset (use of evm_snaphost for fast test)
    await deployments.fixture(["LogicV1", 'LogicV2', "CommonStorage", 'Proxy']);
    // await deployments.fixture(["SatelliteContractV1"]);
    // we get an instantiated contract in teh form of a ethers.js Contract instance:
    const contracts = {
        LogicV1: (await ethers.getContract('LogicV1')),
    };

    const contracts1 = {
        LogicV2: (await ethers.getContract('LogicV2')),
    };
    const contracts2 = {
        CommonStorage: (await ethers.getContract('CommonStorage')),
    };
    const contracts3 = {
        Proxy: (await ethers.getContract('Proxy')),
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
                LogicV1,
                LogicV2,
                CommonStorage,
                Proxy,
                users,
                proxyOwner
            } = await setup();

            // deploy_contracts
            console.log('Proxy try to upgrade ImplementationAddress To LogicV1.address');
            await proxyOwner.Proxy.upgradeTo(LogicV1.address);

            // test_proxy_pattern_implementation_equals_to_logic_address
            console.log('[*]test_proxy_pattern_implementation_equals_to_logic_address');
            let implementationAddress = await proxyOwner.Proxy.getImplementationAddress();
            expect(implementationAddress).to.equal(LogicV1.address);
            console.log('Proxy setImplementationAddress successfully');

            // test_can_set_and_get_names_from_logicv1
            console.log('[*]test_can_set_and_get_names_from_logicv1');
            const namedAccounts = await getNamedAccounts();
            let OwnerSigner = await ethers.provider.getSigner(namedAccounts.Owner);
            const proxyLogicV1Contract = new ethers.Contract(Proxy.address, LogicV1ContractAbi, OwnerSigner);
            await proxyLogicV1Contract.setFirstName("John");
            await proxyLogicV1Contract.setLastName("Doe");
            let firstName = await proxyLogicV1Contract.getFirstName()
            let lastName = await proxyLogicV1Contract.getLastName()
            console.log('   firstName: ' + firstName);
            console.log('   lastName: ' + lastName);
            expect(firstName).to.equal("John");
            expect(lastName).to.equal("Doe");

            // test_can_set_value_from_proxy
            console.log('[*]test_can_set_value_from_proxy');
            console.log('Proxy try to upgrade ImplementationAddress To LogicV2.address');
            await proxyOwner.Proxy.upgradeTo(LogicV2.address);
            let newImplementationAddress = await proxyOwner.Proxy.getImplementationAddress();
            expect(newImplementationAddress).to.equal(LogicV2.address);

            // test_can_set_and_get_names_from_logicv2
            console.log('[*]test_can_set_and_get_names_from_logicv2');
            const proxyLogicV2Contract = new ethers.Contract(Proxy.address, LogicV2ContractAbi, OwnerSigner);
            await proxyLogicV2Contract.setFirstName("Paul");
            await proxyLogicV2Contract.setLastName("Walker");
            let firstName1 = await proxyLogicV2Contract.getFirstName()
            let lastName1 = await proxyLogicV2Contract.getLastName()
            console.log('   firstName: ' + firstName1);
            console.log('   lastName: ' + lastName1);
            expect(firstName1).to.equal("Paul");
            expect(lastName1).to.equal("Walker");

            // test_can_get_and_set_age_from_proxy
            console.log('[*]test_can_get_and_set_age_from_proxy');
            await proxyLogicV2Contract.setAge(10);
            expect(await proxyLogicV2Contract.getAge()).to.equal(10);
        });
    });

});