import { useState } from "react"
import useDaoTreasury from "../../../hooks/useDaoTreasury"

export default () => {
    const [value, setValue] = useState("")
    const { depositEth, loading } = useDaoTreasury()

    const onClickDeposit = async () => {
        await depositEth(Number(value))
    }

    return <div>
        <h2>入金(ネイティブトークンを入力)</h2>
        <input onChange={(e) => setValue(e.target.value)} value={value}></input>
        <button onClick={onClickDeposit}>
            {loading ? "Loading..." : "Deposit"}
        </button>
    </div>

}