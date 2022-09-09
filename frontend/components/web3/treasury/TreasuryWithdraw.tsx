import { useState } from "react"
import useDaoTreasury from "../../../hooks/useDaoTreasury"
import UserHoldTokenInfo from "../token/UserHoldTokenInfo"

export default () => {
    const [value, setValue] = useState("")
    const { withdrawEth, loading } = useDaoTreasury()
    const [errorMessaage, setErrorMessage] = useState("")

    const onClickDeposit = async () => {
        try {
            await withdrawEth(Number(value))
        } catch (e: any) {
            setErrorMessage(e.message)
        }
    }

    return <div>
        <h2>出金(出金したいDAOトークンを入力)</h2>
        <input onChange={(e) => setValue(e.target.value)} value={value}></input>
        <button onClick={onClickDeposit}>
            {loading ? "Loading..." : "Withdraw"}
        </button>
        <div style={{ color: "red" }}>{errorMessaage}</div>
    </div>
}