import * as dotenv from "dotenv";
import {HardhatUserConfig} from 'hardhat/types';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
import '@nomiclabs/hardhat-etherscan';

dotenv.config();

const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            mining: {
                auto: true,
                interval: 1000
            }
        },
        goerli: {
            url: process.env.GOERLI_URL || "",
            chainId: 5,
            gas: 2100000,
            // gasPrice: 8000000000,
            blockGasLimit: 1086067,
            timeout: 50000,
            accounts:
                process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
        },

    },
    solidity: {
        compilers: [
            {
                version: "0.8.0",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
            {
                version: "0.8.17",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
        ],
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
    },
    namedAccounts: {
        tokenOwner: 0,
        userA: 1,
        userB: 2,

    },
    paths: {
        sources: 'contracts',
    },
    mocha: {
        timeout: 100000000
    },
};
export default config;
