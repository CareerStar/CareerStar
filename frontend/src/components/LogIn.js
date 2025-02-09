'use client';
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import ProgressBar from './ProgressBar';
import careerStarLogo from '../assets/images/career-star-logo-white.png';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import eye from '../assets/images/eye.svg';
import eyeOff from '../assets/images/eye-off.svg';

function LogIn() {
    const currentStep = 3;
    const totalSteps = 3;

    const location = useLocation();
    const [emailID, setEmailID] = useState(location.state?.emailID || '');
    const [password, setPassword] = useState('');

    const [isChecked, setIsChecked] = useState(true);
    const [showPopup, setShowPopup] = useState(false);

    const [errorEmail, setErrorEmail] = useState('');
    const [errorPassword, setErrorPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);

    const handleToggle = () => {
        setIsChecked(!isChecked);
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

    const navigate = useNavigate();

    useEffect(() => {
        const access_token = localStorage.getItem('access_token');
        if (access_token) {
            verifyToken(access_token);
        }
    }, []);

    const verifyToken = async (access_token) => {
        try {
            const response = await axios.get('https://api.careerstar.co/protected', {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });
            if (response.status === 200) {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            localStorage.removeItem('access_token');
        }
    };

    const handleLogIn = async () => {
        if (emailID.trim() === '') {
            setErrorEmail('Email ID cannot be empty*');
            return;
        }
        if (password.trim() === '') {
            setErrorPassword('Password cannot be empty*');
            return;
        }
        try {
            const requestBody = {
                "emailID": emailID,
                "password": password
            };

            const response = await axios.post('https://api.careerstar.co/login', requestBody);
            // const response = await axios.post('http://localhost:8080/users/login', requestBody);
            if (response.status === 200) {
                const data = await response.data;
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('refresh_token', data.refresh_token);
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('firstname', data.firstname);
                localStorage.setItem('login_timestamp', Date.now());

                navigate('/dashboard', { state: { userId: data.userId, firstname: data.firstname  } });
            }
        } catch (error) {
            if (error.status === 400) {
                console.log('User does not exist!');
                alert('Incorrect email ID or password. Please try again.');
            } else {
                console.error("Error fetching data:", error);
            }
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleLogIn();
        }
    };

    // const navigateToDashboard = () => {
    //     setShowPopup(false);
    //     navigate('/dashboard');
    // };

    const navigateToStartPage = () => {
        navigate('/');
    };

    const signUpPageNavigation = () => {
        navigate('/signup');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className='signUp-page'>
            <div className='career-star-logo' onClick={navigateToStartPage}>
                <img src={careerStarLogo} alt='Career Star Logo' />
            </div>
            <div className='signUp-page-content'>
                {/* <ProgressBar currentStep={currentStep} totalSteps={totalSteps} /> */}
                <div className='signUp-page-question'>
                    <h2>Log in to <span className="highlight">my account</span></h2>
                    <p>Email address</p>
                    <input 
                        type='text' 
                        placeholder='abigail@gmail.com'
                        value={emailID} 
                        onChange={handleEmailIDInputChange}
                        onKeyDown={handleKeyPress}
                    />
                    {errorEmail && <div className='error-text'><p>{errorEmail}</p></div>}
                    <div className='password-section'>
                        <p>Password</p>
                        <input 
                            type={showPassword ? 'text' : 'password'}
                            placeholder='**********'
                            onChange={handlePasswordInputChange}
                            onKeyDown={handleKeyPress}
                            style={{paddingRight: '40px'}}
                        />
                        <span
                            onClick={togglePasswordVisibility}
                            className='password-visibility-icon'
                        >
                            {/* <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} /> */}
                            {showPassword ? <img src={eye} alt='Eye icon' /> : <img src={eyeOff} alt='Eye off icon' />}
                        </span>
                    </div>
                    {errorPassword && <div className='error-text'><p>{errorPassword}</p></div>}
                </div>
                <div className='signUp-page-button' onClick={handleLogIn}>
                    <p>Continue</p>
                </div>

                <div className='signUp-page-footer'>
                    <p>Do not have an account? <a onClick={signUpPageNavigation}>Sign Up</a></p>
                </div>
            </div>
        </div>
    );
}

export default LogIn;