import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProgressBar from './ProgressBar';
import careerStarLogo from '../assets/images/career-star-logo-black.png';

function UserIntent() {
    const currentStep = 2;
    const totalSteps = 3;

    const [selectedOption, setSelectedOption] = useState('');
    const [error, setError] = useState('');

    const location = useLocation();
    const { firstname } = location.state || {};

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
        if (event.target.value) {
            setError('');
        }
    };

    const navigate = useNavigate();

    const nextPageNavigation = () => {
        if (!selectedOption) {
            setError('Please select an option*');
            return;
        }
        navigate('/emalCredential', { state: { firstname } });
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            nextPageNavigation();
        }
    };

    const navigateToStartPage = () => {
        navigate('/');
    }

    const logInPageNavigation = () => {
        navigate('/login');
    }

    return (
        <div className='signUp-page'>
            <div className='career-star-logo' onClick={navigateToStartPage}>
                <img src={careerStarLogo} alt='Career Star Logo' />
            </div>
            <div className='signUp-page-content'>
                <ProgressBar currentStep={currentStep} totalSteps={totalSteps}/>
                <div className='signUp-page-question'>
                    <h2><span className="highlight">CareerStar</span> can help me most with...</h2>
                    <div className=''>
                        <select 
                            id="options" 
                            className={`dropdown-menu ${error ? 'input-error' : ''}`} 
                            value={selectedOption} 
                            onChange={handleChange}
                            onKeyDown={handleKeyPress}
                        >
                            <option value="" disabled>Select an option</option>
                            <option value="Building confidence for job outreach and applications">Building confidence for job outreach and applications</option>
                            <option value="Improving my resume and professional assets">Improving my resume and professional assets</option>
                            <option value="Getting clarity and setting professional goals">Getting clarity and setting professional goals</option>
                            <option value="Discovering networking events">Discovering networking events</option>
                            <option value="Meeting like-minded professionals">Meeting like-minded professionals</option>
                        </select>
                        {error && <div className='error-text'><p>{error}</p></div>}
                    </div>
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

export default UserIntent;