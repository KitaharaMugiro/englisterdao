import { ethers } from "ethers";
import { useEffect, useState } from "react";
import artifact from "../../src/abi/DAOTreasury.json";
import { DAOTreasury } from "../../types/ethers-contracts";
import useMetaMask, { getContractWithSigner, getContract } from "../web3/useMetaMask";

export default () => {
    const [tokenRate, setTokenRate] = useState(0);
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(false);

    const { address, login } = useMetaMask()


    const contractAddress = process.env.NEXT_PUBLIC_DAOTRESURY_CONTRACT_ADDRESS as string
    const contractWithSigner = getContractWithSigner(contractAddress, artifact.abi) as DAOTreasury
    const contract = getContract(contractAddress, artifact.abi) as DAOTreasury

    useEffect(() => {
        refresh()
    }, [address])

    const refresh = () => {
        contract.functions.getCurrentTokenRate().then(r => setTokenRate(Number(ethers.utils.formatEther(r[0]))));
        contract.functions.getBalance().then(b => setBalance(Number(ethers.utils.formatEther(b[0]))));
    }

    const depositEth = async (amount: number) => {
        setLoading(true);
        await login()
        const options = { value: ethers.utils.parseEther(amount.toString()) };
        await contractWithSigner.functions.deposit(options)
        setLoading(false);
    }

    const withdrawEth = async (amount: number) => {
        setLoading(true);
        await login()
        await contractWithSigner.functions.withdraw(ethers.utils.parseEther(amount.toString()))
        setLoading(false);
    }

    return {
        tokenRate, balance, depositEth, refresh, loading, withdrawEth,
    };
}