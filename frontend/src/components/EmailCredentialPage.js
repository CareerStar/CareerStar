import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from "react-redux";
import axios from 'axios';
import { apiUrl } from '../utils/api';
import ProgressBar from './ProgressBar';
import careerStarLogo from '../assets/images/career-star-logo-white.png';
import Stars3 from '../assets/images/stars3.png';
import eye from '../assets/images/eye.svg';
import eyeOff from '../assets/images/eye-off.svg';

function EmailCredentialPage({onChangeUniversity}) {
    const dispatch = useDispatch();
    const currentStep = 1;
    const totalSteps = 1;

    const location = useLocation();

    const [universityDetails, setUniversityDetails] = useState([]);
    const [selectedUniversity, setSelectedUniversity] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [emailID, setEmailID] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [accessCode, setAccessCode] = useState('');
    const [userId, setUserID] = useState(0);

    const [isChecked, setIsChecked] = useState(true);
    const [showPopup, setShowPopup] = useState(false);

    const [errorName, setErrorName] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [errorConfirmPassword, setErrorConfirmPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    const handleToggle = () => {
        setIsChecked(!isChecked);
    };
    useEffect(() => {
    const fetchuniversityDetails = async () => {
        try {
            const response = await axios.get(apiUrl('/universities'));
                if (response.data) {
                    setUniversityDetails(response.data);  // Assuming the response is an array of university names
                }
            } catch (error) {
                console.error('Error fetching university names', error);
            }
        };
    
        fetchuniversityDetails();
    }, []);

    const handleChangeUniversity = (event) => {
        setSelectedUniversity(event.target.value);
        if(typeof onChangeUniversity === 'function'){
            onChangeUniversity(event.target.value);
        }
        console.log('Selected University:', event.target.value);
    };


    const handleFirstnameInputChange = (event) => {
        setFirstname(event.target.value);
        if (event.target.value.trim() !== '') {
            setErrorName('');
        }
    };

    const handleEmailIDInputChange = (event) => {
        setEmailID(event.target.value);
        if (event.target.value.trim() !== '') {
            setErrorEmail('');
        }
    };

    const handlePasswordInputChange = (event) => {
        setPassword(event.target.value);
        if (event.target.value.trim() !== '') {
            setErrorPassword('');
        }
    };

    const handleConfirmPasswordInputChange = (event) => {
        setConfirmPassword(event.target.value);
        if (event.target.value.trim() !== '') {
            setErrorConfirmPassword('');
        }
    };

    const handleAccessCodeInputChange = (event) => {
        setAccessCode(event.target.value);
    };

    const nextPageNavigation = async () => {

        setErrorName('');
        setErrorEmail('');
        setErrorPassword('');
        setErrorConfirmPassword('');

        if (firstname.trim() === '') {
            setErrorName('First name cannot be empty*');
            return;
        }
        
        if (emailID.trim() === '') {
            setErrorEmail('Email ID cannot be empty*');
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]*(nyit\.edu|cuny\.edu)$/;

        if (!emailRegex.test(emailID)) {
            setErrorEmail('Email must be a valid .edu email address*');
            return;
        }

        if (password.trim() === '') {
            setErrorPassword('Password cannot be empty*');
            return;
        }

        if (confirmPassword.trim() === '') {
            setErrorConfirmPassword('Confirm Password cannot be empty*');
            return;
        }

        if (password !== confirmPassword) {
            setErrorPassword('Passwords do not match*');
            setErrorConfirmPassword('Passwords do not match*');
            return;
        }

        try {
            const requestBody = {
                emailID: emailID,
                firstname: firstname,
                lastname: "No last name",
                password: password,
                stars: 3,
                accesscode: accessCode
            };
            const response = await axios.post(apiUrl('/users'), requestBody);

            if (response.status === 201) {
                const data = await response.data;
                localStorage.clear();
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('refresh_token', data.refresh_token);
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('firstname', data.firstname);
                localStorage.setItem('login_timestamp', Date.now());

                setUserID(response.data.userId);
                dispatch({ type: "SET_STAR_COUNT", payload: 3 });
                // Defer the 3-star popup until onboarding is completed
                localStorage.setItem('show_signup_stars_after_onboarding', 'true');
                setShowPopup(false);
                navigate('/dashboard', { state: { firstname: data.firstname, userId: data.userId } });
            }

        } catch (error) {
            if (error.response && error.response.status === 400) {
                alert(error.response.data.error);
            } else if (error.response && error.response.status === 401) {
                alert(error.response.data.error);
            }
            console.error("Error fetching data:", error);
        }
    };

    const navigateToDashboard = () => {
        setShowPopup(false);
        navigate('/dashboard', { state: { firstname: firstname, userId: userId } });
    };

    // const handleKeyPress = (event) => {
    //     if (event.key === 'Enter' && !showPopup) {
    //         nextPageNavigation();
    //     }
    //     if (event.key === 'Enter' && showPopup) {
    //         navigateToDashboard();
    //     }
    // };
    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !showPopup) {
            nextPageNavigation();
        }
        if (event.key === 'Enter' && showPopup) {
            navigateToDashboard();
        }
    };

    const navigateToStartPage = () => {
        navigate('/');
    };

    const logInPageNavigation = () => {
        navigate('/login', { state: { emailID: emailID } });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    }

    return (
        <div className='signUp-page'>
                <section className="stars-container">
                    <div id="stars"></div>
                    <div id="stars2"></div>
                    <div id="stars3"></div>
                </section>
            <div className='career-star-logo' onClick={navigateToStartPage}>
                <img src={careerStarLogo} alt='Career Star Logo' />
            </div>
            <div className='signUp-page-content'>
                {/* <ProgressBar currentStep={currentStep} totalSteps={totalSteps} /> */}
                <div className='signUp-page-question'>
                    <h2>Create <span className="highlight">my account</span></h2>
                    <label>Choose your University</label>
                        <div>
                            <select
                                id="university-select"
                                className="home-page-question-dropdown-menu"
                                value={selectedUniversity}
                                onChange={handleChangeUniversity}
                            >
                                <option value="" disabled>
                                    Choose your university
                                </option>
                                    {universityDetails.map((university) => (
                                <option key={university.universityId} value={university.universityId}>
                                    {university.name}
                                </option>
                            ))}
                            </select>
                        </div>                            
                    <label>Full name</label>
                    <input
                        type='text'
                        placeholder='Name'
                        onChange={handleFirstnameInputChange}
                        onKeyDown={handleKeyPress}
                    />

                    <label>Email address</label>
                    <input
                        type='text'
                        placeholder='abigail@gmail.com'
                        onChange={handleEmailIDInputChange}
                        onKeyDown={handleKeyPress}
                    />
                    {errorEmail && <div className='error-text'><p>{errorEmail}</p></div>}
                    <label>Password</label>
                    <div className='password-section'>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder='**********'
                            onChange={handlePasswordInputChange}
                            onKeyDown={handleKeyPress}
                        // style={{paddingRight: '40px'}}
                        />
                        <span
                            onClick={togglePasswordVisibility}
                            className='password-visibility-icon'
                        >
                            {showPassword ? <img src={eye} alt='Eye icon' /> : <img src={eyeOff} alt='Eye off icon' />}
                        </span>
                    </div>
                    {errorPassword && <div className='error-text'><p>{errorPassword}</p></div>}

                    <label>Re-enter Password</label>
                    <div className='password-section'>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder='**********'
                            onChange={handleConfirmPasswordInputChange}
                            onKeyDown={handleKeyPress}
                        // style={{paddingRight: '40px'}}
                        />
                        <span
                            onClick={toggleConfirmPasswordVisibility}
                            className='password-visibility-icon'
                        >
                            {showConfirmPassword ? <img src={eye} alt='Eye icon' /> : <img src={eyeOff} alt='Eye off icon' />}
                        </span>
                    </div>
                    {errorConfirmPassword && <div className='error-text'><p>{errorConfirmPassword}</p></div>}

                    <label>Access Code</label>
                    <input
                        type='text'
                        placeholder='**********'
                        onChange={handleAccessCodeInputChange}
                        onKeyDown={handleKeyPress}
                    />
                </div>
                <div className='toggle-button-container'>
                    <div
                        className={`toggle-button ${isChecked ? 'checked' : ''}`}
                        onClick={handleToggle}
                    />
                    <p>Yes, I’d like to receive updates from CareerStar.</p>
                </div>
                <div className='signUp-page-button' onClick={nextPageNavigation}>
                    <p>Continue</p>
                </div>

                <div className='signUp-page-footer'>
                    <p>Have an account? <a onClick={logInPageNavigation}>Log in</a></p>
                </div>

                <div className='email-credential-page-footer'>
                    By signing up, you accept <span className='email-credential-page-footer-bold'>Terms & Conditions</span>
                </div>
            </div>

            {showPopup && (
                <div className='popup'>
                    <div className='popup-content'>
                        <img src={Stars3} alt='3 stars' />
                        <div className='earned-star'>You earned 3 stars!</div>
                        {/* <div className='popup-text'>
                            <p>You took the first step to owning your professional journey - let’s celebrate that small win!</p>
                        </div> */}
                        <div className='popup-submit-button' onClick={navigateToDashboard} onKeyDown={handleKeyPress}>
                            <p>Let's get started</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EmailCredentialPage;
