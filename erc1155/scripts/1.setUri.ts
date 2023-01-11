// scripts/1.set_uri.ts
import {ethers, run, network} from "hardhat"

async function main() {

    const TokenFactory = await ethers.getContractFactory("MyToken")
    console.log("Deploying Token...")
    const Token = await TokenFactory.deploy()
    await Token.deployed()

    console.log("Token Contract deployed at:", Token.address)

    await Token.setBaseURI(0, "ipfs://QmavJyMNJiAz9hXTmZrEuFMi8yrpiNjUbFujHE57Z6avc3/");
    let baseUri = await Token.uri(0);
    console.log("baseUri:", baseUri.toString());

    await Token.setBaseURI(1, "ipfs://QmTwC69n8hPzWYw1wHXT8Dc8h7PnjtAfzLFHPLz423DadA/");
    let baseUri1 = await Token.uri(1);
    console.log("baseUri1:", baseUri1.toString());

    await Token.setBaseURI(2, "ipfs://QmTcwvsf1XXi5kKkBbk7iNX8svZD6iE4JE6NXioFiRTKbD/");
    let baseUri2 = await Token.uri(2);
    console.log("baseUri2:", baseUri2.toString());

    await Token.setBaseURI(3, "ipfs://QmduXsTYa8NQ4xfFwXbLLpkkznwhwS9b1MMa25SENcvcRC/");
    let baseUri3 = await Token.uri(1);
    console.log("baseUri3:", baseUri3.toString());

    await Token.mint("0xa48d2ed854effb7c4dafdb06931633699042c62a", 0, 100, "0x");
    let balance = await Token.balanceOf("0xa48d2ed854effb7c4dafdb06931633699042c62a", 0);
    console.log("balance:", balance.toString());
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})