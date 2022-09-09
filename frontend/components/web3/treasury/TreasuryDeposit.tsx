import { useState } from "react"
import useDaoTreasury from "../../../hooks/useDaoTreasury"

export default () => {
    const [value, setValue] = useState("")
    const { depositEth, loading } = useDaoTreasury()
    const [errorMessaage, setErrorMessage] = useState("")

    const onClickDeposit = async () => {
        try {
            await depositEth(Number(value))
        } catch (e: any) {
            setErrorMessage(e.message)
        }
    }

    return <div>
        <h2>入金(入金したいMATICを入力)</h2>
        <input onChange={(e) => setValue(e.target.value)} value={value}></input>
        <button onClick={onClickDeposit}>
            {loading ? "Loading..." : "Deposit"}
        </button>
        <div style={{ color: "red" }}>{errorMessaage}</div>
    </div>

}