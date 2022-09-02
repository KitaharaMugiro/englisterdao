import useContributionPoll from "../../../hooks/useContributionPoll"

export default () => {
    const { settleCurrentPollAndCreateNewPoll } = useContributionPoll()

    const onClickSettle = async () => {
        try {
            if (settleCurrentPollAndCreateNewPoll)
                await settleCurrentPollAndCreateNewPoll()
        } catch {
            throw new Error("投票を終了することに失敗しました")
        }
    }
    return <div>
        <h3>投票を締め切る(onlyOwner)</h3>
        <button onClick={onClickSettle}>締め切る</button>
    </div>
}