import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import star from '../assets/images/star.png';
import clock from '../assets/images/clock.png';
import startIcon from '../assets/images/start-icon.png';
import TopActivityCard from './TopActivityCard';

function TopActivities() {
    const [firstname, setFirstname] = useState(localStorage.getItem('firstname') || '');

    return (
        <div className='top-activities'>
            <h1>{firstname}'s Top Activities</h1>
            <div className='top-activities-container'>

                <TopActivityCard
                    activityId={2}
                    activityTitle='Reaching out to more than Recruiters'
                    activityDescription='Reaching out to the people you could actually be working with is often be much more effective.'
                    activityTags={['Networking', 'LinkedIn']}
                    activityStarCount={7}
                    activityTime='15 min'
                    moduleId={1}
                />

                <TopActivityCard
                    activityId={3}
                    activityTitle='Get to Know Your Interviewer'
                    activityDescription='Researching your interviewer before a job interview can give you a significant advantage.'
                    activityTags={['Interview', 'LinkedIn']}
                    activityStarCount={7}
                    activityTime='15 min'
                    moduleId={3}
                />

                <TopActivityCard
                    activityId={1}
                    activityTitle='The Dreaded Salary Talk'
                    activityDescription='Discussing Salary During Interviews'
                    activityTags={['Interview']}
                    activityStarCount={7}
                    activityTime='15 min'
                    moduleId={2}
                />

                <TopActivityCard
                    activityId={3}
                    activityTitle='Get to Know Your Interviewer'
                    activityDescription='Researching your interviewer before a job interview can give you a significant advantage.'
                    activityTags={['Interview', 'LinkedIn']}
                    activityStarCount={7}
                    activityTime='15 min'
                    moduleId={3}
                />
            </div>
        </div>
    );
}

export default TopActivities;