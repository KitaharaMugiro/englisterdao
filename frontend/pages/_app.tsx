
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
                <div >Metamaskのインストールをお願いします。</div>
            </div>
        );
    };


    return <SafeHydrate>
        {typeof window === 'undefined' ? windowErrorRender() :
            !isMetaMaskInstalled() ? metamaskErrorRender() :
                <div>
                    <title>Englister DAO</title>
                    <NetworkCheck />
                    <Component {...pageProps} />
                    <Footer />
                </div>
        }
    </SafeHydrate>
}

export default MyApp