import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Layout from '../components/Layout/Layout';

const  MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <>
        <Head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
    </>

  );
};

export default MyApp;
