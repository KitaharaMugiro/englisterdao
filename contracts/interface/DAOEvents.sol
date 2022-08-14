pragma solidity ^0.8.6;

interface DAOEvents {
    event SettlePoll(int256 pollId);
    event CreatePoll(int256 pollId);
    event VotingEnabled(int256 pollId, bool enabled);
    event Voted(int256 pollId, address indexed voter);
    event Candidated(int256 pollId, address indexed candidate);
    event Deposited(address indexed sender, uint256 amount);
    event WithdrawEth(uint256 amount, uint256 payedAmount);
}
