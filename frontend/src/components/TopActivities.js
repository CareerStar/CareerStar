import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopActivityCard from './TopActivityCard';
import activity1 from '../assets/images/activities/activityGalery/activity1.svg';
import activity6 from '../assets/images/activities/activityGalery/activity6.svg';
import activity13 from '../assets/images/activities/activityGalery/acitivty10.svg';


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

                {/*<TopActivityCard
                    activityId={1}
                    activityTitle='Reaching Out To More Than Recruiters'
                    activityDescription='Reaching out to the people you could actually be working with is often be much more effective.'
                    activityTags={['Networking', 'LinkedIn']}
                    activityStarCount={7}
                    activityTime='15 min'
                    moduleId={1}
                    isReady={true}
                    completed={!!activityStatuses?.[1]}
                    activityImage={activity1}
                />

                {/* <TopActivityCard
                    activityId={2}
                    activityTitle='Career Acronym Challenge'
                    activityDescription='Test your knowledge of industry acronyms and their meanings, perfect for anyone looking to strengthen their business and tech vocabulary.'
                    activityTags={['Networking', 'Career']}
                    activityStarCount={7}
                    activityTime='20 min'
                    moduleId={1}
                    isReady={true}
                    completed={!!activityStatuses?.[2]}
                /> */}

            <TopActivityCard
                    activityId={16}
                    activityTitle='Welcome to CareerStar 101'
                    activityDescription="We're glad you're here! this quick guide will help you get started with CareerStar."
                    activityTags={[ 'Communication', 'Leadership']}
                    activityStarCount={3}
                    activityTime='5 min'
                    moduleId={3}
                    isReady={true}
                    completed={!!activityStatuses?.[16]}
                    activityImage={activity6}
                />
            
                <TopActivityCard    
                    activityId={13}
                    activityTitle='3-2-1 + Report: Stand Out During Your Internship'
                    activityDescription='A great way to show your skills and get noticed by your team.'
                    activityTags={['Internship', 'Report']}
                    activityStarCount={10}
                    activityTime='20 min'
                    moduleId={1}
                    isReady={true}
                    completed={!!activityStatuses?.[13]}
                    activityImage={activity13}
                /> 
 
                <TopActivityCard
                    activityId={15}
                    activityTitle='We Want to Know About Your Internship'
                    activityDescription='Help us Help you!'
                    activityTags={[ 'Communication', 'Leadership']}
                    activityStarCount={5}
                    activityTime='5 min'
                    moduleId={3}
                    isReady={true}
                    completed={!!activityStatuses?.[15]}
                    activityImage={activity1}
                />


            </div>
        </div>
    );
}

export default TopActivities;