import useContributionPoll from "../../../hooks/useContributionPoll"
import ContributorList from "../../spreadsheet/ContributorList"

export default () => {
    const { pollId, candidates } = useContributionPoll()

    return <div>
        <h4>立候補者(Poll番号: {pollId})</h4>
        {candidates?.map((candidate, index) => (
            <div key={candidate + pollId}>
                <p>({index + 1})  {candidate}</p>
            </div>
        ))}
        <ContributorList filterAddressList={candidates || []} />
    </div>
}