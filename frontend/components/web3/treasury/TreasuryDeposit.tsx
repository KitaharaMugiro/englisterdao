import { useState } from "react"
import useDaoTreasury from "../../../hooks/useDaoTreasury"

export default () => {
    const [value, setValue] = useState(0)
    const { depositEth, loading } = useDaoTreasury()

    const onClickDeposit = async () => {
        await depositEth(value)
        window.location.reload()
    }

    return <div>
        <input onChange={(e) => setValue(Number(e.target.value))} value={value}></input>
        <button onClick={onClickDeposit}>
            {loading ? "Loading..." : "Deposit"}
        </button>
    </div>

}