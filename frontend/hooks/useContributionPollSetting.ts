import { useEffect, useState } from "react"
import { ethers } from "ethers";
import artifact from "../src/abi/ContributionPoll.json";
import { ContributionPoll } from "../types/ethers-contracts";
import useMetaMask, { getContract, getContractWithSigner } from "./useMetaMask";


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
        _getContract().functions.paused().then(p => setPaused(p[0]));
        _getContract().functions.daoTokenAddress().then(a => setDaoTokenAddress(a[0]));
        _getContract().functions.REQUIRED_TOKEN_FOR_VOTE().then(t => setREQUIRED_TOKEN_FOR_VOTE(Number(ethers.utils.formatEther(t[0]))));
        _getContract().functions.CONTRIBUTOR_ASSIGNMENT_TOKEN().then(t => setCONTRIBUTOR_ASSIGNMENT_TOKEN(Number(ethers.utils.formatEther(t[0]))));
        _getContract().functions.SUPPORTER_ASSIGNMENT_TOKEN().then(t => setSUPPORTER_ASSIGNMENT_TOKEN(Number(ethers.utils.formatEther(t[0]))));
        _getContract().functions.VOTE_MAX_POINT().then(t => setVOTE_MAX_POINT(Number(t[0])));
        _getContract().functions.votingEnabled().then(t => setSetVotingEnabled(t[0]));
        _getContract().functions.pollId().then(t => setPollId(Number(t[0])));
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
        setDaoTokenAddress: _getContractWithSigner()?.functions?.setDaoTokenAddress,
        setRequiredTokenForVote: _getContractWithSigner()?.functions?.setRequiredTokenForVote,
        setContributorAssignmentToken: _getContractWithSigner()?.functions?.setContributorAssignmentToken,
        setSupporterAssignmentToken: _getContractWithSigner()?.functions?.setSupporterAssignmentToken,
        setVoteMaxPoint: _getContractWithSigner()?.functions?.setVoteMaxPoint,
        setVotingEnabled: _getContractWithSigner()?.functions?.setVotingEnabled,
        pause: _getContractWithSigner()?.functions?.pause,
        unpause: _getContractWithSigner()?.functions?.unpause,
    };
}