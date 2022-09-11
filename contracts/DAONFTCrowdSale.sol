// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./DAOToken.sol";
import "./DAONFT.sol";

contract DAONFTCrowdSale is Ownable {
    mapping(address => bool) whitelist;
    address private _daoTokenAddress;
    address private _daoNftAddress;
    uint256 public price;

    constructor() {}

    /**
     * @notice Set DAOToken Address.
     */
    function setDAOTokenAddress(address _address) external onlyOwner {
        _daoTokenAddress = _address;
    }

    /**
     * @notice Set DAOToken Address.
     */
    function setDAONftAddress(address _address) external onlyOwner {
        _daoNftAddress = _address;
    }

    /**
     * @notice Set Price.
     */
    function setPrice(uint256 _amount) external onlyOwner {
        price = _amount;
    }

    modifier onlyWhitelisted() {
        require(isWhitelisted(msg.sender), "You are not in the whitelist");
        _;
    }

    function addWhitelist(address _address) public onlyOwner {
        whitelist[_address] = true;
    }

    function removeWhitelist(address _address) public onlyOwner {
        whitelist[_address] = false;
    }

    function isWhitelisted(address _address) public view returns (bool) {
        return whitelist[_address];
    }

    function buy() public onlyWhitelisted {
        DAOToken daoToken = DAOToken(_daoTokenAddress);
        DAONFT dAONFT = DAONFT(_daoNftAddress);
        require(
            daoToken.balanceOf(msg.sender) >= price,
            "You don't have enough dao tokens"
        );
        daoToken.burn(msg.sender, price);
        dAONFT.safeMint(msg.sender);
        whitelist[msg.sender] = false;
    }
}
