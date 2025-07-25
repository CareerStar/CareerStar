import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import caseStudy from '../../assets/images/activities/activity1/case-study.png';
import changeUser from '../../assets/images/activities/activity1/change-user.png';
import collaboratingInCircle from '../../assets/images/activities/activity1/collaborating-in-circle.png';
import lawyer from '../../assets/images/activities/activity1/lawyer.png';
import backArrow from '../../assets/images/back-arrow.png';
import activityImage from '../../assets/images/activities/activity1/activity-image.png';
import clock from '../../assets/images/activities/clock.png';
import star from '../../assets/images/activities/star.png';
import upArrowScroll from '../../assets/images/up-arrow-scroll.png';
import step1Image1 from '../../assets/images/activities/activity16/home-pg.jpg';
import step1Image2 from '../../assets/images/activities/activity16/profile-pg.jpg';
import step1Image3 from '../../assets/images/activities/activity16/activities-pg.jpg';
import step1Image4 from '../../assets/images/activities/activity16/leaderboard-pg.jpg';
import step1Image5 from '../../assets/images/activities/activity16/resume-pg.jpg';

import Stars3 from '../../assets/images/stars3.png';

import axios from 'axios';
import { useDispatch } from 'react-redux';


const Activity16 = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const prevPage = location.state?.prevPage;
    const [currentStep, setCurrentStep] = useState(null); // null shows activity description by default

    const [firstname, setFirstname] = useState(location.state?.firstname || {});
    const dispatch = useDispatch();
    const userId = localStorage.getItem('userId');
    // const history = useHistory();
    const activityId = 16;
    const [completed, setCompleted] = useState(false);
    const [alreadyCompleted, setAlreadyCompleted] = useState(false);
    const [starCount, setStarCount] = useState(5);
    const [answers, setAnswers] = useState({
        answer1: '', //Answers can not be a null JSON object, it has to have at least one key-value pair
        tableData: Array.from({ length: 4 }, () => Array(7).fill("")),
    });
    // const [showHotTipPopup, setShowHotTipPopup] = useState(false);
    // const [showLikeDislikePopup, setShowLikeDislikePopup] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [loading, setLoading] = useState(false);

    const columnHeadings = [
        "Name",
        "Company",
        "Department",
        "Role",
        "Time at Company",
        "LinkedIn URL",
        "Role URL",
    ];

    const popupRef = useRef(null);

    // const closePopUp = () => {
    //     setShowHotTipPopup(false);
    // }

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    useEffect(() => {
        scrollToTop();
    }, []);
    const navigateToDashboard = () => {
        setShowPopup(false);
    };

    const nextPageNavigation = async () => {

        // setErrorEmail('');
        // setErrorPassword('');
        // setErrorConfirmPassword('');

        // if (emailID.trim() === '') {
        //     setErrorEmail('Email ID cannot be empty*');
        //     return;
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !showPopup) {
            nextPageNavigation();
        }
        if (event.key === 'Enter' && showPopup) {
            navigateToDashboard();
        }
    };

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

    const addRow = () => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            tableData: [...prevAnswers.tableData, Array(7).fill("")],
        }));
    };

    const handleTableChange = (rowIndex, colIndex, value) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            tableData: prevAnswers.tableData.map((row, rIdx) =>
                row.map((cell, cIdx) => (rIdx === rowIndex && cIdx === colIndex ? value : cell))
            ),
        }));
    };

    const stepsData = [
        { id: 1, number: "Step 1", title: "Platform Walkthrough", icon: lawyer },
        { id: 2, number: "Step 2", title: "Getting Support", icon: caseStudy },
        { id: 3, number: "Step 3", title: "Quick Feedback", icon: collaboratingInCircle },
    ];

    const handleStepChange = (stepId) => {
        scrollToTop();
        setCurrentStep(stepId);
    };

    const handleNext = () => {
        scrollToTop();
        if (currentStep === null) {
            setCurrentStep(1);
        }
        else if (currentStep === stepsData.length) {
            setShowPopup(true);
        }
        else if (currentStep < stepsData.length) {
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
                        <h2>Welcome to CareerStar 101</h2>
                        <div className="inline-container">
                            <div className="inline-container">
                                <img src={clock} alt="Clock" />
                                <p>5 minutes</p>
                            </div>
                            <div className="inline-container">
                                <img src={star} alt="Star" />
                                <p>{starCount} stars</p>
                            </div>
                        </div>
                        <h3>We're glad you're here! this quick guide will help you get started with CareerStar.</h3>
                        <p>CareerStar is a platform dedicated to helping students build their career journey by developing key professional skills. 
                            It supports students in improving their professionalism, answering tough career-related questions, strengthening their professional social presence, 
                            and enhancing their organizational and communication abilities.</p>

                    </div>
                ) : currentStep === 1 ? (
                    <div className="activity-description">
                        <h2>Step 1 : </h2>
                        <h2>Platform Walkthrough</h2>
                        <p>In this step, you'll be introduced to the CareerStar platform.</p>
                        <ul>
                            <li><p>What it is: Your central hub for navigating CareerStar.</p></li>
                            <li><p>Highlight: View notifications, upcoming tasks, recent activity, and quick access to key features.</p></li>
                        </ul>
                        <div className="activity-image">
                            <img src={step1Image1} alt="Step 1" />
                        </div>  


                        <ul>
                            <li><p>What it is: Your personal career profile.</p></li>
                            <li><p>Highlight: Showcase your skills, goals, and experience to personalize your journey.</p></li>
                        </ul>                    
                        <div className="activity-image">
                            <img src={step1Image2} alt="Step 2" />
                        </div>


                        <ul>
                            <li><p>What it is: Interactive tasks and challenges to build your professional skills.</p></li>
                            <li><p>Highlight: Complete real-world scenarios, answer career questions, and track your progress.</p></li>
                        </ul>
                        <div className="activity-image">
                            <img src={step1Image3} alt="Step 3" />
                        </div>

                        <ul>
                            <li><p>What it is: A ranking system showing top engaged users.</p></li>
                            <li><p>Highlight: Earn points for completing activities and see how you compare with peers.</p></li>
                        </ul>
                        <div className="activity-image">
                            <img src={step1Image4} alt="Step 4" />
                        </div>

                        <ul>
                            <li><p>What it is: A tool to help you build and improve your resume.</p></li>
                            <li><p>Highlight: Access templates, tips, and examples tailored for students.</p></li>
                        </ul>            
                        <div className="activity-image">
                            <img src={step1Image5} alt="Step 5" />
                        </div>

                        <ul>
                            <li><p>What it is: Walks through the process of completing the 321+ Report</p></li>
                            <li><p>Highlight: Complete the 321+ Report.</p></li>
                        </ul>
                        <iframe width="648px" height="315"
                            src="https://www.youtube.com/embed/l9tZtwVnWu4?autoplay=0&mute=0"
                            frameborder="0"
                            allowfullscreen>
                        </iframe>

                    </div>
                ) : currentStep === 2 ? (
                    <div className="activity-description">
                        <h2>Step 2 :Getting Support</h2>
                        <h2>Need a Hand? We're Here to Help!</h2><br />
                        <h3>How to get in touch with us:</h3>

                        <h3>Contact Options:</h3><br />
                        <h3>Email us at: </h3>
                        <h3>hello@careerstar.com 
                            <br></br>clara@careerstar.c, 
                            <br></br>abdulbaris@careerstar.co, 
                            <br></br>kareng@careerstar.co or 
                            <br></br>angien@careerstar.co</h3>
                        <h4>Conditional Help: Are you facing a specific challenge? or technical issue?</h4>
                        <button className="yes-button">Yes</button>
                        <button className="no-button">No</button>



                    </div>
                ) : currentStep === 3 ? (
                    <div className="activity-description">
                        <h2>Step 3: Your Feedback Matters!</h2>
                        <form>
                            <p>On a scale of 1-5 how helpful was this video/activity?</p>
                                <div class="simple-rating">
                                    <label>
                                        <input type="radio" name="rating" value="1"/> 1
                                            </label>
                                        <label>
                                            <input type="radio" name="rating" value="2"/> 2
                                        </label>
                                        <label>
                                            <input type="radio" name="rating" value="3" checked/> 3
                                        </label>
                                        <label>
                                            <input type="radio" name="rating" value="4"/> 4
                                        </label>
                                        <label>
                                            <input type="radio" name="rating" value="5"/> 5
                                        </label>
                                </div>
                            <br/>
                                <p>Please leave your thoughts on Career Star. Or any suggestions you may have</p>
                                <textarea type="text" placeholder="Your message goes here" ></textarea>
                                <br/>
                                <br/>
                                <button>Send Feedback</button>
                                </form>
                                                                
                    </div>
                ) 
                    : null}
                <div className="activity-navigation-buttons">
                    <div className="activity-navigation-back-button" onClick={handleBack} disabled={currentStep === null} style={{ marginRight: "10px" }}>
                        {currentStep === null ? "Back to Activity Page" : "Back to Previous Step"}
                    </div>
                    <div className="activity-navigation-next-button" onClick={handleNext} disabled={currentStep === stepsData.length}>
                        {currentStep === stepsData.length ? "Mark as completed" : "Go to Next Step"}
                    </div>
                </div>
            </div>
            {showPopup && (
                <div className='popup'>
                    <div className='popup-content'>
                        <img src={Stars3} alt='5 stars' />
                        <div className='earned-star'>You earned 3 stars!</div>
                        <div className='popup-submit-button' onClick={() => handleSubmit(true)}>
                            <p>Complete Activity!</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Activity16;

