import { useEffect, useState } from "react";
import MetaMaskLoginButton from "../components/web3/common/MetaMaskLoginButton";
import DAOTokenTotalSupply from "../components/web3/token/DAOTokenTotalSupply";
import DAOTreasuryInfo from "../components/web3/treasury/DAOTreasuryInfo";
import artifact from "../src/abi/DAOToken.json";

const contractAddress = '0x2279b7a0a67db372996a5fab50d91eaa73d2ebe6'
export default () => {

    return (
        <div>
            <MetaMaskLoginButton />
            <DAOTokenTotalSupply />
            <DAOTreasuryInfo />
        </div>
    );
}