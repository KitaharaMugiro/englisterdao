// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
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
     * @notice Exchange DAOTokens to Native Token(ETH, MATIC).
     */
    function _withdrawBy(address _to, uint256 _amount)
        internal
        whenNotPaused
        returns (uint256)
    {
        require((_amount > 0), "amount must be greater than 0");

        DAOToken daoToken = DAOToken(_daoTokenAddress);

        // Transfer Ethereum(ETH).
        uint256 totalSupply = daoToken.totalSupply(); // Get the totalSupply of DAOTokens.

        // Calculate the payment value.
        uint256 paymentAmount = SafeMath.div(
            SafeMath.mul(getBalance(), _amount),
            totalSupply
        );

        // Burn the exchanged DAOTokens.
        daoToken.burn(_to, _amount);

        // https://github.com/OpenZeppelin/openzeppelin-contracts/issues/3008
        Address.sendValue(payable(_to), paymentAmount);

        emit WithdrawEth(_amount, paymentAmount);
        return paymentAmount;
    }

    /**
     * @notice Exchange DAOTokens to Native Token(ETH, MATIC).
     */
    function withdrawProxy(
        address _to,
        address _from,
        uint256 _amount
    ) external whenNotPaused nonReentrant returns (uint256) {
        require((_amount > 0), "amount must be greater than 0");

        DAOToken daoToken = DAOToken(_daoTokenAddress);

        // Transfer Ethereum(ETH).
        uint256 totalSupply = daoToken.totalSupply(); // Get the totalSupply of DAOTokens.

        // Calculate the payment value.
        uint256 paymentAmount = SafeMath.div(
            SafeMath.mul(getBalance(), _amount),
            totalSupply
        );

        // Burn the exchanged DAOTokens.
        daoToken.burn(_from, _amount);

        // https://github.com/OpenZeppelin/openzeppelin-contracts/issues/3008
        Address.sendValue(payable(_to), paymentAmount);

        emit WithdrawEth(_amount, paymentAmount);
        return paymentAmount;
    }

    /**
     * @notice Exchange DAOTokens to Native Token(ETH, MATIC).
     */
    function withdraw(uint256 _amount)
        external
        whenNotPaused
        nonReentrant
        returns (uint256)
    {
        return _withdrawBy(msg.sender, _amount);
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
        uint256 total_supply = daoToken.totalSupply();
        if (total_supply == 0) {
            return 0;
        }
        return
            SafeMath.div(
                SafeMath.mul(getBalance(), 1000000000000000000),
                total_supply
            );
    }

    /**
     * @notice destroy the contract.
     */
    function destroy() external onlyOwner {
        //全てのETHをownerに転送する
        Address.sendValue(payable(owner()), getBalance());
        _pause();
    }
}
