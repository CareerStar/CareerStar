import React, { useState, useRef, useEffect } from 'react';
import TopActivityCard from './TopActivityCard';

function TopActivities({ userId }) {
    const [firstname, setFirstname] = useState(localStorage.getItem('firstname') || '');
    const [loading, setLoading] = useState(false);
    const [activityStatuses, setActivityStatuses] = useState({});

    useEffect(() => {
        const fetchActivityStatusDetails = async () => {
            setLoading(true);

            try {
                const response = await fetch(`https://api.careerstar.co/roadmapactivity/${userId}`);
                const data = await response.json();
                if (response.ok) {
                    setActivityStatuses(data);
                } else {
                    console.error('Error fetching Activity Status details:', data);
                }
            } catch (error) {
                console.error('Error fetching Activity Status details:', error);
            } finally {
                setLoading(false);
            }
        }
        if (userId) {
            fetchActivityStatusDetails();
        }
    }, [userId]);

    return (
        <div className='top-activities'>
            {loading && (
                <div className="spinner-overlay">
                    <div className="spinner"></div>
                </div>
            )}
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
                    completed={!!activityStatuses?.[1]}
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
                    completed={!!activityStatuses?.[2]}
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
                    completed={!!activityStatuses?.[3]}
                />

                <TopActivityCard
                    activityId={4}
                    activityTitle='Hot Jobs of the Week'
                    activityDescription='Check out these hot jobs of the week! Stay ahead in your career by exploring top openings from leading companies, handpicked just for you.'
                    activityTags={['Job', 'LinkedIn']}
                    activityStarCount={3}
                    activityTime='10 min'
                    moduleId={3}
                    isReady={true}
                    completed={!!activityStatuses?.[4]}
                />

                <TopActivityCard
                    activityId={5}
                    activityTitle='Let’s Network Before We Network'
                    activityDescription='Want to make the most of an event? Start by building a relationship with the event host!'
                    activityTags={['Events', 'Networking']}
                    activityStarCount={7}
                    activityTime='15 min'
                    moduleId={3}
                    isReady={true}
                    completed={!!activityStatuses?.[5]}
                />

                {/* <TopActivityCard
                    activityId={99}
                    activityTitle='Get To Know Your Interviewer'
                    activityDescription='Researching your interviewer before a job interview can give you a significant advantage.'
                    activityTags={['Interview', 'LinkedIn']}
                    activityStarCount={3}
                    activityTime='10 min'
                    moduleId={3}
                    isReady={false}
                    completed={!!activityStatuses?.[99]}
                /> */}

                <TopActivityCard
                    activityId={100}
                    activityTitle='The Dreaded Salary Talk'
                    activityDescription='Discussing Salary During Interviews'
                    activityTags={['Interview']}
                    activityStarCount={5}
                    activityTime='15 min'
                    moduleId={2}
                    isReady={false}
                    completed={!!activityStatuses?.[100]}
                />
            </div>
        </div>
    );
}

export default TopActivities;