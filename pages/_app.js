import '../styles/globals.css'
import { RecoilRoot } from 'recoil'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <Head>
        <title>Security System </title>
      </Head>

      <Component {...pageProps} />
    </RecoilRoot>
  )
}

export default MyApp
