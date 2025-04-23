import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EventCard from '../EventCard';
import starEmpty from '../../assets/images/star-empty.png';

function AdminEvents() {

    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [newEvents, setNewEvents] = useState({
        title: '',
        description: '',
        tags: [],
        imageURL: '',
        star: 0,
    });
    const [isEditing, setIsEditing] = useState(null);

    useEffect(() => {
        const fetchUserEventsDetails = async () => {
            try {
                const admin_token = localStorage.getItem('admin_token');
                const response = await axios.get('https://api.careerstar.co/events', {
                    headers: {
                        Authorization: `Bearer ${admin_token}`
                    }
                });
                if (response.status === 200) {
                    setEvents(response.data);
                } else {
                    console.error('Error fetching user details:', response.data);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
                navigate('/admin');
            }
        }
        fetchUserEventsDetails();
    }, []);

    const handleAddNewActivity = async () => {
        try {
            const admin_token = localStorage.getItem('admin_token');
            if (!admin_token) {
                console.error('No token found');
                return;
            }
            if (newEvents.title === '' || newEvents.description === '' || newEvents.tags === '' || newEvents.imageURL === '' || newEvents.star === '') {
                console.error('All fields are required');
                return;
            }
            const requestBody = {
                newEvents
            };
            const response = await axios.post('https://api.careerstar.co/events', newEvents, {
                headers: {
                    Authorization: `Bearer ${admin_token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 201) {
                alert('Activity added successfully');
                newEvents.activityId = response.data.activity.activityId;
                setEvents([...events, newEvents]);
                setNewEvents({
                    title: '',
                    description: '',
                    tags: [],
                    imageURL: '',
                    star: 0,
                    videoURL: '',
                    eventURL: '',
                    detailedDescription: '',
                    eventDate: ''
                });
            } else {
                console.error('Error adding activity:', response.data);
            }
        } catch (error) {
            console.error('Error adding activity:', error);
        }
    };

    const handleChangeNewActivity = (field, value) => {
        const updatedActivity = { ...newEvents };
        if (field === 'tags') {
            updatedActivity[field] = value.split(',').map(tag => tag.trim());
        } else {
            updatedActivity[field] = value;
        }
        setNewEvents(updatedActivity);
    };

    const handleEdit = (activityId) => {
        const index = events.findIndex(activity => activity.activityId === activityId);
        if (index !== -1) {
            setIsEditing(index);
        }
    };

    const handleDelete = async (activityId) => {
        try {
            const admin_token = localStorage.getItem('admin_token');
            const response = await axios.delete(`https://api.careerstar.co/events/${activityId}`, {
                headers: {
                    Authorization: `Bearer ${admin_token}`
                }
            });
            if (response.status === 200) {
                const updatedActivities = events.filter(activity => activity.activityId !== activityId);
                setEvents(updatedActivities);
            } else {
                console.error('Error deleting user details:', response.data);
            }
        } catch (error) {
            console.error('Error deleting user details:', error);
        }
    };

    const handleChange = (index, field, value) => {
        const updatedActivities = [...events];
        if (field === 'tags') {
            updatedActivities[index][field] = value.split(',').map(tag => tag.trim());
        } else {
            updatedActivities[index][field] = value;
        }
        setEvents(updatedActivities);
    };

    const handleSave = async (activity) => {
        try {
            const admin_token = localStorage.getItem('admin_token');
            // Convert tags back into an array
            // activity.tags = activity.tags.split(',').map(tag => tag.trim());
            const response = await axios.put(
                `https://api.careerstar.co/events/${activity.activityId}`,
                activity,
                {
                    headers: {
                        Authorization: `Bearer ${admin_token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) {
                setIsEditing(null);
            } else {
                console.error('Error updating activity:', response.data);
            }
        } catch (error) {
            console.error('Error updating activity:', error);
        }
    };

    return (
        <div className='admin-events'>
            <div className='events-container'>
                <h1>Add new activity below</h1>
                <div className='edit-activity flex-row'>
                    <input
                        type='text'
                        value={newEvents.title}
                        placeholder='Title'
                        onChange={(e) => handleChangeNewActivity('title', e.target.value)}
                    />
                    <textarea
                        value={newEvents.description}
                        placeholder='Description'
                        onChange={(e) => handleChangeNewActivity('description', e.target.value)}
                    />
                    <textarea
                        type='text'
                        value={newEvents.detailedDescription || ""}
                        placeholder='Detailed Description'
                        onChange={(e) => handleChangeNewActivity('detailedDescription', e.target.value)}
                    />
                    <input
                        type='text'
                        value={newEvents.tags?.join(', ')}
                        placeholder='Tags'
                        onChange={(e) => handleChangeNewActivity('tags', e.target.value)}
                    />
                    <input
                        type='text'
                        value={newEvents.imageURL}
                        placeholder='Image URL'
                        onChange={(e) => handleChangeNewActivity('imageURL', e.target.value)}
                    />
                    <input
                        type='text'
                        value={newEvents.videoURL}
                        placeholder='Video URL'
                        onChange={(e) => handleChangeNewActivity('videoURL', e.target.value)}
                    />
                    <input
                        type='number'
                        value={newEvents.star}
                        placeholder='Star'
                        onChange={(e) => handleChangeNewActivity('star', e.target.value)}
                    />
                    <input
                        type='text'
                        value={newEvents.eventURL || ""}
                        placeholder='Event URL'
                        onChange={(e) => handleChangeNewActivity('eventURL', e.target.value)}
                    />
                    <input
                        type="date"
                        value={newEvents.eventDate || ""}
                        onChange={(e) => handleChangeNewActivity('eventDate', e.target.value)}
                    />
                    <button onClick={() => handleAddNewActivity()}>Save</button>
                </div>
                <div className='event-cards'>
                    {events.map((event, index) => (
                        <div key={event.activityId} className='event-card'>
                            {isEditing === index ? (
                                <div className='flex-row'>
                                    <input
                                        type='text'
                                        value={event.title}
                                        onChange={(e) => handleChange(index, 'title', e.target.value)}
                                    />
                                    <textarea
                                        value={event.description}
                                        onChange={(e) => handleChange(index, 'description', e.target.value)}
                                    />
                                    <textarea
                                        type='text'
                                        value={event.detailedDescription || ""}
                                        onChange={(e) => handleChange(index, 'detailedDescription', e.target.value)}
                                    />
                                    <input
                                        type='text'
                                        value={event.tags.join(', ')}
                                        onChange={(e) => handleChange(index, 'tags', e.target.value)}
                                    />
                                    <input
                                        type='text'
                                        value={event.imageURL}
                                        onChange={(e) => handleChange(index, 'imageURL', e.target.value)}
                                    />
                                    <input
                                        type='text'
                                        value={event.videoURL}
                                        onChange={(e) => handleChange(index, 'videoURL', e.target.value)}
                                    />
                                    <input
                                        type='number'
                                        value={event.star}
                                        onChange={(e) => handleChange(index, 'star', e.target.value)}
                                    />
                                    <input
                                        type='text'
                                        value={event.eventURL || ""}
                                        onChange={(e) => handleChange(index, 'eventURL', e.target.value)}
                                    />
                                    <input
                                        type="date"
                                        value={event.eventDate ? new Date(event.eventDate).toISOString().split("T")[0] : ""}
                                        onChange={(e) => handleChange(index, 'eventDate', e.target.value)}
                                    />
                                    <button onClick={() => handleSave(event)}>Save</button>
                                </div>
                            ) : (
                                <div className='flex-col'>
                                    <div className='event-card-edit' onClick={() => handleEdit(event.activityId)}>
                                        <EventCard
                                            activityId={event.activityId}
                                            image={event.imageURL}
                                            tags={event.tags}
                                            title={event.title}
                                            description={event.description}
                                            starCount={event.star}
                                        />
                                    </div>
                                    <button className='event-delete-button' onClick={() => handleDelete(event.activityId)}>Delete</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AdminEvents;