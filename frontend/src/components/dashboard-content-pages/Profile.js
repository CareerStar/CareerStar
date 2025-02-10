import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import star from '../../assets/images/star-yellow.png';
import axios from 'axios';

function Profile({ userId: propUserId }) {
    const dispatch = useDispatch();
    const [userId, setUserId] = useState(propUserId || localStorage.getItem('userId') || '');
    const [firstname, setFirstname] = useState('');
    const [majorDetails, setMajorDetails] = useState('');
    const [goal, setGoal] = useState('');
    const [summary, setSummary] = useState('');
    const [stars, setStars] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showAvatarModal, setShowavatarModal] = useState(false);
    const avatar = useSelector(state => state.avatar) || 'avatar1';
    const navigate = useNavigate();

    const avatarURL = '../../assets/images/avatars/';

    const avatars = [
        'avatar1',
        'avatar2',
        'avatar3',
        'avatar4',
        'avatar5',
        'avatar6',
        'avatar7',
        'avatar8',
    ]

    const handleSummaryChange = (event) => {
        setSummary(event.target.value);
    };

    const handleHelp = () => {
        generateAIOutput();
    };

    useEffect(() => {
        const fetchUserDetails = async () => {
            setLoading(true);
            try {
                const response = await fetch(`https://api.careerstar.co/user/${userId}`);
                const data = await response.json();
                if (response.ok) {
                    if (data.firstname) {
                        setFirstname(data.firstname);
                        setStars(data.stars);
                    }
                } else {
                    console.error('Error fetching user details:', data);
                }
            }
            catch (error) {
                console.error('Error fetching user details:', error);
            }
            try {
                const response = await fetch(`https://api.careerstar.co/onboarding/${userId}`);
                const data = await response.json();
                if (response.ok) {
                    if (data.summary) {
                        setSummary(data.summary);
                    }
                    setMajorDetails(data.degree + ' in ' + data.major);
                    setGoal(data.goal);
                } else {
                    console.error('Error fetching user details:', data);
                }
            }
            catch (error) {
                console.error('Error fetching user details:', error);
            } finally {
                setLoading(false);
            }
        }
        if (userId) {
            fetchUserDetails();
        }
    }, [userId]);

    const handleSave = async (updatedSummary) => {
        setLoading(true);
        try {
            const response = await fetch(`https://api.careerstar.co/update_profile/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "summary": updatedSummary,
                }),
            });

            if (response.ok) {
                console.log('User details updated successfully');
            } else {
                console.error('Error updating user details');
            }
        } catch (error) {
            console.error('Error updating user details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProfilePictureClick = async (avatar) => {
        setShowavatarModal(false);
        dispatch({ type: "SET_AVATAR", payload: avatar });
        try {
            const response = await fetch(`https://api.careerstar.co/profile_picture/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "profilepicture": avatar,
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
        dispatch({ type: "SET_AVATAR", payload: avatar });
    };

    const generateAIOutput = async (userMessage) => {
        setLoading(true); // Show loader
    
        try {
            const response = await axios.post("https://api.careerstar.co/generate-ai-feedback", {
                prompt: `You are a professional summary writer. 
                    your role is to write a resume summary / LinkedIn About section based on the details I provide. 
                    Do not give options or any other instructions, I just want summary, no heading, nothing. 
                    Directly write it in normal text. It should be short, concise, positive, and in first voice like "I am..". 
                    You don't have to start with "I am". It should be positive in tone.
                    If you write it amzingly, I will give you 5 star rating and a $5 Million check.
                    The summary should be 2-3 sentences long. First name is ${firstname}, pursuing ${majorDetails} from NYIT, 
                    have a dream of becoming ${goal}.`,
            });
    
            if (response.data && response.data.feedback) {
                setSummary(response.data.feedback);
                await handleSave(response.data.feedback);
            } else {
                console.log("Error: Unable to fetch feedback. Please try again.");
            }
        } catch (error) {
            console.log("Error: Unable to fetch feedback. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    }

    return (
        <div className='profile-container'>
            {loading && (
                <div className="spinner-overlay">
                    <div className="spinner"></div>
                </div>
            )}
            <div className='profile-informtation'>
                <img src={require(`../../assets/images/avatars/${avatar}.png`)} alt='Profile icon' />
                <span className='change-avatar material-icons' onClick={() => setShowavatarModal(true)}>edit</span>
                <div className='profile-user-info flex-row'>
                    <p className='profile-user-name'>{firstname}</p>
                    <p className='star-count'>{stars}</p>
                    <img src={star} className='star' />
                </div>
                <p className='profile-role'>{majorDetails}</p>

                <div className='profile-summary flex-column'>
                    <p>My Summary</p>
                    <textarea
                        value={summary}
                        onChange={handleSummaryChange}
                        rows="4"
                        cols="50"
                        placeholder='Write a summary about yourself...'
                    />

                    <div className='summary-buttons flex-row'>
                        <button className='help-me-button' onClick={handleHelp}>Help me</button>
                        <button className='save-button' onClick={() => handleSave(summary)}>Save</button>
                    </div>
                    <div className='summary-buttons flex-row'>
                        <button className='save-button' onClick={handleLogout}>Log Out</button>
                    </div>
                </div>
            </div>
            {showAvatarModal && (
                <div className='avatar-modal'>
                    <div className='avatar-modal-content'>
                        <span className="close material-icons" onClick={() => setShowavatarModal(false)}>close</span>
                        <p>Choose an avatar</p>
                        <div className='avatar-list'>
                            {avatars.map((avatar, index) => (
                                <img
                                    key={index}
                                    src={require(`../../assets/images/avatars/${avatar}.png`)}
                                    alt="Avatar"
                                    onClick={() => handleProfilePictureClick(avatar)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Profile;