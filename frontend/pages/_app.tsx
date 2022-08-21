
import dynamic from 'next/dynamic';
import '../styles/globals.css'

const MyApp = ({ Component, pageProps }: any) => {
    const SafeHydrate = dynamic(() => import('../components/SafeHydrage'), { ssr: false });

    return <SafeHydrate>
        {typeof window === 'undefined' ? null : <Component {...pageProps} />}
    </SafeHydrate>
}

export default MyApp