pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "hardhat/console.sol";
import "./lib/Array.sol";
import "./DAOToken.sol";

struct Vote {
    address voter;
    address[] candidates;
    uint256[] points;
}

contract ContributionPoll is AccessControl {
    int256 public pollId = 0;
    address public daoTokenAddress;
    uint256 private RANK_FOR_VOTE = 10; //DAOトークンの保有順位がRANK_FOR_VOTE以上なら投票可能
    mapping(int256 => address[]) candidates; // pollId => [candidate1, candidate2, ...]

    //TODO: votesからvotersは取得できるため、リファクタリングして削除する
    mapping(int256 => address[]) voters; // pollId => [candidate1, candidate2, ...]
    mapping(int256 => Vote[]) public votes; // pollId => [vote1, vote2, ...]

    /**
     * @notice DAO Token Addressを指定する
     * TODO: constructorで指定するようにする, もしくは権限設定
     */
    function setDaoTokenAddress(address _daoTokenAddress) external {
        daoTokenAddress = _daoTokenAddress;
    }

    /**
     * @notice RANK_FOR_VOTEを指定する
     * TODO: 権限設定
     */
    function setRankForVote(uint256 _rankForVote) external {
        RANK_FOR_VOTE = _rankForVote;
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
    function _isTopHolder() internal view returns (bool) {
        DAOToken daoToken = DAOToken(daoTokenAddress);
        if (Array.contains(daoToken.getTop(RANK_FOR_VOTE), msg.sender)) {
            return true;
        }
        return false;
    }

    /**
     * @notice vote to the current poll
     */
    function vote(address[] memory _candidates, uint256[] memory _points)
        external
        returns (bool)
    {
        // DAOトークンのTOP10に入っていない場合は投票することはできない
        require(_isTopHolder(), "You are not in the top 10 holder.");

        // Check if the voter is already voted
        // TODO:投票を上書きする処理を書いた後にこの制限をなくす
        require(
            !Array.contains(voters[pollId], msg.sender),
            "You are already voted."
        );

        // Check if the points and candidates are the same length
        require(
            _points.length == _candidates.length,
            "The number of points is not valid."
        );

        for (uint256 index = 0; index < _candidates.length; index++) {
            // Check if the candidate is in the current poll
            require(
                Array.contains(candidates[pollId], _candidates[index]),
                "The candidate is not in the current poll."
            );

            // Check if the points are valid
            require(
                _points[index] >= 0,
                "The points are not valid. (0 <= points)"
            );
            require(
                _points[index] <= 20,
                "The points are not valid. (points < 20)"
            );

            // 自分のポイントは必ずゼロにする
            if (_candidates[index] == msg.sender) {
                _points[index] = 0;
            }
        }

        //投票を記録
        Vote memory _vote = Vote({
            voter: msg.sender,
            candidates: _candidates,
            points: _points
        });
        votes[pollId].push(_vote);

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

    /**
     * @notice get the current poll's votes
     */
    function getVotes() external view returns (Vote[] memory) {
        return votes[pollId];
    }
}
