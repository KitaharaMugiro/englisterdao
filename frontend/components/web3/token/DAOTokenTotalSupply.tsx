import { useState } from "react";
import useDaoToken from "../../../hooks/dao/useDaoToken";
import { InfoBox } from "../../style/InfoBox";

export default () => {
    const { tokenName, tokenTotalSupply, tokenSymbol, contractAddress } = useDaoToken()

    return <div style={InfoBox}>
        <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ margin: 10, marginRight: 20 }}>
                <img width={70} src="https://tyoudoii-illust.com/wp-content/uploads/2021/02/coin_simple-279x300.png" />
            </div>
            <div>
                <p>トークン名: <b>{tokenName}</b></p>
                <p>総発行数: <b>{tokenTotalSupply} {tokenSymbol}</b></p>
                <p>トークンコントラクトアドレス: {contractAddress}</p>
            </div>
        </div>

    </div>
}