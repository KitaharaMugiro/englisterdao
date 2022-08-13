import MetaMaskLoginButton from "../components/web3/common/MetaMaskLoginButton";
import DAOTokenTotalSupply from "../components/web3/token/DAOTokenTotalSupply";
import DAOTreasuryInfo from "../components/web3/treasury/DAOTreasuryInfo";

export default () => {

    return (
        <div>
            <MetaMaskLoginButton />
            <DAOTokenTotalSupply />
            <DAOTreasuryInfo />
            <a href="/poll">投票する</a>
            <br />
            <a href="/deposit">ETHをデポジットする</a>
        </div>
    );
}