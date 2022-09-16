import { useState } from "react";
import useTokenSupplySystem from "../../hooks/dao/useTokenSupplySystem";
import useMetaMask from "../../hooks/web3/useMetaMask";

export default () => {
    const { login } = useMetaMask();
    const { payAndPayWithNative, unclaimedBalance, mint, burn } = useTokenSupplySystem()
    const [address, setAddress] = useState("")
    const [amount, setAmount] = useState("")
    const [nativeAmount, setNativeAmount] = useState("")
    const [fee, setFee] = useState("")
    const [mintAmount, setMintAmount] = useState("")
    const [burnAmount, setBurnAmount] = useState("")
    const total = Number(amount) + Number(nativeAmount) + Number(fee)
    const [errorMessaage, setErrorMessage] = useState("")

    const onSend = async () => {
        try {
            await login()
            await payAndPayWithNative(address, Number(amount), Number(nativeAmount), Number(fee))
        } catch (e: any) {
            setErrorMessage(e.message)
        }
    }

    const onMint = async () => {
        try {
            await login()
            await mint(Number(mintAmount))
        } catch (e: any) {
            setErrorMessage(e.message)
        }

    }

    const onBurn = async () => {
        try {
            await login()
            await burn(Number(burnAmount))
        } catch (e: any) {
            setErrorMessage(e.message)
        }
    }

    return <div>
        <div>
            Unclaimed Balance: {unclaimedBalance}
            <h2>Mint(MintしたいDAOトークンを入力)</h2>
            <input onChange={(e) => setMintAmount(e.target.value)} value={mintAmount}></input>
            <button onClick={onMint}>
                Mint
            </button>

            <h2>Burn(BurnしたいDAOトークンを入力)</h2>
            <input onChange={(e) => setBurnAmount(e.target.value)} value={burnAmount}></input>
            <button onClick={onBurn}>
                Burn
            </button>
        </div>

        <br />

        <br />
        <h2>Unclaimed Balanceを送金(全てDAOトークンを入力)</h2>
        <input placeholder="address" value={address} onChange={e => setAddress(e.target.value)} />
        <input placeholder="ENG交換" value={amount} onChange={e => setAmount(e.target.value)} />
        <input placeholder="Native交換" value={nativeAmount} onChange={e => setNativeAmount(e.target.value)} />
        <input placeholder="手数料" value={fee} onChange={e => setFee(e.target.value)} />
        <input placeholder="総額" value={total} />
        <button onClick={onSend}>送金</button>

        <div style={{ color: "red" }}>{errorMessaage}</div>
    </div>
}
