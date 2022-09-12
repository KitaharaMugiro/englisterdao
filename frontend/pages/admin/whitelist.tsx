import { useState } from "react";
import { useForm } from "react-hook-form";
import useDaoNFTCrowdSale from "../../hooks/useDaoNFTCrowdSale";
import useMetaMask from "../../hooks/useMetaMask";

export default () => {
    const { addToWhiteList, removeFromWhiteList, setPrice, price } = useDaoNFTCrowdSale()
    const { register, handleSubmit } = useForm();
    const [errorMessaage, setErrorMessage] = useState("")
    const { login } = useMetaMask()

    const onSubmitAddWhiteList = handleSubmit(async data => {
        try {
            await login()
            await addToWhiteList(data.add_address)
        } catch (e: any) {
            setErrorMessage(e.message)
        }
    });


    const onSubmitRemoveWhiteList = handleSubmit(async data => {
        try {
            await login()
            removeFromWhiteList(data.remove_address)
        } catch (e: any) {
            setErrorMessage(e.message)
        }
    });

    const onSubmitSetPrice = handleSubmit(async data => {
        try {
            await login()
            setPrice(data.price)
        } catch (e: any) {
            setErrorMessage(e.message)
        }
    });

    return (
        <div>
            <h3>ホワイトリストに追加する</h3>
            <form onSubmit={onSubmitAddWhiteList}>
                <input
                    type="text"
                    placeholder="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
                    {...register("add_address")}
                />
                <input type="submit" />
            </form>

            <h3>ホワイトリストから削除する</h3>
            <form onSubmit={onSubmitRemoveWhiteList}>
                <input
                    type="text"
                    placeholder="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
                    {...register("remove_address")}
                />
                <input type="submit" />
            </form>

            <h3>価格を変更する</h3>
            <form onSubmit={onSubmitSetPrice}>
                <input
                    type="text"
                    placeholder={String(price)}
                    {...register("price")}
                />
                <input type="submit" />
            </form>

            <div style={{ color: "red" }}>{errorMessaage}</div>
        </div>
    )
}

