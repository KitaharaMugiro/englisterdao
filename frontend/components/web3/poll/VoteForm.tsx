import { useEffect, useState } from "react"
import useContributionPoll from "../../../hooks/useContributionPoll"

interface Vote {
    candidate: string
    point: number
}

export default () => {
    const { pollId, candidates, vote } = useContributionPoll()

    const [votes, setVotes] = useState<Vote[]>([])

    useEffect(() => {
        const _votes = candidates.map(candidate => ({ candidate, point: 0 }))
        setVotes(_votes)
    }, [candidates])

    const onClickVote = async () => {
        const _candidates = votes.map(vote => vote.candidate)
        const _points = votes.map(vote => vote.point)
        try {
            await vote(_candidates, _points)
            window.location.reload()
        } catch {
            throw new Error("投票に失敗しました");
        }
    }

    const renderForm = () => {
        if (candidates.length === 0) {
            return <p>立候補はいません</p>
        }

        return <div>
            {candidates.map(candidate => {
                const point = votes.find(p => p.candidate === candidate)?.point || 0
                const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

                return <div key={candidate}>
                    <p>{candidate}</p>
                    <input value={point} onChange={onChange} />
                </div>
            })}
        </div>
    }

    return <div>
        <h4>投票する</h4>
        {renderForm()}
        <button onClick={onClickVote}>投票</button>
    </div>
}