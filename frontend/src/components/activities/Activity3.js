import React, { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate, useLocation } from 'react-router-dom';
import caseStudy from '../../assets/images/activities/activity1/case-study.png';
import collaboratingInCircle from '../../assets/images/activities/activity1/collaborating-in-circle.png';
import lawyer from '../../assets/images/activities/activity1/lawyer.png';
import backArrow from '../../assets/images/back-arrow.png';
import activityImage from '../../assets/images/activities/activity3/activity-image.png';
import clock from '../../assets/images/activities/clock.png';
import star from '../../assets/images/activities/star.png';
import upArrowScroll from '../../assets/images/up-arrow-scroll.png';
import fireFlameIcon from '../../assets/images/fire-flame-icon.png';
import likeIcon from '../../assets/images/like-icon.png';
import dislikeIcon from '../../assets/images/dislike-icon.png';

import axios from 'axios';
import { apiUrl } from '../../utils/api';
import { useDispatch } from 'react-redux';


const Activity3 = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const prevPage = location.state?.prevPage;
    const [currentStep, setCurrentStep] = useState(null); // null shows activity description by default

    const dispatch = useDispatch();
    const userId = localStorage.getItem('userId');
    // const history = useHistory();
    const activityId = 3;
    const [completed, setCompleted] = useState(false);
    const [alreadyCompleted, setAlreadyCompleted] = useState(false);
    const [starCount, setStarCount] = useState(7);
    const [answers, setAnswers] = useState({
        draftMessage: '',
    });
    const [AIOutput, setAIOutput] = useState('');
    const [showHotTipPopup, setShowHotTipPopup] = useState(false);
    const [showLikeDislikePopup, setShowLikeDislikePopup] = useState(false);
    const [loading, setLoading] = useState(false);

    const messages = [
        { id: 1, text: "Dear XX\,\n I hope you’re doing well.\n I wanted to reach out personally to introduce myself to you. I have applied to XX role on October 20, 2024. I believe I would be a great fit for this role due to my experience as a software engineer. If there is anything I can do to help my application please let me know.", isGood: false },
        { id: 2, text: "Hi XX\,\n I'm reaching out to see if we could chat briefly about hiring at XX. It's a company I've been eyeing for some time\, and despite my efforts\, I haven't made headway in landing a role there. Your insights would be incredibly valuable in refining my approach.", isGood: true },
        { id: 3, text: "Hello Ms. XX\,\nI hope this email finds you well. I wanted to take a moment to express my gratitude for the opportunity to interview for the XX Analyst position in XX Department at XX University. It was a pleasure meeting with the team on October 15, 2024, and I greatly appreciate the chance to learn more about the role and the department. I am writing to kindly inquire about the status of the interview process and whether any updates are available regarding the next steps. Please let me know if any additional information is required from my side. I look forward to hearing from you soon.\n Thank you again for your time and consideration.", isGood: true },
        { id: 4, text: "Dear xx\,\nI hope you're doing well. I wanted to let you know that I’ve applied for the position ROLE ID XX, which aligns well with my qualifications. Please, let me know if you want to follow up on this. Best.", isGood: false },
        { id: 5, text: "Hello xx\,\nUnfortunately we have never met before, but I as an accomplished Technical Managing Director & XX XX based volunteer troop leader, it is with great interest that I am writing you about the Senior Director, XX role that you recently reposted. My journey began as a Scout Daisy in 1989 and since evolved into becoming a multi international patent holder, senior data architect and weekly troop board game organizer. I see this opportunity to foster strategic growth with The Girl Scouts of the USA as a distinguished honor and culmination of my lifelong commitment to live by the Girl Scout Law.\n I submitted my formal appplication this week. If have any time to chat about the amazing work GSUSA is currenty doing or any questions for me I would so appreaciate any engagement, of course at your convenience. Thank you so much. Have a great weekend and week ahead.", isGood: true }
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
                const response = await axios.get(apiUrl(`/roadmapactivity/${userId}/${activityId}`));
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

    const generateAIOutput = async (userMessage) => {
        setLoading(true); // Show loader

        try {
            const response = await axios.post(apiUrl('/generate-ai-feedback'), {
                prompt: `You are a Career Guide. This message is what I am sending to a recruiter. Provide feedback on the message. The feedback should be concise and also write the message in an improved way. The message is as follows:\n\n "${userMessage}"`
            });

            if (response.data && response.data.feedback) {
                setAIOutput(response.data.feedback);
            } else {
                setAIOutput("Error: Unable to fetch feedback. Please try again.");
            }
        } catch (error) {
            setAIOutput("Error: Unable to fetch feedback. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (completed) => {
        try {
            const payload = {
                userId: userId,
                completed: completed,
                answers: answers,
                stars: starCount,
            };
            const response = await axios.post(apiUrl(`/roadmapactivity/${userId}/${activityId}`), payload);
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

    const [votes, setVotes] = useState({});

    const handleVote = (id, isGood) => {
        setVotes(prevVotes => ({ ...prevVotes, [id]: isGood }));
    };

    const stepsData = [
        { id: 1, number: "Step 1", title: "Hook them with personalization!", icon: lawyer },
        { id: 2, number: "Step 2", title: "Tell why you’re reaching out! In a positive way!", icon: caseStudy },
        { id: 3, number: "Step 3", title: "Complete the activity", icon: collaboratingInCircle },
        { id: 4, number: "Step 4", title: "Draft your own message", icon: collaboratingInCircle },
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
                        <h2>Better Cold Call LinkedIn Messages</h2>
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
                        <p>Draft better LinkedIn Messages that actually get results, while learning something new at the same time!
                            Cold calling is a LIFE SKILL and social media has made it easier than ever to reach out to people.
                            Let’s make it count!
                        </p>
                        <p>
                            Remember - the goal of a cold call messages is NOT to get a job - it’s to get the person to engage back with you.
                            We’ve got a super simple formula for you that's gonna change the game, plus a hot tip.
                        </p>

                    </div>
                ) : currentStep === 1 ? (
                    <div className="activity-description">
                        <h2>Step 1 : Hook them with personalization!</h2>
                        <ol>
                            <li>
                                <p>Do your homework on the person you're reaching out to. Google them, check out their blog, stalk their LinkedIn (in a non-creepy way, of course).</p>
                                {/* <div className="activity-image">
                                    <img src={step1Image1} alt="Step 1" />
                                </div> */}
                            </li>
                            <li>
                                <p>Find that one nugget about them that most people miss. It could be something from their resume, a quote, a news article they shared, or even a podcast appearance.</p>
                                <div className="activity-hot-tip">
                                    <img src={fireFlameIcon} alt="Fire Flame Icon" />
                                    <p>Always, always, always use positive language! Words matter! Never say ‘I didn’t hear back from you..’ or
                                        ‘I wanted to know why I haven’t heard back…’ Positivity counts!</p>
                                </div>
                            </li>
                        </ol>
                    </div>
                ) : currentStep === 2 ? (
                    <div className="activity-description">
                        <h2>Step 2 : Tell them why you’re reaching out! In a positive way!</h2>
                        <ol>
                            <li>
                                <p>Tell them who you are, but make it interesting! Share a quick story that shows why you're awesome
                                    (because you are! 🌟). Make it crystal clear why they should want to meet you and what's in it for them.</p>
                            </li>
                            <li>
                                <p>Find those connection points! Maybe you're both alumni of the same school, or live in the same area.</p>
                            </li>
                            <li>
                                <p>Hi XX, I'm reaching out to see if we could chat briefly about XX's hiring process.
                                    It's a company I've been eyeing for some time, and despite my efforts, I haven't made headway in landing a role there.
                                    Your insights would be incredibly valuable in refining my approach.</p>
                            </li>
                        </ol>
                    </div>
                ) : currentStep === 3 ? (
                    <div className="activity-description">
                        <h2>Step 3 : Complete the activity</h2>
                        <div className="cold-message-vote-container">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className="cold-message-vote"
                                    style={{ backgroundColor: votes[message.id] !== undefined ? (votes[message.id] === message.isGood ? "#d4edda" : "#f8d7da") : "white" }}
                                >
                                    <div className="cold-message">
                                        {message.text.split("\n").map((line, index) => (
                                            <React.Fragment key={index}>
                                                <p>{line}</p><br />
                                            </React.Fragment>
                                        ))}
                                    </div>
                                    <div className="cold-message-answer">
                                        <p>{votes[message.id] !== undefined ? (message.isGood ? "This is a good example" : "This is a bad example") : ''}</p>
                                    </div>
                                    <div className="cold-message-vote-buttons">
                                        <div
                                            className="cold-message-vote-button"
                                            onClick={() => handleVote(message.id, true)}
                                        >👍</div>
                                        <div
                                            className="cold-message-vote-button"
                                            onClick={() => handleVote(message.id, false)}
                                        >👎</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : currentStep === 4 ? (
                    <div className="activity-description">
                        <h2>Step 4 : Draft your own message</h2>
                        <textarea
                            className="activity-draft-message"
                            type="text"
                            placeholder="Write your message here..."
                            value={answers.draftMessage || ''}
                            onChange={(e) => setAnswers({ ...answers, draftMessage: e.target.value })}
                        />
                        <button className="get-ai-feedback-button" onClick={() => generateAIOutput(answers.draftMessage)}>Get AI Feedback</button>
                        {AIOutput && (
                            <div className="ai-output">
                                <h3>AI Feedback:</h3>
                                <div className="ai-output-content">
                                    <ReactMarkdown>{AIOutput}</ReactMarkdown>
                                </div>
                            </div>
                        )}
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

export default Activity3;
