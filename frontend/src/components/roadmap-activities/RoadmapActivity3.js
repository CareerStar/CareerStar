import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import starEmpty from '../../assets/images/star-empty.png';
import star from '../../assets/images/star.png';
import downArrow from '../../assets/images/down-arrow-roadmap.png';
import upArrow from '../../assets/images/up-arrow-roadmap.png';

function RoadmapActivity3({ userId }) {
    const activityId = 3;
    const [completed, setCompleted] = useState(false);
    const [starCount, setStarCount] = useState(3);
    const [answers, setAnswers] = useState({
        answer1: '', //Answers can not be a null JSON object, it has to have at least one key-value pair
    });
    const [uploadedImage, setUploadedImage] = useState(null);
    const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);

    const handleImageUpload = (e) => {
        setUploadedImage(URL.createObjectURL(e.target.files[0]));
    }

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`https://api.careerstar.co/roadmapactivity/${userId}/${activityId}`);
                if (response.data) {
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
            const response = await axios.post(`https://api.careerstar.co/roadmapactivity/${userId}/${activityId}`, payload);
            if (response.status === 200) {
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
                    <p>Take the Career Test 👀</p>
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
                    <div class='activity-description-content'>
                        <h1>👀</h1>
                        <h2>Let’s dive deeper into understanding what drives you. This is the key to discovering
                            a job that excites you and a career that aligns with your unique personality.</h2>
                        <a href="https://www.careerexplorer.com/career-test/" target="_blank">Click here to take the test</a>

                        <h2>My results</h2>
                        <input type="file" onChange={handleImageUpload} accept="image/*,.pdf" />
                        {uploadedImage && (<img src={uploadedImage} alt='Uploaded' />)}
                        <br />
                        <button onClick={handleSubmit}>Save</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RoadmapActivity3;