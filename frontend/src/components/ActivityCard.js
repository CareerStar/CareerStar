import React from 'react';
import starEmpty from '../assets/images/star-empty.png';

function ActivityCard({ activityId, image, tags, title, description, starCount }) {
    return (
        <div className='activity-card-container'>
            <div className='activity-card-image'>
                <img src={image} alt='activity' />
            </div>
            <div className='activity-card-content'>
                <div className='activity-card-tags'>
                    {tags.map(tag => <div className='activity-card-tag'><p>{tag}</p></div>)}
                </div>
                <h2>{title}</h2>
                <div className='activity-card-description'>
                    <p>{description}</p>
                </div>
                <div className='activity-card-star'>
                    <p>{starCount}</p>
                    <img src={starEmpty} alt='star' />
                </div>
            </div>
        </div>
    );
}

export default ActivityCard;