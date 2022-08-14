// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "hardhat/console.sol";
import "./lib/SafeMath.sol";
import "./DAOToken.sol";
import "./interface/DAOEvents.sol";

contract DAOTreasury is Ownable, Pausable, ReentrancyGuard, DAOEvents {
    address private _daoTokenAddress;

    constructor() {}

    /**
     * @notice Set DAOToken Address.
     */
    function setDAOTokenAddress(address _address) external onlyOwner {
        _daoTokenAddress = _address;
    }

    /**
     * @notice ETH held by Treasury.
     */
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @notice Exchange DAOTokens to Ethereum(ETH).
     */
    function withdraw(uint256 _amount)
        external
        whenNotPaused
        nonReentrant
        returns (uint256)
    {
        require((_amount > 0), "amount must be greater than 0");

        DAOToken daoToken = DAOToken(_daoTokenAddress);

        uint256 balance = daoToken.balanceOf(address(msg.sender));
        require((balance >= _amount), "token balance is not enough");

        // Transfer Ethereum(ETH).
        uint256 total_supply = daoToken.totalSupply(); // Get the totalSupply of DAOTokens.

        // Calculate the payment value.
        uint256 pay_val = SafeMath.div(
            SafeMath.mul(getBalance(), _amount),
            total_supply
        );

        // https://github.com/OpenZeppelin/openzeppelin-contracts/issues/3008
        Address.sendValue(payable(msg.sender), pay_val);

        // Burn the exchanged DAOTokens.
        daoToken.burn(address(msg.sender), _amount);

        emit WithdrawEth(_amount, pay_val);
        return pay_val;
    }

    /**
     * @notice Send ETH to the Treasury.
     */
    function deposit() public payable whenNotPaused returns (bool) {
        emit Deposited(msg.sender, msg.value);
        return true;
    }

    /**
     * @notice get token rate(ETH/DAOToken)
     */
    function getCurrentTokenRate() public view returns (uint256) {
        DAOToken daoToken = DAOToken(_daoTokenAddress);
        uint256 total_supply = daoToken.totalSupply(); // Get the totalSupply of DAOTokens.
        return SafeMath.div(SafeMath.mul(getBalance(), 1), total_supply);
    }
}
