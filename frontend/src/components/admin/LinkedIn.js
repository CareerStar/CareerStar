import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LinkedIn() {
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState([]);
    const [isEditing, setIsEditing] = useState(null);
    const [linkedInData, setLinkedInData] = useState({});

    useEffect(() => {
        const fetchUsersLinkedInDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('https://ec2-34-227-29-26.compute-1.amazonaws.com:5000/linkedin', {
                    headers: {
                        Authorization: `Bearer ${token}`,
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
                `https://ec2-34-227-29-26.compute-1.amazonaws.com:5000/linkedin/${userId}`,
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
        <div className='admin-activities'>
            <div className='activities-container'>
                <h1>LinkedIn</h1>
                {userDetails.map((user) => (
                    <div key={user.userId} className='flex-column'>
                        <div className='flex-row'>
                            <p>{user.firstname}</p>
                            <p>{user.emailId}</p>
                        </div>

                        {isEditing === user.userId ? (
                            <div>
                                {/* Editable form for LinkedIn data */}
                                <label>Headline:</label>
                                <input
                                    type='text'
                                    name='headline'
                                    value={linkedInData.headline}
                                    onChange={handleInputChange}
                                />

                                <label>Resume:</label>
                                <input
                                    type='text'
                                    name='resume'
                                    value={linkedInData.resume}
                                    onChange={handleInputChange}
                                />

                                <label>Remark:</label>
                                <input
                                    type='text'
                                    name='remark'
                                    value={linkedInData.remark}
                                    onChange={handleInputChange}
                                />

                                {/* Add more fields as necessary */}
                                
                                <button onClick={() => handleSave(user.userId)}>Save</button>
                                <button onClick={() => setIsEditing(null)}>Cancel</button>
                            </div>
                        ) : (
                            <div>
                                <p>Headline: {user.LinkedIn?.headline || 'N/A'}</p>
                                <p>Resume: {user.LinkedIn?.resume || 'N/A'}</p>
                                <p>Remark: {user.LinkedIn?.remark || 'N/A'}</p>
                                {/* Add more fields as necessary */}
                                
                                <button onClick={() => handleEditClick(user.userId, user.LinkedIn)}>Edit</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LinkedIn;
