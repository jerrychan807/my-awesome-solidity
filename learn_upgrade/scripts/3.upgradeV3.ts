import {ethers} from "hardhat";
import {upgrades} from "hardhat";

const proxyAddress = '0xfA86bf3B1aFC147276b4a21fDe03fc59F63c60ad'

// const proxyAddress = '0x1CD0c84b7C7C1350d203677Bb22037A92Cc7e268'
async function main() {
    console.log(proxyAddress, " original Box(proxy) address")
    const BoxV3 = await ethers.getContractFactory("BoxV3")
    console.log("upgrade to BoxV3...")
    const boxV3 = await upgrades.upgradeProxy(proxyAddress, BoxV3)
    console.log(boxV3.address, " BoxV3 address(should be the same)")

    console.log(await upgrades.erc1967.getImplementationAddress(boxV3.address), " getImplementationAddress")
    console.log(await upgrades.erc1967.getAdminAddress(boxV3.address), " getAdminAddress")
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})