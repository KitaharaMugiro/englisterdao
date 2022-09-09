import useEth from "../../../hooks/useEth";

export default () => {
    const { network } = useEth();
    const expectedNetwork = process.env.NEXT_PUBLIC_EXPECTED_NETWORK;
    const renderHowToChangeNetwork = () => {
        if (expectedNetwork === "Mumbai") {
            return <div>
                接続方法は<a href="https://button-hearing-b81.notion.site/Polygon-Mumbai-a2c0d728603044359f5a820db5f07636">こちら</a>を参照してください。
            </div>
        } else if (expectedNetwork === "Matic") {
            return <div>
                接続方法は<a href="https://button-hearing-b81.notion.site/Polygon-fd2333b6919343fcaf32a54a83562727">こちら</a>を参照してください。
            </div>
        } else {
            return <div></div>
        }
    }
    return (
        <div>
            {network !== expectedNetwork && <div style={{ color: "red" }}>現在のネットワークは{network}です。{expectedNetwork}に変更してください。</div>}
            {renderHowToChangeNetwork()}
        </div>
    );
}