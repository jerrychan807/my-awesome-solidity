import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const {deployments, getNamedAccounts} = hre;
    const {deploy} = deployments;

    const {tokenOwner} = await getNamedAccounts();
    const Permit2 = await deployments.get('Permit2');
    await deploy('Permit2Vault', {
        from: tokenOwner,
        args: [Permit2.address],
        log: true,
    });
};
export default func;
func.tags = ['Permit2Vault'];
module.exports.dependencies = ['Permit2'];
