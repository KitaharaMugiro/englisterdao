import { ethers } from "ethers";
import { useEffect, useState } from "react";
import artifact from "../src/abi/TokenSupplySystem.json";
import { TokenSupplySystem } from "../types/ethers-contracts";
import useMetaMask, { getContract, getContractWithSigner } from "./useMetaMask";


export default () => {
    const { address } = useMetaMask()
    const [unclaimedBalance, setUnclaimedBalance] = useState(0);
    const contractAddress = process.env.NEXT_PUBLIC_TOKENSUPPLYSYSTEM_CONTRACT_ADDRESS as string
    const contract = getContract(contractAddress, artifact.abi) as TokenSupplySystem
    const contractWithSigner = getContractWithSigner(contractAddress, artifact.abi) as TokenSupplySystem

    useEffect(() => {
        refresh()
    }, [address])

    const refresh = () => {
        contract.functions.unclaimedBalance().then(s => setUnclaimedBalance(Number(ethers.utils.formatEther(s[0]))));
    }

    const _mint = async (_amount: number) => {
        const amount = ethers.utils.parseEther(_amount.toString());
        await contractWithSigner.functions.mint(amount)
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
        await contractWithSigner.functions.payAndPayWithNative(address, amount, amountNative, fee)
    }


    return {
        payAndPayWithNative: _payAndPayWithNative,
        mint: _mint,
        unclaimedBalance
    };
}