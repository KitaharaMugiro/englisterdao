pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract EnglisterToken is ERC20, AccessControl {
    string public TOKEN_NAME;
    string public TOKEN_SYMBOL;
    uint256 public TOKEN_INITIAL_SUPPLY;
    uint256 public TOKEN_DECIMALS;

    // Roles
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    constructor(
        string memory _tokenName,
        string memory _tokenSymbol,
        uint256 _tokenInitialSupply
    ) ERC20(_tokenName, _tokenSymbol) {
        TOKEN_INITIAL_SUPPLY = _tokenInitialSupply;
        _mint(msg.sender, TOKEN_INITIAL_SUPPLY);

        //TEMPORARY: 作成者にロールを設定する(仕様検討後削除する可能性あり)
        _setupRole(MINTER_ROLE, msg.sender);
        _setupRole(BURNER_ROLE, msg.sender);
    }

    // MINTER_ROLE can mint new tokens
    function mint(address to, uint256 amount) external {
        // Check that the calling account has the minter role
        require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
        _mint(to, amount);
    }

    // BURNER_ROLE can burn tokens
    function burn(address from, uint256 amount) external {
        // Check that the calling account has the minter role
        require(hasRole(BURNER_ROLE, msg.sender), "Caller is not a burner");
        _burn(from, amount);
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
}
