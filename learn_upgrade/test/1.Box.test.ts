// test/Box.js
// Load dependencies
const {expect} = require('chai');

import {ethers, deployments, getNamedAccounts, getUnnamedAccounts} from 'hardhat';
import {time, loadFixture} from "@nomicfoundation/hardhat-network-helpers";


async function deployFixture() {
    const Box = await ethers.getContractFactory("Box");
    const box = await Box.deploy();
    await box.deployed();
    return {box};
}

// Start test block
describe('Box', function () {
    // Test case
    it('retrieve returns a value previously stored', async function () {
        const {box} = await loadFixture(deployFixture);
        // Store a value
        await box.store(42);

        // Test if the returned value is the same one
        // Note that we need to use strings to compare the 256 bit integers
        expect((await box.retrieve()).toString()).to.equal('42');
        await box.store(100)
        expect((await box.retrieve()).toString()).to.equal('100');

    });
});