import {HardhatRuntimeEnvironment} from 'hardhat/types'
import {DeployFunction} from 'hardhat-deploy/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const {deployments, getNamedAccounts, ethers} = hre
    const {deploy} = deployments

    const {deployer} = await getNamedAccounts()
    // const diamondCutFacet = await ethers.getContract('DiamondCutFacet')
    await deployments.fixture(["InitialFacets"]);
    const diamondCutFacetDev = await deployments.get('DiamondCutFacet');
    const diamondCutFacet = await ethers.getContractAt(
        diamondCutFacetDev.abi,
        diamondCutFacetDev.address
    );
    await deploy('Diamond', {
        from: deployer,
        args: [deployer, diamondCutFacet.address],
        log: true,
    })
}
export default func
func.id = 'deploy_diamond'
func.tags = ['Diamond']
module.exports.dependencies = ['InitialFacets'];