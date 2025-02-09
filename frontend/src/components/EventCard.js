import React from 'react';
import starEmpty from '../assets/images/star-empty.png';
import star from '../assets/images/star.png';

function EventCard({ activityId, image, tags, title, eventDate, description, eventURL, starCount, completed }) {
    return (
        <div className='event-card-container'>
            <div className='event-card-image'>
                <img src={image} alt='activity' />
            </div>
            <div className='event-card-content'>
                <div className='event-card-tags'>
                    {tags.map(tag => <div className='event-card-tag'><p>{tag}</p></div>)}
                </div>
                <h2>{title}</h2>
                <div className='event-card-date'>
                    {eventDate && <p>{new Date(eventDate).toISOString().split("T")[0]}</p>}
                </div>
                <div className='event-card-description'>
                    <p>{description}</p>
                </div>
                <div className='event-card-star'>
                    <p>{starCount}</p>
                    {completed ? <img src={star} alt='star' /> : <img src={starEmpty} alt='star' />}
                </div>
            </div>
        </div>
    );
}

export default EventCard;