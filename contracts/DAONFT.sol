// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract DAONFT is ERC721, ERC721Enumerable, Pausable, AccessControl {
    using Counters for Counters.Counter;
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    Counters.Counter private _tokenIdCounter;
    string private _baseTokenURI;

    constructor(string memory _tokenName, string memory _tokenSymbol)
        ERC721(_tokenName, _tokenSymbol)
    {
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function setupMinterRole(address _minter) public {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "DAONFT: must have admin role to setup minter"
        );
        _setupRole(MINTER_ROLE, _minter);
    }

    function _baseURI() internal view override returns (string memory) {
        // example:
        // https://raw.githubusercontent.com/KitaharaMugiro/englisterdao/main/contracts/metadata/daonft/
        return _baseTokenURI;
    }

    function setBaseURI(string memory _newBaseTokenURI) public {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "DAONFT: must have admin role to set base URI"
        );
        _baseTokenURI = _newBaseTokenURI;
    }

    function pause() public {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "DAONFT: must have admin role to pause"
        );
        _pause();
    }

    function unpause() public {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "DAONFT: must have admin role to unpause"
        );
        _unpause();
    }

    function safeMint(address to) public {
        require(
            hasRole(MINTER_ROLE, msg.sender),
            "DAONFT: must have minter role to mint"
        );
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    function getLatestTokenId() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
