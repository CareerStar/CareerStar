import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import caseStudy from '../../assets/images/activities/activity1/case-study.png';
import collaboratingInCircle from '../../assets/images/activities/activity1/collaborating-in-circle.png';
import lawyer from '../../assets/images/activities/activity1/lawyer.png';
import backArrow from '../../assets/images/back-arrow.png';
import activityImage from '../../assets/images/activities/activity2/activity-image.jpg';
import clock from '../../assets/images/activities/clock.png';
import star from '../../assets/images/activities/star.png';
import upArrowScroll from '../../assets/images/up-arrow-scroll.png';
import likeIcon from '../../assets/images/like-icon.png';
import dislikeIcon from '../../assets/images/dislike-icon.png';
import FlippableCard from "./activities-support/FlippableCard";

import axios from 'axios';
import { useDispatch } from 'react-redux';


const Activity2 = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const prevPage = location.state?.prevPage;
    const [currentStep, setCurrentStep] = useState(null); // null shows activity description by default

    const dispatch = useDispatch();
    const userId = localStorage.getItem('userId');
    // const history = useHistory();
    const activityId = 2;
    const [completed, setCompleted] = useState(false);
    const [alreadyCompleted, setAlreadyCompleted] = useState(false);
    const [starCount, setStarCount] = useState(7);
    const [answers, setAnswers] = useState({
        answer1: "", //Answers can not be a null JSON object, it has to have at least one key-value pair
    });
    const [showHotTipPopup, setShowHotTipPopup] = useState(false);
    const [showLikeDislikePopup, setShowLikeDislikePopup] = useState(false);
    const [loading, setLoading] = useState(false);

    const popupRef = useRef(null);

    const closePopUp = () => {
        setShowHotTipPopup(false);
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                closePopUp();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [popupRef]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`https://api.careerstar.co/roadmapactivity/${userId}/${activityId}`);
                if (response.data) {
                    setAnswers(response.data[0]);
                    // setTableData(response.data[0].tableData);
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
            console.log('answers:', answers);
            const payload = {
                userId: userId,
                roadmapActivityId: 11,
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
            if (prevPage === 'roadmap') {
                navigate('/dashboard/roadmap');
            } else {
                navigate('/dashboard/home');
            }
        } catch (error) {
            console.error('Error saving answers:', error);
        }
    };

    const executiveLeadershipAndManagement = [
        { abbreviation: 'CEO', fullForm: 'Chief Executive Officer', duty: 'Highest-ranking executive responsible for major corporate decisions, overall operations and financial solvency.' },
        { abbreviation: 'CFO', fullForm: 'Chief Financial Officer', duty: 'Is responsible for a company\'s financial operations. They oversee the finance department and make strategic financial decisions.' },
        { abbreviation: 'CTO', fullForm: 'Chief Technology Officer', duty: 'Executive responsible for technology strategy, innovation, and technical infrastructure.' },
        { abbreviation: 'CMO', fullForm: 'Chief Marketing Officer', duty: 'Executive responsible for marketing strategy, brand management, and market growth. Develops and executes social media strategy and cross-brand partnerships.' },
        { abbreviation: 'VP', fullForm: 'Vice President', duty: 'In charge of the overall business, institution, university, organization, agency or branch of government. A VP furthers the board of directors\' goals and missions by implementing new standards and strategies in the company.' },
        { abbreviation: 'SVP', fullForm: 'Senior Vice President', duty: 'Is responsible for overseeing internal operations, helping to build strong customer relationships, and maximizing the company\'s financial goals.' },
        { abbreviation: 'CHRO', fullForm: 'Chief Human Resource Officer', duty: 'Is responsible for designing and rolling out strategies that help the company get the best out of its workforce.' }
    ];

    const technicalAndProductRoles = [
        { abbreviation: 'PM', fullForm: 'Product Manager', duty: 'Responsible for the strategy, roadmap, and feature definition for that product or product line.' },
        { abbreviation: 'UX', fullForm: 'User Experience Designer', duty: 'Responsible for creating products that provide meaningful and relevant experiences to users.' },
        { abbreviation: 'UI', fullForm: 'User Interface Designer', duty: 'Responsible for the look and feel of a product, and ensuring that the user experience is seamless.' },
        { abbreviation: 'QA', fullForm: 'Quality Assurance Engineer', duty: 'Responsible for ensuring the quality of the final product.' },
        { abbreviation: 'SWE / SDE', fullForm: 'Software Engineer', duty: 'Responsible for designing, developing, and testing software systems or applications for software companies.' },
        { abbreviation: 'SRE', fullForm: 'Site Reliability Engineer', duty: 'Responsible for ensuring that the company\'s services are reliable and scalable.' },
        { abbreviation: 'DBA', fullForm: 'Database Administrator', duty: 'Responsible for the performance, integrity, and security of a database.' }
    ];

    const businessModelsMetricsAndTechnology = [
        { abbreviation: 'B2B', fullForm: 'Business-to-Business', duty: "A type of commerce where businesses exchange products, services, or information with other businesses." },
        { abbreviation: 'B2C', fullForm: 'Business-to-Consumer', duty: "A business model where a company sells products or services directly to consumers." },
        { abbreviation: 'SaaS', fullForm: 'Software as a Service', duty: "A cloud-based model for delivering software applications to users over the internet." },
        { abbreviation: 'KPI', fullForm: 'Key Performance Indicator', duty: "A measurable value that demonstrates how effectively a company is achieving key objectives."},
        { abbreviation: 'OKR', fullForm: 'Objectives and Key Results', duty: "A goal-setting methodology that can help teams set measurable goals." },
        { abbreviation: 'CRM', fullForm: 'Customer Relationship Management', duty: "A system for managing all of your company's interactions with current and potential customers." },
        { abbreviation: 'HR', fullForm: 'Human Resources', duty: "The department of a business that manages the employee life cycle." },
    ]

    const stepsData = [
        { id: 1, number: "Step 1", title: "Executive Leadership & Senior Management", icon: lawyer },
        { id: 2, number: "Step 2", title: "Technical & Product Roles & Terms", icon: caseStudy },
        { id: 3, number: "Step 3", title: "Business Models, Metrics & Technology", icon: collaboratingInCircle }
    ];

    const scrollToTop = () => {
        window.scrollTo(0, 0);
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
            if (prevPage === 'roadmap') {
                navigate('/dashboard/roadmap');
            } else {
                navigate('/dashboard/home');
            }
        }
    };

    const handleBackNavigation = () => {
        if (prevPage === 'roadmap') {
            navigate('/dashboard/roadmap');
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
                                <div className={`activity-step-button ${currentStep === step.id ? "selected" : ""}`} onClick={() => setCurrentStep(step.id)}>Dive In</div>
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
                        <h2>Acronym Card Game</h2>
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
                        <p>Test your knowledge of industry acronyms and their meanings, perfect for anyone looking to strengthen their business and tech vocabulary.</p>

                    </div>
                ) : currentStep === 1 ? (
                    <div className="activity-description">
                        <h2>Step 1 : Executive Leadership & Senior Management</h2>
                        <div className="flip-cards-container">
                            {executiveLeadershipAndManagement.map((role, index) => (
                                <FlippableCard key={`step1-${index}`}  abbreviation={role.abbreviation} fullForm={role.fullForm} duty={role.duty} />
                            ))}
                        </div>
                    </div>
                ) : currentStep === 2 ? (
                    <div className="activity-description">
                        <h2>Step 2 : Technical & Product Roles & Terms</h2>
                        <div className="flip-cards-container">
                            {technicalAndProductRoles.map((role, index) => (
                                <FlippableCard key={`step2-${index}`}  abbreviation={role.abbreviation} fullForm={role.fullForm} duty={role.duty} />
                            ))}
                        </div>
                    </div>
                ) : currentStep === 3 ? (
                    <div className="activity-description">
                        <h2>Step 3 : Business Models, Metrics & Technology</h2>
                        <div className="flip-cards-container">
                            {businessModelsMetricsAndTechnology.map((role, index) => (
                                <FlippableCard key={index} abbreviation={role.abbreviation} fullForm={role.fullForm} duty={role.duty} />
                            ))}
                        </div>
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

            {showHotTipPopup && (
                <div className='hot-tip-popup'>
                    <div className='hot-tip-popup-content' ref={popupRef}>
                        {/* <img src={step1Image2} alt='3 stars' /> */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Activity2;
