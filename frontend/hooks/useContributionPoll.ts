import { useEffect, useState } from "react"
import { ethers } from "ethers";
import artifact from "../src/abi/ContributionPoll.json";
import { ContributionPoll } from "../types/ethers-contracts";
import useMetaMask from "./useMetaMask";


export default () => {
    const [pollId, setPollId] = useState<number | undefined>(undefined);
    const [candidates, setCandidates] = useState<string[]>([]);
    const { address, login } = useMetaMask()

    const contractAddress = process.env.NEXT_PUBLIC_CONTRIBUTIONPOLL_CONTRACT_ADDRESS as string
    const getContractWithSigner = () => {
        if (!address) return undefined
        const provider = new ethers.providers.Web3Provider((window as any).ethereum)
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, artifact.abi, provider);
        return contract.connect(signer) as ContributionPoll
    }

    const getContract = () => {
        const provider = new ethers.providers.Web3Provider((window as any).ethereum)
        const contract = new ethers.Contract(contractAddress, artifact.abi, provider);
        return contract as ContributionPoll
    }

    useEffect(() => {
        getContract().functions.pollId().then(id => setPollId(Number(id[0])));
        getContract().functions.getCurrentCandidates().then(c => setCandidates(c[0]));
    }, []);

    return {
        pollId,
        candidates,
        vote: getContractWithSigner()?.functions?.vote,
        candidateToContributionPoll: getContractWithSigner()?.functions?.candidateToContributionPoll,
        settleCurrentPollAndCreateNewPoll: getContractWithSigner()?.functions?.settleCurrentPollAndCreateNewPoll,
    };
}