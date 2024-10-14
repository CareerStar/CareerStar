import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import starEmpty from '../../assets/images/star-empty.png';
import downArrow from '../../assets/images/down-arrow-roadmap.png';
import upArrow from '../../assets/images/up-arrow-roadmap.png';

function RoadmapActivity3({ userId }) {
    const [uploadedImage, setUploadedImage] = useState(null);
    const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);


    const handleImageUpload = (e) => {
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
                    <p>Take the Career Test</p>
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
                    <p>3</p>
                    <img src={starEmpty} alt='Star icon' />
                </div>
            </div>
            {isDescriptionVisible && (
                <div className='activity-description-container'>
                    <div class='activity-description-content'>
                        <h2>Let’s dive deeper into understanding what drives you. This is the key to discovering
                            a job that excites you and a career that aligns with your unique personality.</h2>
                        <a href="https://www.careerexplorer.com/career-test/" target="_blank">Click here to take the test</a>

                        <h2>My results</h2>
                        <input type="file" onChange={handleImageUpload} accept="image/*,.pdf"/>
                        <img src={uploadedImage} alt='Uploaded'/>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RoadmapActivity3;