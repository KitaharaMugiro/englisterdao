import { ethers } from "ethers";
import { useState } from "react";

export default () => {
    const [address, setAddress] = useState("null")
    const getSigner = async () => {
        const provider = new ethers.providers.Web3Provider((window as any).ethereum)
        const signer = provider.getSigner()
        if (!signer) {
            throw new Error("No signer")
        }
        setAddress(await signer.getAddress());
    }

    return <div>
        <button onClick={getSigner}>アドレス表示</button>
        <p>{address}</p>
    </div>
}