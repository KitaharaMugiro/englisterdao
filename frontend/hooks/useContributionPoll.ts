import { useEffect, useState } from "react";
import artifact from "../src/abi/ContributionPoll.json";
import { ContributionPoll } from "../types/ethers-contracts";
import useMetaMask, { getContract, getContractWithSigner } from "./useMetaMask";


export default () => {
    const [voters, setVoters] = useState<string[]>([]);
    const [pollId, setPollId] = useState<number | undefined>(undefined);
    const [candidates, setCandidates] = useState<string[]>([]);
    const { address } = useMetaMask()

    const contractAddress = process.env.NEXT_PUBLIC_CONTRIBUTIONPOLL_CONTRACT_ADDRESS as string

    const _getContractWithSigner = () => {
        if (!address) return undefined
        const contract = getContractWithSigner(contractAddress, artifact.abi)
        return contract as ContributionPoll
    }

    const _getContract = () => {
        const contract = getContract(contractAddress, artifact.abi)
        return contract as ContributionPoll
    }

    useEffect(() => {
        _getContract().functions.pollId().then(id => setPollId(Number(id[0])));
        _getContract().functions.getCurrentCandidates().then(c => setCandidates(c[0]));
    }, [address]);

    useEffect(() => {
        getCurrentVoters().then(v => setVoters(v));
    }, [pollId]);

    const getCurrentVoters = async () => {
        console.log("getCurrentVoters")
        let index = 0
        const votes = []
        while (true) {
            try {
                const vote = await _getContract().functions.votes(pollId!, index)
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
        vote: _getContractWithSigner()?.functions?.vote,
        candidateToContributionPoll: _getContractWithSigner()?.functions?.candidateToContributionPoll,
        settleCurrentPollAndCreateNewPoll: _getContractWithSigner()?.functions?.settleCurrentPollAndCreateNewPoll,
        voters,
        completedVote,
        completedCandidate
    };
}