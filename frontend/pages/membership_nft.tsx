import { useState } from "react"
import useDaoNFT from "../hooks/dao/useDaoNFT"
import useDaoNFTCrowdSale from "../hooks/dao/useDaoNFTCrowdSale"
import useDaoToken from "../hooks/dao/useDaoToken"
import useMetaMask from "../hooks/web3/useMetaMask"

export default () => {

    const { isWhiteListed, buy, price } = useDaoNFTCrowdSale()
    const { contractAddress, owned, metadata } = useDaoNFT()

    const { tokenSymbol, yourBalance } = useDaoToken()
    const [errorMessaage, setErrorMessage] = useState("")
    const { login } = useMetaMask()
    const canBuy = yourBalance >= price

    const onClickBuy = async () => {
        try {
            await login()
            await buy()
        } catch (e: any) {
            setErrorMessage(e.message)
        }
    }

    if (owned) {
        return <div>
            <h3>あなたは既にNFTを持っています</h3>
            <p>コントラクトアドレス: <b>{contractAddress}</b></p>
            <p>名前: <b>{metadata?.name}</b></p>
            <p>説明: <b>{metadata?.description}</b></p>
            <img src={metadata?.image} width={300} height={300} />
        </div>
    }
    if (!isWhiteListed) {
        return <div>
            <h2>Englister DAOメンバーシップ証を手に入れよう</h2>
            <img src={metadata?.image} width={200} height={200} />
            <p>STEP1 500ENGを集める: {canBuy ? <span style={{ color: "green" }}>OK</span> : <span style={{ color: "red" }}>未達成</span>}</p>
            <p>STEP2 ホワイトリストに追加を依頼する (毎週金曜20:30-21:00の経営会議に参加する) : <span style={{ color: "red" }}>未達成</span></p>
        </div>
    }
    return (
        <div>
            <h1>You are in white list!</h1>
            <p>一度だけDAOメンバーシップを購入することができます</p>
            <p>価格: <b>{price} {tokenSymbol}</b></p>
            <p>あなたの所持金: <b>{yourBalance} {tokenSymbol}</b></p>
            {canBuy ? <div /> : <div>購入するには所持金が足りません</div>}
            <button onClick={onClickBuy} disabled={!canBuy}>購入する</button>
            <div style={{ color: "red" }}>{errorMessaage}</div>
        </div>
    )
}
