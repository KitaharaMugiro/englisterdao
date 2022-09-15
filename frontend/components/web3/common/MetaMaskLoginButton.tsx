import { useEffect, useState } from "react";
import useMetaMask from "../../../hooks/web3/useMetaMask";

export default () => {
    const { address, login } = useMetaMask()

    const onClickLogin = async () => {
        await login()
    }


    return (
        <div>
            {address && <p>{address}</p>}
            {!address && <button onClick={onClickLogin}>Login</button>}
        </div>
    );
}