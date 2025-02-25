import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EventCard from './EventCard';
import starEmpty from '../assets/images/star-empty.png';
import star from '../assets/images/star.png';

function Events({ userId }) {
    const [events, setEvents] = useState([]);
    const [firstname, setFirstname] = useState(localStorage.getItem('firstname') || '');
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUserEventsDetails = async () => {
            try {
                const responseAll = await fetch(`https://api.careerstar.co/events`);
                const eventsData = await responseAll.json();
            
                if (!responseAll.ok) {
                    console.error('Error fetching all events:', eventsData);
                    return;
                }
            
                const responseUser = await fetch(`https://api.careerstar.co/events/${userId}`);
                const completedData = await responseUser.json();
            
                if (!responseUser.ok) {
                    console.error('Error fetching user completed events:', completedData);
                    return;
                }
            
                const completedSet = new Set(Object.keys(completedData).map(id => Number(id)));
            
                const updatedEvents = eventsData.map(event => ({
                    ...event,
                    completed: completedSet.has(event.activityId)
                }));
        
                setEvents(updatedEvents.slice(0, 4));
            } catch (error) {
                console.error('Error fetching event details:', error);
            }
        }
        if (userId) {
            fetchUserEventsDetails();
        }
    }, [userId]);

    const [showPopup, setShowPopup] = useState(false);
    const [currentCard, setCurrentCard] = useState(null);
    const popupRef = useRef(null);

    const closePopUp = () => {
        setShowPopup(false);
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                closePopUp();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [popupRef]);

    const updateEvent = (activityId, updatedData) => {
        setEvents((prevActivities) =>
            prevActivities.map((activity) =>
                activity.activityId === activityId
                    ? { ...activity, ...updatedData }
                    : activity
            )
        );
    };

    const openEventPage = () => {
        if (currentCard.eventURL) {
            window.open(currentCard.eventURL, '_blank');
        }
    }

    const updateUserEvent = async () => {
        if (currentCard.completed) {
            closePopUp();
            return;
        }
        try {
            const response = await fetch(`https://api.careerstar.co/events/${userId}/${currentCard.activityId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    completed: true,
                    stars: currentCard.star
                })
            });

            const data = await response.json();
            if (response.ok) {
                updateEvent(currentCard.activityId, { completed: true });
                closePopUp();
                window.location.reload();
            } else {
                console.error('Error updating user activity:', data);
            }
        }
        catch (error) {
            console.error('Error updating user activity:', error);
        }
    }

    return (
        <div className='events-container'>
            <div className='events-header'>
                <h1>Top Picks For You This Week</h1>
                <button className='view-all-button' onClick={() => navigate('/dashboard/events')}>View all →</button>
            </div>
            <div className='event-cards'>
                {events.map(card => <div className="event-card-wrapper" onClick={() => { setShowPopup(true); setCurrentCard(card) }}><EventCard activityId={card.activityId} image={card.imageURL} tags={card.tags} title={card.title} eventDate={card.eventDate} description={card.description} eventURL={card.eventURL} starCount={card.star} completed={card.completed} /></div>)}
            </div>
            {showPopup && (
                <div className='event-popup'>
                    <div className='event-popup-content' ref={popupRef}>
                        {currentCard.videoURL ? (<iframe
                            width="754"
                            height="392"
                            src={currentCard.videoURL}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        >
                        </iframe>) : (<img src={currentCard.imageURL} className='popup-image' />)}
                        <div className='event-popuop-tags-stars'>
                            <div className='event-popup-tags'>
                                <div className='event-card-tags'>
                                    {currentCard.tags.map(tag => <div className='event-card-tag'><p>{tag}</p></div>)}
                                </div>
                                <div className='event-popup-star-and-count'>
                                    <p>{currentCard.star}</p>
                                    {currentCard.completed ? <img src={star} alt='star' /> : <img src={starEmpty} alt='star' />}
                                </div>
                            </div>
                        </div>
                        <h2>{currentCard.title}</h2>
                        <div className='event-popup-text'>
                            {currentCard.detailedDescription ? <p>{currentCard.detailedDescription}</p> : <p>{currentCard.description}</p>}
                        </div>
                        <div className='event-popup-buttons'>
                            <div className='event-popup-sign-up-button' onClick={openEventPage}>
                                <p>Sign up ↗</p>
                            </div>
                            <div className='event-popup-submit-button' onClick={updateUserEvent}>
                                {currentCard.completed ? <p>Completed</p> : <p>Mark as completed</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Events;