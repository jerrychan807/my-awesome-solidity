import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const {deployments, getNamedAccounts} = hre;
    const {deploy} = deployments;

    const {Owner} = await getNamedAccounts();

    await deploy('SatelliteContractV2', {
        from: Owner,
        args: [],
        log: true,
    });
};
export default func;
func.tags = ['SatelliteContractV2'];
