import React, {useState} from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import ProgressBar from './ProgressBar';
import careerStarLogo from '../assets/images/career-star-logo-black.png';

function EmailCredentialPage() {
    const currentStep = 3;

    const [isChecked, setIsChecked] = useState(true);

    const handleToggle = () => {
        setIsChecked(!isChecked);
    };

    const navigate = useNavigate();

    const nextPageNavigation = () => {
        console.log('Div clicked!');
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
                <ProgressBar currentStep={currentStep} />
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
        </div>
    );
}

export default EmailCredentialPage;