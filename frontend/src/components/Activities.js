import React, { useState, useRef, useEffect } from 'react';
import ActivityCard from './ActivityCard';
import activity1 from '../assets/images/activity-1.png';
import activity2 from '../assets/images/activity-2.png';
import activity3 from '../assets/images/activity-3.png';
import activity4 from '../assets/images/activity-4.png';
import starEmpty from '../assets/images/star-empty.png';
import star from '../assets/images/star.png';

function Activities({ userId }) {
    const [activites, setActivities] = useState([]);
    useEffect(() => {
        const fetchUserActivitiesDetails = async () => {
            try {
                const response = await fetch(`https://ec2-34-227-29-26.compute-1.amazonaws.com:5000/activities/${userId}`);

                const data = await response.json();
                if (response.ok) {
                    if (data) {
                        setActivities(data);
                    }
                    console.log('User activities details:', data);
                } else {
                    console.error('Error fetching user details:', data);
                }

                // if (data.length === 0) {
                //     const response = await fetch(`https://ec2-34-227-29-26.compute-1.amazonaws.com:5000/activities`);
                //     const data = await response.json();
                //     console.log('All activities:', data);
                //     if (response.ok) {
                //         if (data) {
                //             setActivities(data);
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
            fetchUserActivitiesDetails();
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

    const updateActivity = (activityId, updatedData) => {
        setActivities((prevActivities) =>
            prevActivities.map((activity) =>
                activity.activityId === activityId
                    ? { ...activity, ...updatedData }
                    : activity
            )
        );
    };
    

    const updateUserActivity = async () => {
        try {
            const response = await fetch(`https://ec2-34-227-29-26.compute-1.amazonaws.com:5000/user_activities/${userId}/${currentCard.activityId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    completed: true
                })
            });

            const data = await response.json();
            if (response.ok) {
                console.log('User activity updated:', data);
                updateActivity(currentCard.activityId, { completed: true });
                closePopUp();
            } else {
                console.error('Error updating user activity:', data);
            }
        }
        catch (error) {
            console.error('Error updating user activity:', error);
        }
    }

    return (
        <div className='activities-container'>
            <h1>Top Activities For You This Week</h1>
            <div className='activity-cards'>
                {/* {activites.length > 0 ? (
                    activites.map(card => <div onClick={() => { setShowPopup(true); setCurrentCard(card) }}><ActivityCard activityId={card.activityId} image={card.imageURL} tags={card.tags} title={card.title} description={card.description} starCount={card.star} /></div>)
                ) : (
                    cards.map(card => <div onClick={() => { setShowPopup(true); setCurrentCard(card) }}><ActivityCard activityId={card.activityId} image={card.imageURL} tags={card.tags} title={card.title} description={card.description} starCount={card.star} /></div>)
                )} */}
                {activites.map(card => <div onClick={() => { setShowPopup(true); setCurrentCard(card) }}><ActivityCard activityId={card.activityId} image={card.imageURL} tags={card.tags} title={card.title} description={card.description} starCount={card.star} completed={card.completed} /></div>)            }
            </div>
            {showPopup && (
                <div className='activity-popup'>
                    <div className='activity-popup-content' ref={popupRef}>
                        {currentCard.videoURL ? (<iframe
                            width="754"
                            height="392"
                            src={currentCard.videoURL}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        >
                        </iframe>) : (<img src={currentCard.imageURL} className='popup-image' />)}
                        <div className='activity-popuop-tags-stars'>
                            <div className='activity-popup-tags'>
                                <div className='activity-card-tags'>
                                    {currentCard.tags.map(tag => <div className='activity-card-tag'><p>{tag}</p></div>)}
                                </div>
                                <div className='activity-popup-star-and-count'>
                                    <p>{currentCard.star}</p>
                                    {currentCard.completed ? <img src={star} alt='star' /> : <img src={starEmpty} alt='star' />}
                                </div>
                            </div>
                        </div>
                        <h2>{currentCard.title}</h2>
                        <div className='activity-popup-text'>
                            <p>{currentCard.description}</p>
                        </div>
                        <div className='activity-popup-submit-button' onClick={updateUserActivity}>
                            <p>I watched this</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Activities;