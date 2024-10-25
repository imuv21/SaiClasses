import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet-async';

const PaymentSuccess = () => {

  return (
    <Fragment>
      <Helmet>
        <title>Sai Classes</title>
        <meta name="description" content="Join SaiClasses today for academic excellence and success in school exams"></meta>
        <link rel="canonical" href="https://saiclasses.netlify.app/payment-success" />
      </Helmet>
      <div className="page flexcol center" style={{height: '100vh'}}>
        Payment Success page
      </div>
    </Fragment>
  )
}

export default PaymentSuccess