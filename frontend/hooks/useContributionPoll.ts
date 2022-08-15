import { useEffect, useState } from "react"
import { ethers } from "ethers";
import artifact from "../src/abi/ContributionPoll.json";
import { ContributionPoll } from "../types/ethers-contracts";


export default () => {
    const [pollId, setPollId] = useState<number | undefined>(undefined);
    const [candidates, setCandidates] = useState<string[]>([]);

    const contractAddress = process.env.NEXT_PUBLIC_CONTRIBUTIONPOLL_CONTRACT_ADDRESS as string
    const getContract = () => {
        //const provider = new ethers.providers.JsonRpcProvider(); //WARN: metamaskのログインと関係なく、Ownerのアドレスを取得している
        const provider = new ethers.providers.Web3Provider((window as any).ethereum)
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, artifact.abi, provider);
        try {
            return contract as ContributionPoll
            return contract.connect(signer) as ContributionPoll
        } catch {
            return contract as ContributionPoll
        }
    }

    useEffect(() => {
        const contractWithSigner = getContract()
        contractWithSigner?.functions.pollId().then(id => setPollId(Number(id[0])));
        contractWithSigner?.functions.getCurrentCandidates().then(c => setCandidates(c[0]));
    }, []);


    return {
        pollId,
        candidates,
        vote: getContract().functions.vote,
        candidateToContributionPoll: getContract().functions.candidateToContributionPoll,
        settleCurrentPollAndCreateNewPoll: getContract().functions.settleCurrentPollAndCreateNewPoll,
    };
}