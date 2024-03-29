import { useEffect, useState } from "react"
import { ethers } from "ethers";
import artifact from "../../src/abi/DAOToken.json";
import { DAOToken } from "../../types/ethers-contracts/DAOToken";
import useMetaMask, { getContract } from "../web3/useMetaMask";

export default () => {
    const [tokenName, setTokenName] = useState("");
    const [tokenSymbol, setTokenSymbol] = useState("");
    const [tokenTotalSupply, setTokenTotalSupply] = useState(0);
    const [yourBalance, setYourBalance] = useState(0);
    const { address, login } = useMetaMask()
    const contractAddress = process.env.NEXT_PUBLIC_DAOTOKEN_CONTRACT_ADDRESS as string
    const contract = getContract(contractAddress, artifact.abi) as DAOToken

    useEffect(() => {
        const dataFetch = async () => {
            const provider = new ethers.providers.Web3Provider((window as any).ethereum)
            const signer = provider.getSigner();
            contract.functions.name().then(n => setTokenName(n[0]));
            contract.functions.symbol().then(s => setTokenSymbol(s[0]));
            contract.functions.totalSupply().then(t => setTokenTotalSupply(Number(ethers.utils.formatEther(t[0]))));
            if (address) {
                contract.functions.balanceOf(signer.getAddress()).then(b => setYourBalance(Number(ethers.utils.formatEther(b[0]))));
            }
        }
        dataFetch()
    }, [address])


    return { tokenName, tokenSymbol, tokenTotalSupply, yourBalance, contractAddress };
}