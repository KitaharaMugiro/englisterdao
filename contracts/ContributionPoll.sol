pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "hardhat/console.sol";

contract ContributionPoll is AccessControl {
    int256 public pollId = 0;

    /**
     * @notice Settle the current poll, and start new poll
     */
    function settleCurrentAndCreateNewAuction() external {
        _settleContributionPoll();
        _createContributionPoll();
    }

    /**
     * @notice Settle the current poll
     */
    function _settleContributionPoll() internal {
        // TODO : 貢献度投票の集計コントラクトを呼び出す
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
        // TODO
    }

    /**
     * @notice vote to the current poll
     */
    function vote(address candidate) external {
        // TODO
    }
}
