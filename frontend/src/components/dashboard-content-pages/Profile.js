import React, { useState } from 'react';
import displayPicture from '../../assets/images/display-picture.png';
import star from '../../assets/images/star.png';

function Profile() {

    const [summary, setSummary] = useState('My Summary');

    const handleSummaryChange = (event) => {
        setSummary(event.target.value);
    };

    const handleSave = () => {
        console.log("Summary saved:", summary);
    };

    const handleHelp = () => {
        setSummary('Software Engineer with 3 years of experience in building web applications.');
    };

    return (
        <div className='profile-container'>
            <div className='profile-informtation'>
                <img src={displayPicture} alt='Profile icon' />
                <div className='profile-user-info flex-row'>
                    <p className='profile-user-name'>Abigail</p>
                    <p className='star-count'>3</p>
                    <img src={star} className='star' />
                </div>
                <p className='profile-role'>Software Engineer</p>
        
                <div className='profile-summary flex-column'>
                    <p>My Summary</p>
                    <textarea
                        value={summary}
                        onChange={handleSummaryChange}
                        rows="4"
                        cols="50"
                    />

                    <div className='summary-buttons flex-row'>
                        <button className='help-me-button' onClick={handleHelp}>Help me</button>
                        <button className='save-button' onClick={handleSave}>Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;