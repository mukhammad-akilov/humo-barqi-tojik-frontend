import type { NextPage } from 'next';
import Head from 'next/head';
import Home from '../components/Home/Home';
import CaptchaModal from '../components/CaptchaModal/CaptchaModal';

const homePage: NextPage = () : JSX.Element => {
  return (
    <>
     <Head>
          <title>Оплата Барки Точик &mdash; МДО Хумо</title>
          <meta name="description" content="Орзу - кредит наличными до 30 000 сомони" />
      </Head>
      <Home />
      <CaptchaModal />
    </>
  );
};

export default homePage;
