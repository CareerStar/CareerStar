import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import caseStudy from '../../assets/images/activities/activity1/case-study.png';
import changeUser from '../../assets/images/activities/activity1/change-user.png';
import collaboratingInCircle from '../../assets/images/activities/activity1/collaborating-in-circle.png';
import lawyer from '../../assets/images/activities/activity1/lawyer.png';
import backArrow from '../../assets/images/back-arrow.png';
import activityImage from '../../assets/images/activities/activity5/activity-image.jpg';
import clock from '../../assets/images/activities/clock.png';
import star from '../../assets/images/activities/star.png';
import upArrowScroll from '../../assets/images/up-arrow-scroll.png';
import step2Image1 from '../../assets/images/activities/activity5/step2-image1.png';
import step3Image1 from '../../assets/images/activities/activity5/step3-image1.png';
import step4Image1 from '../../assets/images/activities/activity5/step4-image1.png';
import likeIcon from '../../assets/images/like-icon.png';
import dislikeIcon from '../../assets/images/dislike-icon.png';

import axios from 'axios';
import { useDispatch } from 'react-redux';


const Activity5 = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const prevPage = location.state?.prevPage;
    const [currentStep, setCurrentStep] = useState(null); // null shows activity description by default

    const dispatch = useDispatch();
    const userId = localStorage.getItem('userId');
    // const history = useHistory();
    const activityId = 5;
    const [completed, setCompleted] = useState(false);
    const [alreadyCompleted, setAlreadyCompleted] = useState(false);
    const [starCount, setStarCount] = useState(7);
    const [answers, setAnswers] = useState({
        answer1: '', //Answers can not be a null JSON object, it has to have at least one key-value pair
    });
    const popupRef = useRef(null);
    const [showLikeDislikePopup, setShowLikeDislikePopup] = useState(false);
    const [loading, setLoading] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    useEffect(() => {
        scrollToTop();
    }, []);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`https://api.careerstar.co/roadmapactivity/${userId}/${activityId}`);
                if (response.data) {
                    setAnswers(response.data[0]);
                    setCompleted(response.data[1]);
                    setAlreadyCompleted(response.data[1]);
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
                completed: completed,
                answers: answers,
                stars: starCount,
            };
            const response = await axios.post(`https://api.careerstar.co/roadmapactivity/${userId}/${activityId}`, payload);
            if (response.status === 200) {
                if (completed) {
                    setCompleted(true);
                }
                if (completed && !alreadyCompleted) {
                    dispatch({ type: "INCREMENT_STAR", payload: starCount });
                }
            }
            if (prevPage === 'activities') {
                navigate('/dashboard/activities');
            } else {
                navigate('/dashboard/home');
            }
        } catch (error) {
            console.error('Error saving answers:', error);
        }
    };

    const stepsData = [
        { id: 1, number: "Step 1", title: "Find Relevant Events", icon: lawyer },
        { id: 2, number: "Step 2", title: "Identify the Event Host", icon: caseStudy },
        { id: 3, number: "Step 3", title: "Research the Host", icon: collaboratingInCircle },
        { id: 4, number: "Step 4", title: "Reach Out to the Event Host", icon: collaboratingInCircle },
        { id: 5, number: "Step 5", title: "Meet the Host at the Event", icon: changeUser },
    ];

    const handleStepChange = (stepId) => {
        scrollToTop();
        setCurrentStep(stepId);
    };

    const handleNext = () => {
        scrollToTop();
        if (currentStep === null) {
            setCurrentStep(1);
        } else if (currentStep === stepsData.length) {
            setShowLikeDislikePopup(true);
        } else if (currentStep < stepsData.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        scrollToTop();
        if (currentStep === 1) {
            setCurrentStep(null); // Go back to activity description
        } else if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else if (currentStep === null) {
            if (prevPage === 'activities') {
                navigate('/dashboard/activities');
            } else {
                navigate('/dashboard/home');
            }
        }
    };

    const handleBackNavigation = () => {
        if (prevPage === 'activities') {
            navigate('/dashboard/activities');
        } else {
            navigate('/dashboard/home');
        }
    }

    return (
        <div className="activity-container">
            {loading && (
                <div className="spinner-overlay">
                    <div className="spinner"></div>
                </div>
            )}
            {/* Left Section */}
            <div className="activity-container-left-element">
                <div className="activity-header">
                    <img src={backArrow} alt="Back" onClick={handleBackNavigation} />
                    <h3>Activity Steps :</h3>
                </div>
                <div className="activity-step-container">
                    {stepsData.map((step) => (
                        <div className="activity-step">
                            <div className="activity-step-left-element">
                                <img src={step.icon} alt="Case Study" />
                            </div>
                            <div className="activity-step-right-element">
                                <div className="activity-step-number">{step.number}</div>
                                <div className="activity-step-title">{step.title}</div>
                                {/* <div className={`activity-step-button ${currentStep === step.id ? "selected" : ""}`} onClick={() => handleStepChange(step.id)}>Dive In</div> */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Section */}
            <div className="activity-container-right-element">
                <img src={upArrowScroll} alt="Scroll to Top" className="scroll-top" onClick={scrollToTop} />
                {currentStep === null ? (
                    <div className="activity-description">
                        <div className="activity-main-image">
                            <img src={activityImage} alt="Activity" />
                        </div>
                        <h2>Let’s Network Before We Network</h2>
                        <div className="inline-container">
                            <div className="inline-container">
                                <img src={clock} alt="Clock" />
                                <p>15 minutes</p>
                            </div>
                            <div className="inline-container">
                                <img src={star} alt="Star" />
                                <p>{starCount} stars</p>
                            </div>
                        </div>
                        <h3>Networking Strategies</h3>
                        <p>Want to make the most of an event? Start by building a relationship with the event host!</p>
                        <h2>Why Connect with the Event Host? 🤝</h2>
                        <p>Event hosts are key connectors in any networking event. Engaging with them before the event can:</p>
                        <p>✅ Give you inside knowledge about the event structure.</p>
                        <p>✅ Help you get introductions to other key people.</p>
                        <p>✅ Increase your chances of making meaningful connections.</p>
                    </div>
                ) : currentStep === 1 ? (
                    <div className="activity-description">
                        <h2>Step 1 : Find Relevant Events 🎟️</h2>
                        <p>Before you can connect with an event host, you need to find the right events to attend.</p>
                        <h3>📍 Where to Find Events?</h3>
                        <h4>Event Platforms</h4>
                        <ol>
                            <li><p><a href="https://www.eventbrite.com/" target="_blank">Eventbrite</a> – Business & professional events</p></li>
                            <li><p><a href="https://www.meetup.com/" target="_blank">Meetup</a> – Community & networking events</p></li>
                            <li><p><a href="https://lu.ma/" target="_blank">Luma</a> – Online and in-person networking</p></li>
                        </ol>
                    </div>
                ) : currentStep === 2 ? (
                    <div className="activity-description">
                        <h2>Step 2 :  Identify the Event Host 🏆</h2>
                        <p>Once you’ve chosen an event, find out who is hosting it.</p>
                        <h3>📍 Where to Find the Event Host?</h3>
                        <ol>
                            <li><p>On the Event Page:</p></li>
                            <ul>
                                <li><p>Check the "Organizer" or "Hosted by" section.</p></li>
                            </ul>
                            <li><p>On LinkedIn Events:</p></li>
                            <ul>
                                <li><p>Click on the event → Look for the host’s name under "Organizer."</p></li>
                            </ul>
                            <li>On the Event Website:</li>
                            <ul>
                                <li><p>Conferences & workshops often list organizers under “Team” or “About” pages.</p></li>
                            </ul>
                            <div className="activity-image">
                                <img src={step2Image1} alt="Step 2" />
                            </div>
                        </ol>
                    </div>
                ) : currentStep === 3 ? (
                    <div className="activity-description">
                        <h2>Step 3 : Research the Host 🔍</h2>
                        <p>Find the person on LinkedIn.</p>
                        <div className="activity-image">
                            <img src={step3Image1} alt="Step 1" />
                        </div>
                        <p>Before reaching out, do a quick background check to personalize your message.</p>
                        <h3>Things to Look For:</h3>
                        <ol>
                            <li><p>Their role in the organization or community.</p></li>
                            <li><p>Their past events (Do they host regularly?)</p></li>
                            <li><p>Their LinkedIn posts or blogs (Have they shared insights about the event?)</p></li>
                        </ol>
                    </div>
                ) : currentStep === 4 ? (
                    <div className="activity-description">
                        <h2>Step 4 : Reach Out to the Event Host 📩</h2>
                        <p>Once you know who the host is, send a personalized message introducing yourself.</p>
                        <h3>📍 Where to Contact Them?</h3>
                        <p>✅ LinkedIn DMs (Best for professional events)</p>
                        <p>✅ Twitter/X DMs (If they’re active there)</p>
                        <p>✅ Email (If listed on the event page)</p>
                        <h3>Example Message:</h3>
                        <div className="activity-image">
                            <img src={step4Image1} alt="Step 1" />
                        </div>
                        <h3>🚀 Why These Messages Work:</h3>
                        <ol>
                            <li><p>✅ They are short & respectful (no long paragraphs).</p></li>
                            <li><p>✅ They appreciate their effort in organizing the event.</p></li>
                            <li><p>✅ They invite conversation without demanding anything.</p></li>
                        </ol>
                    </div>
                ) : currentStep === 5 ? (
                    <div className="activity-description">
                        <h2>Step 5 : Meet the Host at the Event 🤝</h2>
                        <p>Since you’ve already introduced yourself online, meeting in person (or virtually) will feel natural.</p>
                        <h3>How to Approach Them at the Event:</h3>
                        <ol>
                            <li><p>Find a moment when they’re not too busy (before the event starts or after a panel).</p></li>
                            <li><p>Say thank you for organizing the event—people appreciate recognition!</p></li>
                            <li><p>Reference something from your earlier message (e.g., "I really liked your post on X/LinkedIn”).</p></li>
                            <li><p>If relevant, ask a short question (e.g., “What inspired you to start hosting these events?”).</p></li>
                        </ol>
                    </div>
                ) : null}
                <div className="activity-navigation-buttons">
                    <div className="activity-navigation-back-button" onClick={handleBack} disabled={currentStep === null} style={{ marginRight: "10px" }}>
                        {currentStep === null ? "Back to Activity Page" : "Back to Previous Step"}
                    </div>
                    <div className="activity-navigation-next-button" onClick={handleNext} disabled={currentStep === stepsData.length}>
                        {currentStep === stepsData.length ? "Mark as completed" : "Go to Next Step"}
                    </div>
                </div>
            </div>

            {showLikeDislikePopup && (
                <div className='activity-like-dislike-popup'>
                    <div className='activity-like-dislike-popup-content'>
                        <p>How did you find this activity?</p>
                        <div className='activity-like-dislike-buttons'>
                            <div className='activity-like-button' onClick={() => handleSubmit(true)}>
                                <img src={likeIcon} alt="Like" />
                            </div>
                            <div className='activity-dislike-button' onClick={() => handleSubmit(true)}>
                                <img src={dislikeIcon} alt="Dislike" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Activity5;
