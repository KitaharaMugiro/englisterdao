pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "hardhat/console.sol";
import "./lib/Array.sol";
import "./DAOToken.sol";

contract ContributionPoll is AccessControl {
    int256 public pollId = 0;
    address public daoTokenAddress;
    mapping(int256 => address[]) candidates; // pollId => [candidate1, candidate2, ...]
    mapping(int256 => address[]) voters; // pollId => [candidate1, candidate2, ...]

    /**
     * @notice DAO Token Addressを指定する
     * TODO: constructorで指定するようにする, もしくは権限設定
     */
    function setDaoTokenAddress(address _daoTokenAddress) external {
        daoTokenAddress = _daoTokenAddress;
    }

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
     * @notice SenderがDAO TokenのTop10のホルダーであるかをチェックする
     */
    function _isTop10() internal view returns (bool) {
        DAOToken daoToken = DAOToken(daoTokenAddress);
        if (Array.contains(daoToken.getTop(10), msg.sender)) {
            return true;
        }
        return false;
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

        // DAOトークンのTOP10に入っていない場合は投票することはできない
        require(_isTop10(), "You are not in the top 10 holder.");

        // 投票した人を記録
        voters[pollId].push(msg.sender);

        return true;
    }

    /**
     * @notice get the current poll's candidates
     */
    function getCandidates() external view returns (address[] memory) {
        return candidates[pollId];
    }
}
