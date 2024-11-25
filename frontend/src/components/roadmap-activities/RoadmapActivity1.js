import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import starEmpty from '../../assets/images/star-empty.png';
import star from '../../assets/images/star.png';
import downArrow from '../../assets/images/down-arrow-roadmap.png';
import upArrow from '../../assets/images/up-arrow-roadmap.png';
import hotTip1 from '../../assets/images/roadmap-activities/hot-tip-1.webp';

function RoadmapActivity1({ userId }) {
    const activityId = 1;
    const [completed, setCompleted] = useState(false);
    const [starCount, setStarCount] = useState(3);
    const [answers, setAnswers] = useState({
        answer1: '', //Answers can not be a null JSON object, it has to have at least one key-value pair
    });
    const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`https://ec2-34-227-29-26.compute-1.amazonaws.com:5000/roadmapactivity/${userId}/${activityId}`);
                if (response.data) {
                    console.log("Comes here");
                    setAnswers(response.data);
                    setCompleted(true);
                }
            } catch (error) {
                console.error('Activity not completed', error);
            }
        };
        if (userId) {
            fetchUserDetails();
        }
    }, [userId]);

    const handleSubmit = async () => {
        try {
            const payload = {
                userId: userId,
                roadmapActivityId: 1,
                completed: true,
                answers: answers,
                stars: starCount,
            };
            const response = await axios.post(`https://ec2-34-227-29-26.compute-1.amazonaws.com:5000/roadmapactivity/${userId}/${activityId}`, payload);
            if (response.status === 200) {
                console.log(response.data.message);
                setCompleted(true);
                toggleDescriptionVisibility();
                window.location.reload();
            }
        } catch (error) {
            console.error('Error saving answers:', error);
        }
    };

    const toggleDescriptionVisibility = () => {
        setIsDescriptionVisible(!isDescriptionVisible);
    };

    return (

        <div>
            <div className='roadmap-sub-phase flex-row'>
                <div className='roadmap-phase-card'>
                    <input
                        type="checkbox"
                        checked={completed}
                    />
                    <p>Hot Tip 1 - Get Immediately More Video Confident! 🔥</p>
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
                    <p>{starCount}</p>
                    {completed ? (
                        <img src={star} alt='Star icon' />
                    ) : (
                        <img src={starEmpty} alt='Star icon' />
                    )}
                </div>
            </div>
            {isDescriptionVisible && (
                <div className='activity-description-container'>
                    <div className='activity-description-content'>
                        <div className='activity-box flex-row'>
                            <div className='activity-emoji'>🔥</div>
                            <div className='flex-col'>
                                <h2>Did you know that it takes someone less than a second to decide if you are a confident person?</h2>
                                <p> Mastering video chats is key in today’s job market!
                                    In this activity, you'll learn two quick tips to boost your confidence on video calls. Whether it’s
                                    for interviews or virtual meetings, feeling comfortable on camera can make a big difference.
                                </p>
                            </div>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>Hot Tip #1</h2>
                            <img src={hotTip1} alt='hot-tip-1' />
                        </div>
                        <div className='activity-buttons'>
                            <div className='activity-button-draft'>Save as Draft</div>
                            <div className='activity-button-save' onClick={handleSubmit}>Mark as completed!</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RoadmapActivity1;