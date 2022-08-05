pragma solidity ^0.8.6;

interface DAOEvents {
    event SettlePoll(uint256 pollId);
    event StartPoll(uint256 pollId);
    event PollEnabeld(bool enabled);
    event Vote(uint256 pollId, address indexed voter);
    event Candidate(uint256 pollId, address indexed candidate);
    event Deposit(uint256 pollId, address indexed voter, uint256 amount);
}
