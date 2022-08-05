pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";
import "./lib/Array.sol";
import "./DAOToken.sol";
import "./lib/SafeMath.sol";

struct Vote {
    address voter;
    address[] candidates;
    uint256[] points;
}

contract ContributionPoll is AccessControl, Ownable, Pausable, ReentrancyGuard {
    int256 public pollId = 0;

    // 配布するDAOトークンのアドレス
    // DAO token address to distribute
    address public daoTokenAddress;

    // 投票はDAOトークンを保有ランキングがRANK_FOR_VOTEよりも上位の場合に可能
    // votes are possible only if the holder has a ranking higher than RANK_FOR_VOTE
    uint256 public RANK_FOR_VOTE = 10;

    // 立候補者(貢献者)に割り当てられるDAOトークンの総数
    // total amount of DAO tokens to be distributed to candidates(contributors)
    uint256 public CONTRIBUTOR_ASSIGNMENT_TOKEN = 5000;

    // 投票者に割り当てられるDAOトークンの総数
    // total amount of DAO tokens to be distributed to voters
    uint256 public SUPPORTER_ASSIGNMENT_TOKEN = 3000;

    // 投票時に指定できる最大点数
    // maximum number of points that can be voted
    uint256 public VOTE_MAX_POINT = 20;

    // 立候補者のリスト
    // list of candidates
    mapping(int256 => address[]) public candidates; // pollId => [candidate1, candidate2, ...]

    // 投票のリスト
    // list of vote
    mapping(int256 => Vote[]) public votes; // pollId => [vote1, vote2, ...]

    /**
     * @notice Set DAO Token Address
     * @dev only owner can set DAO Token Address
     */
    function setDaoTokenAddress(address _daoTokenAddress) external onlyOwner {
        daoTokenAddress = _daoTokenAddress;
    }

    /**
     * @notice Set RANK_FOR_VOTE
     * @dev only owner can set RANK_FOR_VOTE
     */
    function setRankForVote(uint256 _rankForVote) external onlyOwner {
        RANK_FOR_VOTE = _rankForVote;
    }

    /**
     * @notice Set CONTRIBUTOR_ASSIGNMENT_TOKEN
     * @dev only owner can set CONTRIBUTOR_ASSIGNMENT_TOKEN
     */
    function setContributorAssignmentToken(uint256 _contributorAssignmentToken)
        external
        onlyOwner
    {
        CONTRIBUTOR_ASSIGNMENT_TOKEN = _contributorAssignmentToken;
    }

    /**
     * @notice Set SUPPORTER_ASSIGNMENT_TOKEN
     * @dev only owner can set SUPPORTER_ASSIGNMENT_TOKEN
     */
    function setSupporterAssignmentToken(uint256 _supporterAssignmentToken)
        external
        onlyOwner
    {
        SUPPORTER_ASSIGNMENT_TOKEN = _supporterAssignmentToken;
    }

    /**
     * @notice Set VOTE_MAX_POINT
     * @dev only owner can set VOTE_MAX_POINT
     */
    function setVoteMaxPoint(uint256 _voteMaxPoint) external onlyOwner {
        VOTE_MAX_POINT = _voteMaxPoint;
    }

    /**
     * @notice candidate to the current poll
     */
    function candidateToContributionPoll() external whenNotPaused {
        for (uint256 index = 0; index < candidates[pollId].length; index++) {
            require(
                candidates[pollId][index] != msg.sender,
                "You are already candidate to the current poll."
            );
        }
        candidates[pollId].push(msg.sender);
    }

    /**
     * @notice vote to the current poll.
     * @dev Voters assign points to candidates and register their votes.
     * Points are normalized to a total of 100 points.
     * A voted point for oneself will always be 0.
     */
    function vote(address[] memory _candidates, uint256[] memory _points)
        external
        whenNotPaused
        returns (bool)
    {
        // if the voter is not in the top N(RANK_FOR_VOTE) of DAO token holders,
        require(_isTopHolder(), "You are not in the top RANK_FOR_VOTE holder.");

        address[] memory voters = getCurrentVoters();

        // Check if the voter is already voted
        require(!Array.contains(voters, msg.sender), "You are already voted.");

        // Check if the candidate is not empty
        require(_candidates.length != 0, "Candidates must not be empty.");

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
                _points[index] <= VOTE_MAX_POINT,
                "The points are not valid. (points < VOTE_MAX_POINT)"
            );

            // A voted point for oneself will always be 0.
            if (_candidates[index] == msg.sender) {
                _points[index] = 0;
            }
        }

        Vote memory _vote = Vote({
            voter: msg.sender,
            candidates: _candidates,
            points: _points
        });

        uint256 totalPoints = _calculateTotalPoint(_vote);

        // normalize the points to a total of 100 points
        for (
            uint256 candidateIndex = 0;
            candidateIndex < _vote.candidates.length;
            candidateIndex++
        ) {
            _vote.points[candidateIndex] = SafeMath.div(
                SafeMath.mul(_vote.points[candidateIndex], 100),
                totalPoints
            );
        }

        // add the vote to the list of votes
        votes[pollId].push(_vote);
        return true;
    }

    /**
     * @notice Settle the current poll, and start new poll
     * @dev only owner can execute this function and it is expected that external cron system calls this function weekly or bi-weekly.
     */
    function settleCurrentPollAndCreateNewPoll()
        external
        onlyOwner
        whenNotPaused
        nonReentrant
    {
        _settleContributionPoll();
        _createContributionPoll();
    }

    /**
     * @notice Settle the current poll and aggregate the result
     */
    function _settleContributionPoll() internal {
        address[] memory voters = getCurrentVoters();
        // 投票結果を合算する
        // ex:  [(a, 44.4), (b, 55.5), (c, 0)] + [(a,20), (c:100)] = [(a, 64.4), (b:55.5), (c:100)]
        address[] memory summedCandidates = candidates[pollId];
        uint256[] memory summedPoints = new uint256[](
            candidates[pollId].length
        );
        for (uint256 index = 0; index < votes[pollId].length; index++) {
            Vote memory _vote = votes[pollId][index];
            for (
                uint256 candidateIndex = 0;
                candidateIndex < _vote.candidates.length;
                candidateIndex++
            ) {
                address _candidate = _vote.candidates[candidateIndex];
                uint256 _point = _vote.points[candidateIndex];
                for (
                    uint256 summedCandidateIndex = 0;
                    summedCandidateIndex < summedCandidates.length;
                    summedCandidateIndex++
                ) {
                    if (summedCandidates[summedCandidateIndex] == _candidate) {
                        summedPoints[summedCandidateIndex] = SafeMath.add(
                            summedPoints[summedCandidateIndex],
                            _point
                        );
                        break;
                    }
                }
            }
        }

        // Contributorへの配布量を決定する
        // [(a, 64.4), (b:55.5), (c:100)] => [(a, 0.29), (b:0.25), (c:0.45)] =>  [(a, 1450), (b: 1250), (c:2250)]
        uint256 totalPoints = 0;
        for (uint256 index = 0; index < summedPoints.length; index++) {
            uint256 _points = summedPoints[index];
            totalPoints = SafeMath.add(totalPoints, _points);
        }

        uint256[] memory assignmentToken = new uint256[](
            candidates[pollId].length
        );
        if (totalPoints > 0) {
            for (uint256 index = 0; index < summedCandidates.length; index++) {
                uint256 _points = summedPoints[index];
                assignmentToken[index] = SafeMath.div(
                    SafeMath.mul(_points, CONTRIBUTOR_ASSIGNMENT_TOKEN),
                    totalPoints
                );
            }
            // Contributorへの配布を実行
            _mintTokenForContributor(summedCandidates, assignmentToken);
        }

        // 投票者への配布量を決定する (等分する)
        uint256 totalVoterCount = voters.length;
        if (totalVoterCount > 0) {
            uint256 voterAssignmentToken = SafeMath.div(
                SUPPORTER_ASSIGNMENT_TOKEN,
                totalVoterCount
            );
            // 投票者への配布を実行
            _mintTokenForSupporter(voters, voterAssignmentToken);
        }
    }

    /**
     * @notice start new poll
     */
    function _createContributionPoll() internal {
        pollId++;
    }

    /**
     * @notice SenderがDAO TokenのTop N(RANK_FOR_VOTE)のホルダーであるかをチェックする
     */
    function _isTopHolder() internal view returns (bool) {
        DAOToken daoToken = DAOToken(daoTokenAddress);
        if (Array.contains(daoToken.getTop(RANK_FOR_VOTE), msg.sender)) {
            return true;
        }
        return false;
    }

    /**
     * @notice DAOトークンを発行し送付する
     */
    function _mintTokenForContributor(
        address[] memory to,
        uint256[] memory amount
    ) internal {
        require(
            to.length == amount.length,
            "to and amount must be same length"
        );
        DAOToken daoToken = DAOToken(daoTokenAddress);
        for (uint256 index = 0; index < to.length; index++) {
            daoToken.mint(to[index], amount[index]);
        }
    }

    /**
     * @notice DAOトークンを発行し送付する
     */
    function _mintTokenForSupporter(address[] memory to, uint256 amount)
        internal
    {
        DAOToken daoToken = DAOToken(daoTokenAddress);
        for (uint256 index = 0; index < to.length; index++) {
            daoToken.mint(to[index], amount);
        }
    }

    /**
     * @notice 投票のポイントを合計する
     */
    function _calculateTotalPoint(Vote memory _vote)
        internal
        returns (uint256)
    {
        uint256 totalPoints = 0;
        for (
            uint256 candidateIndex = 0;
            candidateIndex < _vote.candidates.length;
            candidateIndex++
        ) {
            totalPoints = SafeMath.add(
                totalPoints,
                _vote.points[candidateIndex]
            );
        }

        require(
            totalPoints > 0,
            "The total points are not valid. (totalPoints <= 0)"
        );

        return totalPoints;
    }

    /**
     * @notice get the current poll's candidates
     */
    function getCurrentCandidates() public view returns (address[] memory) {
        return candidates[pollId];
    }

    /**
     * @notice get the current poll's votes
     */
    function getCurrentVotes() public view returns (Vote[] memory) {
        return votes[pollId];
    }

    /**
     * @notice get the current poll's voters
     */
    function getCurrentVoters() public view returns (address[] memory) {
        Vote[] memory _votes = votes[pollId];
        address[] memory _voters = new address[](_votes.length);
        for (uint256 index = 0; index < _votes.length; index++) {
            _voters[index] = _votes[index].voter;
        }
        return _voters;
    }
}
