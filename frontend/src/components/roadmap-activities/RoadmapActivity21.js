import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import starEmpty from '../../assets/images/star-empty.png';
import star from '../../assets/images/star.png';
import downArrow from '../../assets/images/down-arrow-roadmap.png';
import upArrow from '../../assets/images/up-arrow-roadmap.png';

function RoadmapActivity21({ userId }) {
    const activityId = 21;
    const [completed, setCompleted] = useState(false);
    const [starCount, setStarCount] = useState(3);
    const [answers, setAnswers] = useState({
        answer1: '',
    });
    const [uploadedImage, setUploadedImage] = useState(null);
    const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);

    const handleImageUpload = (e) => {
        setUploadedImage(URL.createObjectURL(e.target.files[0]));
    }

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
                roadmapActivityId: 21,
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
                    <p>Leverage the Skills Section to Add Credibility 🏛️</p>
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
                            <div className='activity-emoji'>🏛️</div>
                            <div className='flex-col'>
                                <h2>Optimize Your LinkedIn Skills Section </h2>
                                <p>Adding relevant skills to your LinkedIn profile can significantly increase your visibility to recruiters and potential employers. The Skill Section improves your searchability and adds credibility to your professional persona.</p>
                            </div>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>In this activity we will:</h2>
                            <ul>
                                <li>Create an ideal skills list based on target jobs</li>
                                <li>Update LinkedIn profile</li>
                                <li>Get valuable endorsements</li>
                            </ul>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>Identify Target Jobs:</h2>
                            <ul>
                                <li>Pull up 5 top jobs you would love to apply to</li>
                                <li>Review the job descriptions and requirements carefully</li>
                            </ul>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>Create a Skill List:</h2>
                            <ul>
                                <li>As you review the job postings, create a list of at least 10 skills that match your current abilities and the desired roles</li>
                                <li>Focus on both hard skills (technical abilities) and soft skills (interpersonal qualities)</li>
                            </ul>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>Update Your LinkedIn Profile:</h2>
                            <ul>
                                <li>Add the identified skills to your LinkedIn profile's Skills section</li>
                                <li>Aim to add as many relevant skills as possible (LinkedIn allows up to 50)</li>
                            </ul>
                        </div>
                        <div className='activity-box flex-row'>
                            <h3>🏆 Challenge Time! Let’s pay it forward and endorse 1 colleague TODAY for 4-5 skills on their Linkedn profile. 💖</h3>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>Get Endorsements:</h2>
                            <ul>
                                <li>Reciprocity is a strong psychological principle. If you go out there and endorse other people for their skills, you ar very likely to get one in return!</li>
                                <li>Start with current and former colleagues, then move to friends if necessary.</li>
                                <li>Go to the person’s profile, and endorse the person first! 1️⃣ </li>
                            </ul>
                        </div>
                        <div className='activity-box flex-col'>
                            <h3>When you're done endorsing, send them a note that says something like this:</h3>
                            <p> Post-Endorsement Message
                                <br />
                                <br />
                                Hey [Name],
                                <br />
                                <br />
                                Hope you're doing well! I just wanted to recognize you for some of the great work we've done together. I just endorsed you for some skills on LinkedIn. If there's anything else I can do to help, please let me know.
                                <br />
                                <br />
                                Best,
                                <br />
                                <br />
                                Clara
                            </p>
                            <p>Note that I didn't ask them to endorse my skills in that note. That kind of ruins the magic. 🔮💫  If you do this enough, plenty of people will take the hint and return the favor.</p>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>Did you know?</h2>
                            <p>Profiles with 5+ skills receive 17x more profile views</p>
                            <p>People with 5+ relevant skills get 31x more messages from recruiters</p>
                        </div>
                        <div className='activity-box flex-col'>
                            <h3>Remember: The Skills section is one of the most impactful parts of your LinkedIn profile. It improves your searchability and adds credibility to your professional persona.</h3>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>Your Turn!</h2>
                            <p>Complete this activity and share your results here:</p>
                            <input type="file" onChange={handleImageUpload} accept="image/*,.pdf" />
                            {uploadedImage && (<img src={uploadedImage} alt='Uploaded' />)}
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

export default RoadmapActivity21;