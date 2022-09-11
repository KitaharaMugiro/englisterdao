import { useEffect, useState } from "react"
import { ethers } from "ethers";

export const getProvider = () => {
    const provider = new ethers.providers.Web3Provider((window as any).ethereum)
    return provider
};

export const getSigner = () => {
    const provider = getProvider()
    const signer = provider.getSigner();
    return signer
}

export const getContractWithSigner = (contractAddress: string, abi: any) => {
    const signer = getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer);
    return contract
}

export const getContract = (contractAddress: string, abi: any) => {
    const provider = getProvider()
    const contract = new ethers.Contract(contractAddress, abi, provider);
    return contract
}

export default () => {
    const [address, setAddress] = useState("")
    const getSignerAddress = async () => {
        const provider = new ethers.providers.Web3Provider((window as any).ethereum)
        const signer = provider.getSigner()
        try {
            const address = await signer.getAddress()
            setAddress(address)
        } catch (error) {
            console.log(error)
        }
    }

    const login = async () => {
        if (!("ethereum" in window)) {
            console.warn("MetaMask Plugin not found");
            return;
        }
        const provider = new ethers.providers.Web3Provider((window as any).ethereum)
        await provider.send("eth_requestAccounts", []);
    }


    useEffect(() => {
        getSignerAddress();
        (window as any).ethereum.on('accountsChanged', (accounts: any) => {
            // If user has locked/logout from MetaMask, this resets the accounts array to empty
            if (!accounts.length) {
                // logic to handle what happens once MetaMask is locked
                setAddress("")
            } else {
                getSignerAddress();
            }
        });
    }, [])

    return { address, login }
}