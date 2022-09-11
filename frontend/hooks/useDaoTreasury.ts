import { ethers } from "ethers";
import { useEffect, useState } from "react";
import artifact from "../src/abi/DAOTreasury.json";
import { DAOTreasury } from "../types/ethers-contracts";
import useMetaMask, { getContract, getContractWithSigner } from "./useMetaMask";

export default () => {
    const [tokenRate, setTokenRate] = useState(0);
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(false);

    const { address } = useMetaMask()


    const contractAddress = process.env.NEXT_PUBLIC_DAOTRESURY_CONTRACT_ADDRESS as string
    const _getContractWithSigner = async () => {
        const provider = new ethers.providers.Web3Provider((window as any).ethereum)
        await provider.send('eth_requestAccounts', []);
        const contract = getContractWithSigner(contractAddress, artifact.abi)
        return contract as DAOTreasury
    }

    const _getContract = () => {
        const contract = getContract(contractAddress, artifact.abi)
        return contract as DAOTreasury
    }

    useEffect(() => {
        refresh()
    }, [address])

    const refresh = () => {
        _getContract().functions.getCurrentTokenRate().then(r => setTokenRate(Number(ethers.utils.formatEther(r[0]))));
        _getContract().functions.getBalance().then(b => setBalance(Number(ethers.utils.formatEther(b[0]))));
    }

    const depositEth = async (amount: number) => {
        setLoading(true);
        const options = { value: ethers.utils.parseEther(amount.toString()) };
        const contract = await _getContractWithSigner();
        await contract.functions.deposit(options)
        setLoading(false);
    }

    const withdrawEth = async (amount: number) => {
        setLoading(true);
        const contract = await _getContractWithSigner();
        await contract.functions.withdraw(ethers.utils.parseEther(amount.toString()))
        setLoading(false);
    }

    return {
        tokenRate, balance, depositEth, refresh, loading, withdrawEth,
        history: _getContract().filters["Deposited(address,uint256)"]
    };
}