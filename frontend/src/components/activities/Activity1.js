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
import step2Image1 from '../../assets/images/activities/activity1/step2-image1.png';
import step3Image1 from '../../assets/images/activities/activity1/step3-image1.png';
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
    const activityId = 11;
    const [completed, setCompleted] = useState(false);
    const [alreadyCompleted, setAlreadyCompleted] = useState(false);
    const [starCount, setStarCount] = useState(3);
    const [answers, setAnswers] = useState({
        answer1: '', //Answers can not be a null JSON object, it has to have at least one key-value pair
        tableData: Array.from({ length: 4 }, () => Array(7).fill("")),
    });
    const [showPopup, setShowPopup] = useState(false);
    const [loading, setLoading] = useState(false);

    const columnHeadings = [
        "Name",
        "Company",
        "Department",
        "Role",
        "Time at Company",
        "LinkedIn",
        "Role URL",
    ];

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`https://ec2-34-227-29-26.compute-1.amazonaws.com:5000/roadmapactivity/${userId}/${activityId}`);
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
            const response = await axios.post(`https://ec2-34-227-29-26.compute-1.amazonaws.com:5000/roadmapactivity/${userId}/${activityId}`, payload);
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
        { id: 1, number: "Step 1", title: "Understanding Recruiters and Teams", icon: lawyer },
        { id: 2, number: "Step 2", title: "Contact Research & Outreach", icon: caseStudy },
        { id: 3, number: "Step 3", title: "Tools for Networking Success", icon: collaboratingInCircle },
        { id: 4, number: "Step 4", title: "Your Turn, go shine!", icon: changeUser },
    ];

    const scrollToTop = () => {
        window.scrollTo(0, 0);
    };

    const handleNext = () => {
        scrollToTop();
        if (currentStep === null) {
            setCurrentStep(1);
        } else if (currentStep === 4) {
            setShowPopup(true);
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
                    <h3>Steps for finding contacts :</h3>
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
                        <h2>Reaching out to more than Recruiters</h2>
                        <div className="inline-container">
                            <img src={clock} alt="Clock" />
                            <p>15 minutes</p>
                        </div>
                        <div className="inline-container">
                            <img src={star} alt="Star" />
                            <p>2 stars</p>
                        </div>
                        <h3>Networking Strategies</h3>
                        <p>It’s important to reach out to more than recruiters and people that have posted the job! Reaching out to the people you could actually be working with is often be much more effective.</p>

                    </div>
                ) : currentStep === 1 ? (
                    <div className="activity-description">
                        <h2>Step 1 : Understanding Recruiters & Teams</h2>
                        <ol>
                            <li>
                                <p> Pull up an active job of interest and look for information about the company division,
                                    group or team that you would be working for.</p>
                                <div className="activity-image">
                                    <img src={step1Image1} alt="Step 1" />
                                </div>
                                <div className="activity-hot-tip">
                                    <img src={fireFlameIcon} alt="Fire Flame Icon" />
                                    <p>Hot Tip! Look for things that are in capital letters,
                                        they usually signify a specific department or division within a company!</p>
                                </div>
                            </li>
                        </ol>
                    </div>
                ) : currentStep === 2 ? (
                    <div className="activity-description">
                        <h2>Step 2 : Contact Research & Outreach</h2>
                        <ol>
                            <li><p>Look for information online about this department</p></li>
                            <ul>
                                <li><p>What other division/department does this roll up to?</p></li>
                                <li><p>What person is ultimately responsible for this department’s KPIs and Lines of Business? 💯</p></li>
                                <li><p>What type of division/department would you be working for?</p></li>
                                <ul>
                                    <li><p>Ex: Engineering, Operations, Customer Applications, Research & Development</p></li>
                                </ul>
                            </ul>
                            <div className="activity-image">
                                <img src={step2Image1} alt="Step 1" />
                            </div>
                        </ol>
                    </div>
                ) : currentStep === 3 ? (
                    <div className="activity-description">
                        <h2>Step 3 : Tools for networking success</h2>
                        <ol>
                            <li><p>Go to the main company page LinkedIn page. First things first -
                                follow the company! Now you will see company updates and jobs as they are posted
                                on your LinkedIn feed!</p>
                            </li>
                            <li><p>You are now going to search people based on parameters from the job posting!
                                Location - Filter by people that are based in the same city as the job posted
                                Department Type - See point 2c above! 👔</p>
                            </li>
                            <div className="activity-image">
                                <img src={step3Image1} alt="Step 1" />
                            </div>
                        </ol>
                    </div>
                ) : currentStep === 4 ? (
                    <div className="activity-description">
                        <h2>Step 4 : Your Turn!</h2>
                        <ol>
                            <li>
                                <p>Here comes the magic - Now that you have filtered down the results,
                                    look for the team and department that you would be working with among the
                                    people results.
                                </p>
                            </li>
                            <li>
                                <p>Click on a person and take note of the following:</p>
                            </li>
                            <ul>
                                <li><p>Team Name</p></li>
                                <li><p>Time at Company</p></li>
                                <li><p>Have they already posted the role you are looking for or a similar role?</p></li>
                            </ul>

                            <div>
                                <button onClick={addRow}>+</button>
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
                        </ol>
                    </div>
                ) : null}
                <div className="activity-navigation-buttons">
                    <div className="activity-navigation-back-button" onClick={handleBack} disabled={currentStep === null} style={{ marginRight: "10px" }}>
                        {currentStep === null ? "Back to Activity Page" : "Back to Previous Step"}
                    </div>
                    <div className="activity-navigation-next-button" onClick={handleNext} disabled={currentStep === stepsData.length}>
                        {currentStep === 4 ? "Mark as completed" : "Go to Next Step"}
                    </div>
                </div>
            </div>

            {showPopup && (
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

export default Activity1;
