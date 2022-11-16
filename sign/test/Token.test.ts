import {expect} from "./chai-setup";

// we import our utilities

import {ethers, deployments, getNamedAccounts, getUnnamedAccounts} from 'hardhat';
import {ADMIN_PRIVATE_KEY, NormalUser1_PRIVATE_KEY, NormalUser2_PRIVATE_KEY, compAbi} from './utils/setting';


describe("Token contract", function () {
    const adminUser = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
    const normalAddr1 = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
    const normalAddr2 = '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC';

    const adminUserPk = ADMIN_PRIVATE_KEY;
    const normalUser1Pk = NormalUser1_PRIVATE_KEY;
    const normalUser2Pk = NormalUser2_PRIVATE_KEY;

    const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
    let adminUserWallet = new ethers.Wallet(adminUserPk, provider);
    let normalUser1Wallet = new ethers.Wallet(normalUser1Pk, provider);
    let normalUser2Wallet = new ethers.Wallet(normalUser2Pk, provider);

    // before(async function () {
    //     const namedAccounts = await getNamedAccounts();
    //     user = namedAccounts.user;
    //     userSigner = await ethers.provider.getSigner(user);
    //
    // });

    // beforeEach(async function () {
    //
    // });

    describe("contract tests1", function () {
        it("Check normal address balance", async function () {
            // let balance = await user.getBalance();
            console.log("Normal addr: 123");
            expect(1).to.equal(1);
        });
    });

    // 测试
    describe("contract tests1", function () {
        it('check balance', async () => {
            const tokenContract = await ethers.getContract("Comp");
            let adminUserTokenBalanceWeiBefore = await tokenContract.balanceOf(adminUser);
            console.log("admin Balance: " + ethers.utils.formatEther(adminUserTokenBalanceWeiBefore));
        });

        it('transfer', async () => {
            const tokenContract = await ethers.getContract("Comp");
            let tokenContractWithSigner = tokenContract.connect(adminUserWallet);

            let adminUserTokenBalanceWeiBefore = await tokenContract.balanceOf(adminUser);
            console.log("admin Balance: " + ethers.utils.formatEther(adminUserTokenBalanceWeiBefore));

            let amount = ethers.utils.parseEther('10.0');
            // admin地址转账-> 其他地址
            await tokenContractWithSigner.transfer(normalAddr1, amount)
            await tokenContractWithSigner.transfer(normalAddr2, amount)

            let adminUserTokenBalanceWeiAfter = await tokenContract.balanceOf(adminUser);
            console.log("admin Balance After: " + ethers.utils.formatEther(adminUserTokenBalanceWeiAfter));
        });

        it.only('query delegate', async () => {
            const tokenContract = await ethers.getContract("Comp");
            let normalAddr1DelegatesBalance = await tokenContract.delegates(normalAddr1);
            console.log("normalAddr1DelegatesBalance : " + ethers.utils.formatEther(normalAddr1DelegatesBalance));

            let normalAddr2DelegatesBalance = await tokenContract.delegates(normalAddr2);
            console.log("normalAddr2DelegatesBalance : " + ethers.utils.formatEther(normalAddr2DelegatesBalance));

            let adminDelegatesBalance = await tokenContract.delegates(adminUser);
            console.log("adminDelegatesBalance : " + ethers.utils.formatEther(adminDelegatesBalance));
        });

        it('delegate', async () => {
            const tokenContract = await ethers.getContract("Comp");
            let tokenContractWithSigner = tokenContract.connect(normalUser1Wallet);

            const sig = "0xfa147120c87bd59e19d148c76b55e3013513699fcdb391803f747bdf1d47997e1564f8ab9114dacc89cb6cd57a7463d8a721a3d90ef26b8927774a46cccebc1f1b";
            const r = '0x' + sig.substring(2).substring(0, 64);
            const s = '0x' + sig.substring(2).substring(64, 128);
            const v = '0x' + sig.substring(2).substring(128, 130);
            let delegatee = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
            let nonce = 0
            let expiry = 10000000000
            await tokenContractWithSigner.delegateBySig(delegatee, nonce, expiry, v, r, s, {gasLimit: 305000});

        });
    });
});