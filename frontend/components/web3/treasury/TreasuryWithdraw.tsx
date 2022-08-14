import { useState } from "react"
import useDaoTreasury from "../../../hooks/useDaoTreasury"
import UserHoldTokenInfo from "../token/UserHoldTokenInfo"

export default () => {
    const [value, setValue] = useState("")
    const { withdrawEth, loading } = useDaoTreasury()

    const onClickDeposit = async () => {
        try {
            await withdrawEth(Number(value))
        } catch {
            throw new Error("引き出しに失敗しました");
        }

        window.location.reload()
    }

    return <div>
        <h2>出金(トークンを入力)</h2>
        <input onChange={(e) => setValue(e.target.value)} value={value}></input>
        <button onClick={onClickDeposit}>
            {loading ? "Loading..." : "Withdraw"}
        </button>
    </div>
}