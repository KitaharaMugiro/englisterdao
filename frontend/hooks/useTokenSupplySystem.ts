import { useEffect, useState } from "react"
import { ethers } from "ethers";
import artifact from "../src/abi/TokenSupplySystem.json";
import { ContributionPoll, TokenSupplySystem } from "../types/ethers-contracts";
import useMetaMask, { getContract, getContractWithSigner } from "./useMetaMask";


export default () => {
    const { address, login } = useMetaMask()
    const [unclaimedBalance, setUnclaimedBalance] = useState(0);
    const contractAddress = process.env.NEXT_PUBLIC_TOKENSUPPLYSYSTEM_CONTRACT_ADDRESS as string


    const _getContract = () => {
        const contract = getContract(contractAddress, artifact.abi)
        return contract as TokenSupplySystem
    }

    useEffect(() => {
        refresh()
    }, [address])

    const refresh = () => {
        _getContract()?.functions?.unclaimedBalance().then(s => setUnclaimedBalance(Number(ethers.utils.formatEther(s[0]))));
    }


    const _getContractWithSigner = () => {
        if (!address) return undefined
        const contract = getContractWithSigner(contractAddress, artifact.abi)
        return contract as TokenSupplySystem
    }

    const _mint = async (_amount: number) => {
        const amount = ethers.utils.parseEther(_amount.toString());
        await _getContractWithSigner()?.functions?.mint(amount)
    }

    const _payAndPayWithNative = async (
        address: string,
        _amount: number,
        _amountNative: number,
        _fee: number
    ) => {
        const amount = ethers.utils.parseEther(_amount.toString());
        const amountNative = ethers.utils.parseEther(_amountNative.toString());
        const fee = ethers.utils.parseEther(_fee.toString());
        await _getContractWithSigner()?.functions?.payAndPayWithNative(address, amount, amountNative, fee)
    }


    return {
        payAndPayWithNative: _payAndPayWithNative,
        mint: _mint,
        unclaimedBalance
    };
}