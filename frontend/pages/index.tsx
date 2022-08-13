import { useEffect, useState } from "react";
import MetaMaskLoginButton from "../components/web3/MetaMaskLoginButton";
import MetaMaskLoginState from "../components/web3/MetaMaskLoginState";
import artifact from "../src/abi/DAOToken.json";

const contractAddress = '0x2279b7a0a67db372996a5fab50d91eaa73d2ebe6'
export default () => {
    const [count, setCount] = useState(0);


    return (
        <div>
            <MetaMaskLoginButton />
            <MetaMaskLoginState />
            <h1 >{count}</h1>
        </div>
    );
}