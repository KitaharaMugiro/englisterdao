// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

import "./interface/IERC20.sol";
import "./lib/SafeMath.sol";

contract Multisend {
    using SafeMath for uint256;

    event LogTokenBulkSentETH(address from, uint256 total);
    event LogTokenBulkSent(address token, address from, uint256 total);

    function ethSendSameValue(address[] memory _to, uint256 _value)
        external
        payable
    {
        uint256 sendAmount = _to.length.mul(_value);
        uint256 remainingValue = msg.value;
        address from = msg.sender;

        require(remainingValue >= sendAmount, "insuf balance");
        require(_to.length <= 255, "exceed max allowed");

        for (uint8 i = 0; i < _to.length; i++) {
            require(payable(_to[i]).send(_value), "failed to send");
        }

        emit LogTokenBulkSentETH(from, remainingValue);
    }

    function ethSendDifferentValue(
        address[] memory _to,
        uint256[] memory _value
    ) external payable {
        uint256 sendAmount = _value[0];
        uint256 remainingValue = msg.value;
        address from = msg.sender;

        require(remainingValue >= sendAmount, "insuf balance");
        require(_to.length == _value.length, "invalid input");
        require(_to.length <= 255, "exceed max allowed");

        for (uint8 i = 0; i < _to.length; i++) {
            require(payable(_to[i]).send(_value[i]));
        }
        emit LogTokenBulkSentETH(from, remainingValue);
    }

    function sendSameValue(
        address _tokenAddress,
        address[] memory _to,
        uint256 _value
    ) external {
        address from = msg.sender;
        require(_to.length <= 255, "exceed max allowed");
        uint256 sendAmount = _to.length.mul(_value);
        IERC20 token = IERC20(_tokenAddress);
        for (uint8 i = 0; i < _to.length; i++) {
            token.transferFrom(from, _to[i], _value);
        }
        emit LogTokenBulkSent(_tokenAddress, from, sendAmount);
    }

    function sendDifferentValue(
        address _tokenAddress,
        address[] memory _to,
        uint256[] memory _value
    ) external {
        address from = msg.sender;
        require(_to.length == _value.length, "invalid input");
        require(_to.length <= 255, "exceed max allowed");
        uint256 sendAmount;
        IERC20 token = IERC20(_tokenAddress);
        for (uint8 i = 0; i < _to.length; i++) {
            token.transferFrom(msg.sender, _to[i], _value[i]);
            sendAmount.add(_value[i]);
        }
        emit LogTokenBulkSent(_tokenAddress, from, sendAmount);
    }
}
