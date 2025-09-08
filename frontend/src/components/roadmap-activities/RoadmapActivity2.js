import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apiUrl } from '../../utils/api';
import starEmpty from '../../assets/images/star-empty.png';
import star from '../../assets/images/star.png';
import downArrow from '../../assets/images/down-arrow-roadmap.png';
import upArrow from '../../assets/images/up-arrow-roadmap.png';

function RoadmapActivity2({ userId }) {
    const activityId = 2;
    const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [starCount, setStarCount] = useState(5);
    const [answers, setAnswers] = useState({
        currentSituation1: '',
        currentSituation2: '',
        obstacles: '',
        confidenceLinkedIn: '',
        confidenceMessaging: '',
        confidenceNetworking: '',
        confidenceBehavioral: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [name]: value,
        }));
    };

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

    const toggleDescriptionVisibility = () => {
        setIsDescriptionVisible(!isDescriptionVisible);
    };

    const handleSubmit = async (completed) => {
        try {
            const payload = {
                userId: userId,
                roadmapActivityId: 1,
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

    return (
        <div>
            <div className='roadmap-sub-phase flex-row'>
                <div className='roadmap-phase-card'>
                    <input 
                        type='checkbox' 
                        checked={completed}
                    />
                    <p>Where you’re at 📍</p>
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
                            <div className='activity-emoji'>📍</div>
                            <p>Let’s dive into understanding where you’re at at and uncover what might be holding you back. Take a moment to reflect and answer the following questions.
                                The more honest you are, the clearer your path forward will be.</p>
                        </div>

                        <div className='activity-box'>
                            <h3> Describe your current situation: Where are you in your job hunt journey? (1)</h3>
                            <p> Are you just starting, applying but not hearing back, or maybe you’re getting interviews but no offers?
                                <br />
                                Example: 'I’ve sent out 20 applications but haven’t received any interviews yet.”
                            </p>
                            <input
                                type='text'
                                name='currentSituation1'
                                placeholder='Add yours here'
                                value={answers.currentSituation1}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className='activity-box'>
                            <h3> Describe your current situation: Where are you in your job hunt journey? (2) </h3>
                            <p>Are you following up with people about these jobs, but not hearing back?
                                <br />
                                Example: 'I’ve sent some emails, but not for every job, and only to a few people.”</p>
                            <input
                                type='text'
                                name='currentSituation2'
                                placeholder='Add yours here'
                                value={answers.currentSituation2}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className='activity-box'>
                            <h3>What do you think is holding you back or why is this happening? </h3>
                            <p>Reflect on any obstacles, like lack of experience, unclear goals, or feeling unsure about how to market yourself.
                                <br />
                                Example: 'I think my resume doesn’t reflect my strengths well, and I’m not sure how to improve it.”</p>
                            <input
                                type='text'
                                name='obstacles'
                                placeholder='Add yours here'
                                value={answers.obstacles}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* <h1> On a scale from 1-10, how confident do you feel about the following? </h1> */}

                        <div className='activity-box'>
                            <h3> Messaging someone you do not know on LinkedIn that you found through a job listing. </h3>
                            <p> Example: 'I’d say a 5. I feel nervous about reaching out because I don’t know what to say.”</p>
                            <input
                                type='text'
                                name='confidenceLinkedIn'
                                placeholder='Add yours here'
                                value={answers.confidenceLinkedIn}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className='activity-box'>
                            <h3>Messaging someone at a company you would like to work for, that has no affiliation with a job posting. </h3>
                            <p> Example: 'I’d say a 5. I feel nervous about reaching out because I don’t know what to say.”</p>
                            <input
                                type='text'
                                name='confidenceMessaging'
                                placeholder='Add yours here'
                                value={answers.confidenceMessaging}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className='activity-box'>
                            <h3>Going to a neworking event alone and chatting with new people (1-10)</h3>
                            <p>How confident do you feel in putting yourself out there IRL?</p>
                            <input
                                type='text'
                                name='confidenceNetworking'
                                placeholder='Add yours here'
                                value={answers.confidenceNetworking}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className='activity-box'>
                            <h3>Behavioural interviews (1-10)</h3>
                            <p>How confident do you feel in handling behavioral interview questions (like 'Tell me about a time when…')?
                                <br />
                                Example: 'Probably a 4. I struggle to come up with examples quickly in interviews.”</p>
                            <input
                                type='text'
                                name='confidenceBehavioral'
                                placeholder='Add yours here'
                                value={answers.confidenceBehavioral}
                                onChange={handleInputChange}
                            />
                        </div>

                        <br />
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

export default RoadmapActivity2;
