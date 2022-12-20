// scripts/4.prepareV4.ts
import { ethers } from "hardhat";
import { upgrades } from "hardhat";

const proxyAddress = '0xfA86bf3B1aFC147276b4a21fDe03fc59F63c60ad'

async function main() {
  console.log(proxyAddress," original Box(proxy) address")
  const BoxV4 = await ethers.getContractFactory("BoxV4")
  console.log("Preparing upgrade to BoxV4...");
  const boxV4Address = await upgrades.prepareUpgrade(proxyAddress, BoxV4);
  console.log(boxV4Address, " BoxV4 implementation contract address")
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})