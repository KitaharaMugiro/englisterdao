pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "hardhat/console.sol";

contract DAOToken is ERC20, AccessControl {
    // Roles
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    // Holder Set
    struct HolderSet {
        address[] values;
        mapping(address => bool) is_in;
    }

    HolderSet holders;

    function addHolder(address a) public {
        if (!holders.is_in[a]) {
            holders.values.push(a);
            holders.is_in[a] = true;
        }
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

    // MINTER_ROLE can mint new tokens
    function mint(address to, uint256 amount) external {
        // Check that the calling account has the minter role
        require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
        _mint(to, amount);
        addHolder(to);
    }

    // BURNER_ROLE can burn tokens
    function burn(address from, uint256 amount) external {
        // Check that the calling account has the minter role
        require(hasRole(BURNER_ROLE, msg.sender), "Caller is not a burner");
        _burn(from, amount);
    }

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

    function batchTransfer(address[] memory _to, uint256[] memory _value)
        external
    {
        require(_to.length == _value.length, "invalid input");
        require(_to.length <= 255, "exceed max allowed");
        for (uint8 i = 0; i < _to.length; i++) {
            transfer(_to[i], _value[i]);
        }
    }

    function _checkSkip(
        address[] memory exceptAddressMap,
        address holderAddress
    ) internal view returns (bool) {
        for (
            uint256 exceptIndex = 0;
            exceptIndex < exceptAddressMap.length;
            exceptIndex++
        ) {
            if (holderAddress == exceptAddressMap[exceptIndex]) {
                return true;
            }
        }
        return false;
    }

    function _getTopAddress(address[] memory exceptAddressMap)
        internal
        view
        returns (address)
    {
        address topAddress;
        uint256 topBalance;

        for (uint256 index = 0; index < holders.values.length; index++) {
            address holderAddress = holders.values[index];
            if (_checkSkip(exceptAddressMap, holderAddress)) {
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

    function getTop(uint256 _limit) public view returns (address[] memory) {
        require(_limit < 5, "limit must be lesser than 5");
        address[] memory topAddresses = new address[](_limit);
        uint256[] memory topBalances = new uint256[](_limit);
        address[] memory exceptAddressMap = new address[](_limit);
        for (uint256 index = 0; index < _limit; index++) {
            address topAddress = _getTopAddress(exceptAddressMap);
            topAddresses[index] = topAddress;
            topBalances[index] = balanceOf(topAddress);
            exceptAddressMap[index] = topAddress;
        }
        return topAddresses;
    }
}
