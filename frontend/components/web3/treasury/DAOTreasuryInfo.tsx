import useDaoTreasury from "../../../hooks/useDaoTreasury"
import { InfoBox } from "../../style/InfoBox"

export default () => {
    const { tokenRate, balance } = useDaoTreasury()

    return <div style={InfoBox}>
        <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ margin: 10, marginRight: 20 }}>
                <img width={70} src="https://tyoudoii-illust.com/wp-content/uploads/2021/03/money_bag_simple-320x320.png" />
            </div>
            <div>
                <p>トレジャリーに保管されているETH: <b>{balance}</b></p>
                <p>1トークンあたりの交換レート: <b>{tokenRate}</b></p>
            </div>
        </div>

    </div>
}