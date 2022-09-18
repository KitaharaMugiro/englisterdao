pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./lib/Array.sol";
import "./DAOToken.sol";
import "./DAONFT.sol";
import "./lib/SafeMath.sol";
import "./interface/DAOEvents.sol";

struct Vote {
    address voter;
    address[] candidates;
    uint256[] points;
}

contract ContributionPoll is
    AccessControl,
    Ownable,
    Pausable,
    ReentrancyGuard,
    DAOEvents
{
    // ContributionPollを開始したり終了する権限
    // Role to start and end a ContributionPoll
    bytes32 public constant POLL_ADMIN_ROLE = keccak256("POLL_ADMIN_ROLE");

    // ContributionPoll Id
    int256 public pollId = 0;

    // 配布するDAOトークンのアドレス
    // DAO token address to distribute
    address public daoTokenAddress;

    // 投票するのに必要なNFTのアドレス
    // NFT address required to vote
    address public nftAddress;

    // 投票はDAO NFTをREQUIRED_TOKEN_FOR_VOTEよりも多く保持しているアドレスのみ可能
    // Voting is only possible for addresses that hold more than REQUIRED_TOKEN_FOR_VOTE DAO NFT
    uint256 public REQUIRED_TOKEN_FOR_VOTE = 0;

    // 立候補者(貢献者)に割り当てられるDAOトークンの総数
    // total amount of DAO tokens to be distributed to candidates(contributors)
    uint256 public CONTRIBUTOR_ASSIGNMENT_TOKEN = 7000 * (10**18);

    // 投票者に割り当てられるDAOトークンの総数
    // total amount of DAO tokens to be distributed to voters
    uint256 public SUPPORTER_ASSIGNMENT_TOKEN = 3000 * (10**18);

    // 投票時に指定できる最大点数
    // maximum number of points that can be voted
    uint256 public VOTE_MAX_POINT = 20;

    // 投票可能かどうかの制御を行うフラグ
    // flag to control voting
    bool public votingEnabled = true;

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
     * @notice Set NFT Address
     * @dev only owner can set NFT Address
     */
    function setNftAddress(address _nftAddress) external onlyOwner {
        nftAddress = _nftAddress;
    }

    /**
     * @notice Set POLL_ADMIN_ROLE
     * @dev only owner can set POLL_ADMIN_ROLE
     */
    function setPollAdminRole(address _address) external onlyOwner {
        _setupRole(POLL_ADMIN_ROLE, _address);
    }

    /**
     * @notice Set REQUIRED_TOKEN_FOR_VOTE
     * @dev only poll admin can set REQUIRED_TOKEN_FOR_VOTE
     */
    function setRequiredTokenForVote(uint256 _rankForVote) external {
        require(
            hasRole(POLL_ADMIN_ROLE, msg.sender),
            "Caller is not a poll admin"
        );
        REQUIRED_TOKEN_FOR_VOTE = _rankForVote;
    }

    /**
     * @notice Set CONTRIBUTOR_ASSIGNMENT_TOKEN
     * @dev only poll admin can set CONTRIBUTOR_ASSIGNMENT_TOKEN
     */
    function setContributorAssignmentToken(uint256 _contributorAssignmentToken)
        external
    {
        require(
            hasRole(POLL_ADMIN_ROLE, msg.sender),
            "Caller is not a poll admin"
        );
        CONTRIBUTOR_ASSIGNMENT_TOKEN = _contributorAssignmentToken;
    }

    /**
     * @notice Set SUPPORTER_ASSIGNMENT_TOKEN
     * @dev only poll admin can set SUPPORTER_ASSIGNMENT_TOKEN
     */
    function setSupporterAssignmentToken(uint256 _supporterAssignmentToken)
        external
    {
        require(
            hasRole(POLL_ADMIN_ROLE, msg.sender),
            "Caller is not a poll admin"
        );
        SUPPORTER_ASSIGNMENT_TOKEN = _supporterAssignmentToken;
    }

    /**
     * @notice Set VOTE_MAX_POINT
     * @dev only poll admin can set VOTE_MAX_POINT
     */
    function setVoteMaxPoint(uint256 _voteMaxPoint) external {
        require(
            hasRole(POLL_ADMIN_ROLE, msg.sender),
            "Caller is not a poll admin"
        );
        VOTE_MAX_POINT = _voteMaxPoint;
    }

    /**
     * @notice Set VOTE_MAX_POINT
     * @dev only poll admin can set VOTE_MAX_POINT
     */
    function setVotingEnabled(bool _votingEnabled) external {
        require(
            hasRole(POLL_ADMIN_ROLE, msg.sender),
            "Caller is not a poll admin"
        );
        votingEnabled = _votingEnabled;
        emit VotingEnabled(pollId, votingEnabled);
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
        emit Candidated(pollId, msg.sender);
    }

    /**
     * @notice check if the voter has enough DAO NFT to vote
     */
    function isEligibleToVote(address _address) public view returns (bool) {
        DAONFT daoToken = DAONFT(nftAddress);
        return daoToken.balanceOf(_address) >= REQUIRED_TOKEN_FOR_VOTE;
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
        // Check if votig is enabled
        require(
            votingEnabled,
            "Voting is not enabled right now. Contact the admin to start voting."
        );

        address[] memory voters = getCurrentVoters();

        // Check if the voter is eligible to vote
        require(isEligibleToVote(msg.sender), "You are not eligible to vote.");

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

        // save the vote to the list of votes
        votes[pollId].push(_vote);
        emit Voted(pollId, msg.sender);
        return true;
    }

    /**
     * @notice Settle the current poll, and start new poll
     * @dev only poll admin can execute this function and it is expected that external cron system calls this function weekly or bi-weekly.
     */
    function settleCurrentPollAndCreateNewPoll()
        external
        whenNotPaused
        nonReentrant
    {
        require(
            hasRole(POLL_ADMIN_ROLE, msg.sender),
            "Caller is not a poll admin"
        );
        _settleContributionPoll();
        _createContributionPoll();
    }

    /**
     * @notice Settle the current poll and aggregate the result
     */
    function _settleContributionPoll() internal {
        // Add up votes for each candidate
        address[] memory summedCandidates = candidates[pollId];
        uint256[] memory summedPoints = new uint256[](
            candidates[pollId].length
        );
        address[] memory voters = getCurrentVoters();
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

        // Decide how much to distribute to Contributors
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
            _mintTokenForContributor(summedCandidates, assignmentToken);
        }

        // Decide how much to distribute to Supporters
        uint256 totalVoterCount = voters.length;
        if (totalVoterCount > 0) {
            uint256 voterAssignmentToken = SafeMath.div(
                SUPPORTER_ASSIGNMENT_TOKEN,
                totalVoterCount
            );
            _mintTokenForSupporter(voters, voterAssignmentToken);
        }

        emit SettlePoll(pollId);
    }

    /**
     * @notice start new poll
     */
    function _createContributionPoll() internal {
        pollId++;
        emit CreatePoll(pollId);
    }

    /**
     * @notice Mint dao token for contributors
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
     * @notice Mint dao token for supporters
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
     * @notice Sum up the points of the vote
     */
    function _calculateTotalPoint(Vote memory _vote)
        internal
        pure
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

    /**
     * @notice pause the contract
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice unpause the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}
