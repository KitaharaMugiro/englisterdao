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
        <h4>立候補する</h4>
        <button onClick={onClickCandidate}>立候補</button>
    </div>
}