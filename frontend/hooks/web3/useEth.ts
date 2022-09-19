import { ethers } from "ethers";
import { useEffect, useState } from "react";
import useMetaMask from "./useMetaMask";

export default () => {
    const [balance, setBalance] = useState(0);
    const [network, setNetwork] = useState("")
    const { address } = useMetaMask()

    const getSigner = () => {
        if (!address) return undefined
        const provider = new ethers.providers.Web3Provider((window as any).ethereum)
        return provider.getSigner()
    }

    const getNetwork = () => {
        const provider = new ethers.providers.Web3Provider((window as any).ethereum)
        return provider.getNetwork()
    }

    useEffect(() => {
        refresh()
    }, [address])

    const refresh = async () => {
        getSigner()?.getBalance().then(b => setBalance(Number(ethers.utils.formatEther(b))));
        getNetwork().then(n => {
            if (n.name === "unknown") setNetwork("Unknown")
            else if (n.name === "maticmum") setNetwork("Mumbai")
            else if (n.name === "homestead") setNetwork("Mainnet")
            else if (n.name === "matic") setNetwork("Polygon Mainnet")
            else setNetwork(n.name)
        }
        )
    }

    return { balance, network };
}