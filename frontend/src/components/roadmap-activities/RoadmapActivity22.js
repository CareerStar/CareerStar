import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { apiUrl } from '../../utils/api';
import starEmpty from '../../assets/images/star-empty.png';
import star from '../../assets/images/star.png';
import downArrow from '../../assets/images/down-arrow-roadmap.png';
import upArrow from '../../assets/images/up-arrow-roadmap.png';
import coverImage1 from '../../assets/images/roadmap-activity-22-1.png';
import coverImage2 from '../../assets/images/roadmap-activity-22-2.png';

function RoadmapActivity22({ userId }) {
    const activityId = 22;
    const [completed, setCompleted] = useState(false);
    const [starCount, setStarCount] = useState(5);
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
                roadmapActivityId: 22,
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
                    <p>Crafting Your Cover Photo 🎨</p>
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
                            <div className='activity-emoji'>📸</div>
                            <div className='flex-col'>
                                <h2>This is also an opportunity to share something you're passionate about or use your cover photo as real estate to sell yourself. </h2>
                                <p>Design an eye-catching LinkedIn cover photo that showcases your personality and professional goals! Your cover photo creates a great opportunity to share more about you as a human being and as a professional.</p>
                            </div>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>1️⃣ Select a photo of you sharing your passions. This could include:</h2>
                            <ul>
                                <li>Presenting/speaking at an industry event</li>
                                <li>Doing volunteer work</li>
                                <li>Taking part in a (professionally-kosher) hobby like marathon running, painting, hiking, teaching, etc.</li>
                                <li>Spending time with your family (everyone loves a person dedicated to their family)</li>
                                <li>Traveling</li>
                            </ul>
                            <p>If you want to use the space to sell yourself, you're going to be including some graphic elements so you want to make sure the design is on point.</p>
                        </div>
                        <div className='activity-box flex-row'>
                            <div className='activity-emoji'>📸</div>
                            <h3>Hot Tip! You can use Canva, Figma, PowerPoint, etc.  to include graphic elements in the background of photos to sell ourself. Most  have awesome pre-made templates you can edit for free</h3>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>2️⃣ Once you've settled on your template, you need to decide what you want to push in your cover photo. I recommend featuring:</h2>
                            <ul>
                                <li>Your elevator pitch and goals in two lines or less</li>
                                <li>A link to your personal website, if you have one</li>
                                <li>Links to your portfolio, projects you've worked on, or your resume</li>
                            </ul>
                            <p>If you want to take things to the next level, find a way to combine awesome design from Canva with one of the passion images I mentioned above!</p>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>Create a Skill List:</h2>
                            <ul>
                                <li>As you review the job postings, create a list of at least 10 skills that match your current abilities and the desired roles</li>
                                <li>Focus on both hard skills (technical abilities) and soft skills (interpersonal qualities)</li>
                            </ul>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>3️⃣ Check dimensions - when you're uploading your cover photo, you need to make sure it meets LinkedIn's criteria so it doesn't get rejected.</h2>
                            <p>📸Here are LinkedIn's cover photo guidelines:</p>
                            <ul>
                                <li>The recommended cover photo size is 1584 x 396</li>
                                <li>The maximum cover photo file size is 8 mb</li>
                                <li>LinkedIn accepts PNG, JPG, and GIF file types for cover photos</li>
                            </ul>
                        </div>
                        <div className='activity-box flex-row'>
                            <div className='activity-emoji'>🔥</div>
                            <div className='flex-col'>
                                <h2>Hot Tip! You need to consider Device Type when choosing your photo! 📱 ❌💻 ❌ ⌚</h2>
                                <p>When someone is viewing your LinkedIn profile on desktop, your profile picture appears on the lefthand side and will be laid over that part of your cover photo!</p>
                            </div>
                        </div>
                        <div className='activity-box'>
                            <h3>Cover Photo Samples:</h3>
                            <img src={coverImage1} alt='Cover photo sample 1' />
                            <br/>
                            <img src={coverImage2} alt='Cover photo sample 2' />
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>Your Turn!</h2>
                            <p>📸 Please show us your new LinkedIn cover photo uploaded to your profile</p>
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

export default RoadmapActivity22;
