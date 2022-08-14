import { useEffect, useState } from "react"
import { ethers } from "ethers";
import artifact from "../src/abi/DAOToken.json";
import { DAOToken } from "../types/ethers-contracts/DAOToken";

export default () => {
    const [tokenName, setTokenName] = useState("");
    const [tokenSymbol, setTokenSymbol] = useState("");
    const [tokenTotalSupply, setTokenTotalSupply] = useState(0);
    const [yourBalance, setYourBalance] = useState(0);

    const contractAddress = process.env.NEXT_PUBLIC_DAOTOKEN_CONTRACT_ADDRESS as string
    const provider = new ethers.providers.JsonRpcProvider();
    const signer = provider.getSigner(); //WARN: metamaskのログインと関係なく、Ownerのアドレスを取得している
    const contract = new ethers.Contract(contractAddress, artifact.abi, provider);
    const contractWithSigner = contract.connect(signer) as DAOToken;

    const { name, totalSupply, symbol, balanceOf } = contractWithSigner.functions;

    useEffect(() => {
        name().then(n => setTokenName(n[0]));
        symbol().then(s => setTokenSymbol(s[0]));
        totalSupply().then(t => setTokenTotalSupply(Number(t[0])));
        balanceOf(signer.getAddress()).then(b => setYourBalance(Number(b[0])));
    }, [])

    return { tokenName, tokenSymbol, tokenTotalSupply, yourBalance };
}