import React, { useEffect, useState } from 'react';
import axios from 'axios';
import starEmpty from '../../assets/images/star-empty.png';
import star from '../../assets/images/star.png';
import downArrow from '../../assets/images/down-arrow-roadmap.png';
import upArrow from '../../assets/images/up-arrow-roadmap.png';

function RoadmapActivity5({ userId }) {
    const activityId = 5;
    const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [starCount, setStarCount] = useState(3);
    const [answers, setAnswers] = useState({
        lifestyle: '',
        salary: '',
        learning: '',
        oneYearProfesional: '',
        oneYearLearning: '',
        fiveYearProfessional: '',
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
                    <p>What does success mean to you? 🌟</p>
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
                        <h1>🌟</h1>
                        <h2>Success is personal, and defining it for yourself is crucial. 
                            This questionnaire helps you clarify your unique vision and goals, 
                            setting a clear path forward.</h2> 

                        <h2>Neglecting this crucial step can lead to confusion and lack of direction, 
                            making it easy to get "lost in the sauce"!</h2>

                        <h2>Reflect on what success means to you, so you can pursue it with focus and intention.</h2>


                        <h3>General </h3>
                        <p>1. What’s the ideal lifestyle?</p>
                        <p>Where do you live? Who do you surround yourself with? When do you come home? 
                            What type of projects are you working on at work and in your free time? What do you do over 
                            the weekends and on vacation?</p>
                        <input
                            type="text"
                            name="lifestyle"
                            value={answers.lifestyle}
                            onChange={handleInputChange}
                        />

                        <br />

                        <p>2. How much do I want to make?</p>
                        <p>What’s your target salary? We will explore compensation further in the later sections. </p>
                        <input
                            type="text"
                            name="salary"
                            value={answers.salary}
                            onChange={handleInputChange}
                        />

                        <br />

                        <p>3. What do you want to learn?</p>
                        <p>What skills, industries, and activities do you want to learn more about?</p>

                        <input
                            type="text"
                            name="learning"
                            value={answers.learning}
                            onChange={handleInputChange}
                        />

                        <br />

                        <h3> Goals
                        </h3>

                        <p>1. Looking back 1 year from now, what do you want to have accomplished professionally?</p>
                        
                        <input
                            type="text"
                            name="oneYearProfessional"
                            value={answers.oneYearProfessional}
                            onChange={handleInputChange}
                        />

                        <br />

                        <p>2. Looking back 1 year from now, what is one thing you would like to have learned?</p>

                        <input
                            type="text"
                            name="oneYearLearning"
                            value={answers.oneYearLearning}
                            onChange={handleInputChange}
                        />

                        <br />

                        <p>3. Looking back 5 years from now, what do you want to have accomplished professionally?</p>

                        <input
                            type="text"
                            name="fiveYearProfessional"
                            value={answers.fiveYearProfessional}
                            onChange={handleInputChange}
                        />

                        <br />
                       
                        <br />
                        <button onClick={handleSubmit}>Save Answers</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RoadmapActivity5;