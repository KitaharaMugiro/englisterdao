import { useEffect, useState } from "react";
import MetaMaskLoginButton from "../components/web3/MetaMaskLoginButton";
import artifact from "../src/abi/DAOToken.json";

const contractAddress = '0x2279b7a0a67db372996a5fab50d91eaa73d2ebe6'
export default () => {
    const [count, setCount] = useState(0);


    return (
        <div>
            <MetaMaskLoginButton />
            <h1 >{count}</h1>
        </div>
    );
}