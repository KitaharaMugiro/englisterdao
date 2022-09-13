import { useState } from "react"
import useDaoToken from "../../../hooks/useDaoToken"
import useDaoTreasury from "../../../hooks/useDaoTreasury"
import UserHoldTokenInfo from "../token/UserHoldTokenInfo"

export default () => {
    const [value, setValue] = useState("")
    const { withdrawEth, loading, tokenRate } = useDaoTreasury()
    const { yourBalance, tokenSymbol } = useDaoToken()
    const [errorMessaage, setErrorMessage] = useState("")

    const onClickDeposit = async () => {
        try {
            await withdrawEth(Number(value))
        } catch (e: any) {
            setErrorMessage(e.message)
        }
    }

    return <div>
        <h2>出金</h2>
        <input onChange={(e) => setValue(e.target.value)} value={value}></input> <b>{tokenSymbol}</b> (残高:{yourBalance} {tokenSymbol})
        <br />
        ↓
        <br />
        <input value={tokenRate * Number(value)}></input> <b>MATIC</b>
        <br />
        <button onClick={onClickDeposit}>
            {loading ? "Loading..." : "交換する"}
        </button>
        <div style={{ color: "red" }}>{errorMessaage}</div>
    </div>
}