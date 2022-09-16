pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./lib/Array.sol";
import "./DAOToken.sol";
import "./DAOTreasury.sol";
import "./lib/SafeMath.sol";
import "./interface/DAOEvents.sol";

contract TokenSupplySystem is Ownable, Pausable, ReentrancyGuard {
    // 配布するDAOトークンのアドレス
    // DAO token address to distribute
    address public daoTokenAddress;

    // DAOトレジャリーのアドレス
    // DAO treasury address
    address public daoTreasuryAddress;

    /**
     * @notice Set DAOToken Address.
     */
    function setDAOTokenAddress(address _address) external onlyOwner {
        daoTokenAddress = _address;
    }

    /**
     * @notice Set DAOTreasury Address.
     */
    function setDAOTreasuryAddress(address _address) external onlyOwner {
        daoTreasuryAddress = _address;
    }

    /**
     * @notice mint the dao token and store it inside this contract.
     */
    function mint(uint256 value) external onlyOwner {
        DAOToken(daoTokenAddress).mint(address(this), value);
    }

    /**
     * @notice burn the dao token inside this contract.
     */
    function burn(uint256 value) external onlyOwner {
        DAOToken(daoTokenAddress).burn(address(this), value);
    }

    function _pay(
        address _to,
        uint256 _amount,
        uint256 _fee
    ) internal {
        require(unclaimedBalance() >= _amount + _fee, "insufficient balance");
        DAOToken(daoTokenAddress).transfer(_to, _amount);
        if (_fee > 0) {
            DAOToken(daoTokenAddress).transfer(owner(), _fee);
        }
    }

    /**
     * @notice send Dao Token inside this contract to the specified address.
     */
    function pay(
        address _to,
        uint256 _amount,
        uint256 _fee
    ) public onlyOwner {
        _pay(_to, _amount, _fee);
    }

    /**
     * @notice send Dao Token inside this contract to the specified address list.
     */
    function batchPay(
        address[] memory _to,
        uint256[] memory _amount,
        uint256[] memory _fee
    ) public onlyOwner {
        require(_to.length == _amount.length, "length mismatch");
        require(_to.length == _fee.length, "length mismatch");
        for (uint256 i = 0; i < _to.length; i++) {
            _pay(_to[i], _amount[i], _fee[i]);
        }
    }

    /**
     * @notice get the balance of this contract.
     */
    function unclaimedBalance() public view returns (uint256) {
        return DAOToken(daoTokenAddress).balanceOf(address(this));
    }

    function _payWithNative(
        address _to,
        uint256 _amount,
        uint256 _fee
    ) internal {
        require(unclaimedBalance() >= _amount + _fee, "insufficient balance");
        if (_amount > 0) {
            DAOTreasury(daoTreasuryAddress).withdrawProxy(
                _to,
                address(this),
                _amount
            );
        }

        if (_fee > 0) {
            DAOToken(daoTokenAddress).transfer(address(this.owner()), _fee);
        }
    }

    /**
     * @notice convert DAO token into ETH and send it to the specified address.
     */
    function payWithNative(
        address _to,
        uint256 _amount,
        uint256 _fee
    ) public onlyOwner nonReentrant whenNotPaused {
        _payWithNative(_to, _amount, _fee);
    }

    /**
     * @notice pay and payWithNative
     */
    function payAndPayWithNative(
        address _to,
        uint256 _amount,
        uint256 _amountNative,
        uint256 _fee
    ) public onlyOwner nonReentrant whenNotPaused {
        require(
            unclaimedBalance() >= _amount + _amountNative + _fee,
            "insufficient balance"
        );
        _pay(_to, _amount, 0);
        _payWithNative(_to, _amountNative, _fee);
    }
}
