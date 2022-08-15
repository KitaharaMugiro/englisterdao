import MetaMaskLoginButton from "../components/web3/common/MetaMaskLoginButton";
import DAOTokenTotalSupply from "../components/web3/token/DAOTokenTotalSupply";
import UserHoldTokenInfo from "../components/web3/token/UserHoldTokenInfo";
import DAOTreasuryInfo from "../components/web3/treasury/DAOTreasuryInfo";

export default () => {

    return (
        <div>
            <MetaMaskLoginButton />
            <DAOTokenTotalSupply />
            <UserHoldTokenInfo />
            <DAOTreasuryInfo />
            <a href="/poll">投票する</a>
            <br />
            <a href="/deposit">入出金する</a>
        </div>
    );
}