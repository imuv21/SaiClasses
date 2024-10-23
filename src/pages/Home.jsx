import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet-async';

const Home = () => {
  return (
    <Fragment>
      <Helmet>
        <title>Sai Classes</title>
        <meta name="description" content="Join SaiClasses today for academic excellence and success in school exams"></meta>
        <link rel="canonical" href="https://saiclasses.netlify.app/" />
      </Helmet>
      <div className="page flexcol center">
        Home page
      </div>
    </Fragment>
  )
}

export default Home