
import dynamic from 'next/dynamic';
import Footer from '../components/web3/common/Footer';
import NetworkCheck from '../components/web3/common/NetworkCheck';

import '../styles/globals.css'

const MyApp = ({ Component, pageProps }: any) => {
    const SafeHydrate = dynamic(() => import('../components/SafeHydrage'), { ssr: false });
    const isMetaMaskInstalled = () => {
        const { ethereum } = window as any;
        return Boolean(ethereum && ethereum.isMetaMask);
    };

    const windowErrorRender = () => {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="text-2xl font-bold">このページを開くことはできません(お問い合わせをお願いします)</div>
            </div>
        );
    };

    const metamaskErrorRender = () => {
        return (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div >Englister DAOを表示するにはMetaMaskが必要です。</div>
                <div >MetaMaskのインストールをお願いします。</div>
                <div >またiOS/AndroidはMetaMaskのブラウザからアクセスしてください。</div>
                <div>
                    Desktop: <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=ja">Chrome MetaMaskインストールページ</a>
                </div>
                <div>
                    iOS: <a href="https://apps.apple.com/jp/app/metamask-blockchain-wallet/id1438144202">iOS MetaMaskインストールページ</a>
                </div>
                <div>
                    Android: <a href="https://play.google.com/store/apps/details?id=io.metamask&hl=ja&gl=US">Android MetaMaskインストールページ</a>
                </div>
            </div>
        );
    };

    const render = () => {
        return <div>
            <NetworkCheck />
            <Component {...pageProps} />
            <Footer />
        </div>
    }

    return <SafeHydrate>
        <title>Englister DAO(PoC)</title>
        {
            typeof window === 'undefined' ? windowErrorRender() :
                !isMetaMaskInstalled() ? metamaskErrorRender() :
                    render()
        }
    </SafeHydrate>
}

export default MyApp