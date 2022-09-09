import useDaoToken from "../../../hooks/useDaoToken"
import useDaoTreasury from "../../../hooks/useDaoTreasury"
import useEth from "../../../hooks/useEth"
import { InfoBox } from "../../style/InfoBox"

export default () => {
    const { yourBalance, tokenSymbol, tokenTotalSupply } = useDaoToken()
    const { tokenRate } = useDaoTreasury()
    const { balance } = useEth()

    return <div style={InfoBox}>
        <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ margin: 10, marginRight: 20 }}>
                <img width={70} src="https://tyoudoii-illust.com/wp-content/uploads/2021/03/costgood_man_color.png" />
            </div>
            <div>
                <p>あなたの保有ネイティブトークン: <b>{balance} MATIC</b></p>
                <p>あなたの保有トークン数: <b>{yourBalance} {tokenSymbol}</b></p>
                <p>あなたの保持割合: <b>{yourBalance / tokenTotalSupply * 100} %</b></p>
                <p>あなたの保有トークン価値(ネイティブトークン換算): <b>{tokenRate * yourBalance} MATIC</b></p>
            </div>
        </div>

    </div>
}