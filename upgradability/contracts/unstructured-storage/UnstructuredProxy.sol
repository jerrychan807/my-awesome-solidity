// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UnstructuredProxy {
    // `代理合约`通常需要所有者和实现地址来维护所有权和版本控制。
    //`代理合约`将这些属性指定为常量，并在合约的字节码中设置它们。

    // 因为在第一个逻辑合约中声明的变量占用了代理内部可用的第一个存储槽。
    // 请记住，程序将实现和所有权变量的值存储在相当随机的位置
    bytes32 private constant ownerPosition = bytes32(uint256(
        keccak256('eip1967.proxy.owner')) - 1 // TODO: 啥意思。。。
    );

    bytes32 private constant implementationPosition = bytes32(uint256(
        keccak256('eip1967.proxy.implementation')) - 1
    );

    function getImplementationAddress() public view returns (address impl){
        bytes32 _implementationPosition = implementationPosition;
        assembly {
            impl := sload(_implementationPosition) // TODO:sload???
        }
    }

    function setImplementationAddress(address _implementationAddress) public {
        bytes32 _implementationPosition = implementationPosition;
        assembly {
            sstore(_implementationPosition, _implementationAddress)
        }
    }

    function getOwnerAddress() external view returns (address ownr){
        bytes32 _ownerPosition = ownerPosition;
        assembly {
            ownr := sload(_ownerPosition)
        }
    }

    function setOwnerAddress(address _ownerAddress) external {
        bytes32 _ownerPosition = ownerPosition;
        assembly {
            sstore(_ownerPosition, _ownerAddress)
        }
    }

    fallback() external {
        address implementation = getImplementationAddress();
        assembly {
            let ptr := mload(0x40)
            calldatacopy(ptr, 0, calldatasize())
            let result := delegatecall(
            gas(),
            implementation,
            ptr,
            calldatasize(),
            0,
            0
            )
            returndatacopy(ptr, 0, returndatasize())
            switch result
            case 0 {revert(ptr, returndatasize())}
            default {return (ptr, returndatasize())}
        }
    }
}