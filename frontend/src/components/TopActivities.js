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
                    activityId={1}
                    activityTitle='Reaching Out To More Than Recruiters'
                    activityDescription='Reaching out to the people you could actually be working with is often be much more effective.'
                    activityTags={['Networking', 'LinkedIn']}
                    activityStarCount={7}
                    activityTime='15 min'
                    moduleId={1}
                    isReady={true}
                />

                <TopActivityCard
                    activityId={2}
                    activityTitle='Career Acronym Challenge'
                    activityDescription='Test your knowledge of industry acronyms and their meanings, perfect for anyone looking to strengthen their business and tech vocabulary.'
                    activityTags={['Networking', 'Career']}
                    activityStarCount={7}
                    activityTime='20 min'
                    moduleId={1}
                    isReady={true}
                />

                <TopActivityCard
                    activityId={3}
                    activityTitle='Better Cold Call LinkedIn Messages'
                    activityDescription='Draft better Messages that actually get results, while learning something new at the same time!'
                    activityTags={['Networking', 'LinkedIn']}
                    activityStarCount={3}
                    activityTime='10 min'
                    moduleId={3}
                    isReady={true}
                />

                <TopActivityCard
                    activityId={3}
                    activityTitle='Get To Know Your Interviewer'
                    activityDescription='Researching your interviewer before a job interview can give you a significant advantage.'
                    activityTags={['Interview', 'LinkedIn']}
                    activityStarCount={3}
                    activityTime='10 min'
                    moduleId={3}
                    isReady={false}
                />

                <TopActivityCard
                    activityId={1}
                    activityTitle='The Dreaded Salary Talk'
                    activityDescription='Discussing Salary During Interviews'
                    activityTags={['Interview']}
                    activityStarCount={5}
                    activityTime='15 min'
                    moduleId={2}
                    isReady={false}
                />

                <TopActivityCard
                    activityId={3}
                    activityTitle='Sending A Great Thank You Note - Immediately'
                    activityDescription='Master the art of writing a professional and memorable thank-you note after your interview.'
                    activityTags={['Interview', 'LinkedIn']}
                    activityStarCount={5}
                    activityTime='10 min'
                    moduleId={3}
                    isReady={false}
                />
            </div>
        </div>
    );
}

export default TopActivities;