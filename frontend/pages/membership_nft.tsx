import { useState } from "react"
import useDaoNFT from "../hooks/useDaoNFT"
import useDaoNFTCrowdSale from "../hooks/useDaoNFTCrowdSale"
import useDaoToken from "../hooks/useDaoToken"
import useMetaMask from "../hooks/useMetaMask"

export default () => {

    const { isWhiteListed, buy, price } = useDaoNFTCrowdSale()
    const { contractAddress, owned, metadata } = useDaoNFT()

    const { tokenSymbol, yourBalance } = useDaoToken()
    const [errorMessaage, setErrorMessage] = useState("")
    const { login } = useMetaMask()
    const canBuy = isWhiteListed && yourBalance >= price

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
            <img src={metadata?.image} width={600} height={600} />
        </div>
    }
    if (!isWhiteListed) {
        return <div>
            <h1>ホワイトリストに登録されていません</h1>
            <div>Englister DAOの経営会議に参加して投票権を取得しよう！(詳しい説明は後で記載)</div>
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
