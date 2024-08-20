import React from 'react';
import careerStarLogo from '../assets/images/main-page-career-star-logo-white.png';
import astroaut from '../assets/images/main-page-astronaut.png';

function MainPage() {
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
                    <h1>Start owning your</h1>
                    <h1>career journey</h1>
                    <p>Personalized & motivating professional development tool that puts people first. Built with love. </p>
                </div>

                <div className='main-page-button'>
                    <p>Get Started Free &rarr;</p>
                </div>

                <div className='main-page-footer'>
                    <p>Have an account? <a href='https://google.com' target='_blank'>Log in</a></p>
                </div>
            </div>
        </div>
    );
}

export default MainPage;