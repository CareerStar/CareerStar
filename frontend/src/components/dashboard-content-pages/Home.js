import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../../utils/api';
import StarField from '../StarField';
import astronaut from '../../assets/images/home-page-astronaut.png'
import star from '../../assets/images/star-yellow.png'
import HomepageQuestion1 from "../homepage-questionnaires/HomepageQuestion1";
import HomepageQuestion2 from "../homepage-questionnaires/HomepageQuestion2";
import HomepageQuestion3 from "../homepage-questionnaires/HomepageQuestion3";
import HomepageQuestion4 from "../homepage-questionnaires/HomepageQuestion4";
import HomepageQuestion5 from "../homepage-questionnaires/HomepageQuestion5";
import ProgressBar from "../ProgressBar";
import Events from "../Events";
import QoD from "../question-of-the-day/QoD";
import TopActivities from "../TopActivities";
import DailyPopup from "./DailyPopup";
import Stars3 from "../../assets/images/stars3.png";

function Home({ onComplete, userId }) {
    const stars = useSelector(state => state.starCount);
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [videoEnded, setVideoEnded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userDetails, setUserDetails] = useState({});
    const [activityChoices, setActivityChoices] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [answers, setAnswers] = useState({
        describeMe: 'NA',
        currentSituation: 'A student at NYIT',
        goal: '',
        onboarded: false,
        choice: '',
        summary: '',
        degree: '',
        major: '',
        activityChoices: [],
        universityId: null
    });
    const [showSignupStarsPopup, setShowSignupStarsPopup] = useState(false);
    const [errors, setErrors] = useState({
        describeMe: '',
        currentSituation: '',
        goal: '',
        degree: '',
        major: '',
        universityId: ''
    });

    const totalSteps = 3;

    const buttonVisibility = {
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: false
    };

    useEffect(() => {
        const fetchUserDetails = async () => {
            setLoading(true);
            try {
                const response = await fetch(apiUrl(`/user/${userId}`));
                // const response = await fetch(`http://localhost:8080/users/${userId}`);
                const data = await response.json();
                if (response.ok) {
                    setUserDetails(data);
                } else {
                    console.error('Error fetching user details:', data);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }

            try {
                const response = await fetch(apiUrl(`/onboarding/${userId}`));
                // const response = await fetch(`http://localhost:8080/onboarding/${userId}`);
                const data = await response.json();
                if (response.ok) {
                    if (data.onboarded) {
                        setCurrentStep(4);
                    }
                    setAnswers((prevAnswers) => ({
                        ...prevAnswers,
                        ["describeMe"]: data.describeMe,
                        ["currentSituation"]: data.currentSituation,
                        ["goal"]: data.goal,
                        ["onboarded"]: data.onboarded,
                    }));
                } else {
                    console.error('Error fetching user details:', data);
                    setShowPopup(true);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
                setShowPopup(true);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUserDetails();
        }
    }, [userId]);

    // Show the signup stars popup only after onboarding is complete
    useEffect(() => {
        const isOnboardingComplete = answers.onboarded || currentStep >= 4;
        if (isOnboardingComplete && localStorage.getItem('show_signup_stars_after_onboarding') === 'true') {
            setShowSignupStarsPopup(true);
            localStorage.removeItem('show_signup_stars_after_onboarding');
        }
    }, [answers.onboarded, currentStep]);

    // Auto-dismiss the 3-star popup so it doesn't block sidebar interaction
    useEffect(() => {
        if (showSignupStarsPopup) {
            const timer = setTimeout(() => setShowSignupStarsPopup(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [showSignupStarsPopup]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter') {
                handleClick();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentStep, answers]);

    const scrollToBottom = () => {
        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        }, 100);
    };

    const scrollToTop = () => {
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 100);
    };

    const handleOptionSelect = async (selectedOption) => {
        if (selectedOption === 'roadmap') {
            answers.onboarded = true;
            answers.choice = 'roadmap';
            await addUserOnboardingDeatils();
            onComplete('Roadmap');
        } else if (selectedOption === 'activities') {
            answers.onboarded = true;
            answers.choice = 'activities';
            // await addUserOnboardingDeatils();
            setCurrentStep(currentStep + 1);
        }
    };

    const saveUserOnboardingDetailsWithActivities = async () => {
        setLoading(true);
        answers.onboarded = true;
        answers.choice = 'activities';
        answers.activityChoices = activityChoices;
        try {
            await addUserOnboardingDeatils();
        } catch (error) {
            console.error("Error adding onboarding details:", error);
        } finally {
            setTimeout(() => {
                setCurrentStep(currentStep + 1);
                onComplete('Home');
            }, 0);
            setLoading(false);
        }
    }

    const handleActivityChoicesSelect = async (selectedActivities) => {
        setActivityChoices(selectedActivities);
    }

    const addUserOnboardingDeatils = async () => {
        try {
            const universityIdNumeric = Number(answers.universityId) || 0;
            const requestBody = {
                "userId": userId,
                "describeMe": answers.describeMe,
                "currentSituation": answers.currentSituation,
                "goal": answers.goal,
                "onboarded": answers.onboarded,
                "choice": answers.choice,
                "summary": answers.summary,
                "degree": answers.degree,
                "major": answers.major,
                "activityChoices": answers.activityChoices,
                "universityId": universityIdNumeric
            };
            const response = await axios.post(apiUrl('/onboarding'), requestBody);
            // const response = await axios.post('http://localhost:8080/onboarding', requestBody);
            if (response.status === 200 || response.status === 201) {
                const { responseUserId } = response.data;
                return true;
            } else {
                console.error('Error adding user onboarding details:', response);
                return false;
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            return false;
        }
    }


    const handleAnswerChange = (field, value) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [field]: value,
        }));
    }

    const renderPage = () => {
        switch (currentStep) {
            case 1:
                return (
                    <>
                        <HomepageQuestion3 onChange={(value) => handleAnswerChange('goal', value)} />
                        {errors.goal && <div className='error-text'><p>{errors.goal}</p></div>}
                    </>
                );
            case 2:
                return (
                    <>
                        <HomepageQuestion4 onChangeDegree={(value) => handleAnswerChange('degree', value)} onChangeMajor={(value) => handleAnswerChange('major', value)} onChangeUniversity={(value) => handleAnswerChange('universityId', value)} />
                        {errors.degree && <div className='error-text'><p>{errors.degree}</p></div>}
                        {errors.major && <div className='error-text'><p>{errors.major}</p></div>}
                        {errors.universityId && <div className='error-text'><p>{errors.universityId}</p></div>}
                    </>
                );
            case 3:
                return (
                    <HomepageQuestion5 onActivityChoicesSelect={handleActivityChoicesSelect} />
                );
            case 4:
                return (
                    <div className="home-page-content">
                        <TopActivities userId={userId} />
                        {/*<Events userId={userId} />*/}
                        {/*<QoD />*/}
                    </div>
                );
            default:
                return <HomepageQuestion1 />;
        }
    };

    const validateStep = () => {
        let stepErrors = {};
        if (currentStep === 1 && !answers.goal.trim()) {
            stepErrors.describeMe = 'This field cannot be empty*';
        }
        if (currentStep === 2 && !answers.degree.trim()) {
            stepErrors.degree = 'Please choose your degree*';
        }
        if (currentStep === 2 && !answers.major.trim()) {
            stepErrors.major = 'Please choose your major*';
        }
        // if (currentStep === 2 && !answers.universityId) {
        //     stepErrors.universityId = 'Please choose your university*';
        // }
        setErrors(stepErrors);
        return Object.keys(stepErrors).length === 0;
    };

    const handleClick = () => {
        if (validateStep()) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleSkipVideo = () => {
        setCurrentStep(1);
    }

    const handleVideoEnd = () => {
        setVideoEnded(true);
    }

    const cleanLastName = (() => {
        const ln = (userDetails.lastname || '').trim();
        if (!ln) return '';
        const lowered = ln.toLowerCase();
        if (lowered === 'no last name' || lowered === 'n/a' || lowered === 'null' || lowered === 'undefined') return '';
        return ln;
    })();
    const studentName = `${(userDetails.firstname || '').trim()} ${cleanLastName}`.trim();

    return (
        <div className="home">
            {loading && (
                <div className="spinner-overlay">
                    <div className="spinner"></div>
                </div>
            )}
            {showPopup && (
                <div className='popup'>
                    <div className='popup-content'>
                        <div className='earned-star'>Onboarding process</div>
                        <div className='popup-text'>
                            <p>Please complete your profile by answering three quick questions.</p>
                        </div>
                        <div className='popup-submit-button' onClick={() => { setShowPopup(false); scrollToBottom(); }}>
                            <p>Continue</p>
                        </div>
                    </div>
                </div>
            )}

            {(answers.onboarded || currentStep >= 4) && (
                <DailyPopup userId={userId} studentName={studentName} />
            )}

            {showSignupStarsPopup && (
                <div className='popup' onClick={() => setShowSignupStarsPopup(false)}>
                    <div className='popup-content' onClick={(e) => e.stopPropagation()}>
                        <button
                            className='close material-icons'
                            onClick={() => setShowSignupStarsPopup(false)}
                            style={{ position: 'absolute', top: 8, right: 12, background: 'transparent', border: 'none', cursor: 'pointer' }}
                        >
                            close
                        </button>
                        <img src={Stars3} alt='3 stars' />
                        <div className='earned-star'>You earned 3 stars!</div>
                        <div className='popup-submit-button' onClick={() => setShowSignupStarsPopup(false)}>
                            <p>Let's get started</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="home-welcome">
                <div className='home-welcome-left'>
                    <img src={astronaut} alt="Astronaut" />
                    <div className="home-welcome-left-text">
                        <h1>Welcome, {userDetails.firstname}!</h1>
                        <p>It's a great day to be a Career Star!</p>
                    </div>
                </div>
                {/* <div className="home-welcome-right"><span className="star-count"> {stars} </span>  <img src={star} className='star' /></div> */}
            </div>
            {currentStep >= 1 && currentStep < totalSteps ? (
                <div className="home-questions">
                    <div className="home-questions-border">
                        <span className="personalize-text">LET'S PERSONALIZE YOUR CAREERSTAR JOURNEY</span>
                        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
                        <div className="home-question-wrapper">
                            {renderPage()}
                        </div>
                        {buttonVisibility[currentStep] && (
                            <div className='home-page-button' onClick={() => { handleClick(); scrollToBottom(); }}>
                                <p>Continue</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : currentStep === (totalSteps) ? (
                <div className="home-questions">
                    <div className="home-questions-border">
                        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
                        <span className="personalize-text">LET'S GET GOING THEN!</span>
                        <div className="home-question-wrapper">
                            {renderPage()}
                        </div>
                        <div className='home-page-button' onClick={() => { saveUserOnboardingDetailsWithActivities(); scrollToTop(); }}>
                            <p>Continue</p>
                        </div>
                    </div>
                </div>
            ) : currentStep === (totalSteps + 1) ? (
                <div className="">
                    {renderPage()}
                     <StarField />
                </div>
            ) : (
                <div className="home-questions">
                    <div className="home-questions-border">
                        {/* <iframe
                            width="754"
                            height="392"
                            src="https://www.youtube.com/embed/b7eMnAn_WhI?si=_JK_K37lxh5f7HI0"
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            onEnded={handleVideoEnd}
                        >
                        
                        </iframe> */}
                        <div
                            style={{
                                position: 'relative',
                                width: '100%',
                                height: 0,
                                paddingTop: '100%',
                                paddingBottom: 0,
                                boxShadow: '0 2px 8px 0 rgba(63,69,81,0.16)',
                                marginTop: '1.6em',
                                marginBottom: '0.9em',
                                overflow: 'hidden',
                                borderRadius: '8px',
                                willChange: 'transform',
                            }}
                        >
                            <iframe
                                loading="lazy"
                                style={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    top: 0,
                                    left: 0,
                                    border: 'none',
                                    padding: 0,
                                    margin: 0,
                                }}
                                src="https://www.canva.com/design/DAGda-KOPbc/GC-CM5QHez5oM-AlkYEpVg/watch?embed"
                                allowFullScreen
                                title="Canva Design Embed"
                            ></iframe>
                            <a
                                href="https://www.canva.com/design/DAGda-KOPbc/GC-CM5QHez5oM-AlkYEpVg/watch?utm_content=DAGda-KOPbc&utm_campaign=designshare&utm_medium=embeds&utm_source=link"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ display: 'block', marginTop: '1em', textAlign: 'center' }}
                            >
                                Welome to CareerStar
                            </a>
                        </div>
                        <div className='home-page-button' onClick={handleSkipVideo}>
                            <p>{videoEnded ? "Next" : "Skip Video"}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
