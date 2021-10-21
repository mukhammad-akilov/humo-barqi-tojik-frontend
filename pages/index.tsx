import type { NextPage } from 'next';
import Head from 'next/head';
import Home from '../components/Home/Home';

const homePage: NextPage = () : JSX.Element => {
  return (
    <>
      <Home />
    </>
  );
};

export default homePage;
