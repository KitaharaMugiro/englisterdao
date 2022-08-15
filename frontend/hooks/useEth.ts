import { ethers } from "ethers";
import { useEffect, useState } from "react";
import artifact from "../src/abi/DAOTreasury.json";
import { DAOTreasury } from "../types/ethers-contracts";

export default () => {
    const [balance, setBalance] = useState(0);

    const provider = new ethers.providers.JsonRpcProvider();
    const signer = provider.getSigner(); //WARN: metamaskのログインと関係なく、Ownerのアドレスを取得している

    useEffect(() => {
        refresh()
    }, [])

    const refresh = () => {
        signer.getBalance().then(b => setBalance(Number(ethers.utils.formatEther(b))));
    }

    return { balance, refresh };
}