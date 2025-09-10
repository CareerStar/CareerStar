import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import caseStudy from '../../assets/images/activities/activity1/case-study.png';
import collaboratingInCircle from '../../assets/images/activities/activity1/collaborating-in-circle.png';
import lawyer from '../../assets/images/activities/activity1/lawyer.png';
import backArrow from '../../assets/images/back-arrow.png';
import activityImage from '../../assets/images/activities/activity9/activity-image.jpg'; 
import clock from '../../assets/images/activities/clock.png';
import star from '../../assets/images/activities/star.png';
import upArrowScroll from '../../assets/images/up-arrow-scroll.png';
import fireFlameIcon from '../../assets/images/fire-flame-icon.png';
import likeIcon from '../../assets/images/like-icon.png';
import dislikeIcon from '../../assets/images/dislike-icon.png';
import lumaImage from '../../assets/images/activities/activity9/luma.png'; 
import eventbriteImage from '../../assets/images/activities/activity9/eventbrite.png'; 
import linkedinImage from '../../assets/images/activities/activity9/linkedin.png'; 
import localEventImage from '../../assets/images/activities/activity9/local-event.png';

import axios from 'axios';
import { apiUrl } from '../../utils/api';
import { useDispatch } from 'react-redux';

const Activity9 = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const prevPage = location.state?.prevPage;
    const [currentStep, setCurrentStep] = useState(null);

    const dispatch = useDispatch();
    const userId = localStorage.getItem('userId');
    const activityId = 9; 
    const [completed, setCompleted] = useState(false);
    const [alreadyCompleted, setAlreadyCompleted] = useState(false);
    const [starCount, setStarCount] = useState(7);
    const [showHotTipPopup, setShowHotTipPopup] = useState(false);
    const [showLikeDislikePopup, setShowLikeDislikePopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [platformRatings, setPlatformRatings] = useState({
        luma: 0,
        eventbrite: 0,
        linkedin: 0,
        local: 0
    });
    
    const [answers, setAnswers] = useState({
        virtualEvent: {
            name: '',
            date: '',
            platform: '',
            goal: ''
        },
        irlEvent: {
            name: '',
            date: '',
            location: '',
            goal: ''
        },
        platformPreference: '',
        platformRatings: {
            luma: 0,
            eventbrite: 0,
            linkedin: 0,
            local: 0
        }  
    });

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
                    if (response.data[0].platformRatings) {
                        setPlatformRatings(response.data[0].platformRatings);
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

    const handleInputChange = (eventType, field, value) => {
        setAnswers(prev => ({
            ...prev,
            [eventType]: {
                ...prev[eventType],
                [field]: value
            }
        }));
    };

    const handlePlatformRating = (platform, rating) => {
        setPlatformRatings(prev => ({
            ...prev,
            [platform]: rating
        }));
        
        // Find the platform with the highest rating
        const ratings = { ...platformRatings, [platform]: rating };
        const highestRated = Object.entries(ratings).reduce(
            (max, [key, val]) => val > max.val ? {key, val} : max, 
            {key: '', val: -1}
        );
        
        setAnswers(prev => ({
            ...prev,
            platformPreference: highestRated.key,
            platformRatings: ratings
        }));
    };

    const stepsData = [
        { id: 1, number: "Step 1", title: "Discover Event Platforms", icon: caseStudy },
        { id: 2, number: "Step 2", title: "Explore Luma", icon: lawyer },
        { id: 3, number: "Step 3", title: "Explore Eventbrite", icon: collaboratingInCircle },
        { id: 4, number: "Step 4", title: "Explore LinkedIn Events", icon: collaboratingInCircle },
        { id: 5, number: "Step 5", title: "Local Resources", icon: collaboratingInCircle },
        { id: 6, number: "Step 6", title: "Commit to Events", icon: collaboratingInCircle },
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
                    <h3>Activity Steps:</h3>
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
                            <img src={activityImage} alt="Networking Activity" />
                        </div>
                        <h2>Networking Made Easy: Finding Your Events</h2>
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
                        <h3>By the end of this activity, you will:</h3>
                        <p>✅ Discover various event platforms for networking</p>
                        <p>✅ Learn how to identify relevant networking events</p>
                        <p>✅ Commit to both virtual and in-person networking opportunities</p>
                        <p>✅ Develop a personal networking strategy</p>
                        
                        <div className="activity-statistic">
                            <p>According to a LinkedIn survey, 85% of all jobs are filled through networking.</p>
                        </div>
                    </div>
                ) : currentStep === 1 ? (
                    <div className="activity-description">
                        <h2>Step 1: Discover Event Platforms</h2>
                        <p>Effective networking requires knowing where to find events that align with your interests and career goals. In today's hybrid world, you have access to both virtual and in-person networking opportunities.</p>
                        
                        <h3>Key platforms we'll explore:</h3>
                        <ul>
                            <li><p><strong>Luma</strong> - A modern event platform with personalized calendars and easy filtering</p></li>
                            <li><p><strong>Eventbrite</strong> - Comprehensive event marketplace with excellent filtering options</p></li>
                            <li><p><strong>LinkedIn Events</strong> - Professional networking events directly integrated with your profile</p></li>
                            <li><p><strong>Local Resources</strong> - City-specific career support and community events</p></li>
                        </ul>
                        
                        <div className="activity-hot-tip" onClick={() => setShowHotTipPopup(true)}>
                            <img src={fireFlameIcon} alt="Fire Flame Icon" />
                            <p>Hot Tip! The best networking happens when you're genuinely interested in the topic. Choose events aligned with your passions! (Click for more!)</p>
                        </div>
                    </div>
                ) : currentStep === 2 ? (
                    <div className="activity-description">
                        <h2>Step 2: Explore Luma</h2>
                        <div className="activity-image">
                            <img src={lumaImage} alt="Luma Platform" />
                        </div>
                        
                        <h3>Key Features:</h3>
                        <ul>
                            <li><p>Set up your own event calendar</p></li>
                            <li><p>Follow company calendars you're interested in</p></li>
                            <li><p>Filter events by location</p></li>
                            <li><p>Use the "Discover" tab to find new events</p></li>
                        </ul>
                        
                        <h3>Rate your interest in using Luma:</h3>
                        <div className="platform-rating">
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <button 
                                    key={rating}
                                    className={`rating-button ${platformRatings.luma >= rating ? 'active' : ''}`}
                                    onClick={() => handlePlatformRating('luma', rating)}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                        
                        <a href="https://lu.ma/home" target="_blank" rel="noopener noreferrer" className="platform-link">Visit Luma</a>
                    </div>
                ) : currentStep === 3 ? (
                    <div className="activity-description">
                        <h2>Step 3: Explore Eventbrite</h2>
                        <div className="activity-image">
                            <img src={eventbriteImage} alt="Eventbrite Platform" />
                        </div>
                        
                        <h3>Key Features:</h3>
                        <ul>
                            <li><p>Filter by event type (virtual/in-person)</p></li>
                            <li><p>Search by category, date, and price</p></li>
                            <li><p>Low/no cost resources for hosting your own events</p></li>
                            <li><p>Location-based recommendations</p></li>
                        </ul>
                        
                        <h3>Rate your interest in using Eventbrite:</h3>
                        <div className="platform-rating">
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <button 
                                    key={rating}
                                    className={`rating-button ${platformRatings.eventbrite >= rating ? 'active' : ''}`}
                                    onClick={() => handlePlatformRating('eventbrite', rating)}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                        
                        <a href="https://www.eventbrite.com/" target="_blank" rel="noopener noreferrer" className="platform-link">Visit Eventbrite</a>
                    </div>
                ) : currentStep === 4 ? (
                    <div className="activity-description">
                        <h2>Step 4: Explore LinkedIn Events</h2>
                        <div className="activity-image">
                            <img src={linkedinImage} alt="LinkedIn Events" />
                        </div>
                        
                        <h3>Key Features:</h3>
                        <ul>
                            <li><p>Search by parameters like "hiring" or industry</p></li>
                            <li><p>Follow networking event-based accounts</p></li>
                            <li><p>Connect directly with event attendees through LinkedIn</p></li>
                            <li><p>Events are integrated with your professional profile</p></li>
                        </ul>
                        
                        <h3>Rate your interest in using LinkedIn Events:</h3>
                        <div className="platform-rating">
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <button 
                                    key={rating}
                                    className={`rating-button ${platformRatings.linkedin >= rating ? 'active' : ''}`}
                                    onClick={() => handlePlatformRating('linkedin', rating)}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                        
                        <a href="https://www.linkedin.com/events/" target="_blank" rel="noopener noreferrer" className="platform-link">Visit LinkedIn Events</a>
                    </div>
                ) : currentStep === 5 ? (
                    <div className="activity-description">
                        <h2>Step 5: Local Resources</h2>
                        <div className="activity-image">
                            <img src={localEventImage} alt="Local Events" />
                        </div>
                        
                        <h3>Why Local Resources Matter:</h3>
                        <ul>
                            <li><p>Many cities have career support centers with free networking events</p></li>
                            <li><p>Local events help you connect with people in your immediate area</p></li>
                            <li><p>Community-based networking can lead to more meaningful connections</p></li>
                            <li><p>Don't forget about your immediate circle - ask friends about events they attend</p></li>
                        </ul>
                        
                        <h3>Rate your interest in local networking resources:</h3>
                        <div className="platform-rating">
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <button 
                                    key={rating}
                                    className={`rating-button ${platformRatings.local >= rating ? 'active' : ''}`}
                                    onClick={() => handlePlatformRating('local', rating)}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                        
                        <div className="activity-hot-tip">
                            <img src={fireFlameIcon} alt="Fire Flame Icon" />
                            <p>Hot Tip! Be open to events beyond just hiring events. Try to identify with local industry in your area to make it easier to find events, see the same people regularly, and build specialization.</p>
                        </div>
                    </div>
                ) : currentStep === 6 ? (
                    <div className="activity-description">
                        <h2>Step 6: Commit to Events</h2>
                        <p>Based on your exploration of networking platforms, it's time to commit to attending both a virtual and in-person event.</p>
                        
                        <div className="event-commitment-form">
                            <h3>Virtual Event Commitment</h3>
                            <div className="form-group">
                                <label>Event Name:</label>
                                <input 
                                    type="text" 
                                    value={answers.virtualEvent.name} 
                                    onChange={(e) => handleInputChange('virtualEvent', 'name', e.target.value)} 
                                    placeholder="Enter event name"
                                />
                            </div>
                            <div className="form-group">
                                <label>Event Date:</label>
                                <input 
                                    type="date" 
                                    value={answers.virtualEvent.date} 
                                    onChange={(e) => handleInputChange('virtualEvent', 'date', e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Platform:</label>
                                <select 
                                    value={answers.virtualEvent.platform} 
                                    onChange={(e) => handleInputChange('virtualEvent', 'platform', e.target.value)}
                                >
                                    <option value="">Select platform</option>
                                    <option value="Luma">Luma</option>
                                    <option value="Eventbrite">Eventbrite</option>
                                    <option value="LinkedIn">LinkedIn</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Your Goal for This Event:</label>
                                <textarea 
                                    value={answers.virtualEvent.goal} 
                                    onChange={(e) => handleInputChange('virtualEvent', 'goal', e.target.value)} 
                                    placeholder="What do you hope to gain from this event?"
                                />
                            </div>
                            
                            <h3>In-Person Event Commitment</h3>
                            <div className="form-group">
                                <label>Event Name:</label>
                                <input 
                                    type="text" 
                                    value={answers.irlEvent.name} 
                                    onChange={(e) => handleInputChange('irlEvent', 'name', e.target.value)} 
                                    placeholder="Enter event name"
                                />
                            </div>
                            <div className="form-group">
                                <label>Event Date:</label>
                                <input 
                                    type="date" 
                                    value={answers.irlEvent.date} 
                                    onChange={(e) => handleInputChange('irlEvent', 'date', e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Location:</label>
                                <input 
                                    type="text" 
                                    value={answers.irlEvent.location} 
                                    onChange={(e) => handleInputChange('irlEvent', 'location', e.target.value)} 
                                    placeholder="Where is this event taking place?"
                                />
                            </div>
                            <div className="form-group">
                                <label>Your Goal for This Event:</label>
                                <textarea 
                                    value={answers.irlEvent.goal} 
                                    onChange={(e) => handleInputChange('irlEvent', 'goal', e.target.value)} 
                                    placeholder="What do you hope to gain from this event?"
                                />
                            </div>
                        </div>
                        
                        <div className="platform-preference">
                            <h3>Your preferred platform appears to be: {answers.platformPreference ? answers.platformPreference.charAt(0).toUpperCase() + answers.platformPreference.slice(1) : 'Not selected yet'}</h3>
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
                        <h3>🔥 Tips for Finding a Networking Event</h3>
                        <ol>
                            <li>Don't be too picky - any networking is better than none</li>
                            <li>Be open to events beyond just hiring events</li>
                            <li>Try to identify with local industry in your area to make it easier to find events</li>
                            <li>Pick something related to what you already like doing! (e.g., Tech Pickleball NYC)</li>
                        </ol>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Activity9;
