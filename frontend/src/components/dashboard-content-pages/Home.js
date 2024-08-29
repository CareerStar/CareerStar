import React, { useState } from "react";
import { Navigate, useNavigate } from 'react-router-dom';
import astronaut from '../../assets/images/home-page-astronaut.png'
import star from '../../assets/images/star.png'
import HomepageQuestion1 from "../homepage-questionnaires/HomepageQuestion1";
import HomepageQuestion2 from "../homepage-questionnaires/HomepageQuestion2";
import HomepageQuestion3 from "../homepage-questionnaires/HomepageQuestion3";
import HomepageQuestion4 from "../homepage-questionnaires/HomepageQuestion4";
import HomepageQuestion5 from "../homepage-questionnaires/HomepageQuestion5";
import ProgressBar from "../ProgressBar";
import Activities from "../Activities";

function Home({ onComplete }) {
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(0);
    const [videoEnded, setVideoEnded] = useState(false);
    const totalSteps = 4;

    const handleOptionSelect = (selectedOption) => {
        console.log(`Option selected: ${selectedOption}`);
        // You can perform additional actions based on the selected option here
        // For example, navigate to another page, update state, etc.
        if (selectedOption === 'roadmap') {
            onComplete('Roadmap');
        } else if (selectedOption === 'activities') {
            setCurrentStep(currentStep + 1);
        }
    };

    const renderPage = () => {
        switch (currentStep) {
            case 1:
                return <HomepageQuestion1 />;
            case 2:
                return <HomepageQuestion2 />;
            case 3:
                return <HomepageQuestion3 />;
            case 4:
                return <HomepageQuestion4 onOptionSelect={handleOptionSelect} />;
            case 5:
                return <HomepageQuestion5 />;
            case 6:
                return <Activities />;
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
                        <h1>Welcome, Abigail!</h1>
                        <p>It's great day to be a career star!</p>
                    </div>
                </div>
                <div className="home-welcome-right"><span className="star-count"> 3 </span>  <img src={star} className='star' /></div>
            </div>
            {currentStep >= 1 && currentStep <= totalSteps ? (
                <div className="home-questions">
                    <span className="personalize-text">LET'S PERSONALIZE YOUR CAREERSTAR JOURNEY</span>
                    <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
                    <div className="home-question-wrapper">
                        {renderPage()}
                    </div>
                    <div className='home-page-button' onClick={handleClick}>
                        <p>Continue</p>
                    </div>
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