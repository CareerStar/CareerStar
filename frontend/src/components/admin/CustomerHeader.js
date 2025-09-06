import React from 'react';
import careerStarLogo from '../../assets/images/career-star-logo-white.png';

function CustomerHeader({ userName }) {
    return (
        <div className='header'>
            <div className='logo'>
                <img src={careerStarLogo} alt='Career Star Logo' />
            </div>
            <div className='user-info'>
                <p className='username'>{userName}</p>
            </div>
        </div>
    );
};

export default CustomerHeader;


