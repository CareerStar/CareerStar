import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Jeopardy from '../internal-components/Jeopardy';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import starEmpty from '../../assets/images/star-empty.png';
import star from '../../assets/images/star.png';
import rightArrow from '../../assets/images/right-arrow-roadmap.png';

function RoadmapActivityBar({ activityName, activityId, completed, starCount }) {
    const navigate = useNavigate();
    console.log('activityId', activityId, 'activityName', activityName, 'completed', completed, 'starCount', starCount);
    return (
        <div className='roadmap-sub-phase flex-row'>
            <div className='roadmap-phase-card'>
                <input
                    type="checkbox"
                    checked={completed}
                />
                <p>{activityName}</p>
                <img
                    src={rightArrow}
                    alt='Right arrow icon'
                    onClick={() => navigate('/dashboard/activity/' + activityId, { state: { prevPage: 'roadmap' } })}
                    style={{ cursor: 'pointer' }}
                />
            </div>
            <div className='roadmap-phase-star-count flex-row'>
                <p>{starCount}</p>
                {completed ? (
                    <img src={star} alt='Star icon' />
                ) : (
                    <img src={starEmpty} alt='Star icon' />
                )}
            </div>
        </div>
    );
}

export default RoadmapActivityBar;