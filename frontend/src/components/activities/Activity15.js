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


const Activity15 = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const prevPage = location.state?.prevPage;
    const [currentStep, setCurrentStep] = useState(null); // null shows activity description by default

    const dispatch = useDispatch();
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('firstname');
    // const history = useHistory();
    const activityId = 15;
    const [completed, setCompleted] = useState(false);
    const [alreadyCompleted, setAlreadyCompleted] = useState(false);
    const [starCount, setStarCount] = useState(5);
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

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    useEffect(() => {
        scrollToTop();
    }, []);

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
    const handleSubmit = async (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
          }        
        try {
          const payload = {
            userId: userId,
            completed: true,
            answers: answers,
            stars: 5,
          };
      
          // roadmap POST 
          const response = await axios.post(
            `https://api.careerstar.co/roadmapactivity/${userId}/${activityId}`,
            payload
          );
      
          // internship info
          const internshipPayload = {
            user_id: userId,
            user_name: userName,
            term: answers.term,
            year: answers.year,
            role_title: answers.roleTitle,
            manager_name: answers.managerName,
            team_size: answers.teamSize,
            division: answers.division,
            technologies: answers.technologies,
            feedback_frequency: answers.feedbackFrequency,
            astro_sign: answers.astroSign,
            help: answers.help,
          };
      
        
      
          if (response.status === 200) {
            setCompleted(true);
            if (!alreadyCompleted) {
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
      
      const handleLikeDislike = async (liked) => {
        try {
          await handleSubmit(); 
      
          const payload = {
            user_id: userId,
            user_name: userName,
            term: answers.term,
            year: answers.year,
            roleTitle: answers.roleTitle,
            managerName: answers.managerName,
            teamSize: answers.teamSize,
            division: answers.division,
            technologies: answers.technologies,
            feedbackFrequency: answers.feedbackFrequency,
            astroSign: answers.astroSign,
            help: answers.help,
          };
      
          await axios.post('https://api.careerstar.co/user-internship-info', payload);
      
          if (prevPage === 'activities') {
            navigate('/dashboard/activities');
          } else {
            navigate('/dashboard/home');
          }
        } catch (error) {
          console.error('Error saving answers:', error);
        }
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
        { id: 1, number: "Step 1", title: "Tell us about yourself", icon: lawyer },
        { id: 2, number: "Step 2", title: "Tell us about your team", icon: caseStudy },
        { id: 3, number: "Step 3", title: "Tell us about your work", icon: collaboratingInCircle },
        { id: 4, number: "Step 4", title: "Final questions", icon: collaboratingInCircle },
        // { id: 5, number: "Step 5", title: "Your Turn, go shine!", icon: changeUser },
    ];

    const handleStepChange = (stepId) => {
        scrollToTop();
        setCurrentStep(stepId);

        // Clear only the fields for the new step
        if (stepId === 1) {
            setAnswers(prev => ({
                ...prev,
                term: '',
                year: '',
                roleTitle: ''
            }));
        } else if (stepId === 2) {
            setAnswers(prev => ({
                ...prev,
                managerName: '',
                teamSize: ''
            }));
        } else if (stepId === 3) {
            setAnswers(prev => ({
                ...prev,
                division: '',
                technologies: '',
                feedbackFrequency: ''
            }));
        } else if (stepId === 4) {
            setAnswers(prev => ({
                ...prev,
                astroSign: '',
                help: ''
            }));
        }
    };

    const handleNext = () => {
        scrollToTop();
        if (currentStep === null) {
            handleStepChange(1);
        } else if (currentStep === stepsData.length) {
            setShowLikeDislikePopup(true);
        } else if (currentStep < stepsData.length) {
            handleStepChange(currentStep + 1); // <-- This will clear the fields!
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

    // Validation for required fields in each step
    const isStepValid = () => {
        if (currentStep === 1) {
            return (
                answers.term &&
                answers.year &&
                answers.roleTitle
            );
        } else if (currentStep === 2) {
            return (
                answers.managerName &&
                answers.teamSize
            );
        } else if (currentStep === 3) {
            return (
                answers.division &&
                answers.technologies &&
                answers.feedbackFrequency
            );
        } else if (currentStep === 4) {
            return (
                answers.astroSign &&
                answers.help
            );
        }
        return true;
    };

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
                        <h2>We Want to Know About Your Internship</h2>
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
                        <h3>Help us Help you!</h3>
                        <p>Help us help you! Fill out a quick form so we can understand more about your role. This activity is mandatory, but only takes a minute or two!</p>

                    </div>
                ) : currentStep === 1 ? (
                    <form className="activity-description" onSubmit={handleSubmit}>
                        <h2>Step 1 : Tell us about yourself</h2>
                        <div className="activity15-term-year-row">
                            <div>
                                <label>Expected Term of Graduation</label>
                                <select
                                    name="term"
                                    value={answers.term || ''}
                                    onChange={e => setAnswers({ ...answers, term: e.target.value })}
                                    required
                                >
                                    <option value="">Select term</option>
                                    <option value="Winter">Winter</option>
                                    <option value="Spring">Spring</option>
                                    <option value="Summer">Summer</option>
                                    <option value="Fall">Fall</option>
                                </select>
                            </div>
                            <div>
                                <label>Year</label>
                                <select
                                    name="year"
                                    value={answers.year || ''}
                                    onChange={e => setAnswers({ ...answers, year: e.target.value })}
                                    required
                                >
                                    <option value="">Select year</option>
                                    {[2024, 2025, 2026, 2027, 2028].map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label>Role Title at Internship</label>
                            <input
                                type="text"
                                name="roleTitle"
                                value={answers.roleTitle || ''}
                                onChange={e => setAnswers({ ...answers, roleTitle: e.target.value })}
                                required
                            />
                        </div>
                    </form>
                ) : currentStep === 2 ? (
                    <div className="activity-description">
                        <h2>Step 2 :Tell us about your team</h2>
                        {/* <ol>
                            <li><p>Gather details about the department:</p></li>
                            <ul>
                                <li><p>What are the responsibilities of this department?</p></li>
                                <li><p>Search for the keywords (here example: Advanced Data Science, Artificial Intelligence)</p></li>
                                <li><p>What person is ultimately responsible for this department’s KPIs and Lines of Business?</p></li>
                                <li><p>What is the department’s focus area (e.g., Engineering, Operations, Research & Development)?</p></li>
                            </ul>
                            <div className="activity-image">
                                <img src={step2Image1} alt="Step 1" />
                            </div>
                        </ol> */}
                        <h2>Manager Name</h2>
                        <div className="activity-input">
                            <input
                                type="text"
                                name="managerName"
                                placeholder="Enter Manager Name"
                                value={answers.managerName || ''}
                                onChange={e => setAnswers({ ...answers, managerName: e.target.value })}
                            />
                        </div>

                        <h2>Approx. number of people on your team</h2>
                        <div className="activity-input">
                            <input
                                type="number"
                                name="teamSize"
                                placeholder="Enter Team Size"
                                value={answers.teamSize || ''}
                                onChange={e => setAnswers({ ...answers, teamSize: e.target.value })}
                            />
                        </div>

                    </div>
                ) : currentStep === 3 ? (
                    <div className="activity-description">
                        <h2>Step 3 : Tell us about your work</h2>

                        {/* <ol>
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
                        </ol> */}
                        <h2>Division/Group at Company</h2>
                        <div className="activity-input">
                            <input
                                type="text"
                                name="division"
                                placeholder="Enter Division/Group at Company"
                                value={answers.division || ''}
                                onChange={e => setAnswers({ ...answers, division: e.target.value })}
                            />
                        </div>
                        <h2>Primary technologies</h2>
                        <div className="activity-input">
                            <input
                                type="text"
                                name="technologies"
                                placeholder="Enter Primary Technologies"
                                value={answers.technologies || ''}
                                onChange={e => setAnswers({ ...answers, technologies: e.target.value })}
                            />
                        </div>   
                        <h2>Feedback Frequency</h2>
                        <div className="radio-group">
                        <label>
                            <input
                                type="radio"
                                name="feedbackFrequency"
                                value="daily"
                                checked={answers.feedbackFrequency === "daily"}
                                onChange={(e) =>
                                    setAnswers({ ...answers, feedbackFrequency: e.target.value })
                                }
                            />
                            Daily
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="feedbackFrequency"
                                value="weekly"
                                checked={answers.feedbackFrequency === "weekly"}
                                onChange={(e) =>
                                    setAnswers({ ...answers, feedbackFrequency: e.target.value })
                                }
                            />
                            Weekly
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="feedbackFrequency"
                                value="every_2_weeks"
                                checked={answers.feedbackFrequency === "every_2_weeks"}
                                onChange={(e) =>
                                    setAnswers({ ...answers, feedbackFrequency: e.target.value })
                                }
                            />
                            Every 2 weeks
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="feedbackFrequency"
                                value="rarely"
                                checked={answers.feedbackFrequency === "rarely"}
                                onChange={(e) =>
                                    setAnswers({ ...answers, feedbackFrequency: e.target.value })
                                }
                            />
                            Rarely
                        </label>
                        </div>
                    </div>
            ) : currentStep === 4 ? (
            <div className="activity-description">
                <h2>Step 4 : Final questions</h2>
                {/* <ol>
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
                        </ol> */}
                <h2>Astrological Sign</h2>
                    <div className="activity-input">
                        <input
                            type="text"
                            name="astroSign"
                            placeholder="Enter Astrological Sign"
                            value={answers.astroSign || ''}
                            onChange={e => setAnswers({ ...answers, astroSign: e.target.value })}
                        />
                    </div> 
               
                <h2>How can we help you?</h2>
                    <div className="activity-input">
                        <input
                            type="text"
                            name="help"
                            placeholder="Enter How can we help you?"
                            value={answers.help || ''}
                            onChange={e => setAnswers({ ...answers, help: e.target.value })}
                        />
                    </div> 
            </div>
            )
                //: currentStep === 5 ? (
                //     <div className="activity-description">
                //         <h2>Step 5 : Your Turn!</h2>
                //         <ol>
                //             <li>
                //                 <p>Analyze your filtered search results to identify potential team members.
                //                 </p>
                //             </li>
                //             <li>
                //                 <p>Click on a person and take note of the following:</p>
                //             </li>
                //             <ul>
                //                 <li><p>Person's Name</p></li>
                //                 <li><p>Company & Department details</p></li>
                //                 <li><p>Role details</p></li>
                //             </ul>

                //             <div>
                //                 <button onClick={addRow}>+</button>
                //                 <div className="x-scrollable-table">
                //                     <table className="recruiters-table">
                //                         <thead>
                //                             <tr>
                //                                 {columnHeadings.map((heading, colIndex) => (
                //                                     <th key={colIndex}>{heading}</th>
                //                                 ))}
                //                             </tr>
                //                         </thead>
                //                         <tbody>
                //                             {answers.tableData.map((row, rowIndex) => (
                //                                 <tr key={rowIndex}>
                //                                     {row.map((cell, colIndex) => (
                //                                         <td key={colIndex}>
                //                                             <input
                //                                                 type="text"
                //                                                 value={cell}
                //                                                 onChange={(e) =>
                //                                                     handleTableChange(rowIndex, colIndex, e.target.value)
                //                                                 }
                //                                             />
                //                                         </td>
                //                                     ))}
                //                                 </tr>
                //                             ))}
                //                         </tbody>

                //                     </table>
                //                 </div>
                //             </div>
                //         </ol>
                //     </div>
                //) 
                :null}
                                            <div className="activity-navigation-buttons">
                                                <div className="activity-navigation-back-button" onClick={handleBack} disabled={currentStep === null} style={{ marginRight: "10px" }}>
                                                    {currentStep === null ? "Back to Activity Page" : "Back to Previous Step"}
                                                </div>
                                                <button
                                                    type="button"
                                                    className="activity-navigation-next-button"
                                                    onClick={handleNext}
                                                    disabled={!isStepValid()}
                                                    >
                                                    {currentStep === stepsData.length ? "Mark as completed" : "Go to Next Step"}
                                                </button>
                                            </div>
                                        </div>

                                        {showLikeDislikePopup && (
                                            <div className='activity-like-dislike-popup'>
                                                <div className='activity-like-dislike-popup-content'>
                                                    <p>How did you find this activity?</p>
                                                    <div className='activity-like-dislike-buttons'>
                                                        <div className='activity-like-button' onClick={() => handleLikeDislike(true)}>
                                                            <img src={likeIcon} alt="Like" />
                                                        </div>
                                                        <div className='activity-dislike-button' onClick={() => handleLikeDislike(false)}>
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

                                    export default Activity15;
