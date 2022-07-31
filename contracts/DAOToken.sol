pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "hardhat/console.sol";
import "./lib/Array.sol";

contract DAOToken is ERC20, AccessControl {
    // Roles
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    /**
     * @notice 重複なしのホルダーリストを作成するためのstruct
     */
    struct HolderSet {
        address[] values;
        mapping(address => bool) exists;
    }

    HolderSet holders;

    function addHolder(address a) public {
        if (holders.exists[a]) {
            return;
        }
        holders.values.push(a);
        holders.exists[a] = true;
    }

    constructor(
        string memory _tokenName,
        string memory _tokenSymbol,
        uint256 _tokenInitialSupply
    ) ERC20(_tokenName, _tokenSymbol) {
        _mint(msg.sender, _tokenInitialSupply);
        addHolder(msg.sender);

        //TEMPORARY: 作成者にロールを設定する(仕様検討後削除する可能性あり)
        _setupRole(MINTER_ROLE, msg.sender);
        _setupRole(BURNER_ROLE, msg.sender);
    }

    /**
     * @notice MINTER_ROLE can mint new tokens
     */
    function mint(address to, uint256 amount) external {
        // Check that the calling account has the minter role
        require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
        _mint(to, amount);
        addHolder(to);
    }

    /**
     * @notice BURNER_ROLE can burn tokens
     */
    function burn(address from, uint256 amount) external {
        // Check that the calling account has the minter role
        require(hasRole(BURNER_ROLE, msg.sender), "Caller is not a burner");
        _burn(from, amount);
    }

    /**
     * @notice 特定のアドレスに対してトークンを送る
     */
    function transfer(address to, uint256 amount)
        public
        virtual
        override
        returns (bool)
    {
        _transfer(msg.sender, to, amount);
        addHolder(to);
        return true;
    }

    /**
     * @notice 複数のアドレスに対してトークンを送る
     */
    function batchTransfer(address[] memory _to, uint256[] memory _value)
        external
    {
        require(_to.length == _value.length, "invalid input");
        require(_to.length <= 255, "exceed max allowed");
        for (uint8 i = 0; i < _to.length; i++) {
            transfer(_to[i], _value[i]);
        }
    }

    /**
     * @notice exceptAddressListを除いた上で最もトークンを保有したホルダーを返す
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
     * @notice get TOP holders order by the balance
     */
    function getTop(uint256 _limit) public view returns (address[] memory) {
        //TODO: Quick sortして上位_limit件を返す方がいいかも
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
