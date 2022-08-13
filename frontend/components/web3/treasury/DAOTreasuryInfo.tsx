import useDaoTreasury from "../../../hooks/useDaoTreasury"

export default () => {
    const { tokenRate, balance } = useDaoTreasury()

    return <div>
        <p>トレジャリーに保管されているETH: {balance}</p>
        <p>1トークンあたりの交換レート: {tokenRate}</p>
    </div>
}