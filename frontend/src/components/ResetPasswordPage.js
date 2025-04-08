import React, { useState } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import axios from 'axios';

import careerStarLogo from '../assets/images/career-star-logo-white.png';
import eye from '../assets/images/eye.svg';
import eyeOff from '../assets/images/eye-off.svg';

function ResetPasswordPage() {
    const navigate = useNavigate();
    const {token} = useParams();

    console.log('Token:', token);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [errorConfirmPassword, setErrorConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');

    const handlePasswordInputChange = (event) => {
        setPassword(event.target.value);
        if (event.target.value.trim() !== '') {
            setErrorPassword('');
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        if (password.trim() === '') {
            setErrorPassword('Password cannot be empty*');
            return;
        }

        if (password.trim() === '') {
            setErrorPassword('Password cannot be empty*');
            return;
        }
        
        if (confirmPassword.trim() === '') {
            setErrorConfirmPassword('Confirm Password cannot be empty*');
            return;
        }
        
        if (password !== confirmPassword) {
            setErrorConfirmPassword('Passwords do not match*');
            return;
        }

        try {
            const res = await axios.post(`https://api.careerstar.co/reset-password/${token}`, {
                password
            });
            setMessage(res.data.message || 'Password successfully reset!');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Something went wrong';
            setMessage(errorMsg);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
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
                <div className='signUp-page-question'>
                    <h2>Reset <span className="highlight">your password</span></h2>
                    <p>Enter your new password</p>
                    <div className='password-section'>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder='**********'
                            onChange={handlePasswordInputChange}
                            onKeyDown={handleKeyPress}
                        />
                        <span
                            onClick={togglePasswordVisibility}
                            className='password-visibility-icon'
                        >
                            {showPassword ? <img src={eye} alt='Eye icon' /> : <img src={eyeOff} alt='Eye off icon' />}
                        </span>
                    </div>
                    {errorPassword && <div className='error-text'><p>{errorPassword}</p></div>}

                    <p>Confirm Password</p>
                    <div className='password-section'>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder='**********'
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                if (e.target.value.trim() !== '') {
                                    setErrorConfirmPassword('');
                                }
                            }}
                            onKeyDown={handleKeyPress}
                        />
                        <span
                            onClick={togglePasswordVisibility}
                            className='password-visibility-icon'
                        >
                            {showPassword ? <img src={eye} alt='Eye icon' /> : <img src={eyeOff} alt='Eye off icon' />}
                        </span>
                    </div>
                    {errorConfirmPassword && <div className='error-text'><p>{errorConfirmPassword}</p></div>}
                </div>

                <div className='signUp-page-button' onClick={handleSubmit}>
                    <p>Reset Password</p>
                </div>

                {message && (
                    <div className='email-credential-page-footer' style={{ marginTop: '1rem', color: 'green', textAlign: 'center' }}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ResetPasswordPage;