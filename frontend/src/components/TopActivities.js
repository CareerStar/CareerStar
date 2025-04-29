import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopActivityCard from './TopActivityCard';

function TopActivities({ userId }) {
    const navigate = useNavigate();
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
            <div className='top-activities-header'>
                <h1>{firstname}'s Top Activities</h1>
                <button className='view-all-button' onClick={() => navigate('/dashboard/activities')}>View all →</button>
            </div>
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

            </div>
        </div>
    );
}

export default TopActivities;