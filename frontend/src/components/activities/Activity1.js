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
import step1Image1 from '../../assets/images/activities/activity1/step1-image1.png';
import step1Image2 from '../../assets/images/activities/activity1/step1-image2.png';
import step2Image1 from '../../assets/images/activities/activity1/step2-image1.png';
import step3Image1 from '../../assets/images/activities/activity1/step3-image1.png';
import step3Image2 from '../../assets/images/activities/activity1/step3-image2.png';
import step4Image1 from '../../assets/images/activities/activity1/step4-image1.png';
import fireFlameIcon from '../../assets/images/fire-flame-icon.png';
import likeIcon from '../../assets/images/like-icon.png';
import dislikeIcon from '../../assets/images/dislike-icon.png';

import axios from 'axios';
import { useDispatch } from 'react-redux';


const Activity1 = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const prevPage = location.state?.prevPage;
    const [currentStep, setCurrentStep] = useState(null); // null shows activity description by default

    const dispatch = useDispatch();
    const userId = localStorage.getItem('userId');
    // const history = useHistory();
    const activityId = 1;
    const [completed, setCompleted] = useState(false);
    const [alreadyCompleted, setAlreadyCompleted] = useState(false);
    const [starCount, setStarCount] = useState(7);
    const [answers, setAnswers] = useState({
        answer1: '', //Answers can not be a null JSON object, it has to have at least one key-value pair
        tableData: Array.from({ length: 4 }, () => Array(7).fill("")),
    });
    const [showHotTipPopup, setShowHotTipPopup] = useState(false);
    const [showLikeDislikePopup, setShowLikeDislikePopup] = useState(false);
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
        { id: 1, number: "Step 1", title: "Identifying the Right Team & Division", icon: lawyer },
        { id: 2, number: "Step 2", title: "Department Research", icon: caseStudy },
        { id: 3, number: "Step 3", title: "Find Alumni from Your University", icon: collaboratingInCircle },
        { id: 4, number: "Step 4", title: "Uncover the Hiring Team", icon: collaboratingInCircle },
        { id: 5, number: "Step 5", title: "Your Turn, go shine!", icon: changeUser },
    ];

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

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
                                <div className={`activity-step-button ${currentStep === step.id ? "selected" : ""}`} onClick={() => handleStepChange(step.id)}>Dive In</div>
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
                        <h2>Reaching out to more than Recruiters</h2>
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
                        <p>It’s crucial to connect with more than just recruiters and job posters. Engaging with professionals in the team you may be working with can often yield better insights and opportunities.</p>

                    </div>
                ) : currentStep === 1 ? (
                    <div className="activity-description">
                        <h2>Step 1 : Identifying the Right Team & Division</h2>
                        <ol>
                            <li>
                                <p>Identify a job of interest and research the company’s division, group, or team associated with the role</p>
                                <div className="activity-image">
                                    <img src={step1Image1} alt="Step 1" />
                                </div>
                                <div className="activity-hot-tip" onClick={() => setShowHotTipPopup(true)}>
                                    <img src={fireFlameIcon} alt="Fire Flame Icon" />
                                    <p>Hot Tip! Look for capitalized words in job descriptions—they often indicate specific departments or divisions. (Click for more!)</p>
                                </div>
                            </li>
                        </ol>
                    </div>
                ) : currentStep === 2 ? (
                    <div className="activity-description">
                        <h2>Step 2 : Department Research</h2>
                        <ol>
                            <li><p>Gather details about the department:</p></li>
                            <ul>
                                <li><p>What are the responsibilities of this department?</p></li>
                                <li><p>Search for the keywords (here example: Advanced Data Science, Artificial Intelligence)</p></li>
                                {/* <li><p>What person is ultimately responsible for this department’s KPIs and Lines of Business?</p></li>
                                <li><p>What is the department’s focus area (e.g., Engineering, Operations, Research & Development)?</p></li> */}
                            </ul>
                            <div className="activity-image">
                                <img src={step2Image1} alt="Step 1" />
                            </div>
                        </ol>
                    </div>
                ) : currentStep === 3 ? (
                    <div className="activity-description">
                        <h2>Step 3 : Find Alumni from Your University</h2>
                        <ol>
                            <li>
                                <p>Go to LinkedIn → Company Page → People Tab.</p>
                            </li>
                            <li>
                                <p>Use the "School" filter to find employees who attended your university.</p>
                                <div className="activity-image">
                                    <img src={step3Image1} alt="Step 1" />
                                </div>
                            </li>
                            <li>
                                <p>Reach out to alumni —they may provide valuable insights or referrals.</p>
                                <div className="activity-image">
                                    <img src={step3Image2} alt="Step 1" />
                                </div>
                            </li>
                            <li>
                                <p>When messaging, personalize your outreach by mentioning your shared university experience.</p>
                            </li>
                        </ol>
                    </div>
                ) : currentStep === 4 ? (
                    <div className="activity-description">
                        <h2>Step 4 : Uncover the Hiring Team</h2>
                        <ol>
                            <li>
                                <p>Search for employees based on job criteria:</p>
                                <ul>
                                    <li><p>Filter by location (same city as the job posting)</p></li>
                                    <li><p>Find people in relevant departments.</p></li>
                                </ul>
                            </li>
                            <div className="activity-image">
                                <img src={step4Image1} alt="Step 1" />
                            </div>
                            <ul>
                                <li>
                                    <h3>Salimat Solebo is the most likely the Hiring Manager for this role.</h3>
                                </li>
                            </ul>
                        </ol>
                    </div>
                ) : currentStep === 5 ? (
                    <div className="activity-description">
                        <h2>Step 5 : Your Turn!</h2>
                        <ol>
                            <li>
                                <p>Analyze your filtered search results to identify potential team members.
                                </p>
                            </li>
                            <li>
                                <p>Click on a person and take note of the following:</p>
                            </li>
                            <ul>
                                <li><p>Person's Name</p></li>
                                <li><p>Company & Department details</p></li>
                                <li><p>Role details</p></li>
                            </ul>

                            <div>
                                <button onClick={addRow}>+</button>
                                <div className="x-scrollable-table">
                                    <table className="recruiters-table">
                                        <thead>
                                            <tr>
                                                {columnHeadings.map((heading, colIndex) => (
                                                    <th key={colIndex}>{heading}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {answers.tableData.map((row, rowIndex) => (
                                                <tr key={rowIndex}>
                                                    {row.map((cell, colIndex) => (
                                                        <td key={colIndex}>
                                                            <input
                                                                type="text"
                                                                value={cell}
                                                                onChange={(e) =>
                                                                    handleTableChange(rowIndex, colIndex, e.target.value)
                                                                }
                                                            />
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>

                                    </table>
                                </div>
                            </div>
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

            {showHotTipPopup && (
                <div className='hot-tip-popup'>
                    <div className='hot-tip-popup-content' ref={popupRef}>
                        <img src={step1Image2} alt='3 stars' />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Activity1;
