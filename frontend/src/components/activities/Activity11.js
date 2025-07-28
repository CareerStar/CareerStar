import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import caseStudy from '../../assets/images/activities/activity1/case-study.png';
import changeUser from '../../assets/images/activities/activity1/change-user.png';
import collaboratingInCircle from '../../assets/images/activities/activity1/collaborating-in-circle.png';
import lawyer from '../../assets/images/activities/activity1/lawyer.png';
import backArrow from '../../assets/images/back-arrow.png';
import activityImage from '../../assets/images/activities/activity11/activity-image.jpg';
import clock from '../../assets/images/activities/clock.png';
import star from '../../assets/images/activities/star.png';
import upArrowScroll from '../../assets/images/up-arrow-scroll.png';
import fireFlameIcon from '../../assets/images/fire-flame-icon.png';
import likeIcon from '../../assets/images/like-icon.png';
import dislikeIcon from '../../assets/images/dislike-icon.png';

import axios from 'axios';
import { useDispatch } from 'react-redux';

const Activity11 = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const prevPage = location.state?.prevPage;
    const [currentStep, setCurrentStep] = useState(null);

    const dispatch = useDispatch();
    const userId = localStorage.getItem('userId');
    const activityId = 11;
    const [completed, setCompleted] = useState(false);
    const [alreadyCompleted, setAlreadyCompleted] = useState(false);
    const [starCount, setStarCount] = useState(8);
    const [answers, setAnswers] = useState({
        dreamRole: '',
        interests: [],
        skills: [],
        goals: '',
        volunteerURL: '',
        pledgeDate: '',
        notes: '',
    });
    const [showHotTipPopup, setShowHotTipPopup] = useState(false);
    const [showLikeDislikePopup, setShowLikeDislikePopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedInterests, setSelectedInterests] = useState([]);

    // Pre-defined options for interests
    const interestOptions = [
        "Animals & Wildlife", 
        "Arts & Culture", 
        "Community Development", 
        "Education & Literacy", 
        "Environment & Conservation", 
        "Health & Medicine", 
        "Homelessness & Housing", 
        "Human Rights & Justice", 
        "Sports & Recreation", 
        "Technology"
    ];

    // Pre-defined options for skills
    const skillOptions = [
        "Leadership", 
        "Communication", 
        "Organization", 
        "Problem-Solving", 
        "Technical Skills", 
        "Teaching/Tutoring", 
        "Writing/Editing", 
        "Design/Creative", 
        "Research",
        "Social Media",
        "Physical Labor",
        "Customer Service"
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
                    if (response.data[0].interests) {
                        setSelectedInterests(response.data[0].interests);
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

    const handleInterestToggle = (interest) => {
        const newSelectedInterests = [...selectedInterests];
        
        if (newSelectedInterests.includes(interest)) {
            // Remove interest if already selected
            const index = newSelectedInterests.indexOf(interest);
            newSelectedInterests.splice(index, 1);
        } else {
            // Add interest if not already selected
            newSelectedInterests.push(interest);
        }
        
        setSelectedInterests(newSelectedInterests);
        setAnswers({...answers, interests: newSelectedInterests});
    };

    const handleSkillToggle = (skill) => {
        const newSkills = [...answers.skills || []];
        
        if (newSkills.includes(skill)) {
            // Remove skill if already selected
            const index = newSkills.indexOf(skill);
            newSkills.splice(index, 1);
        } else {
            // Add skill if not already selected
            newSkills.push(skill);
        }
        
        setAnswers({...answers, skills: newSkills});
    };

    const stepsData = [
        { id: 1, number: "Step 1", title: "Dream Role Creation", icon: collaboratingInCircle },
        { id: 2, number: "Step 2", title: "Interests & Skills Mapping", icon: caseStudy },
        { id: 3, number: "Step 3", title: "Opportunities Research", icon: lawyer },
        { id: 4, number: "Step 4", title: "Make Your Volunteer Pledge", icon: changeUser },
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
                            <img src={activityImage} alt="Volunteering Activity" />
                        </div>
                        <h2>Unlock Your Volunteer Superpowers!</h2>
                        <div className="inline-container">
                            <div className="inline-container">
                                <img src={clock} alt="Clock" />
                                <p>20 minutes</p>
                            </div>
                            <div className="inline-container">
                                <img src={star} alt="Star" />
                                <p>{starCount} stars</p>
                            </div>
                        </div>
                        <p>Volunteering is a great way to give back to your community, gain valuable experience, and potentially enhance your career prospects.</p>
                        <p>Did you know that according to a 2016 Deloitte survey, <strong>82% of hiring managers prefer applicants with volunteer experience?</strong> Volunteering not only helps others but can also boost your career prospects!</p>
                        <p>In this activity, you'll:</p>
                        <ul>
                            <li>Create your dream volunteer role</li>
                            <li>Identify your interests and skills</li>
                            <li>Learn how to find suitable organizations</li>
                            <li>Make a personal volunteer pledge</li>
                        </ul>
                    </div>
                ) : currentStep === 1 ? (
                    <div className="activity-description">
                        <h2>Step 1: Dream Role Creation</h2>
                        <p>Imagine you are creating a volunteer role for yourself, with no financial limits. What dream volunteer position speaks to you?</p>
                        <p>Some inspiration to get you started:</p>
                        <ul>
                            <li>Animal Care Specialist at the local shelter</li>
                            <li>Environmental Conservation Coordinator at a community garden</li>
                            <li>Information Services Assistant at the library</li>
                            <li>Curatorial Associate at a museum</li>
                            <li>Youth Athletics Program Coordinator at a sports league</li>
                        </ul>
                        
                        <div className="form-group">
                            <label>Your Dream Volunteer Role:</label>
                            <textarea
                                value={answers.dreamRole || ''}
                                onChange={(e) => setAnswers({...answers, dreamRole: e.target.value})}
                                placeholder="Describe your ideal volunteer position and organization..."
                                rows={5}
                            />
                        </div>
                        
                        <div className="activity-hot-tip" onClick={() => setShowHotTipPopup(true)}>
                            <img src={fireFlameIcon} alt="Fire Flame Icon" />
                            <p>Hot Tip! Think beyond conventional roles. The most fulfilling volunteer experiences often combine your unique skills with causes you're passionate about. (Click for more!)</p>
                        </div>
                    </div>
                ) : currentStep === 2 ? (
                    <div className="activity-description">
                        <h2>Step 2: Interests & Skills Mapping</h2>
                        
                        <div className="section-container">
                            <h3>Select your areas of interest and passion:</h3>
                            <div className="interest-buttons-container">
                                {interestOptions.map(interest => (
                                    <div 
                                        key={interest}
                                        className={`interest-button ${selectedInterests.includes(interest) ? 'selected' : ''}`}
                                        onClick={() => handleInterestToggle(interest)}
                                    >
                                        {interest}
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="section-container">
                            <h3>Select skills you can offer as a volunteer:</h3>
                            <div className="skill-buttons-container">
                                {skillOptions.map(skill => (
                                    <div 
                                        key={skill}
                                        className={`skill-button ${answers.skills && answers.skills.includes(skill) ? 'selected' : ''}`}
                                        onClick={() => handleSkillToggle(skill)}
                                    >
                                        {skill}
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="section-container">
                            <h3>Set your volunteering goals:</h3>
                            <textarea
                                value={answers.goals || ''}
                                onChange={(e) => setAnswers({...answers, goals: e.target.value})}
                                placeholder="What do you hope to achieve through volunteering? (e.g., gain experience in a specific field, develop certain skills, meet new people, make an impact in a particular area...)"
                                rows={4}
                            />
                        </div>
                    </div>
                ) : currentStep === 3 ? (
                    <div className="activity-description">
                        <h2>Step 3: Opportunities Research</h2>
                        
                        <h3>Great Places to Look for Volunteer Opportunities:</h3>
                        <ul className="research-list">
                            <li>
                                <strong>Local Community Centers and Boards</strong>
                                <p>Visit community centers, libraries, or check community bulletin boards for posted opportunities.</p>
                            </li>
                            <li>
                                <strong>Volunteer Matchmaking Websites</strong>
                                <p>Platforms like VolunteerMatch, Idealist, or DoSomething connect volunteers with organizations.</p>
                            </li>
                            <li>
                                <strong>Social Media</strong>
                                <p>Follow local charities and organizations on social media where they often post volunteer needs.</p>
                            </li>
                            <li>
                                <strong>Personal Network</strong>
                                <p>Ask friends, family, and colleagues about volunteer opportunities they know about.</p>
                            </li>
                            <li>
                                <strong>College or University</strong>
                                <p>Check with your school's community service office for opportunities or campus-based initiatives.</p>
                            </li>
                        </ul>
                        
                        <div className="tips-container">
                            <h3>Tips for Selecting the Right Opportunity:</h3>
                            <ul>
                                <li>Choose organizations aligned with your interests and values</li>
                                <li>Consider time commitment and schedule compatibility</li>
                                <li>Look for roles that utilize your skills or help you develop new ones</li>
                                <li>Start with a small commitment before diving into long-term roles</li>
                                <li>Connect with current volunteers to learn about their experiences</li>
                            </ul>
                        </div>
                        
                        <div className="research-exercise">
                            <h3>Your Turn!</h3>
                            <p>Research and find a volunteer opportunity that interests you. Copy the link below:</p>
                            <input 
                                type="text" 
                                placeholder="Paste volunteer opportunity URL here"
                                value={answers.volunteerURL || ''}
                                onChange={(e) => setAnswers({...answers, volunteerURL: e.target.value})}
                            />
                        </div>
                    </div>
                ) : currentStep === 4 ? (
                    <div className="activity-description">
                        <h2>Step 4: Make Your Volunteer Pledge</h2>
                        
                        <div className="pledge-container">
                            <h3>Your Volunteer Commitment</h3>
                            <p>Turn your intention into action by making a concrete plan:</p>
                            
                            <div className="form-group">
                                <label>When will you attend your first volunteer session or orientation?</label>
                                <input 
                                    type="date" 
                                    value={answers.pledgeDate || ''}
                                    onChange={(e) => setAnswers({...answers, pledgeDate: e.target.value})}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>My Volunteer Victory Journal</label>
                                <p>Start documenting your volunteer journey by noting what you hope to accomplish and learn:</p>
                                <textarea
                                    value={answers.notes || ''}
                                    onChange={(e) => setAnswers({...answers, notes: e.target.value})}
                                    placeholder="Write your initial thoughts, goals, and aspirations for your volunteer experience..."
                                    rows={5}
                                />
                            </div>
                            
                            <div className="sharing-tips">
                                <h3>Sharing Your Journey</h3>
                                <p>Consider sharing your volunteer experience on LinkedIn or other platforms to:</p>
                                <ul>
                                    <li>Inspire others to volunteer</li>
                                    <li>Build your professional network</li>
                                    <li>Document your experience for future reference</li>
                                    <li>Show appreciation to the organizations you're supporting</li>
                                </ul>
                            </div>
                            
                            <div className="activity-hot-tip">
                                <img src={fireFlameIcon} alt="Fire Flame Icon" />
                                <p>Keep updating your "Volunteer Victory Journal" with photos, stories, challenges, and achievements. It will be invaluable for reflecting on your growth and for future job interviews!</p>
                            </div>
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
                        <h3>Crafting Your Perfect Volunteer Role</h3>
                        <p>When imagining your ideal volunteer position, consider:</p>
                        <ul>
                            <li><strong>Impact:</strong> What type of change do you want to help create?</li>
                            <li><strong>Environment:</strong> Do you prefer working outdoors, in an office, or virtually?</li>
                            <li><strong>People:</strong> Do you want to work directly with those being served or behind the scenes?</li>
                            <li><strong>Skills:</strong> What existing skills do you want to use, and what new ones do you want to develop?</li>
                            <li><strong>Time:</strong> Would you prefer regular weekly commitments or project-based opportunities?</li>
                        </ul>
                        <p>Remember, your dream role might not exist exactly as you imagine it, but this exercise helps you identify what matters most to you in a volunteer opportunity!</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Activity11;