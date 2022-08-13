import { ethers } from "ethers";
import { useEffect, useState } from "react";
import artifact from "../src/abi/DAOTreasury.json";
import { DAOTreasury } from "../types/ethers-contracts";

export default () => {
    const [tokenRate, setTokenRate] = useState(0);
    const [balance, setBalance] = useState(0);

    const contractAddress = process.env.NEXT_PUBLIC_DAOTRESURY_CONTRACT_ADDRESS as string
    const provider = new ethers.providers.JsonRpcProvider();
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, artifact.abi, provider);
    const contractWithSigner = contract.connect(signer) as DAOTreasury;

    const { getCurrentTokenRate, getBalance, deposit } = contractWithSigner.functions;

    useEffect(() => {
        refresh()
    }, [])

    const refresh = () => {
        getCurrentTokenRate().then(r => setTokenRate(Number(r[0])));
        getBalance().then(b => setBalance(Number(b[0])));
    }

    return { tokenRate, balance, deposit, refresh };
}