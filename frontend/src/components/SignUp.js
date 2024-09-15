import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from './ProgressBar';
import careerStarLogo from '../assets/images/career-star-logo-black.png';

function SignUp() {
    const [firstname, setFirstname] = useState('');
    const currentStep = 1;
    const totalSteps = 3;

    const navigate = useNavigate();

    const handleInputChange = (event) => {
        setFirstname(event.target.value);
    };

    const nextPageNavigation = () => {
        console.log('Div clicked!');
        navigate('/userIntent', { state: { firstname } });
    };

    const navigateToStartPage = () => {
        navigate('/');
    };

    return (
        <div className='signUp-page'>
            <div className='career-star-logo' onClick={navigateToStartPage}>
                <img src={careerStarLogo} alt='Career Star Logo' />
            </div>
            <div className='signUp-page-content'>
                <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
                <div className='signUp-page-question'>
                    <h2>What's your <span className="highlight">name?</span></h2>
                    <p>First name</p>
                    <input
                        type='text'
                        placeholder='Your First name'
                        value={firstname}
                        onChange={handleInputChange}
                    />
                </div>
                <div className='signUp-page-button' onClick={nextPageNavigation}>
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