import useDaoToken from "../../../hooks/useDaoToken"
import useEth from "../../../hooks/useEth"
import { InfoBox } from "../../style/InfoBox"

export default () => {
    const { yourBalance } = useDaoToken()
    const { balance } = useEth()

    return <div style={InfoBox}>
        <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ margin: 10, marginRight: 20 }}>
                <img width={70} src="https://tyoudoii-illust.com/wp-content/uploads/2021/03/costgood_man_color.png" />
            </div>
            <div>
                <p>あなたの保有ETH: <b>{balance}</b></p>
                <p>あなたの保有トークン数: <b>{yourBalance}</b></p>
            </div>
        </div>

    </div>
}