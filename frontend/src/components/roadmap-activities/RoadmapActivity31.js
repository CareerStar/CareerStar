import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { apiUrl } from '../../utils/api';
import starEmpty from '../../assets/images/star-empty.png';
import star from '../../assets/images/star.png';
import downArrow from '../../assets/images/down-arrow-roadmap.png';
import upArrow from '../../assets/images/up-arrow-roadmap.png';

function RoadmapActivity31({ userId }) {
    const activityId = 31;
    const [completed, setCompleted] = useState(false);
    const [starCount, setStarCount] = useState(3);
    const [answers, setAnswers] = useState({
        interviewerName: '',
        linkedInURL: '',
        talkingPoint1: '',
        talkingPoint2: '',
    });
    const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(apiUrl(`/roadmapactivity/${userId}/${activityId}`));
                if (response.data) {
                    setAnswers(response.data[0]);
                    setCompleted(response.data[1]);
                }
            } catch (error) {
                console.error('Activity not completed', error);
            }
        };
        if (userId) {
            fetchUserDetails();
        }
    }, [userId]);

    const handleSubmit = async (completed) => {
        try {
            const payload = {
                userId: userId,
                roadmapActivityId: 31,
                completed: completed,
                answers: answers,
                stars: starCount,
            };
            const response = await axios.post(apiUrl(`/roadmapactivity/${userId}/${activityId}`), payload);
            if (response.status === 200) {
                if (completed) {
                    setCompleted(true);
                }
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
                    <p>Get to Know Your Interviewer 😏</p>
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
                            <div className='activity-emoji'>🚀</div>
                            <div className='flex-col'>
                                <h2>Get to Know Your Interviewer - Ahead of Time</h2>
                                <p>Researching your interviewer before a job interview can give you a significant advantage It helps you establish rapport, find common ground, and tailor your responses to their background and interests.</p>
                            </div>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>In this activity we will:</h2>
                            <ul>
                                <li>Identify Interviewers</li>
                                <li>Research the interviewer(s) on LinkedIn</li>
                                <li>Identify Common Ground</li>
                                <li>Practice Talking Points</li>
                            </ul>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>Activity Steps:</h2>
                            <h2>1️⃣ Identify Your Interviewer</h2>
                            <ul>
                                <li>Check the email/meeting invite! 💌</li>
                                <li>If the interviewer isn't mentioned in the posting, you can politely ask the HR contact for this information, or check the calendar invite!</li>
                            </ul>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>2️⃣ Research Your Interviewer on LinkedIn:</h2>
                            <ul>
                                <li>Current and past positions - especially how long they have worked at current role and for which departments</li>
                                <li>Articles/posts they have shared</li>
                                <li>Professional associations, groups, volunteering</li>
                            </ul>
                            <p>Be sure to look for any mutual connections you might have!</p>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>3️⃣ Look For Common Ground</h2>
                            <p>Identify any shared experiences, interests, or connections you have with the interviewer. This could include:</p>
                            <ul>
                                <li>Alma mater</li>
                                <li>Previous employers</li>
                                <li>Professional associations</li>
                                <li>Volunteer work</li>
                                <li>Shared connections</li>
                            </ul>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>4️⃣ Prepare Talking Points</h2>
                            <ul>
                                <li>Based on your research, prepare 2-3 talking points or questions that demonstrate your interest and knowledge.</li>
                            </ul>
                        </div>
                        <div className='activity-box flex-row'>
                            <h3>🔥 Hot Tip! Practice saying these talking points aloud, and practice transitioning them in different orders! This will make it seem much more natural on the call!</h3>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>Your Turn!</h2>
                            <p>❓ Interviewer Name</p>
                            <input
                                type="text"
                                name="interviewerName"
                                value={answers.interviewerName}
                                placeholder='Paste the link here'
                                onChange={(e) => setAnswers({ ...answers, interviewerName: e.target.value })}
                            />
                        </div>
                        <div className='activity-box flex-col'>
                            <p>💿 LinkedIn profile URL:</p>
                            <input
                                type="text"
                                name="linkedInURL"
                                value={answers.linkedInURL}
                                placeholder='Type first certification here'
                                onChange={(e) => setAnswers({ ...answers, linkedInURL: e.target.value })}
                            />
                        </div>
                        <div className='activity-box flex-col'>
                            <p>1️⃣ Talking Point 1:</p>
                            <input
                                type="text"
                                name="talkingPoint1"
                                value={answers.talkingPoint1}
                                placeholder='Type second certification here'
                                onChange={(e) => setAnswers({ ...answers, talkingPoint1: e.target.value })}
                            />
                        </div>
                        <div className='activity-box flex-col'>
                            <p>2️⃣ Talking Point 2:</p>
                            <input
                                type="text"
                                name="talkingPoint2"
                                value={answers.talkingPoint2}
                                placeholder='Type your timeline here'
                                onChange={(e) => setAnswers({ ...answers, talkingPoint2: e.target.value })}
                            />
                        </div>
                        <div className='activity-buttons'>
                            <div className='activity-button-draft' onClick={() => handleSubmit(false)}>Save as Draft</div>
                            <div className='activity-button-save' onClick={() => handleSubmit(true)}>Mark as completed!</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RoadmapActivity31;
