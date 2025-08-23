import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import techstack from '../../assets/images/activities/activity2/techstack.png';
import applicationdevelopment from '../../assets/images/activities/activity2/applicationdevelopment.png';
import bonuscompany from '../../assets/images/activities/activity2/bonuscompany.png';
import businesssales from '../../assets/images/activities/activity2/businesssales.png';


import companyroles from '../../assets/images/activities/activity2/companyroles.png';
import backArrow from '../../assets/images/back-arrow.png';
import activityImage from '../../assets/images/activities/activity2/activity2.png';
import clock from '../../assets/images/activities/clock.png';
import star from '../../assets/images/activities/star.png';
import upArrowScroll from '../../assets/images/up-arrow-scroll.png';
import likeIcon from '../../assets/images/like-icon.png';
import dislikeIcon from '../../assets/images/dislike-icon.png';
import SampleCard from "../../assets/images/activities/activity17/learnTheCards.svg";
import FrontCard from "./activities-support/FrontCard";

import axios from 'axios';
import { useDispatch } from 'react-redux';


const VirtualCompanyGame = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const prevPage = location.state?.prevPage;
    const [currentStep, setCurrentStep] = useState(null); // null shows activity description by default
    const [selectedCard, setSelectedCard] = useState(null);
    const [selectedCeo, setSelectedCeo] = useState(null);


    const dispatch = useDispatch();
    const userId = localStorage.getItem('userId');
    // const history = useHistory();
    const activityId = 17;
    const [completed, setCompleted] = useState(false);
    const [alreadyCompleted, setAlreadyCompleted] = useState(false);
    const [starCount, setStarCount] = useState(7);
    const [answers, setAnswers] = useState({
        answer1: "", //Answers can not be a null JSON object, it has to have at least one key-value pair
    });
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
        { id: 1, number: "Step 1", title: "Learn the cards", icon: companyroles },
        { id: 2, number: "Step 2", title: "Choose Your CEO & Company", icon: techstack },
        { id: 3, number: "Step 3", title: "Get Your Cards", icon: applicationdevelopment },
        { id: 4, number: "Step 4", title: "Build Your Business", icon: businesssales },
        { id: 5, number: "Step 5", title: "Bonus! Company", icon: bonuscompany },
    ];

    // Cards
    const ceoCards = [
            {abbreviation: "Healthtech CEO", title: 'Chief Executive Officer', desc:'Oversees the entire company’s vision, long-term strategy, and high-level decision-making. The CEO aligns all departments toward company goals and represents the organization to stakeholders.'},
            {abbreviation: "Edtech CEO", title: 'Chief Executive Officer', desc:'Oversees the entire company’s vision, long-term strategy, and high-level decision-making. The CEO aligns all departments toward company goals and represents the organization to stakeholders.'},
            {abbreviation: "Crypto CEO", title: 'Chief Executive Officer', desc:'Oversees the entire company’s vision, long-term strategy, and high-level decision-making. The CEO aligns all departments toward company goals and represents the organization to stakeholders.'},
            {abbreviation: "Fashion CEO", title: 'Chief Executive Officer', desc:'Oversees the entire company’s vision, long-term strategy, and high-level decision-making. The CEO aligns all departments toward company goals and represents the organization to stakeholders.'},            
    ]


    const handleStepChange = (stepId) => {
        scrollToTop();
        setCurrentStep(stepId);
    };

    const handleNext = () => {
        scrollToTop();
        if (currentStep === null) {
            setCurrentStep(1);
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
                        <h2>Build a Company Virtual Card Game</h2>
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
                        <p>Build your dream company by choosing a CEO, assembling your team with role cards, and earning stars for how you hire.</p>
                    </div>
                ) : currentStep === 1 ? (
                    <div className="activity-description">
                        <h2>Step 1 : Learn the Cards</h2>
                        <p> See a sample card with callouts that explain its parts:</p>
                        <div className="cards-container">
                            <div className="sample-card-container">
                                <img src={SampleCard} alt="Sample Card with Callouts" className="sample-card-image" />
                            </div>
                        </div>
                    </div>
                ) : currentStep === 2 ? (
                    <div className="activity-description">
                        <h2>Step 2 :Choose Your CEO & Company</h2>
                        <p>Pick your Queen CEO to set your company’s industry:</p>
                        <div className="cards-grid">
                            {ceoCards.map((card, index) => (
                                <FrontCard
                                    key={`card.id`} 
                                    // abbreviation={card.abbreviation}
                                    title={card.title}
                                    desc={card.desc}
                                    isSelected={selectedCeo === card.id}
                                    onSelect={() => setSelectedCeo(card.id)}
                                /> 
                            ))}
                        </div>
                    </div>

                ) : currentStep === 3 ? (
                    <div className="activity-description">
                        <h2>Step 3 :Get Your Cards</h2>
                        <p>In this step, you’re to recognize each acronyms of Application Development.</p>
                        <div className="cards-container">

                        </div>
                    </div>


                ) : currentStep === 4 ? (
                    <div className="activity-description">
                        <h2>Step 4 :Build Your Business </h2>
                        <p>In this step, you’re to recognize each acronyms of Business & Sales.</p>
                        <div className="flip-cards-container">
                        </div>
                    </div>


                ) : currentStep === 5 ? (
                    <div className="activity-description">
                        <h2>Step 5 : Bonus Company </h2>
                        <p>In this step, you’re to recognize each acronyms of Application Development.</p>
                        <div className="flip-cards-container">

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
        </div>
    );
};

export default VirtualCompanyGame;
