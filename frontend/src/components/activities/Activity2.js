import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import techstack from '../../assets/images/activities/activity2/techstack.png';
import applicationdevelopment from '../../assets/images/activities/activity2/applicationdevelopment.png';
import bonuscompany from '../../assets/images/activities/activity2/bonuscompany.png';
import businesssales from '../../assets/images/activities/activity2/businesssales.png';
import quiz from '../../assets/images/activities/activity2/quiz.png';


import companyroles from '../../assets/images/activities/activity2/companyroles.png';
import backArrow from '../../assets/images/back-arrow.png';
import activityImage from '../../assets/images/activities/activity2/activity2.png';
import clock from '../../assets/images/activities/clock.png';
import star from '../../assets/images/activities/star.png';
import upArrowScroll from '../../assets/images/up-arrow-scroll.png';
import FlippableCard from "./activities-support/FlippableCard";

import axios from 'axios';
import { useDispatch } from 'react-redux';


const Activity2 = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const prevPage = location.state?.prevPage;
    const [currentStep, setCurrentStep] = useState(null); // null shows activity description by default

    const dispatch = useDispatch();
    const userId = localStorage.getItem('userId');
    // const history = useHistory();
    const activityId = 2;
    const [completed, setCompleted] = useState(false);
    const [alreadyCompleted, setAlreadyCompleted] = useState(false);
    const [starCount, setStarCount] = useState(7);
    const [answers, setAnswers] = useState({
        answer1: "", //Answers can not be a null JSON object, it has to have at least one key-value pair
    });
    const [showHotTipPopup, setShowHotTipPopup] = useState(false);
    const [showLikeDislikePopup, setShowLikeDislikePopup] = useState(false);
    const [loading, setLoading] = useState(false);

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

    const handleSubmit = async (completed) => {
        try {
            console.log('answers:', answers);
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

    const companyRoles = [
        { abbreviation: 'CEO', fullForm: 'Chief Executive Officer', duty: 'Oversees the entire company’s vision, long-term strategy, and high-level decision-making. The CEO aligns all departments toward company goals and represents the organization to stakeholders.' },
        { abbreviation: 'CFO', fullForm: 'Chief Financial Officer', duty: ' Manages budgets, investments, and ensures financial health and growth.' },
        { abbreviation: 'CTO', fullForm: 'Chief Technology Officer', duty: 'Drives tech strategy, oversees product development, and leads innovation.' },
        { abbreviation: 'CMO', fullForm: 'Chief Marketing Officer', duty: 'Builds brand strategy, drives campaigns, and boosts customer engagement.' },
        { abbreviation: 'CIO', fullForm: 'Chief Information Officer ', duty: 'Leads talent strategy, company culture, and employee growth initiatives.' },
        { abbreviation: 'VP', fullForm: 'Vice President ', duty: 'Supports the CEO, leads key initiatives, and steps in as second-in-command..' },
        { abbreviation: 'COO', fullForm: 'Chief Operating Officer', duty: 'Leads sales and revenue efforts .' },
        { abbreviation: 'CPO', fullForm: 'Chief People Officer', duty: 'Leads talent strategy, company culture, and employee growth initiatives..' },
    ];

    const techStack = [
        { abbreviation: 'HTML', fullForm: 'HyperText Markup Language', duty: 'The standard language used to create and design websites and web applications.' },
        { abbreviation: 'CSS', fullForm: 'Cascading Style Sheets', duty: 'A style sheet language used for describing the presentation of a document written in HTML.' },
        { abbreviation: 'API', fullForm: 'Application Programming Interface', duty: 'A set of rules that allows different software applications to communicate with each other.' },
        { abbreviation: 'AWS', fullForm: 'Amazon Web Services', duty: 'A comprehensive cloud computing platform provided by Amazon, offering storage, computing power, and other functionality.' },
        { abbreviation: 'DB', fullForm: 'Database', duty: 'An organized collection of structured information or data, typically stored electronically in a computer system.' },
        { abbreviation: 'SQL', fullForm: 'Structured Query Languager', duty: 'A programming language designed for managing and manipulating relational databases.' },
        { abbreviation: 'AI', fullForm: 'Artificial Intelligencer', duty: 'Technology that enables computers to simulate human intelligence through learning, reasoning, and self-correction.' }
    ];

    const applicationDevelopment = [
        { abbreviation: 'UX', fullForm: 'User Experience', duty: "The overall experience a user has when interacting with a product, focusing on usability, accessibility, and satisfaction." },
        { abbreviation: 'QA', fullForm: 'Quality Assurance', duty: "The process of ensuring a product or service meets specified requirements and quality standards before release." },
        { abbreviation: 'SaaS', fullForm: 'Software as a Service', duty: "A software distribution model where applications are hosted by a provider and made available to customers over the internet." },
        { abbreviation: 'MVP', fullForm: 'Minimum Viable Product', duty: "A version of a product with just enough features to be usable by early customers who can then provide feedback." },
        { abbreviation: 'SWOT', fullForm: 'Strengths, Weaknesses, Opportunities, Threats', duty: "A strategic planning framework used to evaluate these four elements of a project or business venture." },
        { abbreviation: 'CMS', fullForm: 'Content Management System', duty: "Software that helps users create, manage, and modify content on a website without specialized technical knowledge." },
        { abbreviation: 'LoT', fullForm: 'Internet of Things', duty: "The network of physical objects embedded with sensors, software, and technologies to connect and exchange data with other devices over the internet." },
        { abbreviation: 'UI', fullForm: 'User Interface', duty: "The visual elements and interactive components that allow users to interact with a digital product or service." },

    ]

    const businessSales = [
        { abbreviation: 'B2B', fullForm: 'Business to Business', duty: "When one company provides products or services to another company to help them operate, grow, or serve their own customers" },
        { abbreviation: 'B2C', fullForm: 'Business to Consumer', duty: "When a company sells products or services directly to everyday people who use them for their personal needs.." },
        { abbreviation: 'BS', fullForm: 'Brand Strategist', duty: "A cloud-based model for delivering software applications to users over the internet." },
        { abbreviation: 'EBIDTA', fullForm: 'Earnings before interest, depreciation, taxes and amortization', duty: "The financial metric that measures a company's overall financial performance." },
        { abbreviation: 'SEO', fullForm: 'Search Engine Optimization', duty: "Steps a business takes to make its website show up higher on search engines so more people can find it online." },
        { abbreviation: 'IRA', fullForm: 'Individual Retirement Account', duty: " A tax-advantaged investment account designed to help individuals save for retirement." },
        { abbreviation: 'YTD', fullForm: 'Year to Date', duty: "The total amount of something, like sales or expenses, measured from the start of the year up to today." },
        { abbreviation: 'ARR', fullForm: 'Annual Recurring Revenue', duty: "TA metric that shows the money that comes in every year from subscriptions or recurring contracts.." },

    ]
    const bonusCompany = [
        { abbreviation: 'AAPL', fullForm: 'Apple Inc.', duty: "Technology company that designs, manufactures, and markets smartphones, personal computers, tablets, and wearables.." },
        { abbreviation: 'MSFT', fullForm: 'Microsoft Corporation', duty: "Technology company that develops, licenses, and supports software, services, devices, and solutions." },
        { abbreviation: 'AMZN', fullForm: 'Amazon.com, Inc.', duty: "E-commerce and cloud computing company offering online retail shopping, subscription services, and web services." },
        { abbreviation: 'GOOGL', fullForm: 'Alphabet Inc.', duty: "Parent company of Google, focusing on search, advertising, operating systems, platforms, and hardware.." },
        { abbreviation: 'META', fullForm: 'Meta Platforms, Inc.', duty: "Technology company focused on social media, including WhatsApp, Facebook and Instagram." },
        { abbreviation: 'TSLA', fullForm: 'Tesla, Inc.', duty: "Electric vehicle and clean energy company that designs and manufactures electric cars and energy solutions.." },
        { abbreviation: 'NVDA', fullForm: 'NVIDIA Corporation', duty: " Technology company specializing in graphics processing units (GPUs) and artificial intelligence technologies.." },
        { abbreviation: 'JPM', fullForm: 'JPMorgan Chase & Co.', duty: "Global financial services firm and banking institution offering investment banking, asset management, and other services." }
    ]

    const stepsData = [
        { id: 1, number: "Step 1", title: "Company Roles", icon: companyroles },
        { id: 2, number: "Step 2", title: "Tech Stack", icon: techstack },
        { id: 3, number: "Step 3", title: "Application Development", icon: applicationdevelopment },
        { id: 4, number: "Step 4", title: "Business & Sales", icon: businesssales },
        { id: 5, number: "Step 5", title: "Bonus! Company", icon: bonuscompany },
        { id: 6, number: "Step 6", title: "Quiz", icon: quiz },


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

    const quizQuestions = [
        {
            id: 1,
            question: 'What does “HR” mean?',
            options: [
                { id: 'A', text: 'High Risk' },
                { id: 'B', text: 'Hiring Relations' },
                { id: 'C', text: 'Human Resources' }, 
                { id: 'D', text: 'House Resources' }
            ],
            correctAnswer: 'C',
        },
        {
            id: 2,
            question: 'What does “CEO” mean?',
            options: [
                { id: 'A', text: 'Chief Executive Officer' },
                { id: 'B', text: 'Corporate Employee Organizer' },
                { id: 'C', text: 'Central Executive Operator' },
                { id: 'D', text: 'Chief Engineering Officer' }
            ],
            correctAnswer: 'A',
        },
        {
            id: 3,
            question: 'What does JPM stand for?',
            options: [
                { id: 'A', text: 'Japan Manufacturing' }, 
                { id: 'B', text: 'Joint Project Management' },
                { id: 'C', text: 'JPMorgan Chase & Co.' },
                { id: 'D', text: 'Junior Portfolio Manager' }
            ],
            correctAnswer: 'C',
        },
         
         
    ];

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleAnswerSelect = (optionId) => {
        if (!isSubmitted) setSelectedAnswer(optionId);
    };

    const handleQuizSubmit = () => {
        if (selectedAnswer) {
            setIsSubmitted(true);
        }
    };

    const handleNextQuestion = () => {
        setIsSubmitted(false);
        setSelectedAnswer(null);

        if (currentQuestionIndex < quizQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // quiz finished
            handleSubmit(true);
        }
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
                        <h2>Acronym Card Game</h2>
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
                        <p>Test your knowledge of industry acronyms and their meanings, perfect for anyone looking to strengthen their business and tech vocabulary.</p>
                        <p>An Acronym is a shorthand phrase that represents the first letter of each word. For example, CEO means ‘Chief Executive Officer’
                            Crack the codes in our card game by figuring out what each letter stands for.</p>

                    </div>
                ) : currentStep === 1 ? (
                    <div className="activity-description">
                        <h2>Step 1 : Company Roles</h2>
                        <p> In this step, you’re to recognize each acronyms of Company Roles.</p>
                        <div className="flip-cards-container">
                            {companyRoles.map((role, index) => (
                                <FlippableCard key={`step1-${index}`} abbreviation={role.abbreviation} fullForm={role.fullForm} duty={role.duty} />
                            ))}
                        </div>
                    </div>
                ) : currentStep === 2 ? (
                    <div className="activity-description">
                        <h2>Step 2 :Tech Stack </h2>
                        <p>In this step, you’re to recognize each acronyms of tech stack.</p>
                        <div className="flip-cards-container">
                            {techStack.map((role, index) => (
                                <FlippableCard key={`step2-${index}`} abbreviation={role.abbreviation} fullForm={role.fullForm} duty={role.duty} />
                            ))}
                        </div>
                    </div>

                ) : currentStep === 3 ? (
                    <div className="activity-description">
                        <h2>Step 3 :Application Development </h2>
                        <p>In this step, you’re to recognize each acronyms of Application Development.</p>
                        <div className="flip-cards-container">
                            {applicationDevelopment.map((role, index) => (
                                <FlippableCard key={`step2-${index}`} abbreviation={role.abbreviation} fullForm={role.fullForm} duty={role.duty} />
                            ))}
                        </div>
                    </div>


                ) : currentStep === 4 ? (
                    <div className="activity-description">
                        <h2>Step 4 :Business & Sales </h2>
                        <p>In this step, you’re to recognize each acronyms of Business & Sales.</p>
                        <div className="flip-cards-container">
                            {businessSales.map((role, index) => (
                                <FlippableCard key={`step2-${index}`} abbreviation={role.abbreviation} fullForm={role.fullForm} duty={role.duty} />
                            ))}
                        </div>
                    </div>


                ) : currentStep === 5 ? (
                    <div className="activity-description">
                        <h2>Step 5 : Bonus Company </h2>
                        <p>In this step, you’re to recognize each acronyms of Application Development.</p>
                        <div className="flip-cards-container">
                            {bonusCompany.map((role, index) => (
                                <FlippableCard key={`step2-${index}`} abbreviation={role.abbreviation} fullForm={role.fullForm} duty={role.duty} />
                            ))}
                        </div>
                    </div>



                ) : currentStep === 6 ? (
                    <div className="activity-description quiz-step">
                        {/* Progress counter top-right */}
                        <div className="quiz-header">
                            <span>{currentQuestionIndex + 1}/{quizQuestions.length}</span>
                        </div>

                        {/* Question */}
                        <h2>{quizQuestions[currentQuestionIndex].question}</h2>

                        {/* Options */}
                        <div className="quiz-options">
                            {quizQuestions[currentQuestionIndex].options.map((opt) => (
                                <div
                                    key={opt.id}
                                    className={`quiz-option 
              ${selectedAnswer === opt.id ? "selected" : ""} 
              ${isSubmitted && opt.id === quizQuestions[currentQuestionIndex].correctAnswer ? "correct" : ""} 
              ${isSubmitted && selectedAnswer === opt.id && opt.id !== quizQuestions[currentQuestionIndex].correctAnswer ? "incorrect" : ""}`}
                                    onClick={() => handleAnswerSelect(opt.id)}
                                >
                                    {opt.id}. {opt.text}
                                </div>
                            ))}
                        </div>

                        {/* Submit OR Next Arrow */}
                        <div className="quiz-footer">
                            {!isSubmitted ? (
                                <button onClick={handleQuizSubmit} disabled={!selectedAnswer} className="submit-btn">
                                   Submit Answer   
                                </button>
                            ) : (
                                <div className="next-arrow" onClick={handleNextQuestion}>
                                    ➡
                                </div>
                            )}
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
        </div>
    );
};

export default Activity2;
