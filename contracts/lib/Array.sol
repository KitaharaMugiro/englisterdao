// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

library Array {
    function contains(address[] memory a, address b)
        internal
        pure
        returns (bool)
    {
        for (uint256 index = 0; index < a.length; index++) {
            if (a[index] == b) {
                return true;
            }
        }
        return false;
    }

    function contains(int256[] memory a, int256 b)
        internal
        pure
        returns (bool)
    {
        for (uint256 index = 0; index < a.length; index++) {
            if (a[index] == b) {
                return true;
            }
        }
        return false;
    }
}
