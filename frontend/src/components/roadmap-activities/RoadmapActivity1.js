import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import starEmpty from '../../assets/images/star-empty.png';
import downArrow from '../../assets/images/down-arrow-roadmap.png';
import upArrow from '../../assets/images/up-arrow-roadmap.png';
import hotTip1 from '../../assets/images/roadmap-activities/hot-tip-1.webp';

function RoadmapActivity1({ userId }) {
    const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`https://ec2-34-227-29-26.compute-1.amazonaws.com:5000/onboarding/${userId}`);
                const data = await response.json();
                if (response.ok) {
                    // setCurrentSituation(data.currentSituation);
                    // setGoal(data.goal);
                } else {
                    console.error('Error fetching user details:', data);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        }
        if (userId) {
            fetchUserDetails();
        }
    }, [userId]);

    const toggleDescriptionVisibility = () => {
        setIsDescriptionVisible(!isDescriptionVisible);
    };

    return (

        <div>
            <div className='roadmap-sub-phase flex-row'>
                <div className='roadmap-phase-card'>
                    <input type="checkbox" />
                    <p>Hot Tip 1 - Get Immediately More Video Confident!</p>
                    {isDescriptionVisible ? (
                        <img
                            src={upArrow}
                            alt='Up arrow icon'
                            onClick={() => toggleDescriptionVisibility()}
                            style={{ cursor: 'pointer' }}
                        />
                    ) : (
                        <img
                            src={downArrow}
                            alt='Down arrow icon'
                            onClick={() => toggleDescriptionVisibility()}
                            style={{ cursor: 'pointer' }}
                        />
                    )}
                </div>
                <div className='roadmap-phase-star-count flex-row'>
                    <p>3</p>
                    <img src={starEmpty} alt='Star icon' />
                </div>
            </div>
            {isDescriptionVisible && (
                <div className='activity-description-container'>
                    <div className='activity-description-content'>
                        <h2>Did you know that it takes someone less than a second to decide if you are a confident person?</h2>
                        <p> Mastering video chats is key in today’s job market!
                            In this activity, you'll learn two quick tips to boost your confidence on video calls. Whether it’s
                            for interviews or virtual meetings, feeling comfortable on camera can make a big difference.
                        </p>
                        <h2> Hot Tip #1</h2>
                        <img src={hotTip1} alt='hot-tip-1' />
                    </div>
                </div>
            )}
        </div>
    );
}

export default RoadmapActivity1;