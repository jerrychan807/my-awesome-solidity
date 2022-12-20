// test/Box.js
// Load dependencies
const {expect} = require('chai');

import {ethers, deployments, getNamedAccounts, getUnnamedAccounts, upgrades} from 'hardhat';
import {time, loadFixture} from "@nomicfoundation/hardhat-network-helpers";


async function deployFixture() {
    const Box = await ethers.getContractFactory("Box");
    const box = await upgrades.deployProxy(Box, [42], {initializer: 'store'})

    return {box};
}

// Start test block
describe('Box', function () {
    // Test case
    it('retrieve returns a value previously stored', async function () {
        const {box} = await loadFixture(deployFixture);

        let initValue = await box.retrieve()
        console.log("initValue: " + initValue.toString())
        // Test if the returned value is the same one
        // Note that we need to use strings to compare the 256 bit integers
        await box.store(100)
        expect((await box.retrieve()).toString()).to.equal('100');

    });
});