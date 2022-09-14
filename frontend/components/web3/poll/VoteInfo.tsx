import useContributionPollSetting from "../../../hooks/dao/useContributionPollSetting"
import useDaoNFT from "../../../hooks/dao/useDaoNFT"
import useDaoToken from "../../../hooks/dao/useDaoToken"
import { InfoBox } from "../../style/InfoBox"

export default () => {
    const {
        pollId,
        REQUIRED_TOKEN_FOR_VOTE,
        CONTRIBUTOR_ASSIGNMENT_TOKEN,
        SUPPORTER_ASSIGNMENT_TOKEN,
        votingEnabled,
    } = useContributionPollSetting()

    const { tokenSymbol } = useDaoToken()
    const { owned } = useDaoNFT()
    return <div>
        <h3>貢献度投票 第{pollId}回</h3>
        <div style={InfoBox}>
            <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ margin: 10, marginRight: 20 }}>
                    <img width={70} src="https://tyoudoii-illust.com/wp-content/uploads/2021/04/event_01_color.png" />
                </div>
                <div>
                    <p>投票: <b>{votingEnabled ? "受付中" : "停止中"}</b></p>
                    <p>DAOメンバーシップを持っている: <b>{owned ? "OK" : "NG"}</b></p>
                    <p>貢献者に配布されるトークン総額: <b>{CONTRIBUTOR_ASSIGNMENT_TOKEN} {tokenSymbol}</b></p>
                    <p>投票者に配布されるトークン総額: <b>{SUPPORTER_ASSIGNMENT_TOKEN} {tokenSymbol}</b></p>
                </div>
            </div>
        </div>
    </div>
}