import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import ProgressBar from './ProgressBar';
import careerStarLogo from '../assets/images/career-star-logo-black.png';

function SignUp() {
    const currentStep = 1;

    const navigate = useNavigate(); 

    const handleClick = () => {
        console.log('Div clicked!');
    }

    const navigateToMainPage = () => {
        navigate('/');
    }

    return (
        <div className='signUp-page'>
            <div className='career-star-logo' onClick={navigateToMainPage}>
                <img src={careerStarLogo} alt='Career Star Logo' />
            </div>
            <div className='signUp-page-content'>
                <ProgressBar currentStep={currentStep} />
                <div className='signUp-page-question'>
                    <h2>What's your <span class="highlight">name?</span></h2>
                    <p>First name</p>
                    <input type='text' placeholder='Your First name' />
                </div>
                <div className='signUp-page-button' onClick={handleClick}>
                    <p>Continue</p>
                </div>

                <div className='signUp-page-footer'>
                    <p>Have an account? <a href='https://google.com' target='_blank'>Log in</a></p>
                </div>
            </div>
        </div>
    );
}

export default SignUp;