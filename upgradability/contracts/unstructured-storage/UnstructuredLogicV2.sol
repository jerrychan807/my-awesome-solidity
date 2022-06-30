// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UnstructuredLogicV2 {
    // 由于 `UnstructuredProxy` 的第一个存储槽被 `val` 变量占用，
    //`UnstructuredLogicV2` 必须在声明上一个逻辑合约的变量后声明自己的状态变量。
    uint256 val;
    uint256 newVal;

    function getVal() external view returns (uint256) {
        return newVal;
    }

    function setVal(uint256 _newVal) external {
        newVal = _newVal;
    }
}