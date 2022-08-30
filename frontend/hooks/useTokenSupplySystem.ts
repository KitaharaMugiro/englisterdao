import { useEffect, useState } from "react"
import { ethers } from "ethers";
import artifact from "../src/abi/TokenSupplySystem.json";
import { ContributionPoll, TokenSupplySystem } from "../types/ethers-contracts";
import useMetaMask from "./useMetaMask";


export default () => {
    const { address, login } = useMetaMask()
    const [unclaimedBalance, setUnclaimedBalance] = useState(0);
    const contractAddress = process.env.NEXT_PUBLIC_TOKENSUPPLYSYSTEM_CONTRACT_ADDRESS as string


    const getContract = () => {
        const provider = new ethers.providers.Web3Provider((window as any).ethereum)
        const contract = new ethers.Contract(contractAddress, artifact.abi, provider);
        return contract as TokenSupplySystem
    }

    useEffect(() => {
        refresh()
    }, [address])

    const refresh = () => {
        getContract()?.functions?.unclaimedBalance().then(s => setUnclaimedBalance(Number(ethers.utils.formatEther(s[0]))));
    }


    const getContractWithSigner = () => {
        if (!address) return undefined
        const provider = new ethers.providers.Web3Provider((window as any).ethereum)
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, artifact.abi, provider);
        return contract.connect(signer) as TokenSupplySystem
    }

    const _mint = async (_amount: number) => {
        const amount = ethers.utils.parseEther(_amount.toString());
        await getContractWithSigner()?.functions?.mint(amount)
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
        await getContractWithSigner()?.functions?.payAndPayWithNative(address, amount, amountNative, fee)
    }


    return {
        payAndPayWithNative: _payAndPayWithNative,
        mint: _mint,
        unclaimedBalance
    };
}