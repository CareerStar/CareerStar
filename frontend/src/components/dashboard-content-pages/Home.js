import React, {useState} from "react";
import astronaut from '../../assets/images/home-page-astronaut.png'
import star from '../../assets/images/star.png'
import HomepageQuestion1 from "../homepage-questionnaires/HomepageQuestion1";
import HomepageQuestion2 from "../homepage-questionnaires/HomepageQuestion2";
import HomepageQuestion3 from "../homepage-questionnaires/HomepageQuestion3";
import HomepageQuestion4 from "../homepage-questionnaires/HomepageQuestion4";
import ProgressBar from "../ProgressBar";

function Home() {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4;

    const renderPage = () => {
        switch (currentStep) {
            case 1:
                return <HomepageQuestion1 />;
            case 2:
                return <HomepageQuestion2 />;
            case 3:
                return <HomepageQuestion3/>;
            case 4:
                return <HomepageQuestion4 />;
            default:
                return <HomepageQuestion1 />;
        }
    }
    const handleClick = () => {
        setCurrentStep(currentStep + 1);
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
        </div>
    );
}

export default Home;