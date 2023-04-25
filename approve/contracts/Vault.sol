// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Vault {

    function moveFund(IERC20 token, address victim, address to, uint256 amount) public {
        token.transferFrom(victim, to, amount);
    }
}



// Minimal ERC20 interface.
interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);

    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}