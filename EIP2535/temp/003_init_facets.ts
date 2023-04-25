import {ethers} from 'hardhat'
import {DeployFunction} from 'hardhat-deploy/types'
import {IDiamondLoupe} from '../typechain'
import {addFacets, addOrReplaceFacets} from '../utils/diamond'
import {HardhatRuntimeEnvironment} from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {

    const {deployments, getNamedAccounts, ethers} = hre
    const {deploy} = deployments

    const diamondLoupeFacet = await deployments.get('DiamondLoupeFacet')
    const diamond = await deployments.get('Diamond')

    // const loupe = <IDiamondLoupe>(
    //     await ethers.getContractAt('IDiamondLoupe', diamond.address)
    // )
    //
    // try {
    //     await loupe.facets()
    // } catch (e) {
    //     await addFacets([diamondLoupeFacet], diamond.address)
    // }

    await addOrReplaceFacets([diamondLoupeFacet], diamond.address)
}

export default func
func.id = 'init_facets'
func.tags = ['InitFacets']
func.dependencies = ['InitialFacets', 'Diamond']