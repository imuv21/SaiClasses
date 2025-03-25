import React, { Fragment, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { showToast } from '../../components/Schema';
import { updateProfile, clearErrors } from '../../slices/authSlice';
import DOMPurify from 'dompurify';

import ClearIcon from '@mui/icons-material/Clear';


const Profile = () => {

  const dispatch = useDispatch();
  const { user, profLoading, profErrors, profError } = useSelector((state) => state.auth);
  const defImg = 'https://t3.ftcdn.net/jpg/03/58/90/78/360_F_358907879_Vdu96gF4XVhjCZxN2kCG0THTsSQi8IhT.jpg';
  const subandclass = false;

  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    classOp: '',
    subjects: [],
    image: null
  });
  const subjects = ["Maths", "English", "Physics", "Chemistry", "Biology"];
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(defImg);

  //clicks
  const [isClickedFooter, setIsClickedFooter] = useState(false);
  const [isClickedAvatar, setIsClickedAvatar] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleClickFooter = (event) => {
    event.preventDefault();
    setIsClickedFooter(true);
  };
  const handleClickAvatar = (event) => {
    event.preventDefault();
    setIsClickedAvatar(true);
  }
  const closepopup = (event) => {
    event.preventDefault();
    setIsClickedFooter(false);
  }
  const closepopupAvatar = (event) => {
    event.preventDefault();
    setIsClickedAvatar(false);
  }

  // profile photo upload functionality
  useEffect(() => {
    if (user && user.image) {
      setImageUrl(user.image);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.subjects) {
      setSelectedSubjects(user.subjects);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setFormValues(prevValues => ({
        ...prevValues,
        firstName: user.firstName,
        lastName: user.lastName,
        classOp: user.classOp,
        subjects: user.subjects || [],
        image: user.image || defImg
      }));
    }
  }, [user]);

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
  const handleSubjectClick = (subject) => {
    setSelectedSubjects((prev) => {
      const newSelected = prev.includes(subject)
        ? prev.filter((sub) => sub !== subject)
        : [...prev, subject];

      setFormValues((prevValues) => ({
        ...prevValues,
        subjects: newSelected
      }));

      return newSelected;
    });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    dispatch(clearErrors());
  };

  const getProfError = (field) => Array.isArray(profErrors) ? profErrors.find(error => error.path === field) : null;
  const firstNameError = getProfError('firstName');
  const lastNameError = getProfError('lastName');
  const classOpError = getProfError('classOp');
  const subjectsError = getProfError('subjects');


  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitted) return;
    if (firstNameError || lastNameError || classOpError || subjectsError) {
      showToast('error', 'Please fix the errors before submitting the form!');
      return;
    }
    setIsSubmitted(true);
    try {
      const sanitizedFirstName = DOMPurify.sanitize(formValues.firstName);
      const sanitizedLastName = DOMPurify.sanitize(formValues.lastName);
      const sanitizedClassOp = DOMPurify.sanitize(formValues.classOp);
      const sanitizedSubjects = formValues.subjects.map(subject => DOMPurify.sanitize(subject));

      const userData = new FormData();
      userData.append('firstName', sanitizedFirstName);
      userData.append('lastName', sanitizedLastName);
      userData.append('classOp', sanitizedClassOp);
      sanitizedSubjects.forEach((subject, index) => {
        userData.append(`subjects[${index}]`, subject);
      });
      if (selectedImage) {
        userData.append('image', selectedImage);
      }
      const response = await dispatch(updateProfile(userData)).unwrap();
      if (response.status === "success") {
        showToast('success', `${response.message}`);
        setIsClickedFooter(false);
      } else {
        showToast('error', `${response.message}`);
      }
    } catch (error) {
      showToast('error', 'Something went wrong!');
    } finally {
      setIsSubmitted(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isClickedFooter) {
        setIsClickedFooter(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isClickedFooter]);

  //password protect
  const [showPassword, setShowPassword] = useState(false);
  const seePassword = () => {
    setShowPassword(prev => !prev);
  }


  return (
    <Fragment>
      <Helmet>
        <title>Profile | Sai Classes</title>
        <meta name="description" content="Join SaiClasses today for academic excellence and success in school exams"></meta>
        <link rel="canonical" href="https://saiclasses.netlify.app/profile" />
      </Helmet>

      <div className="page flex center-start" style={{ height: '100vh' }}>
        <div className="profile">
          <h1 className="heading">Profile</h1>

          <div className="pagebox10 flexcol start-center">

            <div className={`popup-avatar pointer ${isClickedAvatar ? 'clicked' : ''}`}>
              <img onClick={handleClickAvatar} src={imageUrl} alt="Profile" className="avatar" />
              {isClickedAvatar && (
                <div className="popup">
                  <div className="popup-wrapper-avatar">
                    <img src={imageUrl} alt="Full Picture" className='bigAvatar' />
                    <ClearIcon onClick={closepopupAvatar} />
                  </div>
                </div>
              )}
            </div>

            <div className="pagebox20 flex center-space">
              <p className="textBig">Name :</p>
              <p className="textBig">{user.firstName} {user.lastName}</p>
            </div>
            <div className="pagebox20 flex center-space">
              <p className="textBig">Email :</p>
              <p className="textBig verify flex center-start g5">{user.email}
                {user.isVerified === 1 ? <VerifiedIcon /> : <NewReleasesIcon style={{ color: 'orange' }} />}
              </p>
            </div>
            <div className="pagebox20 flex center-space">
              <p className="textBig">Password :</p>
              <div className="textBig" style={{ cursor: 'pointer' }} onClick={seePassword}> {showPassword ? user.password : '***********'} </div>
            </div>
            <div className="pagebox20 flex center-space">
              <p className="textBig">Class :</p>
              <p className="textBig">{user.classOp}th Standard</p>
            </div>
            <div className="pagebox20 flex center-space">
              <p className="textBig">Subjects :</p>
              <p className="textBig">{user.subjects.join(', ')}</p>
            </div>
          </div>

          <div className="pagebox20 flex center-start">
            <div className={`popup-btn ${isClickedFooter ? 'clicked' : ''}`}>
              <button onClick={handleClickFooter}>Edit Profile</button>
              {isClickedFooter && (
                <div className="popup">
                  <form className="popup-wrapper" onSubmit={handleSubmit}>
                    <h2 className="heading">Update Profile</h2>

                    <div className="flexcol center">
                      <div className="relative">
                        <img src={imageUrl ? imageUrl : defImg} alt="Profile" className="avatar" />
                        <div className="avatar-edit-icon" onClick={handleUploadClick}>
                          <img src="https://res.cloudinary.com/dfsohhjfo/image/upload/v1721197484/MarketPlace/Assets/4850478_upload_uploading_save_arrow_up_icon_haje1x.png" alt="edit-icon" />
                        </div>
                      </div>
                      <input id="avatar" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                    </div>


                    <div className="pagebox10 flexcol center">
                      <input type="text" name='firstName' autoComplete="given-name" placeholder='Enter your first name...' value={formValues.firstName} onChange={handleInputChange} />
                      {firstNameError && <p className="error">{firstNameError.msg}</p>}
                      <input type="text" name='lastName' autoComplete="family-name" placeholder='Enter your last name...' value={formValues.lastName} onChange={handleInputChange} />
                      {lastNameError && <p className="error">{lastNameError.msg}</p>}
                      {subandclass &&
                        <select name='classOp' value={formValues.classOp} onChange={handleInputChange} required>
                          <option value="">Select your class</option>
                          <option value={6}>6th Class</option>
                          <option value={7}>7th Class</option>
                          <option value={8}>8th Class</option>
                          <option value={9}>9th Class</option>
                          <option value={10}>10th Class</option>
                        </select>
                      }
                      {classOpError && <p className="error">{classOpError.msg}</p>}
                    </div>

                    {subandclass &&
                      <div className="wh g15 flexcol center">
                        <p className='text wh'>Select subjects</p>
                        <div className="subjectCont">
                          {subjects.map((subject) => (
                            <div key={subject} className={`subject ${selectedSubjects.includes(subject) ? "turnBlue" : ""}`} onClick={() => handleSubjectClick(subject)}>
                              {subject}
                            </div>
                          ))}
                        </div>
                      </div>
                    }
                    {subjectsError && <p className="error">{subjectsError.msg}</p>}
                    {profError && <p className="error">{profError}</p>}

                    <div className="flex center g20 wh">
                      <button type='submit' disabled={isSubmitted || profLoading}>{(isSubmitted || profLoading)? 'Updating...' : 'Update'}</button>
                      <button type="button" onClick={closepopup} className="btn">Cancel</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default Profile