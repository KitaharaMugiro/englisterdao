
import dynamic from 'next/dynamic';
import NetworkCheck from '../components/web3/common/NetworkCheck';
import '../styles/globals.css'

const MyApp = ({ Component, pageProps }: any) => {
    const SafeHydrate = dynamic(() => import('../components/SafeHydrage'), { ssr: false });

    return <SafeHydrate>
        {typeof window === 'undefined' ? null :
            <div>
                <NetworkCheck />
                <Component {...pageProps} />
            </div>
        }
    </SafeHydrate>
}

export default MyApp