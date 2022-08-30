import LinkInfo from "../components/Common/LinkInfo";
import MetaMaskLoginButton from "../components/web3/common/MetaMaskLoginButton";
import DAOTokenTotalSupply from "../components/web3/token/DAOTokenTotalSupply";
import UserHoldTokenInfo from "../components/web3/token/UserHoldTokenInfo";
import DAOTreasuryInfo from "../components/web3/treasury/DAOTreasuryInfo";

export default () => {

    return (
        <div>
            <DAOTokenTotalSupply />
            <DAOTreasuryInfo />
            <UserHoldTokenInfo />
            <LinkInfo />
        </div>
    );
}