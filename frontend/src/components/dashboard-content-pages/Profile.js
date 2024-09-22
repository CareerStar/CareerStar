import React, { useState, useEffect } from 'react';
import displayPicture from '../../assets/images/display-picture.png';
import star from '../../assets/images/star.png';

function Profile({userId}) {
    const [firstname, setFirstname] = useState('');
    const [summary, setSummary] = useState('My Summary');
    const [stars, setStars] = useState(0);

    const handleSummaryChange = (event) => {
        setSummary(event.target.value);
    };

    const handleHelp = () => {
        setSummary('Software Engineer with 3 years of experience in building web applications.');
    };

    useEffect(() => {  
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/user/${userId}`);

                const data = await response.json();
                if (response.ok) {
                    if (data.firstname) {
                        setFirstname(data.firstname);
                        setStars(data.stars);
                    }
                    console.log('User details:', data);
                } else {
                    console.error('Error fetching user details:', data);
                }
            }
            catch (error) {
                console.error('Error fetching user details:', error);
            }
            try {
                const response = await fetch(`http://127.0.0.1:5000/onboarding/${userId}`);
                const data = await response.json();
                if (response.ok) {
                    if (data.summary) {
                        setSummary(data.summary);
                    }
                    console.log('User details:', data);
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

    const handleSave = async () => {
        console.log("Summary saved:", summary);
        try {
            const response = await fetch(`http://127.0.0.1:5000/update_profile/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "summary": summary,
                }),
            });

            if (response.ok) {
                console.log('User details updated successfully');
            } else {
                console.error('Error updating user details');
            }
        } catch (error) {
            console.error('Error updating user details:', error);
        }
    };

    return (
        <div className='profile-container'>
            <div className='profile-informtation'>
                <img src={displayPicture} alt='Profile icon' />
                <div className='profile-user-info flex-row'>
                    <p className='profile-user-name'>{firstname}</p>
                    <p className='star-count'>{stars}</p>
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