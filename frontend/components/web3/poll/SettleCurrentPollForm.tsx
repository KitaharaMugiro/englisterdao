import { useState } from "react"
import useContributionPoll from "../../../hooks/useContributionPoll"
import useMetaMask from "../../../hooks/useMetaMask"

export default () => {
    const { login } = useMetaMask()
    const { settleCurrentPollAndCreateNewPoll } = useContributionPoll()
    const [errorMessaage, setErrorMessage] = useState("")

    const onClickSettle = async () => {
        try {
            await login()
            await settleCurrentPollAndCreateNewPoll()
        } catch (e: any) {
            setErrorMessage(e.message)
        }
    }
    return <div>
        <h3>投票を締め切る(onlyOwner)</h3>
        <button onClick={onClickSettle}>締め切る</button>
        <div style={{ color: "red" }}>{errorMessaage}</div>
    </div>
}