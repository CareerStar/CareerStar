import React, { useEffect, useState } from 'react';
import axios from 'axios';
import starEmpty from '../../assets/images/star-empty.png';
import star from '../../assets/images/star.png';
import downArrow from '../../assets/images/down-arrow-roadmap.png';
import upArrow from '../../assets/images/up-arrow-roadmap.png';

function RoadmapActivity4({ userId }) {
    const activityId = 4;
    const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [starCount, setStarCount] = useState(3);
    const [answers, setAnswers] = useState({
        strength1: '',
        strength2: '',
        strength3: '',
        improvement1: '',
        improvement2: '',
        improvement3: '',
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
                const response = await axios.get(`https://ec2-34-227-29-26.compute-1.amazonaws.com:5000/roadmapactivity/${userId}/${activityId}`);
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

    return (
        <div>
            <div className='roadmap-sub-phase flex-row'>
                <div className='roadmap-phase-card'>
                    <input
                        type="checkbox"
                        checked={completed}
                    />
                    <p>My Top Strengths & Weaknesses🤔</p>
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
                        <h1>🤔</h1>
                        <h2>Identify your strengths and recognize areas for growth.
                            Understanding both will empower you to leverage your abilities and address challenges
                            as you pursue your ideal career path.
                        </h2>

                        <h2>Watch the below video for some great tips on how to identify your strongest traits!
                            Don’t worry about your weaknesses for now, we focus on wins around here! 🏆
                        </h2>

                        <iframe width="560" height="315"
                            src="https://www.youtube.com/embed/746-boIy1sI?si=9N87zssI7mdNkgoK"
                            title="YouTube video player"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
                        </iframe>
                        <h3> My Top Strengths
                        </h3>
                        <input
                            type="text"
                            name="strength1"
                            value={answers.strength1}
                            onChange={handleInputChange}
                        />

                        <br />

                        <input
                            type="text"
                            name="strength2"
                            value={answers.strength2}
                            onChange={handleInputChange}
                        />

                        <br />

                        <input
                            type="text"
                            name="strength3"
                            value={answers.strength3}
                            onChange={handleInputChange}
                        />

                        <h3> My Areas for Improvement
                        </h3>
                        <input
                            type="text"
                            name="improvement1"
                            value={answers.improvement1}
                            onChange={handleInputChange}
                        />

                        <br />

                        <input
                            type="text"
                            name="improvement2"
                            value={answers.improvement2}
                            onChange={handleInputChange}
                        />

                        <br />

                        <input
                            type="text"
                            name="improvement3"
                            value={answers.improvement3}
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

export default RoadmapActivity4;