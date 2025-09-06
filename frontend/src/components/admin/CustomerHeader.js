import React from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import careerStarLogo from '../../assets/images/career-star-logo-white.png';

function CustomerHeader({ userName }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('customer_cuny2x_token');
        navigate('/admin/customer/cuny2x');
    };

    return (
        <div className='header'>
            <div className='logo'>
                <img src={careerStarLogo} alt='Career Star Logo' />
            </div>
            <div className='user-info' style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <p className='username'>{userName}</p>
                <button onClick={handleLogout} aria-label='Log out' style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4 }}>
                    <LogOut size={20} color="#ffffff" />
                </button>
            </div>
        </div>
    );
};

export default CustomerHeader;


