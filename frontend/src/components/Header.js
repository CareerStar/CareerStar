import React from 'react';
import { useNavigate } from 'react-router-dom';
import careerStarLogo from '../assets/images/career-star-logo-black.png';
import star from '../assets/images/star.png';
import displayPicture from '../assets/images/display-picture.png';

function Header({ userName, starCount, onSelectPage }) {
    const navigate = useNavigate();
    const handleProfilePictureClick = () => {
        onSelectPage('Profile');
    };
    return (
        <div className='header'>
            <div className='logo'>
                <img src={careerStarLogo} alt='Career Star Logo' />
            </div>
            <div className='user-info'>
                <span className="star-count">{starCount}</span>  <img src={star} className='star' />
                <p className='username'>{userName}</p>  <img src={displayPicture} className='display-picture' onClick={handleProfilePictureClick}/>
            </div>
        </div>
    );
};

export default Header;