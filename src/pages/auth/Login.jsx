import React, { useEffect, useState, Fragment } from "react";
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { clearErrors, loginUser } from '../../slices/authSlice';
import { showToast } from '../../components/Schema';
import DOMPurify from 'dompurify';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';


const Login = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { logLoading, logErrors, logError } = useSelector((state) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  //password hide and show
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  //handlers
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    dispatch(clearErrors());
  };

  const getLogError = (field) => Array.isArray(logErrors) ? logErrors.find(error => error.path === field) : null;
  const emailLogError = getLogError('email');
  const passwordLogError = getLogError('password');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (emailLogError || passwordLogError) {
      showToast('error', 'Please fix the errors before submitting the form!');
      return;
    }
    setIsSubmitting(true);

    try {
      const userData = {
        email: DOMPurify.sanitize(formData.email),
        password: DOMPurify.sanitize(formData.password),
      };
      const response = await dispatch(loginUser(userData)).unwrap();

      if (response.status === "success") {
        showToast('success', `${response.message}`);
        navigate('/');
      }

    } catch (error) {
      showToast('error', 'Something went wrong!');
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  return (
    <Fragment>
      <Helmet>
        <title>Login | Sai Classes</title>
        <meta name="description" content="Join SaiClasses today for academic excellence and success in school exams"></meta>
        <link rel="canonical" href="https://saiclasses.netlify.app/login" />
      </Helmet>
      <div className='page flex center' style={{ height: '100vh' }}>
        <form className="authBox flexcol center" onSubmit={handleLogin}>
          <h1 className="heading">Login to your account</h1>

          <input type="email" name='email' autoComplete='email' placeholder='Enter your email...' value={formData.email} onChange={handleChange} />
          {emailLogError && <p className="error">{emailLogError.msg}</p>}

          <div className="wh relative password">
            <input type={passwordVisible ? "text" : "password"} className='wh' name='password' autoComplete="current-password" placeholder='Enter your password...' value={formData.password} onChange={handleChange} />
            <span onClick={togglePasswordVisibility}>
              {passwordVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </span>
          </div>
          {passwordLogError && <p className="error">{passwordLogError.msg}</p>}

          <button type='submit' disabled={isSubmitting || logLoading}>{(isSubmitting || logLoading) ? 'Loging...' : 'Login'}</button>
          {logError && <p className="error flex center">{logError}</p>}

          <div className="minBox flexcol center">
            <p className="text">Don't have an account? <Link className='text hover' to='/signup'>Click here</Link></p>
            <p className="text">Forgot your password again? <Link className='text hover' to='/forgot-password'>Click here</Link></p>
          </div>
        </form>
      </div>
    </Fragment>
  )
};

export default Login;