pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
import "./lib/Array.sol";
import "./interface/DAOEvents.sol";

contract DAOToken is ERC20, AccessControl, Ownable, DAOEvents {
    // Roles
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    /**
     * @notice struct to create a duplicate-free holder list
     */
    struct HolderSet {
        address[] values;
        mapping(address => bool) exists;
    }

    // holders of DAO token
    HolderSet holders;

    constructor(
        string memory _tokenName,
        string memory _tokenSymbol,
        uint256 _tokenInitialSupply
    ) ERC20(_tokenName, _tokenSymbol) {
        _mint(msg.sender, _tokenInitialSupply);
        _addHolder(msg.sender);
    }

    /**
     * @notice Set MINTER_ROLE
     * @dev only owner can set MINTER_ROLE
     */
    function setupMinterRole(address contractAddress) external onlyOwner {
        _setupRole(MINTER_ROLE, contractAddress);
    }

    /**
     * @notice Set BURNER_ROLE
     * @dev only owner can set BURNER_ROLE
     */
    function setupBurnerRole(address contractAddress) external onlyOwner {
        _setupRole(BURNER_ROLE, contractAddress);
    }

    /**
     * @dev MINTER_ROLE can mint new tokens
     */
    function mint(address to, uint256 amount) external {
        // Check that the calling account has the minter role
        require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
        _mint(to, amount);
        _addHolder(to);
    }

    /**
     * @dev BURNER_ROLE can burn tokens
     */
    function burn(address from, uint256 amount) external {
        // Check that the calling account has the minter role
        require(hasRole(BURNER_ROLE, msg.sender), "Caller is not a burner");
        _burn(from, amount);
    }

    /**
     *
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        _addHolder(to);
    }

    /**
     * @dev Return holders with the most tokens, excluding exceptAddressList
     */
    function _getTopAddress(address[] memory exceptAddressList)
        internal
        view
        returns (address)
    {
        address topAddress;
        uint256 topBalance;

        for (uint256 index = 0; index < holders.values.length; index++) {
            address holderAddress = holders.values[index];
            if (Array.contains(exceptAddressList, holderAddress)) {
                continue;
            }

            uint256 balance = balanceOf(holderAddress);
            if (balance > topBalance) {
                topAddress = holderAddress;
                topBalance = balance;
            }
        }
        return topAddress;
    }

    /**
     * @dev Store the address of token holders
     */
    function _addHolder(address a) internal {
        if (holders.exists[a]) {
            return;
        }
        holders.values.push(a);
        holders.exists[a] = true;
    }

    /**
     * @notice get TOP holders order by the balance
     */
    function getTopHolders(uint256 _limit)
        public
        view
        returns (address[] memory)
    {
        address[] memory topAddresses = new address[](_limit);
        uint256[] memory topBalances = new uint256[](_limit);
        address[] memory exceptAddressList = new address[](_limit);
        for (uint256 index = 0; index < _limit; index++) {
            address topAddress = _getTopAddress(exceptAddressList);
            topAddresses[index] = topAddress;
            topBalances[index] = balanceOf(topAddress);
            exceptAddressList[index] = topAddress;
        }
        return topAddresses;
    }
}
