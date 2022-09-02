import { ethers } from "ethers";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useContributionPollSetting from "../../hooks/useContributionPollSetting";
import useTokenSupplySystem from "../../hooks/useTokenSupplySystem";


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
        setDaoTokenAddress!(data.daoTokenAddress)
    });
    const onSubmitRequiredTokenForVote = handleSubmit(data => {
        setRequiredTokenForVote!(
            ethers.utils.parseEther(
                data.requiredTokenForVote
            ))
    });

    return <div>
        <h2>投票設定</h2>

        <div>
            <h3>DAOトークンアドレス</h3>
            <form onSubmit={onSubmitDaoTokenAddress}>
                <input
                    type="text"
                    placeholder={daoTokenAddress}
                    {...register("daoTokenAddress")}
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
        </div>

    </div>;
}