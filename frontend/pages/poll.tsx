import CandidateForm from "../components/web3/poll/CandidateForm"

import SettleCurrentPollForm from "../components/web3/poll/SettleCurrentPollForm"
import VoteForm from "../components/web3/poll/VoteForm"

export default () => {
    return <div>
        <VoteForm />

        <CandidateForm />

        <SettleCurrentPollForm />
    </div>
}