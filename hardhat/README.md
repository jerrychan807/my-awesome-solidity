# hardhat使用记录

## 部署脚本前后有依赖

[参考链接](https://github.com/wighawag/hardhat-deploy/tree/master#deploy-scripts-tags-and-dependencies)

```js
// 先部署的脚本
module.exports = async ({getNamedAccounts, deployments}) => {
    const {deployIfDifferent, log} = deployments;
    const namedAccounts = await getNamedAccounts();
    const {deployer} = namedAccounts;
    const deployResult = await deploy('Token', {
        from: deployer,
        args: ['hello', 100],
    });
    if (deployResult.newlyDeployed) {
        log(
            `contract Token deployed at ${deployResult.address} using ${deployResult.receipt.gasUsed} gas`
        );
    }
};
module.exports.tags = ['Token'];
```

```js
// 依赖上一个部署脚本
module.exports = async function ({getNamedAccounts, deployments}) {
    const {deployIfDifferent, log} = deployments;
    const namedAccounts = await getNamedAccounts();
    const {deployer} = namedAccounts;
    // 重点!!!!!
    const Token = await deployments.get('Token');
    const deployResult = await deploy('Sale', {
        from: deployer,
        contract: 'ERC721BidSale',
        args: [Token.address, 1, 3600],
    });
    if (deployResult.newlyDeployed) {
        log(
            `contract Sale deployed at ${deployResult.address} using ${deployResult.receipt.gasUsed} gas`
        );
    }
};
module.exports.tags = ['Sale'];
// 重点!!!!!
module.exports.dependencies = ['Token']; // this ensure the Token script above is executed first, so `deployments.get('Token')` succeeds
```


使用了library

[参考](https://github.com/wighawag/hardhat-deploy#handling-contract-using-libraries)

```js
import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {ethers} from "hardhat";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const {deployments, getNamedAccounts} = hre;
    const {deploy} = deployments;

    const {Owner} = await getNamedAccounts();
    const EternalStorage = await deployments.get('EternalStorage');
    const EternalLogicLibrary = await deployments.get('EternalLogicLibrary');
    await deploy('EternalLogicV2', {
        from: Owner,
        args: [EternalStorage.address],
        libraries: {
            EternalLogicLibrary: EternalLogicLibrary.address
        },
        log: true,
    });
};
export default func;
func.tags = ['EternalLogicV2'];
func.dependencies = ['EternalStorage', 'EternalLogicLibrary'];
```