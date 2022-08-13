import { useEffect, useState } from "react";
import { ethers } from "ethers";
import artifact from "../src/DAOTokenAbi.json";

const contractAddress = '0x2279b7a0a67db372996a5fab50d91eaa73d2ebe6'
export default () => {
    const [count, setCount] = useState(0);
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = new ethers.Contract(contractAddress, artifact.abi, provider);
    const { totalSupply, balanceOf } = contract.functions;

    useEffect(() => {
        const getTaskCount = async () => {
            const totalSupplyOfDAOToken = await totalSupply();
            setCount(Number(totalSupplyOfDAOToken));
        }
        getTaskCount()
    }, [])

    return (
        <div>
            <h1 >{count}</h1>
        </div>
    );
}