import './App.css';
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';

//components
import Loader from './components/Loader/Loader';
const Protector = lazy(() => import('./components/Protector'));
const Layout = lazy(() => import('./components/Layout'));

//public
const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));
const Otp = lazy(() => import('./pages/auth/Otp'));

//private
const Home = lazy(() => import('./pages/Home'));
const Profile = lazy(() => import('./pages/auth/Profile'));
const Courses = lazy(() => import('./pages/Features/Courses'));
const Payment = lazy(() => import('./pages/Features/Payment'));
const PaymentSuccess = lazy(() => import('./pages/Features/PaymentSuccess'));
const StreamVideo = lazy(() => import('./pages/Features/StreamVideo'));


function App() {

  const user = useSelector((state) => state.auth.user);

  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Toaster />
        <Routes>

          {/* private */}
          <Route element={<Protector user={user} />}>
            <Route path='/' element={<Layout><Home /></Layout>} />
            <Route path='/profile' element={<Layout><Profile /></Layout>} />
            <Route path='/videos' element={<Layout><Courses /></Layout>} />
            <Route path='/payment' element={<Layout><Payment /></Layout>} />
            <Route path='/stream/:publicId' element={<Layout><StreamVideo /></Layout>} />
          </Route>

          {/* public */}
          <Route element={<Protector user={!user} redirect='/' />}>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/verify-otp' element={<Otp />} />
          </Route>

          {/* both */}
          <Route path='/payment-success' element={<Layout><PaymentSuccess /></Layout>} />

          {/* not found */}
          <Route path='*' element={<div className='page flex center wh'>Are you kidding me? Kuchh bhi!</div>} />

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;