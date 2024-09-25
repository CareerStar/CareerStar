import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ActivityCard from '../ActivityCard';
import starEmpty from '../../assets/images/star-empty.png';

function AdminActivities() {
    const [activities, setActivities] = useState([]);
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
            <h1>Top Activities For You This Week</h1>
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
                            <div className='flex-row'>
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
                                <button onClick={() => handleDelete(activity.activityId)}>Delete</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminActivities;