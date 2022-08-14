import CandidateForm from "../components/web3/poll/CandidateForm"
import CandidateList from "../components/web3/poll/CandidateList"
import SettleCurrentPollForm from "../components/web3/poll/SettleCurrentPollForm"
import VoteForm from "../components/web3/poll/VoteForm"

export default () => {
    return <div>
        <CandidateList />

        <VoteForm />

        <CandidateForm />

        <SettleCurrentPollForm />
    </div>
}