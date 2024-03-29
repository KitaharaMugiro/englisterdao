import AdminLinkInfo from "../components/Common/AdminLinkInfo";
import LinkInfo from "../components/Common/LinkInfo";
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
            <AdminLinkInfo />
        </div>
    );
}