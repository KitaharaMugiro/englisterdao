import { GOOGLE_API_KEY, GOOGLE_SHEETS_ID } from "../../secret";
import useGoogleSheets from 'use-google-sheets';


const NAME_KEY = "Contributor名（Discord名：例mugi#9179）"
const CONTRIBUTION_KEY = "貢献内容(エビデンスURLがあると良い)"
const ADRESS_KEY = "MetaMaskアドレス"

interface Props {
    filterAddressList: string[];
}

export default (props: Props) => {
    const { data, loading, error } = useGoogleSheets({
        apiKey: GOOGLE_API_KEY,
        sheetId: GOOGLE_SHEETS_ID,
    });

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>スプレッドシート連携の失敗(APIキーなどの設定問題かも) {JSON.stringify(error)}</div>;
    }

    const contributors = data[0].data.map((row: any) => {
        return {
            name: row[NAME_KEY],
            contribution: row[CONTRIBUTION_KEY],
            address: row[ADRESS_KEY],
        }
    }).filter((contributor) => {
        return props.filterAddressList.includes(contributor.address)
    })

    const DisplayData = contributors.map(
        (info) => {
            return (
                <tr>
                    <td>{info.name}</td>
                    <td>{info.contribution}</td>
                    <td>{info.address}</td>
                </tr>
            )
        }
    )


    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>名前</th>
                        <th>貢献内容</th>
                        <th>アドレス</th>
                    </tr>
                </thead>
                <tbody>
                    {DisplayData}
                </tbody>
            </table>
        </div>
    )
}
