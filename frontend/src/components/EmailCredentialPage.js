import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import ProgressBar from './ProgressBar';
import careerStarLogo from '../assets/images/career-star-logo-black.png';
import Stars3 from '../assets/images/stars3.png';

function EmailCredentialPage() {
    const currentStep = 3;
    const totalSteps = 3;

    const [isChecked, setIsChecked] = useState(true);
    const [showPopup, setShowPopup] = useState(false);

    const handleToggle = () => {
        setIsChecked(!isChecked);
    };

    const navigate = useNavigate();

    const nextPageNavigation = () => {
        console.log('Div clicked!');
        setShowPopup(true);
        // navigate('/dashboard');
    }

    const navigateToDashboard = () => {
        setShowPopup(false);
        navigate('/dashboard');
    }

    const navigateToStartPage = () => {
        navigate('/');
    }

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
                    <input type='text' placeholder='abigail@gmail.com' />
                    <p>Password</p>
                    <input type='text' placeholder='**********' />
                </div>
                <div className='toggle-button-container'>
                    <div
                        className={`toggle-button ${isChecked ? 'checked' : ''}`}
                        onClick={handleToggle}
                    >
                    </div>
                    <p>Yes, I’d like to receive updates and events from CareerStar</p>
                </div>
                <div className='signUp-page-button' onClick={nextPageNavigation}>
                    <p>Continue</p>
                </div>

                <div className='signUp-page-footer'>
                    <p>Have an account? <a href='https://google.com' target='_blank'>Log in</a></p>
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
                        <div className='popup-submit-button' onClick={navigateToDashboard}>
                            <p>Let's get started</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EmailCredentialPage;