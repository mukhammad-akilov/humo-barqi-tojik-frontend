import { useEffect } from 'react';
import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Layout from '../components/Layout/Layout';
import { StoreContextProvider } from '../store/StoreContext';

const  MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const body = document.querySelector("body") as HTMLBodyElement;
      body.classList.add("body");
      body.id = "body";
    }
  }, []);

  return (
    <>
        <Head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
          <meta name="description" content="Оплата Барки Точик -  МДО Хумо"/>
          <meta property="og:locale" content="ru_RU" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Оплата Барки Точик -  МДО Хумо" />
          <meta property="og:description" content="Оплата Барки Точик -  МДО Хумо" />
          <meta property="og:url" content="https://bark.humo.tj" />
          <meta property="og:site_name" content="Оплата Барки Точик -  МДО Хумо" />
          <meta property="og:image" content="/images/share.png" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <link rel="manifest" href="/favicon/site.webmanifest" />
          <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
          <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#da532c" />
        </Head>
        <StoreContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </StoreContextProvider>
    </>

  );
};

export default MyApp;
