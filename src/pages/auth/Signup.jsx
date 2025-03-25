import React, { useEffect, useState, Fragment } from "react";
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { clearErrors, setSignupData, signupUser } from '../../slices/authSlice';
import { showToast } from '../../components/Schema';
import DOMPurify from 'dompurify';
import Loader from '../../components/Loader/Loader';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';


const Signup = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { signLoading, signErrors, signError, } = useSelector((state) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const subjects = ["Maths", "English", "Physics", "Chemistry", "Biology"];

  // profile photo upload functionality
  const defImg = 'https://t3.ftcdn.net/jpg/03/58/90/78/360_F_358907879_Vdu96gF4XVhjCZxN2kCG0THTsSQi8IhT.jpg';
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(defImg);
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleUploadClick = () => {
    document.getElementById('avatar').click();
  };
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    classOp: '',
    subjects: []
  });

  //password hide and show
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [conPasswordVisible, setConPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const toggleConPasswordVisibility = () => {
    setConPasswordVisible(!conPasswordVisible);
  };

  //handlers
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    dispatch(clearErrors());
  };
  const handleSubjectClick = (subject) => {
    setSelectedSubjects((prevSelected) => {
      const newSelected = prevSelected.includes(subject) ? prevSelected.filter((sub) => sub !== subject) : [...prevSelected, subject];

      setFormData((prevValues) => ({
        ...prevValues,
        subjects: newSelected,
      }));

      dispatch(clearErrors());
      return newSelected;
    });
  };

  const getFieldError = (field) => Array.isArray(signErrors) ? signErrors.find(error => error.path === field) : null;
  const firstNameError = getFieldError('firstName');
  const lastNameError = getFieldError('lastName');
  const emailError = getFieldError('email');
  const passwordError = getFieldError('password');
  const confirmPasswordError = getFieldError('confirmPassword');
  const classOpError = getFieldError('classOp');
  const subjectsError = getFieldError('subjects');

  const handleSignup = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (firstNameError || lastNameError || emailError || passwordError || confirmPasswordError || classOpError || subjectsError) {
      toast(<div className='flex center g5'> < NewReleasesIcon />Please fix the errors before submitting the form.</div>, { duration: 3000, position: 'top-center', style: { color: 'red' }, className: 'failed', ariaProps: { role: 'status', 'aria-live': 'polite' } });
      return;
    }
    setIsSubmitting(true);

    try {
      const sanitizedFirstName = DOMPurify.sanitize(formData.firstName);
      const sanitizedLastName = DOMPurify.sanitize(formData.lastName);
      const sanitizedEmail = DOMPurify.sanitize(formData.email);
      const sanitizedPassword = DOMPurify.sanitize(formData.password);
      const sanitizedConfirmPassword = DOMPurify.sanitize(formData.confirmPassword);
      const sanitizedClassOp = DOMPurify.sanitize(formData.classOp);
      const sanitizedSubjects = formData.subjects.map(subject => DOMPurify.sanitize(subject));

      const userData = new FormData();
      userData.append('firstName', sanitizedFirstName);
      userData.append('lastName', sanitizedLastName);
      userData.append('email', sanitizedEmail);
      userData.append('password', sanitizedPassword);
      userData.append('confirmPassword', sanitizedConfirmPassword);
      userData.append('classOp', sanitizedClassOp);

      sanitizedSubjects.forEach((subject, index) => {
        userData.append(`subjects[${index}]`, subject);
      });

      if (selectedImage) {
        userData.append('image', selectedImage);
      }

      const response = await dispatch(signupUser(userData)).unwrap();
      if (response.status === "success") {
        dispatch(setSignupData({
          firstName: sanitizedFirstName, lastName: sanitizedLastName, email: sanitizedEmail, password: sanitizedPassword, confirmPassword: sanitizedConfirmPassword,
          classOp: sanitizedClassOp, subjects: sanitizedSubjects, image: selectedImage || null
        }));

        showToast('success', `${response.message}`);
        navigate('/verify-otp');
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

  if (signLoading) {
    return <Loader />;
  }

  return (
    <Fragment>
      <Helmet>
        <title>Signup | Sai Classes</title>
        <meta name="description" content="Join SaiClasses today for academic excellence and success in school exams"></meta>
        <link rel="canonical" href="https://saiclasses.netlify.app/signup" />
      </Helmet>
      <div className='page flex center' style={{ height: '100vh' }}>
        <form className="authBox flexcol center" onSubmit={handleSignup}>
          <h1 className="heading">Create your account</h1>

          <div className="minBox flexcol center">
            <div className="relative">
              <img src={imageUrl ? imageUrl : defImg} alt="Profile" className="avatar" />
              <div className="avatar-edit-icon" onClick={handleUploadClick}>
                <img src="https://res.cloudinary.com/dfsohhjfo/image/upload/v1721197484/MarketPlace/Assets/4850478_upload_uploading_save_arrow_up_icon_haje1x.png" alt="edit-icon" />
              </div>
            </div>
            <input id="avatar" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
          </div>

          <input type="text" name='firstName' autoComplete='name' placeholder='Enter your first name...' value={formData.firstName} onChange={handleChange} />
          {firstNameError && <p className="error">{firstNameError.msg}</p>}

          <input type="text" name='lastName' autoComplete='name' placeholder='Enter your last name...' value={formData.lastName} onChange={handleChange} />
          {lastNameError && <p className="error">{lastNameError.msg}</p>}

          <input type="email" name='email' autoComplete='email' placeholder='Enter your email...' value={formData.email} onChange={handleChange} />
          {emailError && <p className="error">{emailError.msg}</p>}

          <div className="wh relative password">
            <input type={passwordVisible ? "text" : "password"} className='wh' name='password' autoComplete="new-password" placeholder='Enter your password...' value={formData.password} onChange={handleChange} />
            <span onClick={togglePasswordVisibility}>
              {passwordVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </span>
          </div>
          {passwordError && <p className="error">{passwordError.msg}</p>}

          <div className="wh relative password">
            <input type={conPasswordVisible ? "text" : "password"} className='wh' name="confirmPassword" autoComplete="new-password" placeholder='Enter your password again...' value={formData.confirmPassword} onChange={handleChange} />
            <span onClick={toggleConPasswordVisibility}>
              {conPasswordVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </span>
          </div>
          {confirmPasswordError && <p className="error">{confirmPasswordError.msg}</p>}

          <select name='classOp' value={formData.classOp} onChange={handleChange}>
            <option value="">Select your class</option>
            <option value={6}>6th Class</option>
            <option value={7}>7th Class</option>
            <option value={8}>8th Class</option>
            <option value={9}>9th Class</option>
            <option value={10}>10th Class</option>
          </select>
          {classOpError && <p className="error">{classOpError.msg}</p>}

          <div className="wh g15 flexcol center">
            <p className='text wh'>Select subjects</p>
            <div className="subjectCont">
              {subjects.map((subject) => (
                <div key={subject} className={`subject ${selectedSubjects.includes(subject) ? "turnBlue" : ""}`} onMouseDown={() => handleSubjectClick(subject)}>
                  {subject}
                </div>
              ))}
            </div>
          </div>
          {subjectsError && <p className="error">{subjectsError.msg}</p>}

          <button type='submit' disabled={isSubmitting}>{isSubmitting ? 'Signing up...' : 'Signup'}</button>
          {signError && <p className="error flex center">{signError}</p>}
          <p className="text blue">Already have an account? <Link className='text blue hover' to='/login'>Click here</Link></p>
        </form>
      </div>
    </Fragment>
  )
};

export default Signup;