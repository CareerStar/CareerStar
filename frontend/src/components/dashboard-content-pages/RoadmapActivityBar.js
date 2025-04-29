import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Jeopardy from '../internal-components/Jeopardy';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import starEmpty from '../../assets/images/star-empty.png';
import star from '../../assets/images/star.png';
import rightArrow from '../../assets/images/right-arrow-roadmap.png';

function RoadmapActivityBar({ activityName, activityId, completed, starCount, showStatus = true, showStar = true }) {
    const navigate = useNavigate();
    return (
        <div className='roadmap-sub-phase flex-row'>
            <div className='roadmap-phase-card'>
                {showStatus && (
                    <input
                        type="checkbox"
                        checked={completed}
                    />
                )}
                <p className='roadmap-activity-title'>{activityName}</p>
                <img
                    src={rightArrow}
                    alt='Right arrow icon'
                    onClick={() => navigate('/dashboard/activity/' + activityId, { state: { prevPage: 'activities' } })}
                    style={{ cursor: 'pointer' }}
                />
            </div>
            {showStar && (
                <div className='roadmap-phase-star-count flex-row'>
                    <p>{starCount}</p>
                    {completed ? (
                        <img src={star} alt='Star icon' />
                    ) : (
                        <img src={starEmpty} alt='Star icon' />
                    )}
                </div>
            )}
        </div>
    );
}

export default RoadmapActivityBar;