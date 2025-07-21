import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import ReactMarkdown from "react-markdown";
// import activityImage from '../../assets/images/activities/activity13/activity-image.jpg';
import activityImage from '../../assets/images/activities/activity13/activity-image2.png';
// import futureIcon from '../../assets/images/activities/activity13/future-icon.png';
// import supportIcon from '../../assets/images/activities/activity13/support-icon.png';
// import highlightIcon from '../../assets/images/activities/activity13/highlight-icon.png';
// import reportIcon from '../../assets/images/activities/activity13/report-icon.png';
import futureIcon from '../../assets/images/activities/activity13/2ReportIcon.png';
import supportIcon from '../../assets/images/activities/activity13/1ReportIcon.png';
import highlightIcon from '../../assets/images/activities/activity13/3ReportIcon.png';
import ideaIcon from '../../assets/images/activities/activity13/plusIcon.png';
import reportIcon from '../../assets/images/activities/activity13/321icon.png';
import backArrow from '../../assets/images/back-arrow.png';
import clock from '../../assets/images/activities/clock.png';
import star from '../../assets/images/activities/star.png';
import upArrowScroll from '../../assets/images/up-arrow-scroll.png';
import fireFlameIcon from '../../assets/images/fire-flame-icon.png';
import likeIcon from '../../assets/images/like-icon.png';
import dislikeIcon from '../../assets/images/dislike-icon.png';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { jsPDF } from 'jspdf';


const Activity13 = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const prevPage = location.state?.prevPage;
    const [currentStep, setCurrentStep] = useState(null);

    const dispatch = useDispatch();
    const userId = localStorage.getItem('userId');
    const [completed, setCompleted] = useState(false);
    const [alreadyCompleted, setAlreadyCompleted] = useState(false);
    const [starCount, setStarCount] = useState(10); 
    const [showHotTipPopup, setShowHotTipPopup] = useState(false);
    const [showLikeDislikePopup, setShowLikeDislikePopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [savedReports, setSavedReports] = useState([]);

    const [managerEmail, setManagerEmail] = useState('');
    const [managerName, setManagerName] = useState('');
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    
    function getCurrentWeekId() {
        const now = new Date();

        // Get the current day of week (0=Sunday, 1=Monday, ..., 6=Saturday)
        const day = now.getDay();
        const hour = now.getHours();
        const minute = now.getMinutes();

        // If it's Monday and before 00:01, treat as previous week
        let effectiveDate = new Date(now);
        if (day === 1 && (hour < 0 || (hour === 0 && minute < 1))) {
            // Go back one day to Sunday
            effectiveDate.setDate(now.getDate() - 1);
        } else if (day === 0) {
            // If it's Sunday, treat as previous week
            effectiveDate.setDate(now.getDate() - 1);
        }

        // Calculate ISO week number
        const year = effectiveDate.getFullYear();

        // Set to nearest Thursday: current date + 4 - current day number
        // Make Sunday (0) become 7
        const tempDate = new Date(effectiveDate);
        tempDate.setDate(effectiveDate.getDate() + 4 - (effectiveDate.getDay() || 7));
        const yearStart = new Date(tempDate.getFullYear(), 0, 1);
        const weekNo = Math.ceil((((tempDate - yearStart) / 86400000) + 1) / 7);

        // Compose a unique numeric ID: 13 (activity) + year + weekNumber, e.g., 13202423
        return Number(`13${year}${weekNo}`);
    }
    const activityId = getCurrentWeekId();
    
    const [answers, setAnswers] = useState({
        highlights: ["", "", ""],
        futureHighlights: ["", ""],
        supportNeeded: "",
        idea: "",
        screenshots: []
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
                    // Ensure arrays are properly initialized with default values
                    const userData = response.data[0] || {};
                    setAnswers({
                        highlights: userData.highlights || ["", "", ""],
                        futureHighlights: userData.futureHighlights || ["", ""],
                        supportNeeded: userData.supportNeeded || "",
                        idea: userData.idea || "",
                        screenshots: userData.screenshots || []
                    });
                    if (userData.savedReports) {
                        setSavedReports(userData.savedReports);
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
        setLoading(true);
        try {
            const payload = {
                userId: userId,
                completed: completed,
                answers: answers,
                stars: starCount,
            };
            // Fetch users who sent reports
            // const handleUserClick = (user) => {
            //     axios.get(`http://localhost:5001/admin/reports/user/${user.userId}`)
            //     .then(res => setReports(res.data))
            //     .catch(err => alert("Failed to fetch reports"));
            // };
            // const response = await axios.get(`http://api.careerstar.co/reports/user/${userId}`);
            const response = await axios.post(`https://api.careerstar.co/roadmapactivity/${userId}/${activityId}`, payload);
            if (response.status === 200) {
                if (completed) {
                    setCompleted(true);
                }
                if (completed && !alreadyCompleted) {
                    dispatch({ type: "INCREMENT_STAR", payload: starCount });
                }
            }
            setShowLikeDislikePopup(false); // <-- Add this line
            if (prevPage === 'activities') {
                navigate('/dashboard/activities');
            } else {
                navigate('/dashboard/home');
            }
        } catch (error) {
            console.error('Error saving answers:', error);
        } finally {
            setLoading(false);
        }
    };
    
    

    const handleSaveReport = () => {
        // Create a new report with current answers and timestamp
        const newReport = {
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            ...answers
        };
        
        // Add the new report to saved reports
        const updatedReports = [...savedReports, newReport];
        setSavedReports(updatedReports);
        
        // Update answers to include saved reports
        setAnswers(prev => ({
            ...prev,
            savedReports: updatedReports
        }));
        
        // Clear form for a new report
        setAnswers(prev => ({
            ...prev,
            highlights: ["", "", ""],
            futureHighlights: ["", ""],
            supportNeeded: "",
            screenshots: []
        }));
    };

    const handleDeleteReport = (reportId) => {
        const updatedReports = savedReports.filter(report => report.id !== reportId);
        setSavedReports(updatedReports);
        setAnswers(prev => ({
            ...prev,
            savedReports: updatedReports
        }));
    };

    // const handleScreenshotUpload = (event) => {
    //     const files = Array.from(event.target.files);
    //     const promises = files.map(file => {
    //         return new Promise((resolve) => {
    //             const reader = new FileReader();
    //             reader.onload = (e) => {
    //                 resolve(e.target.result);
    //             };
    //             reader.readAsDataURL(file);
    //         });
    //     });

    //     Promise.all(promises).then(fileDataUrls => {
    //         setAnswers(prev => ({
    //             ...prev,
    //             screenshots: [...prev.screenshots, ...fileDataUrls]
    //         }));
    //     });
    // };

    const exampleHighlights = [
        {
            title: "Completed database migration for user profiles",
            details: "• Migrated 10,000+ user records to new schema\n• Reduced query time by 35%\n• Zero data loss during transition"
        },
        {
            title: "Redesigned checkout process UI",
            details: "• Simplified from 5 steps to 3 steps\n• Created responsive mobile version\n• Checkout completion rate increased by 12%"
        },
        {
            title: "Implemented automated testing framework",
            details: "• Set up CI/CD pipeline integration\n• Created 50+ test cases\n• Reduced manual QA time by 8 hours per sprint"
        }
    ];

    const exampleFutureHighlights = [
        {
            title: "Optimize database indexing strategy",
            details: "• Will reduce query bottlenecks identified in last week's performance audit\n• Supports company-wide initiative to improve application responsiveness"
        },
        {
            title: "Create user onboarding tutorial flow",
            details: "• Design interactive guide for new feature rollout\n• Aligns with Q3 goal to improve user retention by 15%"
        }
    ];

    const exampleSupportRequests = [
        {
            title: "Access to production error logs",
            details: "Having direct access to these logs would help me identify the source of intermittent authentication failures more efficiently, reducing debugging time by approximately 3-4 hours per week."
        },
        {
            title: "Stakeholder feedback on proposed UI changes",
            details: "Early feedback from marketing and sales teams would help ensure the new dashboard design meets both user needs and business objectives before development begins."
        }
    ];

    const exampleIdeas = [
        {
            title: "Agile Development Methodology",
            details: "• Learned how to break down large projects into manageable sprints\n• Implemented daily stand-ups for better team communication\n• Applied this to improve project planning and delivery timelines"
        },
        {
            title: "User-Centered Design Principles",
            details: "• Discovered the importance of user feedback in design decisions\n• Applied these principles to improve our product's usability\n• Created a framework for gathering and implementing user feedback"
        }
    ];

    const generateReportPreview = () => {
        const reportDate = new Date().toLocaleDateString();
        const reportContent = `
# Weekly Progress Report - ${reportDate}

## Work Delivery Highlights
${answers.highlights.map((highlight, index) => highlight ? `${index + 1}. ${highlight}` : '').filter(Boolean).join('\n')}

## Next Week's Focus
${answers.futureHighlights.map((highlight, index) => highlight ? `${index + 1}. ${highlight}` : '').filter(Boolean).join('\n')}

## Support Needed
${answers.supportNeeded}

## Idea/Initiative
${answers.idea}
`;
        return reportContent;
    };

    const downloadReport = (format = 'md') => {
        const reportContent = generateReportPreview();
        const reportDate = new Date().toLocaleDateString().replace(/\//g, '-');
        
        switch (format) {
            case 'docx':
                // Create a new document
                const doc = new Document({
                    sections: [{
                        properties: {},
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: `Weekly Progress Report - ${reportDate}`,
                                        bold: true,
                                        size: 32
                                    })
                                ]
                            }),
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: '\nWork Delivery Highlights',
                                        bold: true,
                                        size: 24
                                    })
                                ]
                            }),
                            ...answers.highlights.map(highlight => 
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: highlight,
                                            size: 24
                                        })
                                    ]
                                })
                            ),
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: '\nNext Week\'s Focus',
                                        bold: true,
                                        size: 24
                                    })
                                ]
                            }),
                            ...answers.futureHighlights.map(highlight => 
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: highlight,
                                            size: 24
                                        })
                                    ]
                                })
                            ),
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: '\nSupport Needed',
                                        bold: true,
                                        size: 24
                                    })
                                ]
                            }),
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: answers.supportNeeded,
                                        size: 24
                                    })
                                ]
                            }),
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: '\nIdea/Initiative',
                                        bold: true,
                                        size: 24
                                    })
                                ]
                            }),
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: answers.idea,
                                        size: 24
                                    })
                                ]
                            }),
                            // Add screenshots section if there are any
                            ...(answers.screenshots && answers.screenshots.length > 0 ? [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: '\nScreenshots',
                                            bold: true,
                                            size: 24
                                        })
                                    ]
                                }),
                                // Add each screenshot
                                ...answers.screenshots.map(screenshot => {
                                    // Convert base64 to buffer
                                    const base64Data = screenshot.split(',')[1];
                                    const imageBuffer = Buffer.from(base64Data, 'base64');
                                    
                                    return new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: '',
                                                size: 24,
                                                image: {
                                                    data: imageBuffer,
                                                    transformation: {
                                                        width: 400,
                                                        height: 300
                                                    }
                                                }
                                            })
                                        ]
                                    });
                                })
                            ] : [])
                        ]
                    }]
                });

                // Generate and download the document
                Packer.toBlob(doc).then(blob => {
                    const element = document.createElement("a");
                    element.href = URL.createObjectURL(blob);
                    element.download = `Weekly_Report_${reportDate}.docx`;
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                });
                break;

            case 'pdf':
                const pdf = new jsPDF();
                const splitText = reportContent.split('\n');
                let y = 20;
                
                // Add text content
                splitText.forEach(line => {
                    if (line.startsWith('# ')) {
                        pdf.setFontSize(20);
                        pdf.text(line.substring(2), 20, y);
                    } else if (line.startsWith('## ')) {
                        pdf.setFontSize(16);
                        pdf.text(line.substring(3), 20, y);
                    } else {
                        pdf.setFontSize(12);
                        pdf.text(line, 20, y);
                    }
                    y += 10;
                });

                if (answers.screenshots && answers.screenshots.length > 0) {
                    y += 10; // Add some space before screenshots
                    pdf.setFontSize(16);
                    pdf.text('Screenshots:', 20, y);
                    y += 10;

                    answers.screenshots.forEach((screenshot, index) => {
                        if (y > 250) {
                            pdf.addPage();
                            y = 20;
                        }

                        const img = new Image();
                        img.src = screenshot;
                        
                        pdf.addImage(img, 'JPEG', 20, y, 120, 90);
                        y += 140;
                    });
                }

                pdf.save(`Weekly_Report_${reportDate}.pdf`);
                break;

            default:
                const element = document.createElement("a");
                const file = new Blob([reportContent], {type: 'text/markdown'});
                element.href = URL.createObjectURL(file);
                element.download = `Weekly_Report_${reportDate}.md`;
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
        }
    };

    const compressImage = (file, maxWidth = 800, quality = 0.7) => {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
                canvas.width = img.width * ratio;
                canvas.height = img.height * ratio;
                
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                canvas.toBlob(resolve, 'image/jpeg', quality);
            };
            
            img.src = URL.createObjectURL(file);
        });
    };
    
    const convertBlobToBase64 = (blob) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    };
    
    // Updated screenshot upload handler with compression
    const handleScreenshotUpload = async (event) => {
        const files = Array.from(event.target.files);
        
        // Show loading state
        setLoading(true);
        
        try {
            const processedImages = await Promise.all(
                files.map(async (file) => {
                    // Compress large images
                    if (file.size > 1024 * 1024) { // If larger than 1MB
                        const compressedBlob = await compressImage(file, 800, 0.6);
                        return await convertBlobToBase64(compressedBlob);
                    } else {
                        return new Promise((resolve) => {
                            const reader = new FileReader();
                            reader.onload = (e) => resolve(e.target.result);
                            reader.readAsDataURL(file);
                        });
                    }
                })
            );
    
            setAnswers(prev => ({
                ...prev,
                screenshots: [...prev.screenshots, ...processedImages]
            }));
        } catch (error) {
            console.error('Error processing images:', error);
            alert('Error processing images. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    // Updated send email function with better error handling and optimization
    const sendReportToManager = async () => {
        if (!managerEmail || !managerName) {
            alert('Please enter both your manager\'s name and email address');
            return;
        }
    
        if (!managerEmail.includes('@')) {
            alert('Please enter a valid email address');
            return;
        }
    
        setIsSendingEmail(true);
        
        try {
            // Generate PDF with size optimization
            const reportContent = generateReportPreview();
            const reportDate = new Date().toLocaleDateString().replace(/\//g, '-');
            const studentName = localStorage.getItem('firstname') || 'Student';

            const pdf = new jsPDF();

            pdf.internal.events.subscribe('addPage', function () {
                pdf.setFont(undefined, 'normal');
            });

            let y = 20;

            // Add sender's name at the top
            pdf.setFontSize(12);
            pdf.setFont(undefined, 'bold');
            pdf.text(`Report from: ${studentName}`, 20, y);
            y += 10;

            // Add the rest of the report content
            const splitText = reportContent.split('\n');
            splitText.forEach(line => {
                if (y > 280) {
                    pdf.addPage();
                    y = 20;
                }

                if (line.startsWith('# ')) {
                    pdf.setFontSize(18);
                    pdf.setFont(undefined, 'bold');
                    pdf.text(line.substring(2), 20, y);
                    pdf.setFont(undefined, 'normal');
                    y += 12;
                } else if (line.startsWith('## ')) {
                    pdf.setFontSize(14);
                    pdf.setFont(undefined, 'bold');
                    pdf.text(line.substring(3), 20, y);
                    pdf.setFont(undefined, 'normal');
                    y += 10;
                } else if (line.trim()) {
                    pdf.setFontSize(10);
                    pdf.setFont(undefined, 'normal');
                    const splitLine = pdf.splitTextToSize(line, 170);
                    pdf.text(splitLine, 20, y);
                    y += splitLine.length * 5;
                } else {
                    y += 5;
                }
            });

            // Add screenshots with compression and size limits
            if (answers.screenshots && answers.screenshots.length > 0) {
                // Limit number of screenshots to prevent large files
                const maxScreenshots = 5;
                const screenshotsToInclude = answers.screenshots.slice(0, maxScreenshots);
                
                if (y > 250) {
                    pdf.addPage();
                    y = 20;
                }
                
                pdf.setFontSize(14);
                pdf.text('Screenshots:', 20, y);
                y += 15;

                for (let i = 0; i < screenshotsToInclude.length; i++) {
                    const screenshot = screenshotsToInclude[i];
                    
                    if (y > 200) {
                        pdf.addPage();
                        y = 20;
                    }
    
                    try {
                        const img = new Image();
                        img.src = screenshot;
                        await new Promise((res) => img.onload = res);

                        const canvas = document.createElement('canvas');
                        canvas.width = 800;
                        canvas.height = 600;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        const resizedBase64 = canvas.toDataURL('image/jpeg', 0.6); // 60% quality

                        pdf.addImage(resizedBase64, 'JPEG', 20, y, 120, 90);
                        y += 100;
                    } catch (error) {
                        console.warn(`Failed to add screenshot ${i + 1}:`, error);
                        // Continue without this screenshot
                    }
                }
                
                if (answers.screenshots.length > maxScreenshots) {
                    pdf.text(`Note: Only first ${maxScreenshots} screenshots included due to size limits.`, 20, y);
                }
            }
    
            // Get PDF as base64 with compression
            const pdfBase64 = pdf.output('datauristring').split(',')[1];
            
            // Check file size before sending (rough estimate)
            const estimatedSizeMB = (pdfBase64.length * 0.75) / (1024 * 1024);
            
            if (estimatedSizeMB > 20) {
                alert('Report is too large to email. Please reduce the number of screenshots and try again.');
                setIsSendingEmail(false);
                return;
            }
            
            // Prepare email data
            const emailData = {
                managerEmail: managerEmail,
                managerName: managerName,
                studentName: localStorage.getItem('firstname') || 'Student',
                reportDate: reportDate,
                pdfContent: pdfBase64,
                reportPreview: reportContent.substring(0, 1000),
                userId: userId,         
                userAnswers: answers 
            };
            // Send email via API with timeout
            const response = await axios.post('https://api.careerstar.co/send-report-email', emailData, {
                timeout: 60000, // 60 second timeout
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.status === 200) {
                setEmailSent(true);
                alert('Report sent successfully to your manager!');
                setManagerEmail(''); // Clear email field
                setManagerName(''); // Clear name field
                
                // Auto-hide success message after 5 seconds
                setTimeout(() => setEmailSent(false), 5000);
            }
            
        } catch (error) {
            console.error('Error sending email:', error);
            
            // Better error messages
            if (error.response?.status === 413) {
                alert('Report is too large to send. Please reduce screenshots and try again.');
            } else if (error.response?.status === 400) {
                alert('Invalid email format or missing information.');
            } else if (error.code === 'ERR_NETWORK') {
                alert('Network error. Please check your connection and try again.');
            } else if (error.code === 'ECONNABORTED') {
                alert('Request timed out. The report might be too large.');
            } else {
                alert('Failed to send report. Please try again.');
            }
        } finally {
            setIsSendingEmail(false);
        }
    };

    const stepsData = [
        { id: 1, number: "Step 1", title: "Highlights", icon: highlightIcon },
        { id: 2, number: "Step 2", title: "Future Highlights", icon: futureIcon },
        { id: 3, number: "Step 3", title: "Support Need", icon: supportIcon },
        { id: 4, number: "Step 4", title: "Idea", icon: ideaIcon },
        { id: 5, number: "Step 5", title: "Create Your 3-2-1-1 Report", icon: reportIcon },
    ];

    const handleStepChange = (stepId) => {
        scrollToTop();
        setCurrentStep(stepId);
        setPreviewMode(false);
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
                        <div className="activity-step" key={step.id}>
                            <div className="activity-step-left-element">
                                <img src={step.icon} alt={step.title} />
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
                            <img src={activityImage} alt="Activity" />
                        </div>
                        <h2>3-2-1 + Report: Stand Out During Your Internship</h2>
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
                        <ul>
                            <li>
                                The 3-2-1+ Report is a simple, effective tool that helps you track your work, request support, and advance your career.
                            </li>
                            {/* <br /> */}
                            {/* <li>
                                This streamlined format showcases accomplishments, demonstrates forward thinking, and communicates effectively with stakeholders.
                            </li> */}
                            <br />
                            <li>
                                This activity will help you generate a report with images that can be shared instantly with coworkers and managers.
                            </li>
                         </ul>
                        </div>
                ) : currentStep === 1 ? (
                    <div className="activity-description">
                        <h2>Step 1: 3 Highlights</h2>
                        <p>The first section of your report should showcase your top three accomplishments or completed tasks from the week. This is your chance to demonstrate your impact and value.</p>
                        
                        <div className="activity-hot-tip">
                            <img src={fireFlameIcon} alt="Fire Flame Icon" />
                            <p>Always try to quantify your accomplishments with specific numbers, percentages, or time saved. This makes your impact more concrete and impressive!</p>
                        </div>
                        
                        <h3>Key components for good highlights:</h3>
                        <ul>
                            <li>Be specific about what you accomplished</li>
                            <li>Include quantifiable results where possible</li>
                            <li>Connect your work to broader team or company goals</li>
                            <li>Include 1-2 screenshots of your work when relevant</li>
                        </ul>
                        
                        <h3>Examples of effective highlights:</h3>
                        {exampleHighlights.map((example, index) => (
                            <div className="example-card" key={index}>
                                <h4>{example.title}</h4>
                                <pre>{example.details}</pre>
                            </div>
                        ))}
                        
                        <h3>Your turn - list your three highlights:</h3>
                        {[0, 1, 2].map((index) => (
                            <div className="highlight-input" key={index}>
                                <textarea
                                    placeholder={`Highlight ${index + 1}`}
                                    value={answers?.highlights?.[index] || ""}
                                    onChange={(e) => {
                                        const newHighlights = [...(answers?.highlights || ["", "", ""])];
                                        newHighlights[index] = e.target.value;
                                        setAnswers({...answers, highlights: newHighlights});
                                    }}
                                    rows={3}
                                />
                            </div>
                        ))}
                        
                        <h3>Add screenshots (optional):</h3>
                        <div className="screenshot-input">
                            <input 
                                type="file" 
                                accept="image/*" 
                                multiple 
                                onChange={handleScreenshotUpload} 
                            />
                        </div>
                    
                        <div className="screenshots-preview">
                            {answers.screenshots && answers.screenshots.map((screenshot, index) => (
                                <div className="screenshot-thumbnail" key={index}>
                                    <img src={screenshot} alt={`Screenshot ${index + 1}`} />
                                    <button onClick={() => {
                                        const newScreenshots = [...answers.screenshots];
                                        newScreenshots.splice(index, 1);
                                        setAnswers({...answers, screenshots: newScreenshots});
                                    }}>Remove</button>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : currentStep === 2 ? (
                    <div className="activity-description">
                        <h2>Step 2: 2 Future Highlights</h2>
                        <p>In this section, outline two important tasks or initiatives you'll be focusing on in the coming week. This demonstrates forward thinking and helps set expectations.</p>
                        
                        <div className="activity-hot-tip">
                            <img src={fireFlameIcon} alt="Fire Flame Icon" />
                            <p>Connect your future work to broader team goals or company values to show strategic thinking!</p>
                        </div>
                        
                        <h3>Key components for future highlights:</h3>
                        <ul>
                            <li>Be specific about what you plan to accomplish</li>
                            <li>Explain how this work contributes to larger objectives</li>
                            <li>Set realistic expectations for what you can achieve</li>
                            <li>Avoid simply continuing last week's work without showing progression</li>
                        </ul>
                        
                        <h3>Examples of effective future highlights:</h3>
                        {exampleFutureHighlights.map((example, index) => (
                            <div className="example-card" key={index}>
                                <h4>{example.title}</h4>
                                <pre>{example.details}</pre>
                            </div>
                        ))}
                        
                        <h3>Your turn - list your two future highlights:</h3>
                        {[0, 1].map((index) => (
                            <div className="highlight-input" key={index}>
                                <textarea
                                    placeholder={`Future Highlight ${index + 1}`}
                                    value={answers?.futureHighlights?.[index] || ""}
                                    onChange={(e) => {
                                        const newFutureHighlights = [...(answers?.futureHighlights || ["", ""])];
                                        newFutureHighlights[index] = e.target.value;
                                        setAnswers({...answers, futureHighlights: newFutureHighlights});
                                    }}
                                    rows={3}
                                />
                            </div>
                        ))}
                    </div>
                ) : currentStep === 3 ? (
                    <div className="activity-description">
                        <h2>Step 3: 1 Support Need</h2>
                        <p>The final section of your report identifies one area where you need support, guidance, or resources. This shows self-awareness and proactive communication.</p>
                        
                        <div className="activity-hot-tip">
                            <img src={fireFlameIcon} alt="Fire Flame Icon" />
                            <p>Frame your request in terms of how solving this issue will benefit the team or project, not just yourself!</p>
                        </div>
                        
                        <h3>Key components for support requests:</h3>
                        <ul>
                            <li>Clearly identify the specific support you need</li>
                            <li>Explain how addressing this need benefits the team/project</li>
                            <li>Be solution-oriented, not just problem-focused</li>
                            <li>Keep it constructive and positive</li>
                        </ul>
                        
                        <h3>Examples of effective support requests:</h3>
                        {exampleSupportRequests.map((example, index) => (
                            <div className="example-card" key={index}>
                                <h4>{example.title}</h4>
                                <pre>{example.details}</pre>
                            </div>
                        ))}
                        
                        <h3>Your turn - describe your support need:</h3>
                        <textarea
                            className="support-need-textarea"
                            placeholder="Describe one area where you need support..."
                            value={answers.supportNeeded}
                            onChange={(e) => setAnswers({...answers, supportNeeded: e.target.value})}
                            rows={4}
                        />
                    </div>
                ) : currentStep === 4 ? (
                    <div className="activity-description">
                        <h2>Step 4: Idea</h2>
                        <p>In this section, outline one key idea or concept you've learned or discovered during your internship.</p>
                        
                        <div className="activity-hot-tip">
                            <img src={fireFlameIcon} alt="Fire Flame Icon" />
                            <p>Share your learning and apply it to future projects or challenges!</p>
                        </div>
                        
                        <h3>Key components for effective ideas:</h3>
                        <ul>
                            <li>Be specific about the idea</li>
                            <li>Explain its relevance to your internship experience</li>
                            <li>Provide examples of how you've applied the idea</li>
                        </ul>
                        
                        <h3>Examples of effective ideas:</h3>
                        {exampleIdeas.map((example, index) => (
                            <div className="example-card" key={index}>
                                <h4>{example.title}</h4>
                                <pre>{example.details}</pre>
                            </div>
                        ))}
                        
                        <h3>Your turn - describe your key idea:</h3>
                        <textarea
                            className="support-need-textarea"
                            placeholder="Describe one key idea you've learned or discovered during your internship..."
                            value={answers.idea}
                            onChange={(e) => setAnswers({...answers, idea: e.target.value})}
                            rows={4}
                        />
                    </div>
                ) : currentStep === 5 ? (
                    <div className="activity-description">
                        <h2>Step 5: Create Your 3-2-1-1 Report</h2>
                        
                        {previewMode ? (
                            <div className="report-preview">
                                <h3>Report Preview:</h3>
                                <div className="report-preview-content">
                                    <ReactMarkdown>{generateReportPreview()}</ReactMarkdown>
                                    
                                    {answers.screenshots && answers.screenshots.length > 0 && (
                                        <div className="screenshots-section">
                                            <h3>Screenshots:</h3>
                                            <div className="screenshots-grid">
                                                {answers.screenshots.map((screenshot, index) => (
                                                    <img 
                                                        key={index} 
                                                        src={screenshot} 
                                                        alt={`Supporting screenshot ${index + 1}`} 
                                                        className="report-screenshot"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="report-action-buttons">
                                    <button onClick={() => setPreviewMode(false)}>Edit Report</button>
                                    <div className="download-options">
                                        <button onClick={() => downloadReport('md')}>Download MD</button>
                                        <button onClick={() => downloadReport('docx')}>Download DOCX</button>
                                        <button onClick={() => downloadReport('pdf')}>Download PDF</button>
                                    </div>
                                    <button onClick={handleSaveReport}>Save Report</button>
                                </div>
                            </div>
                        ) : (
                            <div className="report-builder">
                                <p>Now that you've completed all four sections, let's put them together into a professional 3-2-1-1 Report that you can share with your manager and stakeholders.</p>
                                
                                <div className="report-section-summary">
                                    <h3>3 Highlights:</h3>
                                    <ul>
                                        {answers.highlights.map((highlight, index) => (
                                            <li key={index}>{highlight || <span className="missing-content">Not completed</span>}</li>
                                        ))}
                                    </ul>
                                    
                                    <h3>2 Future Highlights:</h3>
                                    <ul>
                                        {answers.futureHighlights.map((highlight, index) => (
                                            <li key={index}>{highlight || <span className="missing-content">Not completed</span>}</li>
                                        ))}
                                    </ul>
                                    
                                    <h3>1 Support Need:</h3>
                                    <p>{answers.supportNeeded || <span className="missing-content">Not completed</span>}</p>
                                    
                                    <h3>1 Idea:</h3>
                                    <p>{answers.idea || <span className="missing-content">Not completed</span>}</p>
                                    
                                    {answers.screenshots && answers.screenshots.length > 0 && (
                                        <div>
                                            <h3>Screenshots ({answers.screenshots.length}):</h3>
                                            <p>Screenshots will be included in your report.</p>
                                        </div>
                                    )}
                                </div>
                                
                                {/*<button 
                                    onClick={() => setPreviewMode(true)}
                                    disabled={!answers.highlights[0] || !answers.futureHighlights[0] || !answers.supportNeeded || !answers.idea}
                                >
                                    Preview Report
                                </button> */}
                                <div className="email-manager-section">
                                    <h3>Send Report to Manager</h3>
                                    <div className="email-input-container">
                                        <input
                                            type="text"
                                            placeholder="Enter your manager's name"
                                            value={managerName}
                                            onChange={(e) => setManagerName(e.target.value)}
                                            className="manager-email-input"
                                            disabled={isSendingEmail}
                                        />
                                        <input
                                            type="email"
                                            placeholder="Enter your manager's email"
                                            value={managerEmail}
                                            onChange={(e) => setManagerEmail(e.target.value)}
                                            className="manager-email-input"
                                            disabled={isSendingEmail}
                                        />
                                    </div>
                                    {emailSent && (
                                        <p className="email-success-message">✓ Report sent successfully!</p>
                                    )}
                                </div>
                                {(!answers.highlights[0] || !answers.futureHighlights[0] || !answers.supportNeeded || !answers.idea) && (
                                    <p className="warning-message">Please complete all required sections before previewing your report.</p>
                                )}
                            </div>
                        )}
                        
                        {savedReports.length > 0 && (
                            <div className="saved-reports-section">
                                <h3>Your Saved Reports:</h3>
                                <div className="saved-reports-list">
                                    {savedReports.map((report, index) => (
                                        <div className="saved-report-item" key={index}>
                                            <h4>Report from {report.date}</h4>
                                            <div className="saved-report-actions">
                                                <button onClick={() => {
                                                    setAnswers({
                                                        ...answers,
                                                        highlights: report.highlights,
                                                        futureHighlights: report.futureHighlights,
                                                        supportNeeded: report.supportNeeded,
                                                        screenshots: report.screenshots || []
                                                    });
                                                    setPreviewMode(true);
                                                }}>View</button>
                                                <button onClick={() => handleDeleteReport(report.id)}>Delete</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        <div className="report-tips">
                            <h3>Tips for Effective Reporting:</h3>
                            <ul>
                                <li>Be consistent - send your report on the same day each week</li>
                                <li>Keep it concise - busy managers appreciate brevity</li>
                                <li>Follow up in your 1:1 meetings to discuss key points</li>
                                <li>Save your reports to track your progress over time</li>
                                <li>Use these reports when updating your resume or preparing for performance reviews</li>
                            </ul>
                        </div>
                    </div>
                ) : null}
                <div className="activity-navigation-buttons">
                    <div className="activity-navigation-back-button" onClick={handleBack} disabled={currentStep === null} style={{ marginRight: "10px" }}>
                        {currentStep === null ? "Back to Activity Page" : "Back to Previous Step"}
                    </div>
                    {currentStep === stepsData.length ? (
                        <button
                            className="activity-navigation-next-button"
                            disabled={
                                isSendingEmail ||
                                !managerName ||
                                !managerEmail ||
                                !answers.highlights[0] ||
                                !answers.futureHighlights[0] ||
                                !answers.supportNeeded ||
                                !answers.idea
                            }
                            onClick={async () => {
                                // Set loading state for button
                                setIsSendingEmail(true);
                                try {
                                    await sendReportToManager();
                                    await handleSubmit(true);
                                } finally {
                                    setIsSendingEmail(false);
                                }
                            }}
                        >
                            {isSendingEmail ? 'Sending...' : 'Send Report & Complete'}
                        </button>
                    ) : (
                        <div className="activity-navigation-next-button" onClick={handleNext}>
                            Go to Next Step
                        </div>
                    )}
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
                        {/* Add any popup content here if needed */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Activity13;