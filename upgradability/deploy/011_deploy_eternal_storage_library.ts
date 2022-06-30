import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

// const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
//     const {deployments, getNamedAccounts} = hre;
//     const {deploy} = deployments;
//
//     const {Owner} = await getNamedAccounts();
//
//     await deploy('EternalStorage', {
//         from: Owner,
//         args: [],
//         log: true,
//     });
// };
// export default func;
// func.tags = ['EternalStorage'];


const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const {deployments, getNamedAccounts} = hre;
    const {deploy} = deployments;

    const {Owner} = await getNamedAccounts();

    await deploy('EternalLogicLibrary', {
        from: Owner,
        args: [],
        log: true,
    });


};
export default func;
func.tags = ['EternalLogicLibrary'];