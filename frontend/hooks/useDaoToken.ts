import { useEffect, useState } from "react"
import { ethers } from "ethers";
import artifact from "../src/abi/DAOToken.json";
import { DAOToken } from "../types/ethers-contracts/DAOToken";
import useMetaMask from "./useMetaMask";

export default () => {
    const [tokenName, setTokenName] = useState("");
    const [tokenSymbol, setTokenSymbol] = useState("");
    const [tokenTotalSupply, setTokenTotalSupply] = useState(0);
    const [yourBalance, setYourBalance] = useState(0);
    const { address, login } = useMetaMask()

    const contractAddress = process.env.NEXT_PUBLIC_DAOTOKEN_CONTRACT_ADDRESS as string

    const getContractWithSigner = async () => {
        const provider = new ethers.providers.Web3Provider((window as any).ethereum)
        await provider.send('eth_requestAccounts', []);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, artifact.abi, provider);
        return contract.connect(signer) as DAOToken
    }

    const getContract = () => {
        const provider = new ethers.providers.Web3Provider((window as any).ethereum)
        const contract = new ethers.Contract(contractAddress, artifact.abi, provider);
        return contract as DAOToken
    }

    useEffect(() => {
        const dataFetch = async () => {
            //const provider = new ethers.providers.JsonRpcProvider(); //WARN: metamaskのログインと関係なく、Ownerのアドレスを取得している
            const provider = new ethers.providers.Web3Provider((window as any).ethereum)
            const signer = provider.getSigner();
            getContract().functions.name().then(n => setTokenName(n[0]));
            getContract().functions.symbol().then(s => setTokenSymbol(s[0]));
            getContract().functions.totalSupply().then(t => setTokenTotalSupply(Number(ethers.utils.formatEther(t[0]))));
            if (address) {
                getContract().functions.balanceOf(signer.getAddress()).then(b => setYourBalance(Number(ethers.utils.formatEther(b[0]))));
            }
        }
        dataFetch()
    }, [address])

    return { tokenName, tokenSymbol, tokenTotalSupply, yourBalance };
}