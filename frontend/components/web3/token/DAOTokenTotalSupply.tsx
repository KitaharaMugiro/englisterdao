import { useState } from "react";
import useDaoToken from "../../../hooks/useDaoToken";

export default () => {
    const { tokenName, tokenTotalSupply } = useDaoToken()

    return <div>
        <p>トークン名: {tokenName}</p>
        <p>総発行数: {tokenTotalSupply}</p>
    </div>
}