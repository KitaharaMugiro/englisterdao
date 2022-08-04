pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
import "./lib/Array.sol";
import "./DAOToken.sol";
import "./lib/SafeMath.sol";

struct Vote {
    address voter;
    address[] candidates;
    uint256[] points;
}

contract ContributionPoll is AccessControl, Ownable {
    int256 public pollId = 0;
    address public daoTokenAddress;
    uint256 public RANK_FOR_VOTE = 10; //DAOトークンの保有順位がRANK_FOR_VOTE以上なら投票可能
    uint256 public CONTRIBUTOR_ASSIGNMENT_TOKEN = 5000; //貢献者に割り当てられるDAOトークンの数
    uint256 public SUPPORTER_ASSIGNMENT_TOKEN = 3000; //投票者に割り当てられるDAOトークンの数
    uint256 public VOTE_MAX_POINT = 20; //投票できる最大点数
    mapping(int256 => address[]) public candidates; // pollId => [candidate1, candidate2, ...]

    //TODO: votesからvotersは取得できるため、リファクタリングして削除する
    mapping(int256 => address[]) public voters; // pollId => [candidate1, candidate2, ...]
    mapping(int256 => Vote[]) public votes; // pollId => [vote1, vote2, ...]

    /**
     * @notice DAO Token Addressを指定する
     */
    function setDaoTokenAddress(address _daoTokenAddress) external onlyOwner {
        daoTokenAddress = _daoTokenAddress;
    }

    /**
     * @notice RANK_FOR_VOTEを指定する
     */
    function setRankForVote(uint256 _rankForVote) external onlyOwner {
        RANK_FOR_VOTE = _rankForVote;
    }

    /**
     * @notice CONTRIBUTOR_ASSIGNMENT_TOKENを指定する
     */
    function setContributorAssignmentToken(uint256 _contributorAssignmentToken)
        external
        onlyOwner
    {
        CONTRIBUTOR_ASSIGNMENT_TOKEN = _contributorAssignmentToken;
    }

    /**
     * @notice SUPPORTER_ASSIGNMENT_TOKENを指定する
     */
    function setSupporterAssignmentToken(uint256 _supporterAssignmentToken)
        external
        onlyOwner
    {
        SUPPORTER_ASSIGNMENT_TOKEN = _supporterAssignmentToken;
    }

    /**
     * @notice VOTE_MAX_POINTを指定する
     */
    function setVoteMaxPoint(uint256 _voteMaxPoint) external onlyOwner {
        VOTE_MAX_POINT = _voteMaxPoint;
    }

    /**
     * @notice Settle the current poll, and start new poll
     */
    function settleCurrentPollAndCreateNewPoll() external onlyOwner {
        _settleContributionPoll();
        _createContributionPoll();
    }

    /**
     * @notice Settle the current poll and aggregate the result
     */
    function _settleContributionPoll() internal {
        // 貢献度投票の集計を行う

        // 票を標準化する (TODO: 投票時に計算してもいいかも)
        // 例: [(a, 4), (b, 5), (c,0)]という投票結果を[(a, 44), (b, 55), (c, 0)]に変換する
        for (uint256 index = 0; index < votes[pollId].length; index++) {
            Vote memory vote = votes[pollId][index];
            uint256 totalPoints = 0;
            for (
                uint256 candidateIndex = 0;
                candidateIndex < vote.candidates.length;
                candidateIndex++
            ) {
                totalPoints = SafeMath.add(
                    totalPoints,
                    vote.points[candidateIndex]
                );
            }
            for (
                uint256 candidateIndex = 0;
                candidateIndex < vote.candidates.length;
                candidateIndex++
            ) {
                //WARN : 小数部分を切り捨てる
                vote.points[candidateIndex] = SafeMath.div(
                    SafeMath.mul(vote.points[candidateIndex], 100),
                    totalPoints
                );
            }
            votes[pollId][index] = vote;
        }

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
        uint256 totalVoterCount = voters[pollId].length;
        if (totalVoterCount > 0) {
            uint256 voterAssignmentToken = SafeMath.div(
                SUPPORTER_ASSIGNMENT_TOKEN,
                totalVoterCount
            );
            // 投票者への配布を実行
            _mintTokenForSupporter(voters[pollId], voterAssignmentToken);
        }
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
     * @notice vote to the current poll
     */
    function vote(address[] memory _candidates, uint256[] memory _points)
        external
        returns (bool)
    {
        // DAOトークンのTOP N(RANK_FOR_VOTE)に入っていない場合は投票することはできない
        require(_isTopHolder(), "You are not in the top RANK_FOR_VOTE holder.");

        // Check if the voter is already voted
        // TODO:投票を上書きする処理を書いた後にこの制限をなくす
        require(
            !Array.contains(voters[pollId], msg.sender),
            "You are already voted."
        );

        // Check if the candidate is valid
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
