import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EventCard from './EventCard';
import activity1 from '../assets/images/activity-1.png';
import activity2 from '../assets/images/activity-2.png';
import activity3 from '../assets/images/activity-3.png';
import activity4 from '../assets/images/activity-4.png';
import starEmpty from '../assets/images/star-empty.png';
import star from '../assets/images/star.png';

function Events({ userId }) {
    const [events, setEvents] = useState([]);
    const [firstname, setFirstname] = useState(localStorage.getItem('firstname') || '');
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUserEventsDetails = async () => {
            try {
                const response = await fetch(`https://ec2-34-227-29-26.compute-1.amazonaws.com:5000/events/${userId}`);

                const data = await response.json();
                if (response.ok) {
                    if (data) {
                        setEvents(data);
                    }
                } else {
                    console.error('Error fetching user details:', data);
                }

                // if (data.length === 0) {
                //     const response = await fetch(`https://ec2-34-227-29-26.compute-1.amazonaws.com:5000/events`);
                //     const data = await response.json();
                //     console.log('All activities:', data);
                //     if (response.ok) {
                //         if (data) {
                //             setEvents(data);
                //         }
                //         console.log('User activities details:', data);
                //     }
                // }
            }
            catch (error) {
                console.error('Error fetching user details:', error);
            }
        }
        if (userId) {
            fetchUserEventsDetails();
        }
    }, [userId]);

    const cards =
        [
            {
                activityId: 1,
                imageURL: activity1,
                tags: ['Profile', 'Event'],
                title: 'Complete your LinkedIn profile',
                description: 'Enhance your professional presence with a fully optimized LinkedIn profile. This step-by-step guide will walk you through the process, ensuring you showcase your skills and experience effectively.',
                star: 7
            },
            {
                activityId: 2,
                imageURL: activity2,
                tags: ['Event'],
                title: 'TechWalk - Brooklyn',
                description: 'This is a chance to network, share ideas, and build relationships in a healthy and refreshing alternative to the average happy hour.',
                star: 15
            },
            {
                activityId: 3,
                imageURL: activity3,
                tags: ['Upskill', 'Community'],
                title: 'Flushing Tech Meetup at TIQC',
                description: 'Get ready to dive into the world of innovation and collaboration at the Tech Incubator at Queens College, where the Flushing Tech Meetup is hosting an electrifying hackathon just for you!',
                star: 20
            },
            {
                activityId: 4,
                imageURL: activity4,
                tags: ['Tip of the day'],
                title: 'Showing confidence in job interviews',
                description: 'Watch our tip of the day: How to show confidence in job interviews. It’s easier than you think!',
                star: 3
            }
        ];
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


    const updateUserEvent = async () => {
        if (currentCard.completed) {
            closePopUp();
            return;
        }
        try {
            const response = await fetch(`https://ec2-34-227-29-26.compute-1.amazonaws.com:5000/user_activities/${userId}/${currentCard.activityId}`, {
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

    const handleActivityClick = (activityId) => {
        navigate(`/dashboard/activity/${activityId}`);
    }

    return (
        <div className='events-container'>
            <h1>{firstname}'s Top Activities</h1>
            <div className='temp-event-cards'>
                <div className='temp-event-card' onClick={() => handleActivityClick(1)}>Activity 1</div>
                <div className='temp-event-card' onClick={() => handleActivityClick(2)}>Activity 2</div>
                <div className='temp-event-card' onClick={() => handleActivityClick(3)}>Activity 3</div>
                <div className='temp-event-card' onClick={() => handleActivityClick(4)}>Activity 4</div>
            </div>
            <h1>Top Events For You This Week</h1>
            <div className='event-cards'>
                {/* {events.length > 0 ? (
                    events.map(card => <div onClick={() => { setShowPopup(true); setCurrentCard(card) }}><ActivityCard activityId={card.activityId} image={card.imageURL} tags={card.tags} title={card.title} description={card.description} starCount={card.star} /></div>)
                ) : (
                    cards.map(card => <div onClick={() => { setShowPopup(true); setCurrentCard(card) }}><ActivityCard activityId={card.activityId} image={card.imageURL} tags={card.tags} title={card.title} description={card.description} starCount={card.star} /></div>)
                )} */}
                {events.map(card => <div onClick={() => { setShowPopup(true); setCurrentCard(card) }}><EventCard activityId={card.activityId} image={card.imageURL} tags={card.tags} title={card.title} description={card.description} starCount={card.star} completed={card.completed} /></div>)}
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
                            <p>{currentCard.description}</p>
                        </div>
                        <div className='event-popup-submit-button' onClick={updateUserEvent}>
                            {currentCard.completed ? <p>Completed</p> : <p>Mark as completed</p>}
                            {/* <p>I watched this</p> */}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Events;