import React, { useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import ProgressBar from './ProgressBar';
import careerStarLogo from '../assets/images/career-star-logo-black.png';
import Stars3 from '../assets/images/stars3.png';

function EmailCredentialPage() {
    const currentStep = 3;
    const totalSteps = 3;

    const location = useLocation();

    const [firstname, setFirstname] = useState(location.state?.firstname || {});
    const [lastname, setLastname] = useState('');
    const [emailID, setEmailID] = useState('');
    const [password, setPassword] = useState('');
    const [userId, setUserID] = useState(0);

    const [isChecked, setIsChecked] = useState(true);
    const [showPopup, setShowPopup] = useState(false);

    const [errorEmail, setErrorEmail] = useState('');
    const [errorPassword, setErrorPassword] = useState('');

    const navigate = useNavigate();

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

    const nextPageNavigation = async () => {
        console.log('Div clicked!');
        console.log('First name:', firstname);
        console.log('Last name:', lastname);
        console.log('Email ID:', emailID);
        console.log('Password', password);

        if (emailID.trim() === '') {
            setErrorEmail('Email ID cannot be empty*');
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(emailID)) {
            setErrorEmail('Invalid email format*');
            return;
        }

        if (password.trim() === '') {
            setErrorPassword('Password cannot be empty*');
            return;
        }

        try {
            const requestBody = {
                emailID: emailID,
                firstname: firstname,
                lastname: "No last name",
                password: password,
                stars: 3
            };
            const response = await axios.post('https://ec2-34-227-29-26.compute-1.amazonaws.com:5000/users', requestBody);
            // const response = await axios.post('http://localhost:8080/users', requestBody);
            if (response.status === 200) {
                console.log('User created successfully!');
            }
            setUserID(response.data.userId);
            setShowPopup(true);
            // navigate('/dashboard');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log('User already exists!');
                alert('User already exists.');
            }
            console.error("Error fetching data:", error);
        }
    };

    const navigateToDashboard = () => {
        setShowPopup(false);
        navigate('/dashboard', { state: { firstname: firstname, userId: userId } });
    };

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

    return (
        <div className='signUp-page'>
            <div className='career-star-logo' onClick={navigateToStartPage}>
                <img src={careerStarLogo} alt='Career Star Logo' />
            </div>
            <div className='signUp-page-content'>
                <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
                <div className='signUp-page-question'>
                    <h2>Create <span className="highlight">my account</span></h2>
                    <p>Email address</p>
                    <input
                        type='text'
                        placeholder='abigail@gmail.com'
                        onChange={handleEmailIDInputChange}
                        onKeyDown={handleKeyPress}
                    />
                    {errorEmail && <div className='error-text'><p>{errorEmail}</p></div>}
                    <p>Password</p>
                    <input
                        type='password'
                        placeholder='**********'
                        onChange={handlePasswordInputChange}
                        onKeyDown={handleKeyPress}
                    />
                    {errorPassword && <div className='error-text'><p>{errorPassword}</p></div>}
                </div>
                <div className='toggle-button-container'>
                    <div
                        className={`toggle-button ${isChecked ? 'checked' : ''}`}
                        onClick={handleToggle}
                    />
                    <p>Yes, I’d like to receive updates and events from CareerStar</p>
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
                        <div className='popup-text'>
                            <p>You took the first step to owning your professional journey - let’s celebrate that small win!</p>
                        </div>
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