import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import starEmpty from '../assets/images/star-empty.png';
import star from '../assets/images/star.png';
import clock from '../assets/images/clock.png';
import startIcon from '../assets/images/start-icon.png';

function TopActivityCard({ activityId, activityTitle, activityDescription, activityTags, activityStarCount, activityTime, moduleId, isReady, completed, activityImage }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const handleActivityClick = (activityId) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigate(`/dashboard/activity/${activityId}`);
        }, 500);
    }
    return (
        <div className={`top-activity-card id-${moduleId}`} >
            {loading && (
                <div className="spinner-overlay">
                    <div className="spinner"></div>
                </div>
            )}
            {activityImage && (
                <div className="top-activity-card-image" onClick={() => handleActivityClick(activityId)} style={{ cursor: 'pointer' }}>
                    <img src={activityImage} alt="Activity" />
                </div>
            )}
            <div className='top-activity-card-upper-container'>
                <h2 className='top-activity-card-title'>{activityTitle}</h2>
                <p className='top-activity-card-description'>{activityDescription}</p>
                <div className='top-activity-card-tags'>
                    {activityTags.map((tag, index) => <div className='top-activity-card-tag' key={index}><p>{tag}</p></div>)}
                </div>
            </div>
            <div className='top-activity-card-bottom-container'>
                <div className='top-activity-card-star'>
                    {completed ?
                        <img src={star} alt='star' /> :
                        <img src={starEmpty} alt='star' />}
                    <p>{activityStarCount}</p>
                </div>
                <div className='top-activity-card-time'>
                    <img src={clock} alt='clock' />
                    <p>{activityTime}</p>
                </div>
                {isReady ? (
                    <div className='top-activity-card-start' onClick={() => handleActivityClick(activityId)}>
                        <p>Start</p>
                        <img src={startIcon} alt='start' />
                    </div>
                ) : (
                    <div className='top-activity-card-start'>
                        <p>Coming Soon</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TopActivityCard;