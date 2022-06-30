import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const {deployments, getNamedAccounts} = hre;
    const {deploy} = deployments;

    const {Owner} = await getNamedAccounts();
    const EternalStorage = await deployments.get('EternalStorage');
    const EternalLogicLibrary = await deployments.get('EternalLogicLibrary');

    await deploy('EternalLogicV1', {
        from: Owner,
        args: [EternalStorage.address],
        libraries: {
            EternalLogicLibrary: EternalLogicLibrary.address
        },
        log: true,
    });
};
export default func;
func.tags = ['EternalLogicV1'];
func.dependencies = ['EternalStorage', 'EternalLogicLibrary'];