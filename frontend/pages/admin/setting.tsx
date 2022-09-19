import { ethers } from "ethers";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useContributionPollSetting from "../../hooks/dao/useContributionPollSetting";


export default () => {
    const {
        paused,
        daoTokenAddress,
        REQUIRED_TOKEN_FOR_VOTE,
        CONTRIBUTOR_ASSIGNMENT_TOKEN,
        SUPPORTER_ASSIGNMENT_TOKEN,
        VOTE_MAX_POINT,
        votingEnabled,
        setDaoTokenAddress,
        setRequiredTokenForVote,
        setContributorAssignmentToken,
        setSupporterAssignmentToken,
        setVoteMaxPoint,
        setVotingEnabled,
        pause,
        unpause
    } = useContributionPollSetting()

    const { register, handleSubmit } = useForm();
    const onSubmitDaoTokenAddress = handleSubmit(data => {
        setDaoTokenAddress(data.address)
    });
    const onSubmitRequiredTokenForVote = handleSubmit(data => {
        setRequiredTokenForVote(
            data.requiredTokenForVote
        )
    });
    const onSubmitContributorAssignmentToken = handleSubmit(data => {
        setContributorAssignmentToken(
            ethers.utils.parseEther(
                data.contirbutorAssignmentToken
            ))
    });
    const onSubmitSupporterAssignmentToken = handleSubmit(data => {
        setSupporterAssignmentToken(
            ethers.utils.parseEther(
                data.supporterAssignmentToken
            ))
    });
    const onSubmitVoteMaxPoint = handleSubmit(data => {
        setVoteMaxPoint(data.voteMaxPoint)
    });
    const onSubmitVotingEnabled = handleSubmit(data => {
        setVotingEnabled(data.checked)
    });

    return <div>
        <h2>投票設定</h2>

        <div>
            <h3>DAOトークンアドレス</h3>
            <form onSubmit={onSubmitDaoTokenAddress}>
                <input
                    type="text"
                    placeholder={daoTokenAddress}
                    {...register("address")}
                />
                <input type="submit" />
            </form>

            <h3>投票に必要なトークン数</h3>
            <form onSubmit={onSubmitRequiredTokenForVote}>
                <input
                    type="text"
                    placeholder={String(REQUIRED_TOKEN_FOR_VOTE)}
                    {...register("requiredTokenForVote")}
                />
                <input type="submit" />
            </form>

            <h3>Contributorに与えるトークン数</h3>
            <form onSubmit={onSubmitContributorAssignmentToken}>
                <input

                    type="text"
                    placeholder={String(CONTRIBUTOR_ASSIGNMENT_TOKEN)}
                    {...register("contirbutorAssignmentToken")}
                />
                <input type="submit" />
            </form>

            <h3>Supporterに与えるトークン数</h3>
            <form onSubmit={onSubmitSupporterAssignmentToken}>
                <input
                    type="text"
                    placeholder={String(SUPPORTER_ASSIGNMENT_TOKEN)}
                    {...register("supporterAssignmentToken")}
                />
                <input type="submit" />
            </form>

            <h3>投票の最大ポイント</h3>
            <form onSubmit={onSubmitVoteMaxPoint}>
                <input

                    type="text"
                    placeholder={String(VOTE_MAX_POINT)}
                    {...register("voteMaxPoint")}
                />
                <input type="submit" />
            </form>

            <h3>投票の有効化</h3>
            <form onSubmit={onSubmitVotingEnabled}>
                <input
                    type="checkbox"
                    defaultChecked={votingEnabled}
                    {...register("checked")}
                />
                <input type="submit" />
            </form>
        </div>
    </div>;
}