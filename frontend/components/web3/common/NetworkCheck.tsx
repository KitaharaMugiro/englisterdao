import useEth from "../../../hooks/useEth";

export default () => {
    const { network } = useEth();
    const expectedNetwork = process.env.NEXT_PUBLIC_EXPECTED_NETWORK;
    return (
        <div>
            {network !== expectedNetwork && <div style={{ color: "red" }}>現在のネットワークは{network}です。{expectedNetwork}に変更してください。</div>}
        </div>
    );
}