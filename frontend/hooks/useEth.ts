import { ethers } from "ethers";
import { useEffect, useState } from "react";
import useMetaMask from "./useMetaMask";

export default () => {
    const [balance, setBalance] = useState(0);
    const { address, login } = useMetaMask()

    const getSigner = () => {
        if (!address) return undefined
        const provider = new ethers.providers.Web3Provider((window as any).ethereum)
        return provider.getSigner()
    }

    useEffect(() => {
        refresh()
    }, [address])

    const refresh = async () => {
        getSigner()?.getBalance().then(b => setBalance(Number(ethers.utils.formatEther(b))));
    }

    return { balance };
}