import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../../utils/api';

function LinkedIn() {
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState([]);
    const [isEditing, setIsEditing] = useState(null);
    const [linkedInData, setLinkedInData] = useState({});

    useEffect(() => {
        const fetchUsersLinkedInDetails = async () => {
            try {
                const admin_token = localStorage.getItem('admin_token');
                const response = await axios.get(apiUrl('/linkedin'), {
                    headers: {
                        Authorization: `Bearer ${admin_token}`,
                    },
                });
                if (response.status === 200) {
                    setUserDetails(response.data);
                } else {
                    console.error('Error fetching user details:', response.data);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
                navigate('/admin');
            }
        };
        fetchUsersLinkedInDetails();
    }, []);

    const handleEditClick = (userId, linkedIn) => {
        const defaultLinkedIn = {
            headline: '',
            resume: '',
            remark: '',
        };
        setLinkedInData(linkedIn ? { ...defaultLinkedIn, ...linkedIn } : defaultLinkedIn);
        setIsEditing(userId);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLinkedInData({
            ...linkedInData,
            [name]: value,
        });
    };

    const handleSave = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const payload = {
                LinkedIn: linkedInData,
            };
            const response = await axios.put(
                apiUrl(`/linkedin/${userId}`),
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                // alert('Data updated successfully');
                setUserDetails(prevDetails =>
                    prevDetails.map(user =>
                        user.userId === userId ? { ...user, LinkedIn: linkedInData } : user
                    )
                );
                setIsEditing(null);
            } else {
                alert('Failed to update data');
            }
        } catch (error) {
            console.error('Error updating LinkedIn details:', error);
            alert('Error updating LinkedIn details');
        }
    };

    return (
        <div className='linkedIn-container'>
            <h1>LinkedIn</h1>
            {userDetails.map((user) => (
                <div key={user.userId} className='flex-column'>
                    <div className='user-details'>
                        <h4>{user.firstname}</h4>
                        <h4>{user.emailId}</h4>
                    </div>

                    {isEditing === user.userId ? (
                        <div>
                            <label>Headline:</label>
                            <input
                                type='text'
                                name='headline'
                                value={linkedInData.headline}
                                onChange={handleInputChange}
                            />

                            <label>Current Company:</label>
                            <input
                                type='text'
                                name='currentCompany'
                                value={linkedInData.currentCompany}
                                onChange={handleInputChange}
                            />

                            <label>Job Description:</label>
                            <input
                                type='text'
                                name='jobDescription'
                                value={linkedInData.jobDescription}
                                onChange={handleInputChange}
                            />

                            <label>Resume:</label>
                            <input
                                type='text'
                                name='resume'
                                value={linkedInData.resume}
                                onChange={handleInputChange}
                            />

                            <label>Portfolio:</label>
                            <input
                                type='text'
                                name='portfolio'
                                value={linkedInData.portfolio}
                                onChange={handleInputChange}
                            />

                            <label>Active:</label>
                            <input
                                type='text'
                                name='Active'
                                value={linkedInData.Active}
                                onChange={handleInputChange}
                            />

                            <label>License & Certifications:</label>
                            <input
                                type='text'
                                name='liceneAndCertifications'
                                value={linkedInData.liceneAndCertifications}
                                onChange={handleInputChange}
                            />

                            <label>Endorsement:</label>
                            <input
                                type='text'
                                name='endorsement'
                                value={linkedInData.endorsement}
                                onChange={handleInputChange}
                            />

                            <label>Post:</label>
                            <input
                                type='text'
                                name='post'
                                value={linkedInData.post}
                                onChange={handleInputChange}
                            />

                            <label>Comments:</label>
                            <input
                                type='text'
                                name='comments'
                                value={linkedInData.comments}
                                onChange={handleInputChange}
                            />
                            <button onClick={() => handleSave(user.userId)}>Save</button>
                            <button onClick={() => setIsEditing(null)}>Cancel</button>
                        </div>
                    ) : (
                        <div className='user-linkedIn-details'>
                            <p>Headline: {user.LinkedIn?.headline || 'N/A'}</p>
                            <p>Current Company: {user.LinkedIn?.currentCompany || 'N/A'}</p>
                            <p>Job Description: {user.LinkedIn?.jobDescription || 'N/A'}</p>
                            <p>Resume: {user.LinkedIn?.resume || 'N/A'}</p>
                            <p>Portfolio: {user.LinkedIn?.porfolio || 'N/A'}</p>
                            <p>Active: {user.LinkedIn?.Active || 'N/A'}</p>
                            <p>License & Certifications: {user.LinkedIn?.liceneAndCertifications || 'N/A'}</p>
                            <p>Endorsement: {user.LinkedIn?.endorsement || 'N/A'}</p>
                            <p>Post: {user.LinkedIn?.resume || 'N/A'}</p>
                            <p>Comments: {user.LinkedIn?.comments || 'N/A'}</p>
                            <button onClick={() => handleEditClick(user.userId, user.LinkedIn)}>Edit</button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default LinkedIn;
