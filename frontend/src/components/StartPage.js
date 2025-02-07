import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import careerStarLogo from '../assets/images/career-star-logo-white.png';
import astroaut from '../assets/images/main-page-astronaut.png';

function StartPage() {

    const navigate = useNavigate(); 

    const handleClick = () => {
        navigate('/signup');
    };

    const logInPageNavigation = () => {
        navigate('/login');
    }

    useEffect(() => {
        localStorage.removeItem('selectedPage');
    }, []);

    return (
        <div className='main-page'>
            <div className='career-star-logo'>
                <img src={careerStarLogo} alt='Career Star Logo' />
            </div>
            <div className='main-page-contnent'>
                <div className='hey'>
                    <img src={astroaut} alt='Astronaut' />
                </div>

                <div className='main-page-header'>
                    <h1>Your LaunchPad to Success</h1>
                    {/* <p>Own your career and land your next role with a personalized roadmap and the support of our AllStar community. Built with love. 💜</p> */}
                </div>

                <div className='main-page-button' onClick={handleClick}>
                    <p>Get Started &rarr;</p>
                </div>

                <div className='main-page-footer'>
                    <p>Have an account? <a onClick={logInPageNavigation}>Log in</a></p>
                </div>
            </div>
        </div>
    );
}

export default StartPage;