// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./../../interfaces/simple-interface/ILogic.sol";


contract MainContract {
    address owner;

    ILogic satteliteContract;

    constructor() {
        owner = msg.sender;
    }

    // 1.修改业务逻辑 2.执行更新函数
    function upgradeTo(address newImplementation) public {
        // 更新
        require(msg.sender == owner, "Only Owner");
        satteliteContract = ILogic(newImplementation);
    }

    // MainContract 在内部使用 SatteliteContract 的数据来响应用户的查询
    function getFirstName() external returns (bytes32){
        return satteliteContract.getFirstName();
    }

    function getLastName() external returns (bytes32){
        return satteliteContract.getLastName();
    }

    function setFirstName(bytes32 _firstName) external {
        satteliteContract.setFirstName(_firstName);
    }

    function setLastName(bytes32 _lastName) external {
        satteliteContract.setLastName(_lastName);
    }
}