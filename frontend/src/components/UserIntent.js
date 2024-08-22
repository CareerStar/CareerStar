import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import ProgressBar from './ProgressBar';
import careerStarLogo from '../assets/images/career-star-logo-black.png';

function UserIntent() {
    const currentStep = 2;

    const [selectedOption, setSelectedOption] = useState('');

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const navigate = useNavigate();

    const nextPageNavigation = () => {
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
                    <h2>I will mostly <span className="highlight">use CareerStar for</span>...</h2>
                    <div className=''>
                        <select id="options" className='dropdown-menu' value={selectedOption} onChange={handleChange}>
                            <option value="" disabled>Select an option</option>
                            <option value="option1">Option 1</option>
                            <option value="option2">Option 2</option>
                            <option value="option3">Option 3</option>
                        </select>
                        {selectedOption && <p>You selected: {selectedOption}</p>}
                    </div>
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

export default UserIntent;