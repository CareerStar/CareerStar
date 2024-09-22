import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import astronaut from '../../assets/images/home-page-astronaut.png'
import star from '../../assets/images/star.png'
import HomepageQuestion1 from "../homepage-questionnaires/HomepageQuestion1";
import HomepageQuestion2 from "../homepage-questionnaires/HomepageQuestion2";
import HomepageQuestion3 from "../homepage-questionnaires/HomepageQuestion3";
import HomepageQuestion4 from "../homepage-questionnaires/HomepageQuestion4";
import HomepageQuestion5 from "../homepage-questionnaires/HomepageQuestion5";
import ProgressBar from "../ProgressBar";
import Activities from "../Activities";

function Home({ onComplete, userId }) {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [videoEnded, setVideoEnded] = useState(false);
    const [userDetails, setUserDetails] = useState({});
    const [answers, setAnswers] = useState({
        describeMe: '',
        currentSituation: '',
        goal: '',
        onboarded: false,
        choice: '',
        summary: 'My summary',
    });
    const totalSteps = 4;

    const buttonVisibility = {
        1: true,
        2: true,
        3: true,
        4: false,
        5: true,
        6: false
    };

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:5000/user/${userId}`);
                // const response = await fetch(`http://localhost:8080/users/${userId}`);
                // console.log('Response:', response, "User ID:", userId);
                const data = await response.json();
                if (response.ok) {
                    setUserDetails(data);
                    console.log('User details:', data);
                } else {
                    console.error('Error fetching user details:', data);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }

            try {
                const response = await fetch(`http://127.0.0.1:5000/onboarding/${userId}`);
                // const response = await fetch(`http://localhost:8080/onboarding/${userId}`);
                const data = await response.json();
                if (response.ok) {
                    if (data.onboarded) {
                        if (data.choice === 'roadmap') {
                            onComplete('Roadmap');
                        } else if (data.choice === 'activities') {
                            setCurrentStep(6);
                        }
                    }
                    setAnswers((prevAnswers) => ({
                        ...prevAnswers,
                        ["describeMe"]: data.describeMe,
                        ["currentSituation"]: data.currentSituation,
                        ["goal"]: data.goal,
                        ["onboarded"]: data.onboarded,
                    }));
                    console.log('User onboarding details:', data);
                } else {
                    console.error('Error fetching user details:', data);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        if (userId) {
            fetchUserDetails();
        }
    }, [userId]);

    const handleOptionSelect = (selectedOption) => {
        console.log(`Option selected: ${selectedOption}`);
        if (selectedOption === 'roadmap') {
            answers.onboarded = true;
            answers.choice = 'roadmap'; 
            onComplete('Roadmap');
        } else if (selectedOption === 'activities') {
            answers.onboarded = true;
            answers.choice = 'activities';
            setCurrentStep(currentStep + 1);
        }
        addUserOnboardingDeatils();
    };

    const addUserOnboardingDeatils = async () => {
        try {
            const requestBody = {
                "userId": userId,
                "describeMe": answers.describeMe,
                "currentSituation": answers.currentSituation,
                "goal": answers.goal,
                "onboarded": answers.onboarded,
                "choice": answers.choice,
                "summary": answers.summary,
            };
            // console.log('Request body:', requestBody);
            const response = await axios.post('http://127.0.0.1:5000/onboarding', requestBody);
            // const response = await axios.post('http://localhost:8080/onboarding', requestBody);
            if (response.status === 200) {
                const {responseUserId} = response.data;
                console.log('User onboarding details added successfully!', responseUserId);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
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
                return <HomepageQuestion1 onChange={(value) => handleAnswerChange('describeMe', value)}/>;
            case 2:
                return <HomepageQuestion2 onChange={(value) => handleAnswerChange('currentSituation', value)}/>;
            case 3:
                return <HomepageQuestion3 onChange={(value) => handleAnswerChange('goal', value)}/>;
            case 4:
                return <HomepageQuestion4 onOptionSelect={handleOptionSelect} />;
            case 5:
                return <HomepageQuestion5 />;
            case 6:
                return <Activities userId={userId}/>;
            default:
                return <HomepageQuestion1 />;
        }
    }
    const handleClick = () => {
        setCurrentStep(currentStep + 1);
        if (currentStep === totalSteps) {
            onComplete('Roadmap');
        }
    }

    const handleClickActivities = () => {
        setCurrentStep(currentStep + 1);
    }

    const handleSkipVideo = () => {
        setCurrentStep(1);
    }

    const handleVideoEnd = () => {
        setVideoEnded(true);
    }

    return (
        <div className="home">
            <div className="home-welcome">
                <div className='home-welcome-left'>
                    <img src={astronaut} alt="Astronaut" />
                    <div className="home-welcome-left-text">
                        <h1>Welcome, {userDetails.firstname}!</h1>
                        <p>It's great day to be a career star!</p>
                    </div>
                </div>
                <div className="home-welcome-right"><span className="star-count"> {userDetails.stars} </span>  <img src={star} className='star' /></div>
            </div>
            {currentStep >= 1 && currentStep <= totalSteps ? (
                <div className="home-questions">
                    <span className="personalize-text">LET'S PERSONALIZE YOUR CAREERSTAR JOURNEY</span>
                    <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
                    <div className="home-question-wrapper">
                        {renderPage()}
                    </div>
                    {buttonVisibility[currentStep] && (
                        <div className='home-page-button' onClick={handleClick}>
                            <p>Continue</p>
                        </div>
                    )}
                </div>
            ) : currentStep === (totalSteps + 1) ? (
                <div className="home-questions">
                    <span className="personalize-text">LET'S GET GOING THEN!</span>
                    <div className="home-question-wrapper">
                        {renderPage()}
                    </div>
                    <div className='home-page-button' onClick={handleClickActivities}>
                        <p>Continue</p>
                    </div>
                </div>
            ) : currentStep === (totalSteps + 2) ? (
                <div className="">
                    {renderPage()}
                </div>
            ) : (
                <div className="home-questions">
                    <iframe
                        width="754"
                        height="392"
                        src="https://www.youtube.com/embed/epZ5_DVQzFE"
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        onEnded={handleVideoEnd}
                    >
                    </iframe>
                    <div className='home-page-skip-video-button' onClick={handleSkipVideo}>
                        <p>{videoEnded ? "Next" : "Skip Video"}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;