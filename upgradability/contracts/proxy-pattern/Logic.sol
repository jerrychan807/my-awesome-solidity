// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Logic 合约包含应用程序的业务逻辑
// 代理合约只是将传入调用委托给逻辑合约并将响应返回给用户。类似桥梁的作用
//
contract Logic {
    uint256 myInt;

    constructor(){
        myInt = 10;
    }

    function getMyInt() external view returns(uint256){
        return myInt;
    }

    function setMyInt(uint256 _myInt) external {
        myInt = _myInt;
    }
}
