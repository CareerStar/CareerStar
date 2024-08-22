import React from 'react';
import careerStarLogo from '../assets/images/career-star-logo-black.png';

function SignUp() {
    return (
        <div className='signUp-page'>
            <div className='career-star-logo'>
                <img src={careerStarLogo} alt='Career Star Logo' />
            </div>
        </div>
    );
}

export default SignUp;