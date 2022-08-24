pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";

contract DAOToken is ERC20PresetMinterPauser {
    constructor(
        string memory _tokenName,
        string memory _tokenSymbol,
        uint256 _tokenInitialSupply
    ) ERC20PresetMinterPauser(_tokenName, _tokenSymbol) {
        _mint(msg.sender, _tokenInitialSupply);
    }

    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    function setupMinterRole(address _minter) public {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "DAOToken: must have admin role to setup minter"
        );
        _setupRole(MINTER_ROLE, _minter);
    }

    function revokeMinterRole(address _minter) public {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "DAOToken: must have admin role to setup minter"
        );
        _revokeRole(MINTER_ROLE, _minter);
    }

    function setupBurnerRole(address _burner) public {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "DAOToken: must have admin role to setup burner"
        );
        _setupRole(BURNER_ROLE, _burner);
    }

    function revokeBurnerRole(address _burner) public {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "DAOToken: must have admin role to setup burner"
        );
        _revokeRole(BURNER_ROLE, _burner);
    }

    function burn(address holder, uint256 _amount) public {
        require(
            hasRole(BURNER_ROLE, msg.sender),
            "DAOToken: must have burner role to burn"
        );
        _burn(holder, _amount);
    }
}
