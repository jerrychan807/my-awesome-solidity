import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const {deployments, getNamedAccounts} = hre;
    const {deploy} = deployments;

    const {tokenOwner} = await getNamedAccounts();
    await deploy('Comp', {
        from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        args: ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"],
        log: true,
    });
};
export default func;
func.tags = ['Comp'];
