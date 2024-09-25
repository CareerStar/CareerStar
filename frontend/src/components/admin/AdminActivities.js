import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ActivityCard from '../ActivityCard';
import starEmpty from '../../assets/images/star-empty.png';

function AdminActivities() {
    const [activities, setActivities] = useState([]);
    const [newActivity, setNewActivity] = useState({
        title: '',
        description: '',
        tags: [],
        imageURL: '',
        star: 0,
    });
    const [isEditing, setIsEditing] = useState(null);

    useEffect(() => {
        const fetchUserActivitiesDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://127.0.0.1:5000/activities', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    setActivities(response.data);
                } else {
                    console.error('Error fetching user details:', response.data);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        }
        fetchUserActivitiesDetails();
    }, []);

    const handleAddNewActivity = async () => {
        console.log('Adding new activity:', newActivity);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }
            if (newActivity.title === '' || newActivity.description === '' || newActivity.tags === '' || newActivity.imageURL === '' || newActivity.star === '') {
                console.error('All fields are required');
                return;
            }
            const requestBody = {
                newActivity
            };
            const response = await axios.post('http://127.0.0.1:5000/activities', newActivity, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log('Response:', response);
            if (response.status === 201) {
                console.log('Activity added successfully:', response.data);
                alert('Activity added successfully');
                console.log(response.data);
                console.log(response.data.activity.activityId);
                newActivity.activityId = response.data.activity.activityId;
                setActivities([...activities, newActivity]);
                setNewActivity({
                    title: '',
                    description: '',
                    tags: [],
                    imageURL: '',
                    star: 0,
                });
            } else {
                console.error('Error adding activity:', response.data);
            }
        } catch (error) {
            console.error('Error adding activity:', error);
        }
    };

    const handleChangeNewActivity = (field, value) => {
        const updatedActivity = { ...newActivity };
        if (field === 'tags') {
            updatedActivity[field] = value.split(',').map(tag => tag.trim());
        } else {
            updatedActivity[field] = value;
        }
        setNewActivity(updatedActivity);
    };

    const handleEdit = (activityId) => {
        const index = activities.findIndex(activity => activity.activityId === activityId);
        if (index !== -1) {
            setIsEditing(index);
            console.log('Editing:', activityId);
        }
    };

    const handleDelete = async (activityId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://127.0.0.1:5000/activities/${activityId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                console.log('Activity deleted successfully:', response.data);
                const updatedActivities = activities.filter(activity => activity.activityId !== activityId);
                setActivities(updatedActivities);
            } else {
                console.error('Error deleting user details:', response.data);
            }
        } catch (error) {
            console.error('Error deleting user details:', error);
        }
    };

    const handleChange = (index, field, value) => {
        const updatedActivities = [...activities];
        if (field === 'tags') {
            updatedActivities[index][field] = value.split(',').map(tag => tag.trim());
        } else {
            updatedActivities[index][field] = value;
        }
        setActivities(updatedActivities);
    };

    const handleSave = async (activity) => {
        try {
            const token = localStorage.getItem('token');
            // Convert tags back into an array
            // activity.tags = activity.tags.split(',').map(tag => tag.trim());
            console.log('Saving activity:', activity);
            const response = await axios.put(
                `http://127.0.0.1:5000/activities/${activity.activityId}`,
                activity,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) {
                console.log('Activity updated successfully:', response.data);
                setIsEditing(null);
            } else {
                console.error('Error updating activity:', response.data);
            }
        } catch (error) {
            console.error('Error updating activity:', error);
        }
    };

    return (
        <div className='activities-container'>
            <h1>Add new activity below</h1>
            <div className='flex-row'>
                <input
                    type='text'
                    value={newActivity.title}
                    placeholder='Title'
                    onChange={(e) => handleChangeNewActivity('title', e.target.value)}
                />
                <textarea
                    value={newActivity.description}
                    placeholder='Description'
                    onChange={(e) => handleChangeNewActivity('description', e.target.value)}
                />
                <input
                    type='text'
                    value={newActivity.tags?.join(', ')}
                    placeholder='Tags'
                    onChange={(e) => handleChangeNewActivity('tags', e.target.value)}
                />
                <input
                    type='text'
                    value={newActivity.imageURL}
                    placeholder='Image URL'
                    onChange={(e) => handleChangeNewActivity('imageURL', e.target.value)}
                />
                <input
                    type='number'
                    value={newActivity.star}
                    placeholder='Star'
                    onChange={(e) => handleChangeNewActivity('star', e.target.value)}
                />
                <button onClick={() => handleAddNewActivity()}>Save</button>
            </div>
            <div className='activity-cards'>
                {activities.map((activity, index) => (
                    <div key={activity.activityId} className='activity-card'>
                        {isEditing === index ? (
                            <div className='flex-row'>
                                <input
                                    type='text'
                                    value={activity.title}
                                    onChange={(e) => handleChange(index, 'title', e.target.value)}
                                />
                                <textarea
                                    value={activity.description}
                                    onChange={(e) => handleChange(index, 'description', e.target.value)}
                                />
                                <input
                                    type='text'
                                    value={activity.tags.join(', ')}
                                    onChange={(e) => handleChange(index, 'tags', e.target.value)}
                                />
                                <input
                                    type='text'
                                    value={activity.imageURL}
                                    onChange={(e) => handleChange(index, 'imageURL', e.target.value)}
                                />
                                <input
                                    type='number'
                                    value={activity.star}
                                    onChange={(e) => handleChange(index, 'star', e.target.value)}
                                />
                                <button onClick={() => handleSave(activity)}>Save</button>
                            </div>
                        ) : (
                            <div className='flex-col'>
                                <div className='activity-card-edit' onClick={() => handleEdit(activity.activityId)}>
                                    <ActivityCard
                                        activityId={activity.activityId}
                                        image={activity.imageURL}
                                        tags={activity.tags}
                                        title={activity.title}
                                        description={activity.description}
                                        starCount={activity.star}
                                    />
                                </div>
                                <button className='activity-delete-button' onClick={() => handleDelete(activity.activityId)}>Delete</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminActivities;