import { useState } from "react"
import useContributionPoll from "../../../hooks/useContributionPoll"

export default () => {

    const { completedCandidate, candidateToContributionPoll } = useContributionPoll()
    const [errorMessaage, setErrorMessage] = useState("")

    const onClickCandidate = async () => {
        try {
            if (candidateToContributionPoll)
                await candidateToContributionPoll()
        } catch (e: any) {
            setErrorMessage(e.message)
        }
    }

    const renderCandidateButton = () => {
        if (completedCandidate) {
            return <button disabled>立候補済み</button>
        }
        return <button onClick={onClickCandidate}>立候補</button>
    }


    return <div>
        <h3 >立候補する</h3>
        {renderCandidateButton()}
        <div style={{ color: "red" }}>{errorMessaage}</div>
        <br />
        <a target="_blank" href="https://docs.google.com/spreadsheets/d/15ANGqCgZA8o-QjyjbsWrOiu9nJrAKvSnP54liTZr6t4">スプレッドシート</a>に必要事項を記入してから上記のボタンを押してください。
    </div>
}