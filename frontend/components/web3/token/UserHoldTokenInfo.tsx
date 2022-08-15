import useDaoToken from "../../../hooks/useDaoToken"
import useEth from "../../../hooks/useEth"
import { InfoBox } from "../../style/InfoBox"

export default () => {
    const { yourBalance } = useDaoToken()
    const { balance } = useEth()

    return <div style={InfoBox}>
        <p>あなたの保有ETH: {balance}</p>
        <p>あなたの保有トークン数: {yourBalance}</p>
    </div>
}