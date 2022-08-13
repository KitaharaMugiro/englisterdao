import { ethers } from "ethers";
import { useEffect, useState } from "react";
import artifact from "../src/abi/DAOTreasury.json";
import { DAOTreasury } from "../types/ethers-contracts";

export default () => {
    const [tokenRate, setTokenRate] = useState(0);
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(false);

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
        getCurrentTokenRate().then(r => setTokenRate(Number(ethers.utils.formatEther(r[0]))));
        getBalance().then(b => setBalance(Number(ethers.utils.formatEther(b[0]))));
    }

    const depositEth = async (amount: number) => {
        setLoading(true);
        const options = { value: ethers.utils.parseEther(amount.toString()) };
        await deposit(options)
        setLoading(false);
    }

    return { tokenRate, balance, depositEth, refresh, loading };
}