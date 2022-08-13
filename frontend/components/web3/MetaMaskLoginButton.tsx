import { ethers } from "ethers";
import { useEffect, useState } from "react";

export default () => {
    const [address, setAddress] = useState("")
    const getSigner = async () => {
        const provider = new ethers.providers.Web3Provider((window as any).ethereum)
        const signer = provider.getSigner()
        try {
            const address = await signer.getAddress()
            setAddress(address)
        } catch (error) {
            console.log(error)
        }
    }

    const onClickLogin = async () => {
        if (!("ethereum" in window)) {
            console.warn("MetaMask Plugin not found");
            return;
        }
        const provider = new ethers.providers.Web3Provider((window as any).ethereum)
        await provider.send("eth_requestAccounts", []);
    }

    useEffect(() => {
        getSigner();
        (window as any).ethereum.on('accountsChanged', (accounts: any) => {
            // If user has locked/logout from MetaMask, this resets the accounts array to empty
            if (!accounts.length) {
                // logic to handle what happens once MetaMask is locked
                setAddress("")
            } else {
                getSigner();
            }
        });
    }, [])

    return (
        <div>
            {address && <p>{address}</p>}
            {!address && <button onClick={onClickLogin}>Login</button>}
        </div>
    );
}