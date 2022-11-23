// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Verify {
    function VerifyMessage(bytes32 _hashedMessage, uint8 _v, bytes32 _r, bytes32 _s) public pure returns (address) {
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 prefixedHashMessage = keccak256(abi.encodePacked(prefix, _hashedMessage));
        address signer = ecrecover(prefixedHashMessage, _v, _r, _s);
        return signer;
    }

    /*
         * 将mint地址（address类型）和tokenId（uint256类型）拼成消息msgHash
         * _account: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
         * _tokenId: 0
         * 对应的消息msgHash: 0x1bf2c0ce4546651a1a2feb457b39d891a6b83931cc2454434f39961345ac378c
     */
    function getMessageHash(address _account, uint256 _tokenId) public pure returns (bytes32){
        return keccak256(abi.encodePacked(_account, _tokenId));
    }

    function getSingleMessageHash(string memory _message) public pure returns (bytes32){
        return keccak256(abi.encodePacked(_message));
    }

    /**
        * @dev 返回 以太坊签名消息
         * `hash`：消息
         * 遵从以太坊签名标准：https://eth.wiki/json-rpc/API#eth_sign[`eth_sign`]
         * 以及`EIP191`:https://eips.ethereum.org/EIPS/eip-191`
         * 添加"\x19Ethereum Signed Message:\n32"字段，防止签名的是可执行交易。
     */
    function toEthSignedMessageHash(bytes32 hash) public pure returns (bytes32) {
        // 哈希的长度为32
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
    }

    function verify(address _signer, string memory _message, uint8 _v, bytes32 _r, bytes32 _s) public pure returns (bool) {
        bytes32 msgHash = keccak256(abi.encodePacked(_message));
        bytes32 msgDigest = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", msgHash));
        return ecrecover(msgDigest, _v, _r, _s) == _signer;
    }

}
