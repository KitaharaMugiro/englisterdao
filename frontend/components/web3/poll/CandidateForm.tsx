import useContributionPoll from "../../../hooks/useContributionPoll"

export default () => {

    const { pollId, candidateToContributionPoll } = useContributionPoll()

    const onClickCandidate = async () => {
        try {
            if (candidateToContributionPoll)
                await candidateToContributionPoll()
        } catch {
            throw new Error("立候補に失敗しました")
        }
    }

    return <div>
        <h3 >立候補する</h3>
        <button onClick={onClickCandidate}>立候補</button>
        <br />
        <a target="_blank" href="https://docs.google.com/spreadsheets/d/15ANGqCgZA8o-QjyjbsWrOiu9nJrAKvSnP54liTZr6t4">スプレッドシート</a>に必要事項を記入してから上記のボタンを押してください。
    </div>
}