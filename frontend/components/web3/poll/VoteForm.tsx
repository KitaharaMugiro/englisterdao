import { useEffect, useState } from "react"
import useGoogleSheets from "use-google-sheets"
import useContributionPoll from "../../../hooks/dao/useContributionPoll"
import useMetaMask from "../../../hooks/web3/useMetaMask"
import { GOOGLE_API_KEY, GOOGLE_SHEETS_ID } from "../../../secret"

interface Vote {
    candidate: string
    point: number
}

const NAME_KEY = "Contributor名（Discord名：例mugi#9179）"
const CONTRIBUTION_KEY = "貢献内容(エビデンスURLがあると良い)"
const ADRESS_KEY = "MetaMaskアドレス"
export default () => {
    const { login } = useMetaMask()
    const { candidates, vote, voters, completedVote, isEligibleToVote } = useContributionPoll()
    const [errorMessaage, setErrorMessage] = useState("")

    const [votes, setVotes] = useState<Vote[]>([])

    const { data, loading, error } = useGoogleSheets({
        apiKey: GOOGLE_API_KEY,
        sheetId: GOOGLE_SHEETS_ID,
    });

    const contributors = data[0] ? data[0].data.map((row: any) => {
        return {
            name: row[NAME_KEY],
            contribution: row[CONTRIBUTION_KEY],
            address: row[ADRESS_KEY],
        }
    }) : []

    const getContributorContent = (info: any) => {
        if (loading) {
            return "Loading..."
        }
        if (error) {
            return "スプレッドシート連携の失敗(APIキーなどの設定問題かも)" + JSON.stringify(error)
        }
        if (!info) {
            return "スプレッドシートに貢献が登録されていません"
        }
        return <table>
            <thead>
                <tr>
                    <th>名前</th>
                    <th>貢献内容</th>
                    <th>アドレス</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{info.name}</td>
                    <td style={{ whiteSpace: "pre-wrap" }}>{info.contribution}</td>
                    <td>{info.address}</td>
                </tr>
            </tbody>
        </table>
    }

    useEffect(() => {
        const _votes = candidates?.map(candidate => ({ candidate, point: 0 }))
        setVotes(_votes || [])
    }, [candidates])

    const onClickVote = async () => {
        const _candidates = votes.map(vote => vote.candidate)
        const _points = votes.map(vote => vote.point)
        try {
            await login()
            await vote(_candidates, _points)
        } catch (e: any) {
            setErrorMessage(e.message)
        }
    }

    const renderForm = () => {
        if (candidates?.length === 0) {
            return <p>立候補はいません</p>
        }
        return <div>
            {candidates?.map(candidate => {
                const info = contributors.find(contributor => contributor.address === candidate)

                const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
                    const newVotes = votes.map(v => {
                        if (v.candidate === candidate) {
                            const point = parseInt(e.target.value)

                            //ポイントの制約
                            if (point < 0) {
                                return { candidate, point: 0 }
                            }
                            if (point > 20) {
                                return { candidate, point: 20 }
                            }

                            return { candidate, point: parseInt(e.target.value) }
                        }
                        return v
                    })
                    setVotes(newVotes)
                }

                return <div key={candidate} style={{ marginTop: 20, marginBottom: 20 }}>
                    {getContributorContent(info)}
                    <select onChange={onChange} disabled={!info}>
                        <option value={0}>🤔Umm...(0)</option>
                        <option value={1}>🙂OK(1)</option>
                        <option value={3}>😄Nice(3)</option>
                        <option value={6}>😆Great(6)</option>
                        <option value={10}>😍Excellent(10)</option>
                    </select>
                </div>
            })}
        </div>
    }

    const renderVote = () => {
        if (!isEligibleToVote) {
            return <div>
                <button disabled>投票</button>
                <p style={{ color: "red", fontWeight: "bold" }}>投票に必要なメンバーシップ証を保有していません</p>
            </div>
        }
        if (completedVote) {
            return <button disabled>投票済み</button>
        }
        return <button onClick={onClickVote}>投票</button>
    }

    return <div>
        <h3 >投票する ({voters.length}人が投票済み)</h3>
        {renderForm()}
        {renderVote()}
        <div style={{ color: "red" }}>{errorMessaage}</div>
    </div>
}