import { InfoBox } from "../style/InfoBox"

export default () => {

    return <div style={InfoBox}>
        <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ margin: 10, marginRight: 20 }}>
                <img width={70} src="https://tyoudoii-illust.com/wp-content/uploads/2021/10/president_man_color-1.png" />
            </div>
            <div>
                <a href="/admin/reward">Rewardシステム(onlyOwner)</a>
                <br />
                <a href="/admin/setting">設定値変更(onlyOwner)</a>
                <br />
                <a href="/admin/whitelist">ホワイトリスト追加/削除(onlyOwner)</a>
            </div>
        </div>

    </div>
}