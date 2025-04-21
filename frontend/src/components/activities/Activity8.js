import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import caseStudy from '../../assets/images/activities/activity1/case-study.png';
import collaboratingInCircle from '../../assets/images/activities/activity1/collaborating-in-circle.png';
import changeUser from '../../assets/images/activities/activity1/change-user.png';
import lawyer from '../../assets/images/activities/activity1/lawyer.png';
import backArrow from '../../assets/images/back-arrow.png';
import activityImage from '../../assets/images/activities/activity8/activity-image.jpg';
import clock from '../../assets/images/activities/clock.png';
import star from '../../assets/images/activities/star.png';
import upArrowScroll from '../../assets/images/up-arrow-scroll.png';
import likeIcon from '../../assets/images/like-icon.png';
import dislikeIcon from '../../assets/images/dislike-icon.png';
import fireFlameIcon from '../../assets/images/fire-flame-icon.png';

import axios from 'axios';
import { useDispatch } from 'react-redux';

const Activity8 = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const prevPage = location.state?.prevPage;
    const [currentStep, setCurrentStep] = useState(null);

    const dispatch = useDispatch();
    const userId = localStorage.getItem('userId');
    const activityId = 8;
    const [completed, setCompleted] = useState(false);
    const [alreadyCompleted, setAlreadyCompleted] = useState(false);
    const [starCount, setStarCount] = useState(10);
    const [showHotTipPopup, setShowHotTipPopup] = useState(false);
    const [showLikeDislikePopup, setShowLikeDislikePopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [answers, setAnswers] = useState({
        portfolioUrl: '',
        portfolioType: '',
        completionStatus: {
            aboutMe: false,
            projects: false,
            skills: false,
            contact: false
        },
        feedback: ''
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
                const response = await axios.get(`https://api.careerstar.co/roadmapactivity/${userId}/${activityId}`);
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
            if (prevPage === 'roadmap') {
                navigate('/dashboard/roadmap');
            } else {
                navigate('/dashboard/home');
            }
        } catch (error) {
            console.error('Error saving answers:', error);
        }
    };

    const handleInputChange = (field, value) => {
        setAnswers(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCheckboxChange = (section) => {
        setAnswers(prev => ({
            ...prev,
            completionStatus: {
                ...prev.completionStatus,
                [section]: !prev.completionStatus[section]
            }
        }));
    };

    const stepsData = [
        { id: 1, number: "Step 1", title: "Why Create a Portfolio?", icon: lawyer },
        { id: 2, number: "Step 2", title: "Planning Your Portfolio", icon: caseStudy },
        { id: 3, number: "Step 3", title: "Building Your Portfolio", icon: collaboratingInCircle },
        { id: 4, number: "Step 4", title: "Portfolio Examples & Resources", icon: changeUser },
        { id: 5, number: "Step 5", title: "Share Your Portfolio", icon: changeUser },
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
                    <h3>Activity Steps :</h3>
                </div>
                <div className="activity-step-container">
                    {stepsData.map((step) => (
                        <div className="activity-step" key={step.id}>
                            <div className="activity-step-left-element">
                                <img src={step.icon} alt="Step icon" />
                            </div>
                            <div className="activity-step-right-element">
                                <div className="activity-step-number">{step.number}</div>
                                <div className="activity-step-title">{step.title}</div>
                                <div className={`activity-step-button ${currentStep === step.id ? "selected" : ""}`} onClick={() => handleStepChange(step.id)}>Dive In</div>
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
                            <img src={activityImage} alt="Portfolio showcase" />
                        </div>
                        <h2>Presenting Your Portfolio</h2>
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
                        <h3>By the end of this activity, you will:</h3>
                        <p>✅ Understand the importance of having a portfolio for job searching</p>
                        <p>✅ Learn how to plan and structure your portfolio</p>
                        <p>✅ Get familiar with different portfolio building platforms</p>
                        <p>✅ Have examples and resources to create your own portfolio</p>
                        <p>✅ Build a basic portfolio or plan to improve an existing one</p>
                    </div>
                ) : currentStep === 1 ? (
                    <div className="activity-description">
                        <h2>Step 1: Why Create a Portfolio?</h2>
                        <p>A professional portfolio is a powerful tool in your job search arsenal. According to a recent survey, 65% of employers consider a professional portfolio to be a valuable tool when evaluating job candidates.</p>
                        
                        <h3>Benefits of Having a Portfolio:</h3>
                        <ul>
                            <li><p><strong>Shows, Not Just Tells:</strong> Portfolios provide concrete evidence of your skills and achievements</p></li>
                            <li><p><strong>Differentiates You:</strong> Helps you stand out from other candidates with similar qualifications</p></li>
                            <li><p><strong>Demonstrates Initiative:</strong> Shows you go above and beyond basic requirements</p></li>
                            <li><p><strong>Controls Your Narrative:</strong> Lets you showcase your professional story on your terms</p></li>
                            <li><p><strong>Expands Your Network:</strong> Can attract opportunities through online discovery</p></li>
                        </ul>
                        
                        <div className="activity-hot-tip" onClick={() => setShowHotTipPopup(true)}>
                            <img src={fireFlameIcon} alt="Fire Flame Icon" />
                            <p>Hot Tip! Even non-designers benefit from portfolios! Project managers can showcase completed projects, writers can display samples, and analysts can present case studies or data visualizations. (Click for more!)</p>
                        </div>
                    </div>
                ) : currentStep === 2 ? (
                    <div className="activity-description">
                        <h2>Step 2: Planning Your Portfolio</h2>
                        
                        <h3>Essential Sections for Your Portfolio:</h3>
                        <ol>
                            <li>
                                <p><strong>About Me:</strong> A brief professional bio highlighting your experience, skills, and career goals</p>
                            </li>
                            <li>
                                <p><strong>Projects:</strong> Showcase 3-5 of your best work samples with descriptions of your contribution and results</p>
                            </li>
                            <li>
                                <p><strong>Skills:</strong> List technical and soft skills relevant to your field</p>
                            </li>
                            <li>
                                <p><strong>Contact Information:</strong> Professional ways to reach you (email, LinkedIn)</p>
                            </li>
                            <li>
                                <p><strong>Optional Sections:</strong> Testimonials, resume download, blog, achievements</p>
                            </li>
                        </ol>
                        
                        <h3>Before Building:</h3>
                        <ul>
                            <li><p>Collect your best work samples and relevant projects</p></li>
                            <li><p>Write brief descriptions for each project (problem, solution, impact)</p></li>
                            <li><p>Update your professional bio and ensure contact information is current</p></li>
                            <li><p>Consider your audience and tailor content accordingly</p></li>
                        </ul>
                    </div>
                ) : currentStep === 3 ? (
                    <div className="activity-description">
                        <h2>Step 3: Building Your Portfolio</h2>
                        
                        <h3>Platform Options:</h3>
                        <div className="platform-options">
                            <div className="platform-option">
                                <h4>Website Builders (No-Code)</h4>
                                <ul>
                                    <li><p>Wix</p></li>
                                    <li><p>Squarespace</p></li>
                                    <li><p>WordPress.com</p></li>
                                </ul>
                                <p><strong>Pros:</strong> Easy to use, professional templates</p>
                                <p><strong>Cons:</strong> Less customization, potential costs</p>
                            </div>
                            
                            <div className="platform-option">
                                <h4>Code-Based Options</h4>
                                <ul>
                                    <li><p>GitHub Pages (free!)</p></li>
                                    <li><p>Custom HTML/CSS/JS</p></li>
                                    <li><p>React/Next.js/etc.</p></li>
                                </ul>
                                <p><strong>Pros:</strong> Full control, showcases coding skills</p>
                                <p><strong>Cons:</strong> Requires technical knowledge</p>
                            </div>
                        </div>
                        
                        <h3>Portfolio Building Tips:</h3>
                        <ul>
                            <li><p>Keep design clean and focused on your work</p></li>
                            <li><p>Ensure mobile responsiveness</p></li>
                            <li><p>Use clear navigation</p></li>
                            <li><p>Include calls-to-action (like "Contact Me")</p></li>
                            <li><p>Optimize page load speed</p></li>
                        </ul>
                        
                        <div className="activity-image">
                            <iframe 
                                width="560" 
                                height="315" 
                                src="https://www.youtube.com/embed/u-RLu_8kwA0" 
                                title="GitHub Pages Portfolio Tutorial" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen>
                            </iframe>
                        </div>
                    </div>
                ) : currentStep === 4 ? (
                    <div className="activity-description">
                        <h2>Step 4: Portfolio Examples & Resources</h2>
                        
                        <h3>Example Portfolios for Inspiration:</h3>
                        <ul>
                            <li>
                                <p><strong>CareerStar Sample:</strong> <a href="https://meet1903.github.io/portfolio/" target="_blank" rel="noopener noreferrer">https://meet1903.github.io/portfolio/</a></p>
                            </li>
                            <li><p>Browse portfolio examples on Behance or Dribbble for design inspiration</p></li>
                            <li><p>Look up professionals in your field on LinkedIn to see if they link to portfolios</p></li>
                        </ul>
                        
                        <h3>Helpful Resources:</h3>
                        <ul>
                            <li><p><strong>Free Images:</strong> Unsplash, Pexels, Pixabay</p></li>
                            <li><p><strong>Free Icons:</strong> Font Awesome, Flaticon, Material Icons</p></li>
                            <li><p><strong>Color Schemes:</strong> Coolors, Adobe Color</p></li>
                            <li><p><strong>Templates:</strong> GitHub has free HTML/CSS templates</p></li>
                        </ul>
                        
                        <h3>Portfolio Checklist:</h3>
                        <div className="portfolio-checklist">
                            <div className="checklist-item">
                                <input 
                                    type="checkbox" 
                                    id="aboutMe" 
                                    checked={answers.completionStatus.aboutMe}
                                    onChange={() => handleCheckboxChange('aboutMe')}
                                />
                                <label htmlFor="aboutMe">About Me section</label>
                            </div>
                            <div className="checklist-item">
                                <input 
                                    type="checkbox" 
                                    id="projects" 
                                    checked={answers.completionStatus.projects}
                                    onChange={() => handleCheckboxChange('projects')}
                                />
                                <label htmlFor="projects">Projects section</label>
                            </div>
                            <div className="checklist-item">
                                <input 
                                    type="checkbox" 
                                    id="skills" 
                                    checked={answers.completionStatus.skills}
                                    onChange={() => handleCheckboxChange('skills')}
                                />
                                <label htmlFor="skills">Skills section</label>
                            </div>
                            <div className="checklist-item">
                                <input 
                                    type="checkbox" 
                                    id="contact" 
                                    checked={answers.completionStatus.contact}
                                    onChange={() => handleCheckboxChange('contact')}
                                />
                                <label htmlFor="contact">Contact information</label>
                            </div>
                        </div>
                    </div>
                ) : currentStep === 5 ? (
                    <div className="activity-description">
                        <h2>Step 5: Share Your Portfolio</h2>
                        
                        <h3>Where to Share Your Portfolio:</h3>
                        <ul>
                            <li><p>Add to your LinkedIn profile</p></li>
                            <li><p>Include in your resume</p></li>
                            <li><p>Add to email signatures</p></li>
                            <li><p>Share on relevant social media</p></li>
                            <li><p>Include in job applications</p></li>
                        </ul>
                        
                        <div className="portfolio-submission">
                            <h3>What type of portfolio did you create?</h3>
                            <select 
                                value={answers.portfolioType} 
                                onChange={(e) => handleInputChange('portfolioType', e.target.value)}
                                className="portfolio-select"
                            >
                                <option value="">Select type</option>
                                <option value="github-pages">GitHub Pages</option>
                                <option value="wix">Wix</option>
                                <option value="squarespace">Squarespace</option>
                                <option value="wordpress">WordPress</option>
                                <option value="custom-coded">Custom Coded</option>
                                <option value="other">Other</option>
                                <option value="planning">Still Planning</option>
                            </select>
                            
                            <h3>If you've created your portfolio, paste the link below:</h3>
                            <input 
                                type="text" 
                                placeholder="https://yourportfolio.com" 
                                value={answers.portfolioUrl}
                                onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                                className="portfolio-input"
                            />
                            
                            <h3>What did you learn from this activity? Any challenges?</h3>
                            <textarea 
                                placeholder="Share your thoughts..." 
                                value={answers.feedback}
                                onChange={(e) => handleInputChange('feedback', e.target.value)}
                                className="portfolio-textarea"
                                rows="4"
                            ></textarea>
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
                        <h3>Portfolio Benefits for All Careers</h3>
                        <ul>
                            <li><strong>Software Developers:</strong> Show code samples, deployed projects, and GitHub contributions</li>
                            <li><strong>Project Managers:</strong> Highlight successful projects, methodologies used, and results achieved</li>
                            <li><strong>Data Analysts:</strong> Display data visualizations, analysis projects, and insights discovered</li>
                            <li><strong>Content Writers:</strong> Showcase writing samples, published work, and different writing styles</li>
                            <li><strong>Marketers:</strong> Present campaign results, creative materials, and performance metrics</li>
                        </ul>
                        <p>Remember: Your portfolio is evidence of your capabilities that resumes alone can't convey!</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Activity8;