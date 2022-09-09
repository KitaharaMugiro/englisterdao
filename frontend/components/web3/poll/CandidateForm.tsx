import { useState } from "react"
import useContributionPoll from "../../../hooks/useContributionPoll"

export default () => {

    const { pollId, candidateToContributionPoll } = useContributionPoll()
    const [errorMessaage, setErrorMessage] = useState("")

    const onClickCandidate = async () => {
        try {
            if (candidateToContributionPoll)
                await candidateToContributionPoll()
        } catch (e: any) {
            setErrorMessage(e.message)
        }
    }

    return <div>
        <h3 >立候補する</h3>
        <button onClick={onClickCandidate}>立候補</button>
        <div style={{ color: "red" }}>{errorMessaage}</div>
        <br />
        <a target="_blank" href="https://docs.google.com/spreadsheets/d/15ANGqCgZA8o-QjyjbsWrOiu9nJrAKvSnP54liTZr6t4">スプレッドシート</a>に必要事項を記入してから上記のボタンを押してください。
    </div>
}