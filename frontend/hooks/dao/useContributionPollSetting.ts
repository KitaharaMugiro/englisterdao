import { useEffect, useState } from "react"
import { ethers } from "ethers";
import artifact from "../../src/abi/ContributionPoll.json";
import { ContributionPoll } from "../../types/ethers-contracts";
import useMetaMask, { getContract, getContractWithSigner } from "../web3/useMetaMask";


export default () => {
    const { address, login } = useMetaMask()
    const [paused, setPaused] = useState(false)
    const [daoTokenAddress, setDaoTokenAddress] = useState("")
    const [REQUIRED_TOKEN_FOR_VOTE, setREQUIRED_TOKEN_FOR_VOTE] = useState(0)
    const [CONTRIBUTOR_ASSIGNMENT_TOKEN, setCONTRIBUTOR_ASSIGNMENT_TOKEN] = useState(0)
    const [SUPPORTER_ASSIGNMENT_TOKEN, setSUPPORTER_ASSIGNMENT_TOKEN] = useState(0)
    const [VOTE_MAX_POINT, setVOTE_MAX_POINT] = useState(0)
    const [votingEnabled, setSetVotingEnabled] = useState(true)
    const [pollId, setPollId] = useState(0)

    const contractAddress = process.env.NEXT_PUBLIC_CONTRIBUTIONPOLL_CONTRACT_ADDRESS as string
    const contract = getContract(contractAddress, artifact.abi) as ContributionPoll
    const contractWithSigner = getContractWithSigner(contractAddress, artifact.abi) as ContributionPoll

    useEffect(() => {
        contract.functions.paused().then(p => setPaused(p[0]));
        contract.functions.daoTokenAddress().then(a => setDaoTokenAddress(a[0]));
        contract.functions.REQUIRED_TOKEN_FOR_VOTE().then(t => setREQUIRED_TOKEN_FOR_VOTE(Number(t[0])));
        contract.functions.CONTRIBUTOR_ASSIGNMENT_TOKEN().then(t => setCONTRIBUTOR_ASSIGNMENT_TOKEN(Number(ethers.utils.formatEther(t[0]))));
        contract.functions.SUPPORTER_ASSIGNMENT_TOKEN().then(t => setSUPPORTER_ASSIGNMENT_TOKEN(Number(ethers.utils.formatEther(t[0]))));
        contract.functions.VOTE_MAX_POINT().then(t => setVOTE_MAX_POINT(Number(t[0])));
        contract.functions.votingEnabled().then(t => setSetVotingEnabled(t[0]));
        contract.functions.pollId().then(t => setPollId(Number(t[0])));
    }, [address]);

    return {
        paused,
        daoTokenAddress,
        REQUIRED_TOKEN_FOR_VOTE,
        CONTRIBUTOR_ASSIGNMENT_TOKEN,
        SUPPORTER_ASSIGNMENT_TOKEN,
        VOTE_MAX_POINT,
        votingEnabled,
        pollId,
        setDaoTokenAddress: contractWithSigner.functions.setDaoTokenAddress,
        setRequiredTokenForVote: contractWithSigner.functions.setRequiredTokenForVote,
        setContributorAssignmentToken: contractWithSigner.functions.setContributorAssignmentToken,
        setSupporterAssignmentToken: contractWithSigner.functions.setSupporterAssignmentToken,
        setVoteMaxPoint: contractWithSigner.functions.setVoteMaxPoint,
        setVotingEnabled: contractWithSigner.functions.setVotingEnabled,
        pause: contractWithSigner.functions.pause,
        unpause: contractWithSigner.functions.unpause,
    };
}