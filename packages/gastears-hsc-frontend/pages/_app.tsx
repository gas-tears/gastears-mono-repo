import WalletConnectProvider from 'components/WalletConnectContext'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles/globals.css'


function MyApp({ Component, pageProps }: AppProps) {
  return (<>
    <Head>
      <title>GasTears X HSC</title>
      {/* <meta name="description" content="Keep track of all the gas that you spent through your blockchain exploration" /> */}
      {/* <meta name="image" property="og:image" content="https://live.staticflickr.com/65535/52074290310_e98ab166c1_k.jpg" /> */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Inter&display=optional" rel="stylesheet" />
      <script src="https://www.google.com/recaptcha/api.js?render=6LdYfEkeAAAAALIxY3AisT6fBgj12DW3aV8GDBWn"></script>
    </Head>
    <WalletConnectProvider>
      <Component {...pageProps} />
    </WalletConnectProvider>
  </>)
}

export default MyApp
