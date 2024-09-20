'use client';
import React, { useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import ProgressBar from './ProgressBar';
import careerStarLogo from '../assets/images/career-star-logo-black.png';

function LogIn() {
    const currentStep = 3;
    const totalSteps = 3;

    const location = useLocation();
    const [emailID, setEmailID] = useState(location.state?.emailID || '');
    const [password, setPassword] = useState('');

    const [isChecked, setIsChecked] = useState(true);
    const [showPopup, setShowPopup] = useState(false);

    const handleToggle = () => {
        setIsChecked(!isChecked);
    };

    const handleEmailIDInputChange = (event) => {
        setEmailID(event.target.value);
    };

    const handlePasswordInputChange = (event) => {
        setPassword(event.target.value);
    };

    const navigate = useNavigate();

    const handleLogIn = async () => {
        console.log('Div clicked!');
        console.log('Email ID:', emailID);
        console.log('Password', password);
        try {
            const requestBody = {
                "emailID": emailID,
                "password": password
            };

            const response = await axios.post('http://127.0.0.1:5000/login', requestBody);
            // const response = await axios.post('http://localhost:8080/users/login', requestBody);
            if (response.status === 200) {
                const {userId, firstname, token} = response.data;
                console.log('User logged in successfully!', userId, firstname, token);
                localStorage.setItem('userId', userId);
                localStorage.setItem('token', token);
                navigate('/dashboard', { state: { userId: userId, firstname: firstname  } });
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

    // const navigateToDashboard = () => {
    //     setShowPopup(false);
    //     navigate('/dashboard');
    // };

    const navigateToStartPage = () => {
        navigate('/');
    };

    const signUpPageNavigation = () => {
        navigate('/signup');
    }

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
                    />
                    <p>Password</p>
                    <input 
                        type='text' 
                        placeholder='**********'
                        onChange={handlePasswordInputChange}
                    />
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