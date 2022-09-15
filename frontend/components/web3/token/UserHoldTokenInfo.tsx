import useDaoToken from "../../../hooks/dao/useDaoToken"
import useDaoTreasury from "../../../hooks/dao/useDaoTreasury"
import useEth from "../../../hooks/web3/useEth"
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
                <p>
                    あなたの保有トークン数: <b>{yourBalance} {tokenSymbol}</b>
                    <span style={{ marginLeft: 5, fontSize: 10 }}>
                        ウォレットにトークンが表示されない場合は<a target="_blank" href="https://button-hearing-b81.notion.site/ENG-d154290e262e4fcb828ec407add0fb5c">こちら</a>
                    </span>
                </p>
                <p>あなたの保持割合: <b>{yourBalance / tokenTotalSupply * 100} %</b></p>
                <p>あなたの保有トークン価値(ネイティブトークン換算): <b>{tokenRate * yourBalance} MATIC</b>
                    <span style={{ marginLeft: 5, fontSize: 10 }}>
                        MATICの価値は<a target="_blank" href="https://www.coingecko.com/ja/%E3%82%B3%E3%82%A4%E3%83%B3/%E3%83%9E%E3%83%86%E3%82%A3%E3%83%83%E3%82%AF/jpy">こちら</a>
                    </span>
                </p>
            </div>
        </div>

    </div>
}