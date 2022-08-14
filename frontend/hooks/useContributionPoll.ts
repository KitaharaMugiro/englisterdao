import { useEffect, useState } from "react"
import { ethers } from "ethers";
import artifact from "../src/abi/ContributionPoll.json";
import { ContributionPoll } from "../types/ethers-contracts";


export default () => {
    const [pollId, setPollId] = useState<number | undefined>(undefined);
    const [candidates, setCandidates] = useState<string[]>([]);

    const contractAddress = process.env.NEXT_PUBLIC_CONTRIBUTIONPOLL_CONTRACT_ADDRESS as string
    const provider = new ethers.providers.JsonRpcProvider();
    const signer = provider.getSigner(); //WARN: metamaskのログインと関係なく、Ownerのアドレスを取得している
    const contract = new ethers.Contract(contractAddress, artifact.abi, provider);
    const contractWithSigner = contract.connect(signer) as ContributionPoll;

    const { pollId: getPollId, getCurrentCandidates, vote, candidateToContributionPoll, settleCurrentPollAndCreateNewPoll } = contractWithSigner.functions;

    useEffect(() => {
        getPollId().then(id => setPollId(Number(id[0])));
        getCurrentCandidates().then(c => setCandidates(c[0]));
    }, []);

    return { pollId, candidates, vote, candidateToContributionPoll, settleCurrentPollAndCreateNewPoll };
}