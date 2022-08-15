import { useState } from "react";
import useDaoToken from "../../../hooks/useDaoToken";
import { InfoBox } from "../../style/InfoBox";

export default () => {
    const { tokenName, tokenTotalSupply } = useDaoToken()

    return <div style={InfoBox}>
        <p>トークン名: {tokenName}</p>
        <p>総発行数: {tokenTotalSupply}</p>
    </div>
}