import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import starEmpty from '../../assets/images/star-empty.png';
import downArrow from '../../assets/images/down-arrow-roadmap.png';
import upArrow from '../../assets/images/up-arrow-roadmap.png';

function RoadmapActivity2({ userId }) {
    const [uploadedImage, setUploadedImage] = useState(null);
    const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);


    const handleImageUpload = (e) => {
        // const file = event.target.files[0];
        // const reader = new FileReader();
        // reader.onloadend = () => {
        //     setUploadedImage(reader.result);
        // };
        // reader.readAsDataURL(file);
        setUploadedImage(URL.createObjectURL(e.target.files[0]));
    }

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`https://ec2-34-227-29-26.compute-1.amazonaws.com:5000/onboarding/${userId}`);
                const data = await response.json();
                if (response.ok) {
                    // setCurrentSituation(data.currentSituation);
                    // setGoal(data.goal);
                } else {
                    console.error('Error fetching user details:', data);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        }
        if (userId) {
            fetchUserDetails();
        }
    }, [userId]);

    const toggleDescriptionVisibility = () => {
        // setActivities(activities.map(activity =>
        //     activity.id === id
        //         ? { ...activity, isDescriptionVisible: !activity.isDescriptionVisible }
        //         : activity
        // ));
        setIsDescriptionVisible(!isDescriptionVisible);
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
                    <p>5</p>
                    <img src={starEmpty} alt='Star icon' />
                </div>
            </div>
            {isDescriptionVisible && (
                <div className='activity-description-container'>
                    <div class='activity-description-content'>
                        <h2>Let’s dive into understanding where you’re at and uncover what might be holding you back. Take a moment to reflect and answer the following questions.
                            The more honest you are, the clearer your path forward will be.</h2>
                        <h2> Describe your current situation: Where are you in your job hunt journey? (1) </h2>
                        <p> Are you just starting, applying but not hearing back, or maybe you’re getting interviews but no offers?
                            <br />
                            Example: "I’ve sent out 20 applications but haven’t received any interviews yet.”  </p>
                        <input type="text" />

                        <h2> Describe your current situation: Where are you in your job hunt journey? (2) </h2>
                        <p>Are you following up with people about these jobs, but not hearing back?
                            <br />
                            Example: "I’ve sent some emails, but not for every job, and only to a few people.”</p>
                        <input type="text" />

                        <h2>What do you think is holding you back or why is this happening? </h2>
                        <p>Reflect on any obstacles, like lack of experience, unclear goals, or feeling unsure about how to market yourself.
                            <br />
                            Example: "I think my resume doesn’t reflect my strengths well, and I’m not sure how to improve it.”</p>
                        <input type="text" />

                        <h1> On a scale from 1-10, how confident do you feel about the following? </h1>

                        <h2> Messaging someone you do not know on LinkedIn that you found through a job listing. </h2>
                        <p> Example: "I’d say a 5. I feel nervous about reaching out because I don’t know what to say.”</p>
                        <input type="text" />

                        <h2>Messaging someone at a company you would like to work for, that has no affiliation with a job posting. </h2>
                        <p> Example: "I’d say a 5. I feel nervous about reaching out because I don’t know what to say.”</p>
                        <input type="text" />

                        <h2>Going to a neworking event alone and chatting with new people (1-10)</h2>
                        <p>How confident do you feel in putting yourself out there IRL?</p>
                        <input type="text" />

                        <h2>Behavioural interviews (1-10)</h2>
                        <p>How confident do you feel in handling behavioral interview questions (like "Tell me about a time when…")?
                            <br />
                            Example: "Probably a 4. I struggle to come up with examples quickly in interviews.”</p>
                        <input type="text" />
                    </div>
                </div>
            )}
        </div>
    );
}

export default RoadmapActivity2;