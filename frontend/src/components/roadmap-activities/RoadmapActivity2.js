import React, { useEffect, useState } from 'react';
import axios from 'axios';
import starEmpty from '../../assets/images/star-empty.png';
import star from '../../assets/images/star.png';
import downArrow from '../../assets/images/down-arrow-roadmap.png';
import upArrow from '../../assets/images/up-arrow-roadmap.png';

function RoadmapActivity2({ userId }) {
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
                const response = await axios.get(`https://ec2-34-227-29-26.compute-1.amazonaws.com:5000/roadmapactivity/${userId}/1`);
                if (response.data) {
                    // Handle response
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

    const toggleDescriptionVisibility = () => {
        setIsDescriptionVisible(!isDescriptionVisible);
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                userId: userId,
                roadmapActivityId: 1,
                completed: true,
                answers: answers,
                stars: starCount,
            }; 
            const response = await axios.post(`https://ec2-34-227-29-26.compute-1.amazonaws.com:5000/roadmapactivity/${userId}/1`, payload);
            if (response.status === 200) {
                console.log(response.data.message);
                setCompleted(true);
            }
        } catch (error) {
            console.error('Error saving answers:', error);
        }
    };

    return (
        <div>
            <div className='roadmap-sub-phase flex-row'>
                <div className='roadmap-phase-card'>
                    <input type="checkbox" />
                    <p>Where you’re at</p>
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
                        <h2>Let’s dive into understanding where you’re at at and uncover what might be holding you back. Take a moment to reflect and answer the following questions.
                            The more honest you are, the clearer your path forward will be.</h2>

                        <h2> Describe your current situation: Where are you in your job hunt journey? (1)</h2>
                        <p> Are you just starting, applying but not hearing back, or maybe you’re getting interviews but no offers?
                            <br />
                            Example: "I’ve sent out 20 applications but haven’t received any interviews yet.”
                        </p>
                        <input
                            type="text"
                            name="currentSituation1"
                            value={answers.currentSituation1}
                            onChange={handleInputChange}
                        />

                        <h2> Describe your current situation: Where are you in your job hunt journey? (2) </h2>
                        <p>Are you following up with people about these jobs, but not hearing back?
                            <br />
                            Example: "I’ve sent some emails, but not for every job, and only to a few people.”</p>
                        <input
                            type="text"
                            name="currentSituation2"
                            value={answers.currentSituation2}
                            onChange={handleInputChange}
                        />

                        <h2>What do you think is holding you back or why is this happening? </h2>
                        <p>Reflect on any obstacles, like lack of experience, unclear goals, or feeling unsure about how to market yourself.
                            <br />
                            Example: "I think my resume doesn’t reflect my strengths well, and I’m not sure how to improve it.”</p>
                        <input
                            type="text"
                            name="obstacles"
                            value={answers.obstacles}
                            onChange={handleInputChange}
                        />

                        <h1> On a scale from 1-10, how confident do you feel about the following? </h1>

                        <h2> Messaging someone you do not know on LinkedIn that you found through a job listing. </h2>
                        <p> Example: "I’d say a 5. I feel nervous about reaching out because I don’t know what to say.”</p>
                        <input
                            type="text"
                            name="confidenceLinkedIn"
                            value={answers.confidenceLinkedIn}
                            onChange={handleInputChange}
                        />

                        <h2>Messaging someone at a company you would like to work for, that has no affiliation with a job posting. </h2>
                        <p> Example: "I’d say a 5. I feel nervous about reaching out because I don’t know what to say.”</p>
                        <input
                            type="text"
                            name="confidenceMessaging"
                            value={answers.confidenceMessaging}
                            onChange={handleInputChange}
                        />

                        <h2>Going to a neworking event alone and chatting with new people (1-10)</h2>
                        <p>How confident do you feel in putting yourself out there IRL?</p>
                        <input
                            type="text"
                            name="confidenceNetworking"
                            value={answers.confidenceNetworking}
                            onChange={handleInputChange}
                        />

                        <h2>Behavioural interviews (1-10)</h2>
                        <p>How confident do you feel in handling behavioral interview questions (like "Tell me about a time when…")?
                            <br />
                            Example: "Probably a 4. I struggle to come up with examples quickly in interviews.”</p>
                        <input
                            type="text"
                            name="confidenceBehavioral"
                            value={answers.confidenceBehavioral}
                            onChange={handleInputChange}
                        />

                        <br />
                        <button onClick={handleSubmit}>Save Answers</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RoadmapActivity2;