import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import starEmpty from '../../assets/images/star-empty.png';
import star from '../../assets/images/star.png';
import downArrow from '../../assets/images/down-arrow-roadmap.png';
import upArrow from '../../assets/images/up-arrow-roadmap.png';
import rightArrow from '../../assets/images/right-arrow-roadmap.png';

function RoadmapActivity13({ userId }) {
    const navigate = useNavigate();
    const activityId = 13;
    const [completed, setCompleted] = useState(false);
    const [starCount, setStarCount] = useState(3);
    const [answers, setAnswers] = useState({
        volunteerEvent: '',
        coreValue1: '',
        coreValue2: '',
        coreValue3: '',
    });
    const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`https://api.careerstar.co/roadmapactivity/${userId}/${activityId}`);
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
                roadmapActivityId: 13,
                completed: completed,
                answers: answers,
                stars: starCount,
            };
            const response = await axios.post(`https://api.careerstar.co/roadmapactivity/${userId}/${activityId}`, payload);
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
        navigate('/dashboard/activity/13', { state: { prevPage: 'roadmap' } });
        // setIsDescriptionVisible(!isDescriptionVisible);
    };

    return (

        <div>
            <div className='roadmap-sub-phase flex-row'>
                <div className='roadmap-phase-card'>
                    <input
                        type="checkbox"
                        checked={completed}
                    />
                    <p>Your Core Values 🥰</p>
                    {isDescriptionVisible ? (
                        <img
                            src={rightArrow}
                            alt='Up arrow icon'
                            onClick={() => toggleDescriptionVisibility()}
                            style={{ cursor: 'pointer' }}
                        />
                    ) : (
                        <img
                            src={rightArrow}
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
                            <div className='activity-emoji'>🥰</div>
                            <div className='flex-col'>
                                <h2>Defining your core values is crucial for career satisfaction and decision-making. It is also a common interview question! </h2>
                                <p>This activity will help you identify and prioritize your top 3 core values, which will serve as a compass for your career choices and personal growth. 🧭</p>
                            </div>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>In this activity we will:</h2>
                            <ul>
                                <li>Brainstorm personal values</li>
                                <li>Reflect on past experiences</li>
                                <li>Prioritize values</li>
                                <li>Define top 3 core values</li>
                            </ul>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>Activity Steps:</h2>
                            <h2>1️⃣ Brainstorm Personal Values</h2>
                            <ul>
                                <li>List out as many values as you can think of that are important to you</li>
                                <li>Consider areas like work, relationships, personal growth, and lifestyle</li>
                                <li>Examples: integrity, creativity, family, adventure, learning, etc.</li>
                            </ul>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>2️⃣ Reflect on Past Experiences</h2>
                            <ul>
                                <li>Think about times when you felt most fulfilled or proud</li>
                                <li>Identify the values that were present in those moments</li>
                            </ul>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>3️⃣ Prioritize Your Values</h2>
                            <ul>
                                <li>Review your list and group similar values together</li>
                                <li>Rank the values based on their importance to you</li>
                            </ul>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>4️⃣ Define Your Top 3 Core Values</h2>
                            <ul>
                                <li>Select the three values that resonate most strongly with you</li>
                                <li>Write a brief description of what each value means to you personally</li>
                                <li>Consider how these values align with your career goals and aspirations</li>
                            </ul>
                        </div>
                        <div className='activity-box flex-row'>
                            <h3>🔥 Hot Tip! Your core values may evolve over time. It's a good idea to revisit this exercise periodically to ensure your values still align with your current goals and life stage</h3>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>Your Turn!</h2>
                            <p>Copy the link to your volunteer event here!</p>
                            <input
                                type="text"
                                name="volunteerEvent"
                                value={answers.volunteerEvent}
                                placeholder='Paste the link here'
                                onChange={(e) => setAnswers({ ...answers, volunteerEvent: e.target.value })}
                            />
                        </div>
                        <div className='activity-box flex-col'>
                            <p>Your Core Value 1:</p>
                            <input
                                type="text"
                                name="coreValue1"
                                value={answers.coreValue1}
                                placeholder='Type first certification here'
                                onChange={(e) => setAnswers({ ...answers, coreValue1: e.target.value })}
                            />
                        </div>
                        <div className='activity-box flex-col'>
                            <p>Your Core Value 2:</p>
                            <input
                                type="text"
                                name="coreValue2"
                                value={answers.coreValue2}
                                placeholder='Type second certification here'
                                onChange={(e) => setAnswers({ ...answers, coreValue2: e.target.value })}
                            />
                        </div>
                        <div className='activity-box flex-col'>
                            <p>Your Core Value 3:</p>
                            <input
                                type="text"
                                name="coreValue3"
                                value={answers.coreValue3}
                                placeholder='Type your timeline here'
                                onChange={(e) => setAnswers({ ...answers, coreValue3: e.target.value })}
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

export default RoadmapActivity13;