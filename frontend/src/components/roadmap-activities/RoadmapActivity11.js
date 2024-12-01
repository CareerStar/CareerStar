import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import starEmpty from '../../assets/images/star-empty.png';
import star from '../../assets/images/star.png';
import downArrow from '../../assets/images/down-arrow-roadmap.png';
import upArrow from '../../assets/images/up-arrow-roadmap.png';

function RoadmapActivity11({ userId }) {
    const activityId = 11;
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
                roadmapActivityId: 11,
                completed: completed,
                answers: answers,
                stars: starCount,
            };
            const response = await axios.post(`https://ec2-34-227-29-26.compute-1.amazonaws.com:5000/roadmapactivity/${userId}/${activityId}`, payload);
            if (response.status === 200) {
                console.log(response.data.message);
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
                    <p>Let’s Give Back! 🤝</p>
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
                            <div className='activity-emoji'>🌟</div>
                            <div className='flex-col'>
                                <h2>Volunteering is a great way to give back to your community, gain valuable experience, and potentially enhance your career prospects. </h2>
                                <p>According to a 2016 Deloitte survey, 82% of hiring managers prefer applicants with volunteer experience? Volunteering not only helps others but can also boost your career prospects!</p>
                            </div>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>This activity will:</h2>
                            <ul>
                                <li>Guide you through the process of identifying suitable organizations</li>
                                <li>Provide tips on how to get better involved</li>
                                <li>Help you create your own personal pledge</li>
                            </ul>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>🎭 Let’s Do Some Volunteer Role Playing</h2>
                            <p>Imagine you are creating a role for yourself, without financial limits. What dream job titles speak to you? Some inspiration below!</p>
                            <ul>
                                <li>Animal Care Specialist at the local shelter</li>
                                <li>Environmental Conservation Coordinator at the community garden</li>
                                <li>📚 Information Services Assistant at the library</li>
                                <li>Curatorial Associate at the museum 🎨 </li>
                                <li>Youth Athletics Program Coordinator at the sports league 🏋️‍♀️ </li>
                            </ul>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>💁🏽 Getting Involved - Good Places to Look </h2>
                            <ul>
                                <li>Scout your neighborhood for volunteer opportunities</li>
                                <li>Browse volunteer matchmaking websites</li>
                                <li>Reach out to local charities on social media 📱 </li>
                                <li>🗣️ Ask your friends—they might know the perfect gig</li>
                                <li>Look for opportunities at or posted by your College or University 🏫 </li>
                            </ul>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>✅ Tips for Selecting Opportunities</h2>
                            <ul>
                                <li>Define YOUR areas of interest and passion 💗</li>
                                <li>Don’t be too picky - it’s fun and rewarding once you are there!</li>
                                <li>List your skills and how they can be applied to volunteering - this helps when you reach out to someone at the organization too! Be specific!</li>
                                <li>Set clear goals for what you want to achieve through volunteering - to yourself and to the organization 🥅</li>
                            </ul>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>Your Turn!</h2>
                            <p>Copy the link to your volunteer event here!</p>
                            <input
                                type="text"
                                name="answer1"
                                value={answers.answer1}
                                placeholder='Paste the link here'
                                onChange={(e) => setAnswers({ ...answers, answer1: e.target.value })}
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

export default RoadmapActivity11;