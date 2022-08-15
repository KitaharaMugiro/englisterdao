import UserHoldTokenInfo from "../components/web3/token/UserHoldTokenInfo"
import DAOTreasuryInfo from "../components/web3/treasury/DAOTreasuryInfo"
import TreasuryDeposit from "../components/web3/treasury/TreasuryDeposit"
import TreasuryWithdraw from "../components/web3/treasury/TreasuryWithdraw"

export default () => {
    return <div>
        <DAOTreasuryInfo />
        <UserHoldTokenInfo />

        <TreasuryDeposit />
        <TreasuryWithdraw />
    </div>
}