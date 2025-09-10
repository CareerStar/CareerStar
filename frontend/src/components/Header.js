import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import careerStarLogo from '../assets/images/career-star-logo-white.png';
import star from '../assets/images/star-yellow.png';
import { apiUrl } from '../utils/api';

function Header({ userName }) {
    const dispatch = useDispatch();
    const userId = localStorage.getItem('userId');
    const starCount = useSelector(state => state.starCount);
    const avatar = useSelector(state => state.avatar);
    const navigate = useNavigate();
    const handleProfilePictureClick = () => {
        navigate('/dashboard/profile');
    };

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(apiUrl(`/profile_picture/${userId}`));
                const data = await response.json();
                if (response.ok) {
                    if (data.profilepicture) {
                        dispatch({ type: "SET_AVATAR", payload: data.profilepicture });
                    }
                } else {
                    console.error('Error fetching user details:', data);
                }
            }
            catch (error) {
                console.error('Error fetching user details:', error);
            }
        }
        if (userId) {
            fetchUserDetails();
        }
    }, [userId]);

    return (
        <div className='header'>
            <div className='logo'>
                <img src={careerStarLogo} alt='Career Star Logo' />
            </div>
            <div className='user-info'>
                <span className="star-count">{starCount}</span>  <img src={star} className='star' />
                <p className='username'>{userName}</p>  <img src={require(`../assets/images/avatars/${avatar}.png`)} className='display-picture' onClick={handleProfilePictureClick} />
            </div>
        </div>
    );
};

export default Header;
