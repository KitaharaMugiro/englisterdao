pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "hardhat/console.sol";
import "./lib/Array.sol";

contract ContributionPoll is AccessControl {
    int256 public pollId = 0;
    mapping(int256 => address[]) candidates; // pollId => [candidate1, candidate2, ...]
    mapping(int256 => address[]) voters; // pollId => [candidate1, candidate2, ...]

    /**
     * @notice Settle the current poll, and start new poll
     */
    function settleAndCreateNewPoll() external {
        _settleContributionPoll();
        _createContributionPoll();
    }

    /**
     * @notice Settle the current poll
     */
    function _settleContributionPoll() internal {
        // TODO : 貢献度投票の集計を行う
    }

    /**
     * @notice start new poll
     */
    function _createContributionPoll() internal {
        pollId++;
    }

    /**
     * @notice candidate to the current poll
     */
    function candidateToContributionPoll() external {
        //すでにmsg.senderが立候補済みか確認
        for (uint256 index = 0; index < candidates[pollId].length; index++) {
            require(
                candidates[pollId][index] != msg.sender,
                "You are already candidate to the current poll."
            );
        }
        candidates[pollId].push(msg.sender);
    }

    /**
     * @notice vote to the current poll
     */
    function vote(address candidate) external returns (bool) {
        // Check if the candidate is in the current poll
        require(
            Array.contains(candidates[pollId], candidate),
            "The candidate is not in the current poll."
        );
        // Check if the voter is already voted
        require(
            !Array.contains(voters[pollId], msg.sender),
            "You are already voted."
        );

        return true;
    }

    /**
     * @notice get the current poll's candidates
     */
    function getCandidates() external view returns (address[] memory) {
        return candidates[pollId];
    }
}
