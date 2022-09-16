import { InfoBox } from "../style/InfoBox"

export default () => {

    return <div style={InfoBox}>
        <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ margin: 10, marginRight: 20 }}>
                <img width={70} src="https://tyoudoii-illust.com/wp-content/uploads/2021/04/event_01_color.png" />
            </div>
            <div>
                <a href="/membership_nft">メンバーシップNFTを手に入れる(まずはここから)</a>
                <br />
                <a href="/poll">投票する / 立候補する</a>
                <br />
                <a href="/withdraw">出金する</a>
            </div>
        </div>
    </div>
}