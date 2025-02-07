import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from './ProgressBar';
import careerStarLogo from '../assets/images/career-star-logo-white.png';

function SignUp() {
    const [firstname, setFirstname] = useState('');
    const [error, setError] = useState('');
    const currentStep = 1;
    const totalSteps = 2;

    const navigate = useNavigate();

    const handleInputChange = (event) => {
        setFirstname(event.target.value);
        if (event.target.value.trim() !== '') {
            setError('');
        }
    };

    const nextPageNavigation = () => {
        if (firstname.trim() === '') {
            setError('First name cannot be empty*');
        } else {
            navigate('/emalCredential', { state: { firstname } });
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            nextPageNavigation();
        }
    };

    const navigateToStartPage = () => {
        navigate('/');
    };

    const logInPageNavigation = () => {
        navigate('/login');
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
                    <p>Preferred name</p>
                    <input
                        type='text'
                        placeholder='Your Preferred name'
                        value={firstname}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                    />
                    {error && <div className='error-text'><p>{error}</p></div>}
                </div>
                <div className='signUp-page-button' onClick={nextPageNavigation}>
                    <p>Continue</p>
                </div>

                <div className='signUp-page-footer'>
                    <p>Have an account? <a onClick={logInPageNavigation}>Log in</a></p>
                </div>
            </div>
        </div>
    );
}

export default SignUp;