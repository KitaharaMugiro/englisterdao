import { ethers } from "ethers";

export default () => {
    //TODO: ログイン状態の管理(ログインしている時はボタンの表示を変えるなど)
    const onClickLogin = async () => {
        if (!("ethereum" in window)) {
            console.warn("MetaMask Plugin not found");
            return;
        }
        const provider = new ethers.providers.Web3Provider((window as any).ethereum)
        await provider.send("eth_requestAccounts", []);
    }

    return (
        <div>
            <button onClick={onClickLogin}>metamask login</button>
        </div>
    );
}