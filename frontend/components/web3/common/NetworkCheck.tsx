import { useEffect } from "react";
import useEth from "../../../hooks/web3/useEth";
import useMetaMask from "../../../hooks/web3/useMetaMask";
import style from "./NetworkCheck.module.css";

export default () => {
    const { network } = useEth();
    const { address, login } = useMetaMask()
    const expectedNetwork = process.env.NEXT_PUBLIC_EXPECTED_NETWORK;
    const expectedNetworkChainId = process.env.NEXT_PUBLIC_EXPECTED_NETWORK_CHAIN_ID;
    const renderHowToChangeNetwork = () => {
        if (expectedNetwork === "Mumbai") {
            return <div>
                接続方法は<a target="_blank" href="https://button-hearing-b81.notion.site/Polygon-Mumbai-a2c0d728603044359f5a820db5f07636">こちら</a>を参照してください。
            </div>
        } else if (expectedNetwork === "Polygon Mainnet") {
            return <div>
                接続方法は<a target="_blank" href="https://button-hearing-b81.notion.site/Polygon-fd2333b6919343fcaf32a54a83562727">こちら</a>を参照してください。
            </div>
        } else {
            return null;
        }
    }

    const addressOrLogin = () => {
        if (address) {
            return <div>
                <div>接続済みアドレス: {address}</div>
            </div>
        } else {
            return <div>
                <button onClick={login}>MetaMaskでログイン</button>
            </div>
        }
    }

    useEffect(() => {
        const chengeNetworkRequest = async () => {
            try {
                await (window as any).ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: expectedNetworkChainId }],
                });
                window.location.reload();
            } catch (e: any) {
                if (e.code === 4902) {
                    await (window as any).ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: expectedNetworkChainId,
                                rpcUrl: (() => {
                                    if (expectedNetwork === "Mumbai") {
                                        return "https://rpc-mumbai.maticvigil.com/";
                                    } else if (expectedNetwork === "Polygon Mainnet") {
                                        return "https://polygon-rpc.com/";
                                    } else if (expectedNetwork === "Unknown") {
                                        return "http://localhost:8545";
                                    }
                                })(),
                            },
                        ],
                    });
                    window.location.reload();
                }
            }
        }

        if (network !== expectedNetwork && network && expectedNetwork) {
            chengeNetworkRequest()
            return
        }
    }, [expectedNetwork, network, expectedNetwork, address])

    if (network !== expectedNetwork && network && expectedNetwork) {
        return <div className={style["modal"]} id="modal">
            <a className={style["overlay"]}></a>
            <div className={style["modal-wrapper"]}>
                <div className={style["modal-contents"]}>
                    <div className={style["modal-content"]}>
                        {network !== expectedNetwork &&
                            <div style={{ color: "red" }}>現在{network}のネットワークに接続しています。<br />
                                MetaMaskの接続先を{expectedNetwork}に変更してください。</div>}
                        {renderHowToChangeNetwork()}
                    </div>
                </div>
            </div>
        </div>

    }


    return <div>
        {addressOrLogin()}
    </div>

}