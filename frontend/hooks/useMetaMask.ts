import { useEffect, useState } from "react"
import { ethers } from "ethers";

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