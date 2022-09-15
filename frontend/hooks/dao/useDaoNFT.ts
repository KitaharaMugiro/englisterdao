import { useState, useEffect } from "react";
import artifact from "../../src/abi/DAONFT.json";
import { DAONFT } from "../../types/ethers-contracts";
import useMetaMask, { getContract, getContractWithSigner } from "../web3/useMetaMask";

export type NftMetaData = {
    name: string;
    description: string;
    image: string;
    tokenId: number;
}

export default () => {
    const { address } = useMetaMask()
    const [owned, setOwned] = useState(false)
    const [totalSupply, setTotalSupply] = useState(0)
    const [metadata, setMetadata] = useState<NftMetaData>()

    const contractAddress = process.env.NEXT_PUBLIC_DAONFT_CONTRACT_ADDRESS as string
    const contract = getContract(contractAddress, artifact.abi) as DAONFT
    const contractWithSigner = getContractWithSigner(contractAddress, artifact.abi) as DAONFT

    useEffect(() => {
        if (address) {
            contract.functions.balanceOf(address).then(t => {
                const _owned = t[0].toNumber() > 0
                setOwned(_owned)
                if (_owned) {
                    contract.functions.tokenOfOwnerByIndex(address, 0).then(t => {
                        const tokenId = t[0].toNumber()
                        contract.functions.tokenURI(tokenId).then(t => {
                            const uri = t[0]
                            fetch(uri).then(res => res.json()).then(data => {
                                setMetadata({
                                    name: data.name,
                                    description: data.description,
                                    image: data.image,
                                    tokenId
                                })
                            })
                        })
                    })
                }

            })
        }

    }, [address]);

    useEffect(() => {
        contract.functions.totalSupply().then(t => {
            const totalSupply = t[0].toNumber()
            setTotalSupply(totalSupply)
        })
    }, [])

    return {
        owned,
        contractAddress,
        metadata,
        totalSupply
    };
}