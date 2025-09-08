import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { apiUrl } from '../../utils/api';
import starEmpty from '../../assets/images/star-empty.png';
import star from '../../assets/images/star.png';
import downArrow from '../../assets/images/down-arrow-roadmap.png';
import upArrow from '../../assets/images/up-arrow-roadmap.png';
import activityImage1 from '../../assets/images/roadmap-activity-32-1.png';
import activityImage2 from '../../assets/images/roadmap-activity-32-2.png';
import activityImage3 from '../../assets/images/roadmap-activity-32-3.png';

function RoadmapActivity32({ userId }) {
    const activityId = 32;
    const [completed, setCompleted] = useState(false);
    const [starCount, setStarCount] = useState(10);
    const [answers, setAnswers] = useState({
        answer1: '',
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
                roadmapActivityId: 32,
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
                    <p>Reaching Out to More Than Recruiters 🦩</p>
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
                                <h2>It’s important to reach out to more than recruiters and people that have posted the job! Reaching out to the people you could actually be working with is often be much more effective. </h2>
                            </div>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>Let’s Find Some People to Message! </h2>
                            <ul>
                                <li>How to find people to contact</li>
                                <li>Checklist for companies on LinkedIn</li>
                                <li>Outreach sheet to organize and optimize this process!</li>
                            </ul>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>Process for Finding Contacts:</h2>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>1️⃣ Pull up an active job of interest and look for information about the company division, group or team that you would be working for.</h2>
                            <ul>
                                <li>Hot Tip! Look for things that are in capital letters, they usually signify a specific department or division within a company!</li>
                            </ul>
                            <img src={activityImage1} alt='Activity 1' />
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>2️⃣ Look for information online about this department</h2>
                            <ul>
                                <li>What other division/department does this roll up to? </li>
                                <li>What person is ultimately responsible for this department’s KPIs and Lines of Business? 💯</li>
                                <li>What type of division/department would you be working for?</li>
                            </ul>
                            <img src={activityImage2} alt='Activity 2' />
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>3️⃣ Go to the main company page LinkedIn page. First things first - follow the company! Now you will see company updates and jobs as they are posted on your LinkedIn feed!</h2>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>4️⃣ You are now going to search people based on parameters from the job posting!</h2>
                            <ul>
                                <li>Location - Filter by people that are based in the same city from the job posting 🌎</li>
                                <li>Department Type - See point 2c above! 👔</li>
                            </ul>
                            <img src={activityImage3} alt='Activity 3' />
                        </div>
                        <div className='activity-box'>
                            <h2>5️⃣ Here comes the magic  - Now that you have filtered down the results, look for the team and department that you would be working with among the people results.</h2>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>6️⃣ Click on a person and take note of the following:</h2>
                            <ul>
                                <li>Team Name</li>
                                <li>Time at Company</li>
                                <li>Have they already posted the role you are looking for or a similar role?</li>
                            </ul>
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

export default RoadmapActivity32;
