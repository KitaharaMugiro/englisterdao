import { useEffect, useState } from "react"
import useGoogleSheets from "use-google-sheets"
import useContributionPoll from "../../../hooks/useContributionPoll"
import useDaoToken from "../../../hooks/useDaoToken"
import useMetaMask from "../../../hooks/useMetaMask"
import { GOOGLE_API_KEY, GOOGLE_SHEETS_ID } from "../../../secret"

interface Vote {
    candidate: string
    point: number
}

const NAME_KEY = "Contributor名（Discord名：例mugi#9179）"
const CONTRIBUTION_KEY = "貢献内容(エビデンスURLがあると良い)"
const ADRESS_KEY = "MetaMaskアドレス"
export default () => {
    const { pollId, candidates, vote } = useContributionPoll()
    const { address } = useMetaMask()
    const { topHolders, isTopHolder, tokenName } = useDaoToken()

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

    const getContributorContent = (address: string) => {
        const info = contributors.find(contributor => contributor.address === address)
        if (loading) {
            return "Loading..."
        }
        if (error) {
            return "スプレッドシート連携の失敗(APIキーなどの設定問題かも)" + JSON.stringify(error)
        }
        if (!info) {
            return "SpreadSheetに登録されていません"
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
                    <td>{info.contribution}</td>
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
            if (vote)
                await vote(_candidates, _points)
        } catch (e) {
            console.log(e)
            throw new Error("投票に失敗しました")

        }
    }

    const renderForm = () => {
        if (candidates?.length === 0) {
            return <p>立候補はいません</p>
        }

        return <div>
            {candidates?.map(candidate => {
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
                    {getContributorContent(candidate)}
                    <select onChange={onChange}>
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
        if (!isTopHolder) {
            return <p>
                {tokenName}のTopHolderでなければ投票できません。
                トップホルダー↓
                {topHolders.map(address => <div key={address}>{address}</div>)}
            </p>
        }
        return <button onClick={onClickVote}>投票</button>
    }

    return <div>
        <h3>貢献度投票 第{pollId}回</h3>
        {renderForm()}
        {renderVote()}
    </div>
}