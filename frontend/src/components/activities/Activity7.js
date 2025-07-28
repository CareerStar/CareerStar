import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import caseStudy from '../../assets/images/activities/activity1/case-study.png';
import collaboratingInCircle from '../../assets/images/activities/activity1/collaborating-in-circle.png';
import lawyer from '../../assets/images/activities/activity1/lawyer.png';
import backArrow from '../../assets/images/back-arrow.png';
import activityImage from '../../assets/images/activities/activity5/activity-image.jpg';
import clock from '../../assets/images/activities/clock.png';
import star from '../../assets/images/activities/star.png';
import upArrowScroll from '../../assets/images/up-arrow-scroll.png';
import likeIcon from '../../assets/images/like-icon.png';
import dislikeIcon from '../../assets/images/dislike-icon.png';
import SalaryNegotiationApp from './activities-support/SalaryNegotiationApp';

import axios from 'axios';
import { useDispatch } from 'react-redux';


const Activity7 = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const prevPage = location.state?.prevPage;
    const [currentStep, setCurrentStep] = useState(null); // null shows activity description by default

    const dispatch = useDispatch();
    const userId = localStorage.getItem('userId');
    // const history = useHistory();
    const activityId = 7;
    const [completed, setCompleted] = useState(false);
    const [alreadyCompleted, setAlreadyCompleted] = useState(false);
    const [starCount, setStarCount] = useState(7);
    const [answers, setAnswers] = useState({
        answer1: '', //Answers can not be a null JSON object, it has to have at least one key-value pair
    });
    const popupRef = useRef(null);
    const [showLikeDislikePopup, setShowLikeDislikePopup] = useState(false);
    const [loading, setLoading] = useState(false);

    const [expandedIndex, setExpandedIndex] = useState(null);
    const [confidence, setConfidence] = useState(50);

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
        { id: 1, number: "Step 1", title: "Understanding Salary Discussions", icon: lawyer },
        { id: 2, number: "Step 2", title: "Effective Strategies for Salary Negotiation", icon: caseStudy },
        { id: 3, number: "Step 3", title: "Example Scenarios", icon: collaboratingInCircle },
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

    const keyPoints = [
        {
            title: "Why salary discussions matter",
            content: "Salary discussions ensure you receive fair compensation for your skills and experience. They're an opportunity to advocate for yourself and can significantly impact your long-term career growth and earnings potential."
        },
        {
            title: "When to discuss salary",
            content: "The best time is typically after receiving an offer but before accepting it. This gives you maximum leverage while showing you're primarily interested in the role itself."
        },
        {
            title: "How to research market rates",
            content: "Use resources like Glassdoor, PayScale, industry reports, and professional networks to understand the typical compensation range for your role, experience level, and location."
        },
        {
            title: "Framing your value proposition",
            content: "Highlight specific skills, achievements, and experience that justify your desired compensation. Quantify your impact when possible (e.g., 'increased sales by 20%')."
        }
    ];

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
                        <h2>The Dreaded Salary Talk</h2>
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
                        <h3>By the end of this activity, you will:</h3>
                        <p>✅ Understand the importance of salary discussions in job interviews.</p>
                        <p>✅ Learn effective strategies for salary negotiation.</p>
                        <p>✅ Practice salary discussion scenarios.</p>
                        <p>✅ Develop confidence in asking for what you want.</p>
                    </div>
                ) : currentStep === 1 ? (
                    <div className="activity-description">
                        <h2>Step 1 : Understanding Salary Discussions</h2>
                        <p>Salary discussions are a crucial part of the interview process.
                            They ensure fair compensation for your skills and experience and allow you to advocate
                            for yourself confidently. Having this conversation effectively is also an essential
                            professional skill that can impact your long-term career growth.</p>

                        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
                            {/* Accordion-style key points */}
                            <div className="mb-8">
                                {keyPoints.map((point, index) => (
                                    <div key={index} className="mb-2 border border-gray-200 rounded">
                                        <button
                                            className="w-full text-left p-4 font-medium flex justify-between items-center bg-gray-50 hover:bg-gray-100"
                                            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                                        >
                                            {point.title}
                                            <span>{expandedIndex === index ? '−' : '+'}</span>
                                        </button>
                                        {expandedIndex === index && (
                                            <div className="p-4 bg-white">
                                                <p>{point.content}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Confidence slider */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold mb-2">How confident do you feel about salary discussions?</h3>
                                <div className="flex items-center gap-4">
                                    <span className="text-red-500">Not confident</span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={confidence}
                                        onChange={(e) => setConfidence(parseInt(e.target.value))}
                                        className="flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <span className="text-green-500">Very confident</span>
                                </div>

                                <div className="mt-2 text-center">
                                    <p>Your confidence level: <span className="font-bold">{confidence}%</span></p>
                                </div>
                            </div>

                        </div>
                    </div>
                ) : currentStep === 2 ? (
                    <div className="activity-description">
                        <h2>Step 2 :  Effective Strategies for Salary Negotiation</h2>
                        <ul>
                            <li><p><b>Research:</b> Know the industry standards and salary ranges for the position.</p></li>

                            <li><p><b>Confidence:</b> Be prepared to discuss your salary expectations clearly and without hesitation.</p></li>

                            <li><p><b>Patience:</b> After stating your salary expectation, pause and wait for the response.</p></li>

                            <li><p><b>Full Compensation Awareness:</b> Consider the total package, including benefits, bonuses, stock options, and career growth opportunities.</p></li>

                            {/* <div className="activity-image">
                                <img src={step2Image1} alt="Step 2" />
                            </div> */}
                        </ul>
                    </div>
                ) : currentStep === 3 ? (
                    <div className="activity-description">
                        <h2>Step 3 : Example Scenarios</h2>

                        <ul>
                            <li><p>Be clear and direct about your salary expectations.</p></li>

                            <li><p>Avoid over-explaining or justifying your request too quickly.</p></li>

                            <li><p>Ask about the total compensation package, including bonuses, benefits, and career development.</p></li>

                            <li><p>Practice salary discussions beforehand to gain confidence.</p></li>
                        </ul>

                        <SalaryNegotiationApp />
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

export default Activity7;
