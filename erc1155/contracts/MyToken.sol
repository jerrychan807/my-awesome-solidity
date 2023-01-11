// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MyToken is ERC1155, Ownable, ERC1155Supply {
    using Strings for uint256;

    constructor() ERC1155("") {}

    /// @dev End token Id => URI that overrides `baseURI + tokenId` convention.
    mapping(uint256 => string) public _baseURI;

    function setBaseURI(uint256 _tokenId, string memory newuri) public onlyOwner {
        _baseURI[_tokenId] = newuri;
    }

    /// @dev Returns the URI for a given tokenId.
    function uri(uint256 _tokenId) public view override returns (string memory) {
        return string(abi.encodePacked(_baseURI[_tokenId], _tokenId.toString()));
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data)
        public
        onlyOwner
    {
        _mint(account, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        override(ERC1155, ERC1155Supply)
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}