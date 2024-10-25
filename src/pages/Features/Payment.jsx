import React, { Fragment, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import NewReleasesIcon from '@mui/icons-material/NewReleases';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Payment = () => {

    const pricing = {
        6: { basePrice: 100 },
        7: { basePrice: 120 },
        8: { basePrice: 140 },
        9: { basePrice: 160 },
        10: { basePrice: 180 }
    };
    const subjectPrice = 50;
    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);
    const [duration, setDuration] = useState(1);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const plusDuration = () => {
        setDuration(duration + 1);
    }
    const minusDuration = () => {
        if (duration > 1) {
            setDuration(duration - 1);
        } else {
            setDuration(duration);
        }
    }

    //payment
    const razorpayHandler = async (subAmount, duration) => {

        const { data: { key } } = await axios.get(`${BASE_URL}/feat/getkey`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        const { data: { payment } } = await axios.post(`${BASE_URL}/feat/buysub`, { subAmount },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        const userId = payment.notes.userId;
        const paymentAmount = payment.amount / 100;

        const options = {
            key: key,
            amount: payment.amount,
            currency: payment.currency,
            name: `${user.firstName} ${user.lastName}`,
            description: "Test Transaction",
            image: user.image,
            order_id: payment.id,
            callback_url: `${BASE_URL}/feat/paymentverify?&userId=${userId}&subAmount=${paymentAmount}&duration=${duration}`,
            prefill: {
                name: `${user.firstName} ${user.lastName}`,
                email: user.email
            },
            notes: {
                name: `${user.firstName} ${user.lastName}`,
                class: user.classOp,
            },
            theme: {
                color: "#0cbaff"
            },
            modal: {
                escape: false,
                ondismiss: () => {
                    toast(<div className='flex center g5'> < NewReleasesIcon /> Payment failed</div>, { duration: 3000, position: 'top-center', style: { color: 'red' }, className: 'failed', ariaProps: { role: 'status', 'aria-live': 'polite' } });
                }
            }
        };
        const razor = new window.Razorpay(options);
        razor.open();
    };


    return (
        <Fragment>
            <Helmet>
                <title>Sai Classes</title>
                <meta name="description" content="Join SaiClasses today for academic excellence and success in school exams"></meta>
                <link rel="canonical" href="https://saiclasses.netlify.app/payment" />
            </Helmet>
            <div className="page flexcol center">

                {user?.subscription?.isActive ?
                    (<div className="flexcol center wh g5">
                        <h1 className='headingSmol'>Your have paid {user.subscription.paymentHistory?.[user.subscription.paymentHistory.length - 1]?.paidAmount}₹</h1>
                        <p className="text">Your subscription starts on {formatDate(user.subscription.startDate)} and ends on {formatDate(user.subscription.endDate)}</p>
                        <p className="text">Subjects :&nbsp;
                            {user.subjects.map((subject, index) => (
                                <span key={index}>{subject}{index < user.subjects.length - 1 ? ', ' : ''}</span>
                            ))}
                        </p>
                        <p className='text'>Duration :&nbsp;
                            {user.subscription.paymentHistory?.[user.subscription.paymentHistory.length - 1]?.duration}
                            {user.subscription.paymentHistory?.[user.subscription.paymentHistory.length - 1]?.duration > 1 ? ` months` : ` month`}
                        </p>
                    </div>) :
                    (<div className="flexcol center wh g5">
                        <h1 className='headingSmol'>Your monthly subscription amount is {user.subscription.subAmount}₹</h1>
                        <p className="text">Class: {user.classOp}th Standard, </p>
                        <p className="text">Subjects :&nbsp;
                            {user.subjects.map((subject, index) => (
                                <span key={index}>{subject}{index < user.subjects.length - 1 ? ', ' : ''}</span>
                            ))}
                        </p>
                        <div className="flex center wh g5">Buy for
                            <button disabled={duration === 1} className='plusmiBtns' onClick={minusDuration}><RemoveCircleIcon /></button>
                            {duration}
                            <button className='plusmiBtns' onClick={plusDuration}><AddCircleIcon /></button>
                            {duration > 1 ? ` months` : ` month`}
                        </div>
                        <button style={{ marginTop: '10px' }} onClick={() => razorpayHandler(user.subscription.subAmount * duration, duration)}>
                            Pay Now {user.subscription.subAmount * duration}
                        </button>
                    </div>)
                }

                {!user?.subscription?.isActive &&
                    <table className="pricing-table">
                        <thead>
                            <tr>
                                <th>Class</th>
                                <th>Base Price</th>
                                <th>Subject Price</th>
                                <th>Subjects Selected</th>
                                <th>Total Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{user.classOp}th Standard</td>
                                <td>{pricing[user.classOp]?.basePrice} ₹</td>
                                <td>{subjectPrice} ₹</td>
                                <td>{user?.subjects?.length}</td>
                                <td>{user?.subscription?.subAmount} ₹</td>
                            </tr>
                        </tbody>
                    </table>
                }

                <h1 className='headingSmol flex wh center'>Payment History</h1>

                {user?.subscription?.paymentHistory?.length > 0 ? (
                    <table className="pricing-table">
                        <thead>
                            <tr>
                                <th>Index</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {user.subscription.paymentHistory.map((payment, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{formatDate(payment.paymentDate)}</td>
                                    <td>{payment.paidAmount} ₹</td>
                                    <td>{payment.duration}{payment.duration > 1 ? ' months' : ' month'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className='flex center wh text'>No payment history available.</p>
                )}



                <h1 className='headingSmol flex wh center'>Payment Structure</h1>
                <table className="pricing-table">
                    <thead>
                        <tr>
                            <th>Class</th>
                            <th>Base Price</th>
                            <th>Subject Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>6th Standard</td>
                            <td>{pricing[6]?.basePrice} ₹</td>
                            <td>{subjectPrice} ₹</td>
                        </tr>
                        <tr>
                            <td>7th Standard</td>
                            <td>{pricing[7]?.basePrice} ₹</td>
                            <td>{subjectPrice} ₹</td>
                        </tr>
                        <tr>
                            <td>8th Standard</td>
                            <td>{pricing[8]?.basePrice} ₹</td>
                            <td>{subjectPrice} ₹</td>
                        </tr>
                        <tr>
                            <td>9th Standard</td>
                            <td>{pricing[9]?.basePrice} ₹</td>
                            <td>{subjectPrice} ₹</td>
                        </tr>
                        <tr>
                            <td>10th Standard</td>
                            <td>{pricing[10]?.basePrice} ₹</td>
                            <td>{subjectPrice} ₹</td>
                        </tr>
                    </tbody>
                </table>

            </div>
        </Fragment>
    )
}

export default Payment;
