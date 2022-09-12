import { useState, useEffect } from "react";
import useMetaMask, { getContract, getContractWithSigner } from "./useMetaMask";
import artifact from "../src/abi/DAONFTCrowdSale.json";
import { DAONFTCrowdSale } from "../types/ethers-contracts/DAONFTCrowdSale";
import { ethers } from "ethers";

export default () => {
    const { address } = useMetaMask()
    const [isWhiteListed, setIsWhiteListed] = useState(false)
    const [price, setPrice] = useState(0)

    const contractAddress = process.env.NEXT_PUBLIC_DAONFTCROWDSALE_CONTRACT_ADDRESS as string
    const contract = getContract(contractAddress, artifact.abi) as DAONFTCrowdSale
    const contractWithSigner = getContractWithSigner(contractAddress, artifact.abi) as DAONFTCrowdSale

    useEffect(() => {
        const checkWhiteList = async () => {
            if (address) {
                const isWhiteListed = await contract.functions.isWhitelisted(address)
                setIsWhiteListed(isWhiteListed[0])
            }
        }
        checkWhiteList()
        contract.functions.price().then(t => setPrice(Number(ethers.utils.formatEther(t[0]))))
    }, [address]);


    return {
        isWhiteListed,
        price,
        buy: contractWithSigner.functions.buy,
        addToWhiteList: contractWithSigner.functions.addWhitelist,
        removeFromWhiteList: contractWithSigner.functions.removeWhitelist,
        setPrice: contractWithSigner.functions.setPrice,
    };
}