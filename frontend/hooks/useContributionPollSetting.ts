import { useEffect, useState } from "react"
import { ethers } from "ethers";
import artifact from "../src/abi/ContributionPoll.json";
import { ContributionPoll } from "../types/ethers-contracts";
import useMetaMask from "./useMetaMask";


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
        getContract().functions.paused().then(p => setPaused(p[0]));
        getContract().functions.daoTokenAddress().then(a => setDaoTokenAddress(a[0]));
        getContract().functions.REQUIRED_TOKEN_FOR_VOTE().then(t => setREQUIRED_TOKEN_FOR_VOTE(Number(ethers.utils.formatEther(t[0]))));
        getContract().functions.CONTRIBUTOR_ASSIGNMENT_TOKEN().then(t => setCONTRIBUTOR_ASSIGNMENT_TOKEN(Number(ethers.utils.formatEther(t[0]))));
        getContract().functions.SUPPORTER_ASSIGNMENT_TOKEN().then(t => setSUPPORTER_ASSIGNMENT_TOKEN(Number(ethers.utils.formatEther(t[0]))));
        getContract().functions.VOTE_MAX_POINT().then(t => setVOTE_MAX_POINT(Number(t[0])));
        getContract().functions.votingEnabled().then(t => setSetVotingEnabled(t[0]));
        getContract().functions.pollId().then(t => setPollId(Number(t[0])));
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
        setDaoTokenAddress: getContractWithSigner()?.functions?.setDaoTokenAddress,
        setRequiredTokenForVote: getContractWithSigner()?.functions?.setRequiredTokenForVote,
        setContributorAssignmentToken: getContractWithSigner()?.functions?.setContributorAssignmentToken,
        setSupporterAssignmentToken: getContractWithSigner()?.functions?.setSupporterAssignmentToken,
        setVoteMaxPoint: getContractWithSigner()?.functions?.setVoteMaxPoint,
        setVotingEnabled: getContractWithSigner()?.functions?.setVotingEnabled,
        pause: getContractWithSigner()?.functions?.pause,
        unpause: getContractWithSigner()?.functions?.unpause,
    };
}