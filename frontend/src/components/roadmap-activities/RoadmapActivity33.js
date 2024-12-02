import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import starEmpty from '../../assets/images/star-empty.png';
import star from '../../assets/images/star.png';
import downArrow from '../../assets/images/down-arrow-roadmap.png';
import upArrow from '../../assets/images/up-arrow-roadmap.png';

function RoadmapActivity33({ userId }) {
    const activityId = 33;
    const [completed, setCompleted] = useState(false);
    const [starCount, setStarCount] = useState(3);
    const [answers, setAnswers] = useState({
        thankyouNote: '',
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
                roadmapActivityId: 33,
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
                    <p>Sending a Great Thank You Note - Immediately 💘</p>
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
                            <div className='activity-emoji'>🙏🏽</div>
                            <div className='flex-col'>
                                <h2>An impactful thank you note should never feel generic - it should feel personal and heartfelt! 👋💖</h2>
                            </div>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>Try this structure to improve success: 📝✨</h2>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>1️⃣ Greeting and Expression of Gratitude 🙏</h2>
                            <ul>
                                <li>Address the interviewer(s) by name. </li>
                                <ul>
                                    <li>Start by thanking them for their time and the opportunity to interview. 🕰️</li>
                                </ul>
                            </ul>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>2️⃣ Personalized Detail from the Interview 🗨️</h2>
                            <div className='activity-box flex-row'>
                                <div className='activity-emoji'>💡</div>
                                <h2>Hot Tip:</h2>
                                <p>Write down any fun anecdotes or small personal during your call to use here. It will make the email stand out! 💌 An intriguing question / shared insight / something you enjoyed discussing. 🎯</p>
                            </div>
                            <ul>
                                <li>Use a detail from 🔥 hot tip above in first two sentences of email</li>
                                <li>This reinforces your attentiveness during the interview - it shows you listened </li>
                            </ul>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>3️⃣ Why You're Excited About the Role</h2>
                            <ul>
                                <li>Show enthusiasm for the position - briefly say why you believe you're a good fit 👌 </li>
                                <li>(Don't overdo it, just jog the interviewer's memory) 🧠</li>
                            </ul>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>4️⃣ Additional Value You Bring 💼</h2>
                            <ul>
                                <li>Address any last points you may have missed or to leave an additional positive impression. </li>
                                <li>It's not unusual to forget something or not be able to find an opening to make a point </li>
                            </ul>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>5️⃣ Imply Next Steps - Important!  💼</h2>
                            <ul>
                                <li>End with asking what the next steps are, and say that you are happy to accommodate any and all next actions on their time schedule. ⏰</li>
                                <ul>
                                    <li>Say ‘My interest and dedication to this company goes far beyond this role specifically, I would love to keep in touch.  🚀</li>
                                </ul>
                            </ul>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>✍🏽 Here is an Example Template to Use!</h2>
                            <p>Dear [Interviewer's Name],
                                <br />
                                <br />
                                Thank you so much for the opportunity to interview for the [Job Title] position at [Company Name]. I really enjoyed our conversation around [specific topic discussed]. Learning about [mention specific detail] showed me again how much I’d love to work with you and the team.
                                <br />
                                <br />
                                I’m confident that my experience with [relevant skill or experience] is a great fit not only for the needs of the team but ultimately the company goals.  I feel like our work ethic is really aligned and I’m genuinely excited about the possibility of being part of [team/company/project].
                                <br />
                                <br />
                                Thank you again for your time and consideration. I look forward to our next conversation..
                            </p>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>Your Turn! - Show us what you’ve got! 👌</h2>
                            <p>👇 Paste a thank you note you used with a recent interviewer. We want to help!</p>
                            <input
                                type="text"
                                name="thankyouNote"
                                value={answers.thankyouNote}
                                placeholder='Paste your thank you note here'
                                onChange={(e) => setAnswers({ ...answers, thankyouNote: e.target.value })}
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

export default RoadmapActivity33;