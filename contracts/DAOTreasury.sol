// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "hardhat/console.sol";

import "./DAOToken.sol";

contract DAOTreasury is Ownable, Pausable, ReentrancyGuard {
    address private _daoTokenAddress;

    constructor() {}

    /**
     * @notice Set DAOToken Address.
     */
    function setDAOTokenAddress(address _address) external onlyOwner {
        _daoTokenAddress = _address;
    }

    /**
     * @notice Charges for ETH held by Treasury.
     */
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @notice Can't pull out ETH(balance) anyone.
     * Below is a sample code.
     * This code is withdraw the full amount to the owner's wallet.
     * It's comment out.
     */
    function withdraw() external onlyOwner returns (bool) {
        //Address.sendValue(payable(this.owner()), address(this).balance);
        return true;
    }

    /**
     * @notice Exchange DAOTokens to Ethereum(ETH).
     */
    function requestForTokenToEth(uint256 _amount)
        external
        whenNotPaused
        nonReentrant
        returns (uint256)
    {
        require((_amount > 0), "Token(amount) must be at least 1");

        DAOToken daoToken = DAOToken(_daoTokenAddress);

        // Verify that hold(balance) the DAOTokens.
        uint256 balance = daoToken.balanceOf(address(msg.sender));
        require((balance >= _amount), "Not enough tokens");

        // Transfer Ethereum(ETH).
        uint256 total_supply = daoToken.totalSupply(); // Get the totalSupply of DAOTokens.
        uint256 pay_val = (getBalance() * _amount) / total_supply; // Calculate the payment value.

        // https://github.com/OpenZeppelin/openzeppelin-contracts/issues/3008
        Address.sendValue(payable(msg.sender), pay_val);

        // Burn the exchanged DAOTokens.
        daoToken.burn(address(msg.sender), _amount);

        return pay_val;
    }

    /**
     * @notice Send ETH to the Treasury.
     */
    function deposit() public payable whenNotPaused returns (bool) {
        return true;
    }
}
