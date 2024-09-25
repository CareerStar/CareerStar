import React, { useState, useRef, useEffect } from 'react';
import ActivityCard from './ActivityCard';
import activity1 from '../assets/images/activity-1.png';
import activity2 from '../assets/images/activity-2.png';
import activity3 from '../assets/images/activity-3.png';
import activity4 from '../assets/images/activity-4.png';
import starEmpty from '../assets/images/star-empty.png';

function Activities({ userId }) {
    const [activites, setActivities] = useState([]);
    useEffect(() => {
        const fetchUserActivitiesDetails = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/activities/${userId}`);

                const data = await response.json();
                if (response.ok) {
                    if (data) {
                        setActivities(data);
                    }
                    console.log('User activities details:', data);
                } else {
                    console.error('Error fetching user details:', data);
                }
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

    return (
        <div className='activites-container'>
            <h1>Top Activities For You This Week</h1>
            <div className='activity-cards'>
                {activites.length > 0 ? (
                    activites.map(card => <div onClick={() => { setShowPopup(true); setCurrentCard(card) }}><ActivityCard activityId={card.activityId} image={card.imageURL} tags={card.tags} title={card.title} description={card.description} starCount={card.star} /></div>)
                ):(
                    cards.map(card => <div onClick={() => { setShowPopup(true); setCurrentCard(card) }}><ActivityCard activityId={card.activityId} image={card.imageURL} tags={card.tags} title={card.title} description={card.description} starCount={card.star} /></div>)
                )}
            </div>
            {showPopup && (
                <div className='activity-popup'>
                    <div className='activity-popup-content' ref={popupRef}>
                        <img src={currentCard.imageURL} />
                        <div className='activity-popuop-tags-stars'>
                            <div className='activity-popup-tags'>
                                <div className='activity-card-tags'>
                                    {currentCard.tags.map(tag => <div className='activity-card-tag'><p>{tag}</p></div>)}
                                </div>
                                <div className='activity-popup-star-and-count'>
                                    <p>{currentCard.starCount}</p>
                                    <img src={starEmpty} alt='star' />
                                </div>
                            </div>
                        </div>
                        <h2>{currentCard.title}</h2>
                        <div className='activity-popup-text'>
                            <p>{currentCard.description}</p>
                        </div>
                        <div className='activity-popup-submit-button' onClick={closePopUp}>
                            <p>I watched this</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Activities;