import useDaoTreasury from "../../../hooks/useDaoTreasury"
import { InfoBox } from "../../style/InfoBox"

export default () => {
    const { tokenRate, balance } = useDaoTreasury()

    return <div style={InfoBox}>
        <p>トレジャリーに保管されているETH: {balance}</p>
        <p>1トークンあたりの交換レート: {tokenRate}</p>
    </div>
}