import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import caseStudy from '../../assets/images/activities/activity1/case-study.png';
import backArrow from '../../assets/images/back-arrow.png';
import activityImage from '../../assets/images/activities/activity10/activity-image.jpg';
import clock from '../../assets/images/activities/clock.png';
import star from '../../assets/images/activities/star.png';
import upArrowScroll from '../../assets/images/up-arrow-scroll.png';
import fireFlameIcon from '../../assets/images/fire-flame-icon.png';
import likeIcon from '../../assets/images/like-icon.png';
import dislikeIcon from '../../assets/images/dislike-icon.png';
import coffeeShopIcon from '../../assets/images/activities/activity10/coffee-icon.png';
import speakingIcon from '../../assets/images/activities/activity10/speaking-icon.png';
import cameraIcon from '../../assets/images/activities/activity10/camera-icon.png';

import axios from 'axios';
import { useDispatch } from 'react-redux';

const Activity10 = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const prevPage = location.state?.prevPage;
    const [currentStep, setCurrentStep] = useState(null);

    const dispatch = useDispatch();
    const userId = localStorage.getItem('userId');
    const activityId = 10;
    const [completed, setCompleted] = useState(false);
    const [alreadyCompleted, setAlreadyCompleted] = useState(false);
    const [starCount, setStarCount] = useState(10);
    const [answers, setAnswers] = useState({
        selectedPhrase: '',
        customPhrase: '',
        result: '',
        reflection: '',
        photoUrl: ''
    });
    const [showHotTipPopup, setShowHotTipPopup] = useState(false);
    const [showLikeDislikePopup, setShowLikeDislikePopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const fileInputRef = useRef(null);
    const popupRef = useRef(null);

    const negotiationPhrases = [
        "I'm part of a professional development program and we're doing a challenge. Can I have 10% off my coffee today as a one-time favor? Thank you so much.",
        "Do you have a 10% student discount? I'm doing a program that helps me develop confidence and soft skills and I would love to practice here by getting 10% off. Thank you so much.",
        "I'll have a tall americano with a 10% discount. I've had a rough day and thought I would ask. Thank you!",
        "I'm practicing negotiation skills for a professional development course. Would it be possible to get a 10% discount on my order today? I'd really appreciate it!",
        "Is there any chance I could get a small discount today? I'm working on building my confidence in asking for things."
    ];

    const resultOptions = [
        "They gave me the discount! 🎉",
        "They said no, but were nice about it 😊",
        "They seemed confused but gave me the discount anyway 🤔",
        "They said no and seemed annoyed 😬",
        "They laughed and gave me a smaller discount 😄",
        "Other (describe in reflection)"
    ];

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
                    if (response.data[0].photoUrl) {
                        setUploadedImage(response.data[0].photoUrl);
                        setUploadSuccess(true);
                    }
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

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file);
            setUploadedImage(URL.createObjectURL(file));
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleUploadImage = async () => {
        if (!imageFile) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', imageFile);
            formData.append('userId', userId);
            formData.append('activityId', activityId);

            const response = await axios.post('https://api.careerstar.co/upload-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data && response.data.imageURL) {
                setAnswers(prev => ({
                    ...prev,
                    photoUrl: response.data.imageURL
                }));
                setUploadSuccess(true);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
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
        { id: 1, number: "Step 1", title: "Prepare Your Approach", icon: caseStudy },
        { id: 2, number: "Step 2", title: "Plan Your Coffee Shop Visit", icon: coffeeShopIcon },
        { id: 3, number: "Step 3", title: "Practice Your Request", icon: speakingIcon },
        { id: 4, number: "Step 4", title: "Complete & Reflect", icon: cameraIcon },
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
            setCurrentStep(null);
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
                        <div className="activity-step" key={step.id}>
                            <div className="activity-step-left-element">
                                <img src={step.icon} alt={step.title} />
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
                        <h2>The 10% Coffee Challenge</h2>
                        <div className="inline-container">
                            <div className="inline-container">
                                <img src={clock} alt="Clock" />
                                <p>30 minutes</p>
                            </div>
                            <div className="inline-container">
                                <img src={star} alt="Star" />
                                <p>{starCount} stars</p>
                            </div>
                        </div>
                        <p>
                            Getting what you want in life isn't luck—it's an art form! Practice your sales and
                            negotiation skills in this real-world challenge.
                        </p>
                        <p>
                            The best and often only way to get what you want is to clearly ask for it!
                            In this fun activity, you'll be asking for a 10% discount on your next coffee.
                        </p>
                        <div className="activity-hot-tip">
                            <img src={fireFlameIcon} alt="Fire Flame Icon" />
                            <p>DON'T WORRY ABOUT NOT GETTING THE DISCOUNT! Whether you do or don't, you'll feel
                                excited after trying. No one is going to take it that seriously, have fun! 🤡</p>
                        </div>
                        <p>
                            If you get turned down, laugh it off and move on. This is an excellent way to practice
                            conversational resilience! CareerStar - prepping you for the workforce AND saving you money! 😆 🤑
                        </p>
                    </div>
                ) : currentStep === 1 ? (
                    <div className="activity-description">
                        <h2>Step 1: Prepare Your Approach</h2>
                        <p>Choose a phrase to use when asking for your discount or write your own:</p>

                        <div className="phrase-selection-container">
                            {negotiationPhrases.map((phrase, index) => (
                                <div
                                    key={index}
                                    className={`phrase-option ${answers.selectedPhrase === phrase ? "selected-phrase" : ""}`}
                                    onClick={() => setAnswers({ ...answers, selectedPhrase: phrase })}
                                >
                                    <p>{phrase}</p>
                                </div>
                            ))}

                            <div className="custom-phrase-container">
                                <p><strong>Or write your own phrase:</strong></p>
                                <textarea
                                    className="custom-phrase-textarea"
                                    placeholder="Write your own approach here..."
                                    value={answers.customPhrase || ''}
                                    onChange={(e) => setAnswers({ ...answers, customPhrase: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="activity-hot-tip">
                            <img src={fireFlameIcon} alt="Fire Flame Icon" />
                            <p>Remember to ask for what you want with confidence! Body language and tone account for
                                93% of communication. Stand tall, smile, and speak clearly!</p>
                        </div>
                    </div>
                ) : currentStep === 2 ? (
                    <div className="activity-description">
                        <h2>Step 2: Plan Your Coffee Shop Visit</h2>
                        <ol>
                            <li>
                                <p><strong>Choose your coffee shop:</strong> We recommend shopping local, but chain stores like Starbucks work too!</p>
                            </li>
                            <li>
                                <p><strong>Timing matters:</strong> Avoid peak rush hours (7-9 AM, lunch time) when baristas are most stressed.</p>
                            </li>
                            <li>
                                <p><strong>Be prepared for any response:</strong> The barista might say yes, no, or be confused. All outcomes are valuable learning experiences!</p>
                            </li>
                        </ol>

                        <div className="preparation-tips">
                            <h3>Mental Preparation</h3>
                            <ul>
                                <li>Take a deep breath before entering</li>
                                <li>Visualize a successful interaction</li>
                                <li>Remember: this is just practice - the outcome doesn't define you</li>
                                <li>Smile - it makes you and others feel more comfortable</li>
                            </ul>
                        </div>

                        <div className="activity-hot-tip">
                            <img src={fireFlameIcon} alt="Fire Flame Icon" />
                            <p>If you're feeling nervous, try the "power pose" before going in! Stand with your hands on your hips like a superhero
                                for 2 minutes. Research shows this can actually increase confidence hormones!</p>
                        </div>
                    </div>
                ) : currentStep === 3 ? (
                    <div className="activity-description">
                        <h2>Step 3: Practice Your Request</h2>

                        <div className="practice-container">
                            <h3>Your Selected Approach:</h3>
                            <div className="selected-approach-display">
                                <p>{answers.selectedPhrase || answers.customPhrase || "You haven't selected a phrase yet. Go back to Step 1 to choose or create one."}</p>
                            </div>

                            <div className="practice-instructions">
                                <h3>Practice Tips:</h3>
                                <ol>
                                    <li>Practice saying your request out loud 3 times</li>
                                    <li>Record yourself on your phone to hear how you sound</li>
                                    <li>Try different tones - friendly, professional, casual</li>
                                    <li>When you're ready, head to your chosen coffee shop!</li>
                                </ol>
                            </div>
                        </div>

                        <div className="activity-hot-tip">
                            <img src={fireFlameIcon} alt="Fire Flame Icon" />
                            <p>Always, always, always use positive language! Words matter! Never say 'I didn't hear back from you..' or
                                'I wanted to know why I haven't heard back…' Positivity counts!</p>
                        </div>

                        <div className="conversation-scenario">
                            <h3>Possible Scenarios:</h3>
                            <div className="scenario">
                                <h4>If they say yes:</h4>
                                <p>"Thank you so much! I really appreciate it."</p>
                            </div>
                            <div className="scenario">
                                <h4>If they say no:</h4>
                                <p>"No problem at all! Thank you anyway. Have a great day!"</p>
                            </div>
                            <div className="scenario">
                                <h4>If they seem confused:</h4>
                                <p>"I'm doing a professional development exercise to practice asking for what I want. Thanks for being part of my learning!"</p>
                            </div>
                        </div>
                    </div>
                ) : currentStep === 4 ? (
                    <div className="activity-description">
                        <h2>Step 4: Complete & Reflect</h2>

                        <div className="result-selection">
                            <h3>What was the result?</h3>
                            <div className="result-options">
                                {resultOptions.map((option, index) => (
                                    <div
                                        key={index}
                                        className={`result-option ${answers.result === option ? "selected-result" : ""}`}
                                        onClick={() => setAnswers({ ...answers, result: option })}
                                    >
                                        <p>{option}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="reflection-section">
                            <h3>Your Reflection:</h3>
                            <textarea
                                className="reflection-textarea"
                                placeholder="How did it feel to ask for the discount? What did you learn? What would you do differently next time?"
                                value={answers.reflection || ''}
                                onChange={(e) => setAnswers({ ...answers, reflection: e.target.value })}
                            />
                        </div>

                        <div className="photo-upload-section">
                            <h3>Upload Your Receipt (optional):</h3>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleFileSelect}
                            />

                            <div className="upload-container">
                                {uploadedImage ? (
                                    <div className="uploaded-image-container">
                                        <img
                                            src={uploadedImage}
                                            alt="Uploaded Receipt"
                                            className="uploaded-receipt-image"
                                        />
                                        {!uploadSuccess && (
                                            <button
                                                className="upload-confirm-button"
                                                onClick={handleUploadImage}
                                            >
                                                Confirm Upload
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div
                                        className="upload-button-container"
                                        onClick={handleUploadClick}
                                    >
                                        <div className="upload-button">
                                            <span>+ Upload Receipt Photo</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="activity-hot-tip">
                            <img src={fireFlameIcon} alt="Fire Flame Icon" />
                            <p>Congratulations on completing this challenge! This skill of asking for what you want
                                will serve you in salary negotiations, project discussions, and many other professional situations.</p>
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
                        <h3>Hot Tip: Confidence is Key!</h3>
                        <p>Studies show that confident asks are 42% more likely to succeed than hesitant ones.</p>
                        <p>Even when people say "no," they often respect the confidence it took to ask!</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Activity10;