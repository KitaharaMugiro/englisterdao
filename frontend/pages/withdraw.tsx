import UserHoldTokenInfo from "../components/web3/token/UserHoldTokenInfo"
import DAOTreasuryInfo from "../components/web3/treasury/DAOTreasuryInfo"
import TreasuryWithdraw from "../components/web3/treasury/TreasuryWithdraw"

export default () => {
    return <div>
        <DAOTreasuryInfo />
        <UserHoldTokenInfo />

        <TreasuryWithdraw />
    </div>
}