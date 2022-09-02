import CandidateForm from "../../components/web3/poll/CandidateForm"

import SettleCurrentPollForm from "../../components/web3/poll/SettleCurrentPollForm"
import VoteForm from "../../components/web3/poll/VoteForm"
import VoteInfo from "../../components/web3/poll/VoteInfo"

export default () => {
    return <div>
        <VoteInfo />
        <br /><br />

        <VoteForm />

        <br />
        <br />
        <CandidateForm />
        <br /><br />
        <SettleCurrentPollForm />
        <br /><br />
    </div>
}