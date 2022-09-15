import { useEffect, useState } from "react";
import artifact from "../../src/abi/ContributionPoll.json";
import { ContributionPoll } from "../../types/ethers-contracts";
import useMetaMask, { getContract, getContractWithSigner } from "../web3/useMetaMask";

export default () => {
    const [voters, setVoters] = useState<string[]>([]);
    const [pollId, setPollId] = useState<number | undefined>(undefined);
    const [candidates, setCandidates] = useState<string[]>([]);
    const [isEligibleToVote, setIsEligibleToVote] = useState(false);
    const { address } = useMetaMask()

    const contractAddress = process.env.NEXT_PUBLIC_CONTRIBUTIONPOLL_CONTRACT_ADDRESS as string
    const contract = getContract(contractAddress, artifact.abi) as ContributionPoll
    const contractWithSigner = getContractWithSigner(contractAddress, artifact.abi) as ContributionPoll

    useEffect(() => {
        contract.functions.pollId().then(id => setPollId(Number(id[0])));
        contract.functions.getCurrentCandidates().then(c => setCandidates(c[0]));
        if (address) {
            contract.functions.isEligibleToVote(address).then(e => setIsEligibleToVote(e[0]));

        }
    }, [address]);

    useEffect(() => {
        getCurrentVoters().then(v => setVoters(v));
    }, [pollId]);

    const getCurrentVoters = async () => {
        let index = 0
        const votes = []
        while (true) {
            try {
                const vote = await contract.functions.votes(pollId!, index)
                index += 1
                votes.push(vote[0])
            } catch (e) {
                console.log(e)
                break
            }
        }
        console.log(votes)
        return votes
    }
    const completedVote = voters.includes(address as string)
    const completedCandidate = candidates.includes(address as string)

    return {
        pollId,
        candidates,
        vote: contractWithSigner.functions.vote,
        candidateToContributionPoll: contractWithSigner.functions.candidateToContributionPoll,
        settleCurrentPollAndCreateNewPoll: contractWithSigner.functions.settleCurrentPollAndCreateNewPoll,
        voters,
        completedVote,
        completedCandidate,
        isEligibleToVote
    };
}
