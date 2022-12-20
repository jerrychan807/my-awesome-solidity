// scripts/2.upgradeV2.ts
import {ethers} from "hardhat";
import {upgrades} from "hardhat";

const proxyAddress = '0xfA86bf3B1aFC147276b4a21fDe03fc59F63c60ad'

async function main() {
    console.log(proxyAddress, " original Box(proxy) address")
    const BoxV2 = await ethers.getContractFactory("BoxV2")
    console.log("upgrade to BoxV2...")
    // 部署一个新的合约,并在 ProxyAdmin 中将代理链接到一个新的实施合约
    const boxV2 = await upgrades.upgradeProxy(proxyAddress, BoxV2)
    console.log(boxV2.address, " BoxV2 address(should be the same)")

    console.log(await upgrades.erc1967.getImplementationAddress(boxV2.address), " getImplementationAddress")
    console.log(await upgrades.erc1967.getAdminAddress(boxV2.address), " getAdminAddress")
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})