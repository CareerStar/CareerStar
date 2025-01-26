import React from 'react';
import { useNavigate } from 'react-router-dom';
import starEmpty from '../assets/images/star-empty.png';
import star from '../assets/images/star.png';
import clock from '../assets/images/clock.png';
import startIcon from '../assets/images/start-icon.png';

function TopActivityCard({activityId, activityTitle, activityDescription, activityTags, activityStarCount, activityTime, moduleId}) {
    const navigate = useNavigate();
    const handleActivityClick = (activityId) => {
        navigate(`/dashboard/activity/${activityId}`);
    }
    return (
        <div className={`top-activity-card id-${moduleId}`} >
            <div className='top-activity-card-upper-container'>
                <h2 className='top-activity-card-title'>{activityTitle}</h2>
                <p className='top-activity-card-description'>{activityDescription}</p>
                <div className='top-activity-card-tags'>
                    {activityTags.map((tag, index) => <div className='top-activity-card-tag' key={index}><p>{tag}</p></div>)}
                </div>
            </div>
            <div className='top-activity-card-bottom-container'>
                <div className='top-activity-card-star'>
                    <img src={starEmpty} alt='star' />
                    <p>{activityStarCount}</p>
                </div>
                <div className='top-activity-card-time'>
                    <img src={clock} alt='clock' />
                    <p>{activityTime}</p>
                </div>
                <div className='top-activity-card-start' onClick={() => handleActivityClick(activityId)}>
                    <p>Start</p>
                    <img src={startIcon} alt='start' />
                </div>
            </div>
        </div>
    );
}

export default TopActivityCard;