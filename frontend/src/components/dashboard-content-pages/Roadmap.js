import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import editIcon from '../../assets/images/edit-icon.png';
import starEmpty from '../../assets/images/star-empty.png';
import downArrow from '../../assets/images/down-arrow-roadmap.png';
import upArrow from '../../assets/images/up-arrow-roadmap.png';
import hotTip1 from '../../assets/images/roadmap-activities/hot-tip-1.webp';

function Roadmap({ userId }) {
    const [currentSituation, setCurrentSituation] = useState('I’m a recent grad');
    const [goal, setGoal] = useState('To get my first full-time role as a software engineer');
    const [isEditingCurrentSituation, setIsEditingCurrentSituation] = useState(false);
    const [isEditingGoal, setIsEditingGoal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);
    const inputGoalRef = useRef(null);
    const inputSituationRef = useRef(null);


    const handleImageUpload = (e) => {
        // const file = event.target.files[0];
        // const reader = new FileReader();
        // reader.onloadend = () => {
        //     setUploadedImage(reader.result);
        // };
        // reader.readAsDataURL(file);
        setUploadedImage(URL.createObjectURL(e.target.files[0]));
    }

    const descriptionContent = (
        <div class='activity-description-content'>
            <h2>Let’s dive deeper into understanding what drives you. This is the key to discovering
                a job that excites you and a career that aligns with your unique personality.</h2>
            <a href="https://www.careerexplorer.com/career-test/" target="_blank">Click here to take the test</a>

            <h2>My results</h2>
            <input type="file" onChange={handleImageUpload} />
            <img src={uploadedImage} />
        </div>);

    const [activities, setActivities] = useState([
        {
            id: 1,
            title: 'Hot Tip 1 - Get Immediately More Video Confident!',
            description:
                `<div class='activity-description-content'>
                <h2>Did you know that it takes someone less than a second to decide if you are a confident person?</h2>
                <p> Mastering video chats is key in today’s job market! 
                    In this activity, you'll learn two quick tips to boost your confidence on video calls. Whether it’s 
                    for interviews or virtual meetings, feeling comfortable on camera can make a big difference. 
                </p>
                <h2> Hot Tip #1</h2>
                <img src=${hotTip1} alt='hot-tip-1' />
            </div>`,
            stars: 3,
            isDescriptionVisible: false,
        },
        {
            id: 2,
            title: 'Where you’re at',
            description: `<div class='activity-description-content'>
                <h2>Let’s dive into understanding where you’re at and uncover what might be holding you back. Take a moment to reflect and answer the following questions. 
                The more honest you are, the clearer your path forward will be.</h2>
                <h2> Describe your current situation: Where are you in your job hunt journey? (1) </h2>
                <p> Are you just starting, applying but not hearing back, or maybe you’re getting interviews but no offers?
                <br/>
                Example: "I’ve sent out 20 applications but haven’t received any interviews yet.”  </p>
                <input type="text" />

                <h2> Describe your current situation: Where are you in your job hunt journey? (2) </h2>
                <p>Are you following up with people about these jobs, but not hearing back?
                <br/>
                Example: "I’ve sent some emails, but not for every job, and only to a few people.”</p>
                <input type="text" />

                <h2>What do you think is holding you back or why is this happening? </h2>
                <p>Reflect on any obstacles, like lack of experience, unclear goals, or feeling unsure about how to market yourself. 
                <br/>
                Example: "I think my resume doesn’t reflect my strengths well, and I’m not sure how to improve it.”</p>
                <input type="text" />

                <h1> On a scale from 1-10, how confident do you feel about the following? </h1>

                <h2> Messaging someone you do not know on LinkedIn that you found through a job listing. </h2>
                <p> Example: "I’d say a 5. I feel nervous about reaching out because I don’t know what to say.”</p>
                <input type="text" />

                <h2>Messaging someone at a company you would like to work for, that has no affiliation with a job posting. </h2>
                <pExample: "I’d say a 5. I feel nervous about reaching out because I don’t know what to say.”</p>
                <input type="text" />

                <h2>Going to a neworking event alone and chatting with new people (1-10)</h2>
                <p>How confident do you feel in putting yourself out there IRL?</p>
                <input type="text" />

                <h2>Behavioural interviews (1-10)</h2>
                <p>How confident do you feel in handling behavioral interview questions (like "Tell me about a time when…")? 
                <br/>
                Example: "Probably a 4. I struggle to come up with examples quickly in interviews.”</p>
                <input type="text" />
                `,
            stars: 5,
            isDescriptionVisible: false,
        }, {
            id: 3,
            title: 'Take the Career Test',
            description: `
                <div class='activity-description-content'>
                    <h2>Let’s dive deeper into understanding what drives you. This is the key to discovering 
                    a job that excites you and a career that aligns with your unique personality.</h2>
                    <a href="https://www.careerexplorer.com/career-test/" target="_blank">Click here to take the test</a>

                    <h2>My results</h2>
                    <input type="file" onChange={handleImageUpload} />
                </div>
            `,
            stars: 3,
            isDescriptionVisible: false,
        }
    ]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            setLoading(true);
            try {
                const response = await fetch(`https://ec2-34-227-29-26.compute-1.amazonaws.com:5000/onboarding/${userId}`);
                const data = await response.json();
                if (response.ok) {
                    setCurrentSituation(data.currentSituation);
                    setGoal(data.goal);
                } else {
                    console.error('Error fetching user details:', data);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            } finally {
                setLoading(false);
            }
        }
        if (userId) {
            fetchUserDetails();
        }
    }, [userId]);

    const saveUserDetails = async () => {
        setLoading(true);
        try {
            const response = await fetch(`https://ec2-34-227-29-26.compute-1.amazonaws.com:5000/update_onboarding/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "currentSituation": currentSituation,
                    "goal": goal
                }),
            });

            if (response.ok) {
                console.log('User details updated successfully');
            } else {
                console.error('Error updating user details');
            }
        } catch (error) {
            console.error('Error updating user details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCurrentSituationEdit = () => {
        setIsEditingCurrentSituation(true);
        setTimeout(() => {
            if (inputSituationRef.current) {
                inputSituationRef.current.focus();
                inputSituationRef.current.setSelectionRange(currentSituation.length, currentSituation.length);
            }
        }, 0);
    };

    const handleGoalEdit = () => {
        setIsEditingGoal(true);
        setTimeout(() => {
            if (inputGoalRef.current) {
                inputGoalRef.current.focus();
                inputGoalRef.current.setSelectionRange(goal.length, goal.length);
            }
        }, 0);
    };

    const handleSaveCurrentSituation = () => {
        setIsEditingCurrentSituation(false);
        saveUserDetails();
    };

    const handleSaveGoal = () => {
        setIsEditingGoal(false);
        saveUserDetails();
    };

    const handleKeyPress = (event, saveFunction) => {
        if (event.key === 'Enter') {
            saveFunction();
        }
    };

    const toggleDescriptionVisibility = (id) => {
        setActivities(activities.map(activity =>
            activity.id === id
                ? { ...activity, isDescriptionVisible: !activity.isDescriptionVisible }
                : activity
        ));
    };

    return (
        <div className='roadmap-container'>
            {loading && (
                <div className="spinner-overlay">
                    <div className="spinner"></div>
                </div>
            )}
            <p className='roadmap-title'>My Roadmap</p>
            <div className='roadmap-goals-container flex-row'>
                <div className='roadmap-goal-card flex-column'>
                    <img src={editIcon} alt='Edit icon' onClick={handleCurrentSituationEdit} />
                    <p className='roadmap-goal-card-heading'>Where you’re at</p>
                    {isEditingCurrentSituation ? (
                        <div>
                            <input
                                ref={inputSituationRef}
                                className='roadmap-goal-card-input'
                                type="text"
                                value={currentSituation}
                                onChange={(e) => setCurrentSituation(e.target.value)}
                                onKeyDown={(event) => handleKeyPress(event, handleSaveCurrentSituation)}
                            />
                            <button onClick={handleSaveCurrentSituation} className='situation-goal-save-button'>Save</button>
                        </div>
                    ) : (
                        <p className='roadmap-goal-card-answer'>{currentSituation}</p>
                    )}
                </div>
                <div className='roadmap-goal-card flex-column'>
                    <img src={editIcon} alt='Edit icon' onClick={handleGoalEdit} />
                    <p className='roadmap-goal-card-heading'>The goal</p>
                    {isEditingGoal ? (
                        <div>
                            <input
                                ref={inputGoalRef}
                                className='roadmap-goal-card-input'
                                type="text"
                                value={goal}
                                onChange={(e) => setGoal(e.target.value)}
                                onKeyDown={(event) => handleKeyPress(event, handleSaveGoal)}
                            />
                            <button onClick={handleSaveGoal} className='situation-goal-save-button'>Save</button>
                        </div>
                    ) : (
                        <p className='roadmap-goal-card-answer'>{goal}</p>
                    )}
                </div>
            </div>

            <div className='roadmap-phases-container'>
                <div className='roadmap-phase flex-column'>
                    <p className='roadmap-phase-title'>Phase 1: Values & Goals</p>
                    {activities.map(activity => (
                        <div>
                            <div key={activity.id} className='roadmap-sub-phase flex-row'>
                                <div className='roadmap-phase-card'>
                                    <input type="checkbox" />
                                    <p>{activity.title}</p>
                                    {activity.isDescriptionVisible ? (
                                        <img
                                            src={upArrow}
                                            alt='Up arrow icon'
                                            onClick={() => toggleDescriptionVisibility(activity.id)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    ) : (
                                        <img
                                            src={downArrow}
                                            alt='Down arrow icon'
                                            onClick={() => toggleDescriptionVisibility(activity.id)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    )}
                                </div>
                                <div className='roadmap-phase-star-count flex-row'>
                                    <p>{activity.stars}</p>
                                    <img src={starEmpty} alt='Star icon' />
                                </div>
                            </div>
                            {activity.isDescriptionVisible && (
                                // <div>{activity.description}</div>
                                <div
                                    className="activity-description-container"
                                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(activity.description) }}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Roadmap;