import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import star from '../../assets/images/star-yellow.png';
import axios from 'axios';
import jsPDF from 'jspdf';
import { Star as StarIcon, TrendingUp as TrendingUpIcon, CheckCircle as CheckCircleIcon, Award as AwardIcon, Code as CodeIcon } from 'lucide-react';

function Profile({ userId: propUserId }) {
    const dispatch = useDispatch();
    const [userId, setUserId] = useState(propUserId || localStorage.getItem('userId') || '');
    const [firstname, setFirstname] = useState('');
    const [majorDetails, setMajorDetails] = useState('');
    const [goal, setGoal] = useState('');
    const [summary, setSummary] = useState('');
    const [stars, setStars] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showAvatarModal, setShowavatarModal] = useState(false);
    const avatar = useSelector(state => state.avatar) || 'avatar1';
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [showReports, setShowReports] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [internshipSummary, setInternshipSummary] = useState(null);
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [summaryLoaded, setSummaryLoaded] = useState(false);
    const [showInternDashboard, setShowInternDashboard] = useState(false);
    const [internDashboardView, setInternDashboardView] = useState('summary'); // 'summary' | 'report'

    const avatarURL = '../../assets/images/avatars/';

    const avatars = [
        'avatar1',
        'avatar2',
        'avatar3',
        'avatar4',
        'avatar5',
        'avatar6',
        'avatar7',
        'avatar8',
    ]

    const getTechStyle = (techName) => {
        const key = (techName || '').toString().toLowerCase();
        switch (key) {
            case 'javascript':
                return { bg: '#FEF3C7', color: '#92400E' };
            case 'react':
                return { bg: '#CFFAFE', color: '#155E75' };
            case 'python':
                return { bg: '#E0E7FF', color: '#3730A3' };
            case 'html':
                return { bg: '#FFE4E6', color: '#9F1239' };
            case 'css':
                return { bg: '#DBEAFE', color: '#1E3A8A' };
            case 'git':
                return { bg: '#FFEDD5', color: '#9A3412' };
            case 'node.js':
            case 'node':
                return { bg: '#DCFCE7', color: '#14532D' };
            case 'sql':
                return { bg: '#FEF9C3', color: '#854D0E' };
            default:
                return { bg: '#EEF2FF', color: '#3730A3' };
        }
    };

    const handleSummaryChange = (event) => {
        setSummary(event.target.value);
    };

    const handleHelp = () => {
        generateAIOutput();
    };

    useEffect(() => {
        const fetchUserDetails = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`https://api.careerstar.co/user/${userId}`);
            
                if (response.status === 200) {
                    const data = response.data;
            
                    if (data.firstname) {
                        setFirstname(data.firstname);
                        setStars(data.stars);
                    }
                } else {
                    console.error('Error fetching user details:', response);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
            try {
                const response = await axios.get(`https://api.careerstar.co/onboarding/${userId}`);
            
                if (response.status === 200) {
                    const data = response.data;
            
                    if (data.summary) {
                        setSummary(data.summary);
                    }
                    setMajorDetails(`${data.degree} in ${data.major}`);
                    setGoal(data.goal);
                } else {
                    console.error('Error fetching user details:', response);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            } finally {
                setLoading(false);
            }
        }
        if (userId) {
            fetchUserDetails();
        }
    }, [userId]);

    useEffect(() => {
      const fetchReports = async () => {
        if (!userId) return;
        try {
          const res = await axios.get(`https://api.careerstar.co/admin/reports/user/${userId}`);
          setReports(res.data.sort((a, b) => new Date(b.created_time) - new Date(a.created_time)));
        } catch (err) {
          setReports([]);
        }
      };
      fetchReports();
    }, [userId]);

    const openInternDashboard = () => {
      setShowInternDashboard(true);
      setInternDashboardView('report');
    };

    const closeInternDashboard = () => {
      setShowInternDashboard(false);
      setInternDashboardView('summary');
    };

    const backToInternSummary = () => {
      setShowInternDashboard(false);
      setInternDashboardView('summary');
    };
    

    useEffect(() => {
      const fetchInternshipSummary = async () => {
        if (!userId) return;
        setSummaryLoading(true);
        try {
          const res = await axios.get(`https://api.careerstar.co/internship-summary/${userId}`);
          setInternshipSummary(res.data);
        } catch (err) {
          setInternshipSummary(null);
        } finally {
          setSummaryLoading(false);
          setSummaryLoaded(true);
        }
      };
      fetchInternshipSummary();
    }, [userId]);

    const handleSave = async (updatedSummary) => {
        setLoading(true);
        try {
            const response = await axios.put(`https://api.careerstar.co/update_profile/${userId}`, {
                summary: updatedSummary,
            });
        
            if (response.status === 200) {
                console.log('User details updated successfully');
            } else {
                console.error('Error updating user details');
            }
        } catch (error) {
            console.error('Error updating user details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProfilePictureClick = async (avatar) => {
        setShowavatarModal(false);
        dispatch({ type: "SET_AVATAR", payload: avatar });
        try {
            const response = await axios.put(`https://api.careerstar.co/profile_picture/${userId}`, {
                profilepicture: avatar,
            });
        
            if (response.status === 200) {
                console.log('User details updated successfully');
            } else {
                console.error('Error updating user details');
            }
        } catch (error) {
            console.error('Error updating user details:', error);
        }
        dispatch({ type: "SET_AVATAR", payload: avatar });
    };

    const generateAIOutput = async (userMessage) => {
        setLoading(true); // Show loader
    
        try {
            const response = await axios.post("https://api.careerstar.co/generate-ai-feedback", {
                prompt: `You are a professional summary writer. 
                    your role is to write a resume summary / LinkedIn About section based on the details I provide. 
                    Do not give options or any other instructions, I just want summary, no heading, nothing. 
                    Directly write it in normal text. It should be short, concise, positive, and in first voice like "I am..". 
                    You don't have to start with "I am". It should be positive in tone.
                    If you write it amzingly, I will give you 5 star rating and a $5 Million check.
                    The summary should be 2-3 sentences long. First name is ${firstname}, pursuing ${majorDetails} from NYIT, 
                    have a dream of becoming ${goal}. It should be in first voice like "I am..".`,
            });
    
            if (response.data && response.data.feedback) {
                setSummary(response.data.feedback);
                await handleSave(response.data.feedback);
            } else {
                console.log("Error: Unable to fetch feedback. Please try again.");
            }
        } catch (error) {
            console.log("Error: Unable to fetch feedback. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    }

    // Helper to break long lines for PDF
    const breakLongLines = (text, maxLen = 80) => {
        if (!text) return '';
        return text
            .split('\n')
            .map(line => {
                if (line.length <= maxLen) return line;
                const words = line.split(' ');
                let result = '';
                let current = '';
                for (const word of words) {
                    if ((current + ' ' + word).trim().length > maxLen) {
                        result += current.trim() + '\n';
                        current = word + ' ';
                    } else {
                        current += word + ' ';
                    }
                }
                result += current.trim();
                return result;
            })
            .join('\n');
    };

    const downloadReportPDF = async (report) => {
        const pdf = new jsPDF();
        let y = 20;
        const reportDate = report.created_time
            ? new Date(report.created_time).toLocaleDateString()
            : '';
        // Title
        pdf.setFontSize(18);
        pdf.setFont(undefined, 'bold');
        pdf.text(`Weekly Progress Report - ${reportDate}`, 20, y);
        y += 12;
        // Add sender's name 
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'normal');
        pdf.text(`Report from: ${report.student_name || 'N/A'}`, 20, y);
        y += 10;
        // Add recipient info
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'normal');
        pdf.text(`To: ${report.manager_email || 'N/A'}`, 20, y);
        y += 10;
        // Support Needed
        pdf.setFontSize(14);
        pdf.setFont(undefined, 'bold');
        pdf.text('Support Needed', 20, y);
        y += 8;
        pdf.setFont(undefined, 'normal');
        pdf.setFontSize(10);
        const supportLines = pdf.splitTextToSize(breakLongLines(report.answers?.supportNeeded || '').replace(/<br\/>/g, '\n'), 170);
        pdf.text(supportLines, 20, y);
        y += supportLines.length * 5 + 4;
        // Work Delivery Highlights
        pdf.setFontSize(14);
        pdf.setFont(undefined, 'bold');
        pdf.text('Work Delivery Highlights', 20, y);
        y += 8;
        pdf.setFont(undefined, 'normal');
        pdf.setFontSize(10);
        (report.answers?.highlights || []).forEach((h, i) => {
            if (h) {
                const lines = pdf.splitTextToSize(`${i + 1}. ${breakLongLines(h).replace(/<br\/>/g, '\n')}`, 170);
                pdf.text(lines, 20, y);
                y += lines.length * 5;
            }
        });
        y += 4;
        // Next Week's Focus
        pdf.setFontSize(14);
        pdf.setFont(undefined, 'bold');
        pdf.text("Next Week's Focus", 20, y);
        y += 8;
        pdf.setFont(undefined, 'normal');
        pdf.setFontSize(10);
        (report.answers?.futureHighlights || []).forEach((h, i) => {
            if (h) {
                const lines = pdf.splitTextToSize(`${i + 1}. ${breakLongLines(h).replace(/<br\/>/g, '\n')}`, 170);
                pdf.text(lines, 20, y);
                y += lines.length * 5;
            }
        });
        y += 4;
        // Idea/Initiative
        pdf.setFontSize(14);
        pdf.setFont(undefined, 'bold');
        pdf.text('Idea/Initiative', 20, y);
        y += 8;
        pdf.setFont(undefined, 'normal');
        pdf.setFontSize(10);
        const ideaLines = pdf.splitTextToSize(breakLongLines(report.answers?.idea || '').replace(/<br\/>/g, '\n'), 170);
        pdf.text(ideaLines, 20, y);
        y += ideaLines.length * 5;
        // Screenshots
        if (report.answers?.screenshots && report.answers.screenshots.length > 0) {
            const maxScreenshots = 5;
            const screenshotsToInclude = report.answers.screenshots.slice(0, maxScreenshots);
            if (y > 250) {
                pdf.addPage();
                y = 20;
            }
            pdf.setFontSize(14);
            pdf.setFont(undefined, 'bold');
            pdf.text('Screenshots:', 20, y);
            y += 15;
            for (let i = 0; i < screenshotsToInclude.length; i++) {
                const screenshot = screenshotsToInclude[i];
                if (y > 200) {
                    pdf.addPage();
                    y = 20;
                }
                try {
                    const img = new window.Image();
                    img.src = screenshot;
                    await new Promise((res) => img.onload = res);
                    const canvas = document.createElement('canvas');
                    canvas.width = 800;
                    canvas.height = 600;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    const resizedBase64 = canvas.toDataURL('image/jpeg', 0.6);
                    pdf.addImage(resizedBase64, 'JPEG', 20, y, 120, 90);
                    y += 100;
                } catch (error) {
                    // Handle error
                }
            }
            if (report.answers.screenshots.length > maxScreenshots) {
                pdf.text(`Note: Only first ${maxScreenshots} screenshots included due to size limits.`, 20, y);
            }
        }
        pdf.save(`Weekly_Report_${reportDate}.pdf`);
    };

    return (
        <div className='profile-container'>
            {loading && (
                <div className="spinner-overlay">
                    <div className="spinner"></div>
                </div>
            )}
            <div className='profile-informtation'>
                <img src={require(`../../assets/images/avatars/${avatar}.png`)} alt='Profile icon' />
                <span className='change-avatar material-icons' onClick={() => setShowavatarModal(true)}>edit</span>
                <div className='profile-user-info flex-row'>
                    <p className='profile-user-name'>{firstname}</p>
                    <p className='star-count'>{stars}</p>
                    <img src={star} className='star' />
                </div>
                <p className='profile-role'>{majorDetails}</p>

                <div className='profile-summary flex-column'>
                    <p>My Summary</p>
                    <textarea
                        value={summary}
                        onChange={handleSummaryChange}
                        rows="4"
                        cols="50"
                        placeholder='Write a summary about yourself...'
                    />

                    <div className='summary-buttons flex-row'>
                        <button className='help-me-button' onClick={handleHelp}>Help me write summary</button>
                        <button className='save-button' onClick={() => handleSave(summary)}>Save</button>
                    </div>
                    <div className="my-reports-section">
                      <button
                        className="my-reports-main-btn"
                        onClick={() => {
                          setShowReports(!showReports);
                          setSelectedReport(null);
                        }}
                      >
                        {showReports ? "Hide My Reports" : "My Reports"}
                      </button>
                      {showReports && !selectedReport && (
                        <div className="my-reports-list">
                          {reports.length === 0 ? (
                            <p>No reports found.</p>
                          ) : (
                            <ul>
                              {reports.map((report) => (
                                <li
                                  key={report.id}
                                  className="my-report-card clickable"
                                  onClick={() => setSelectedReport(report)}
                                >
                                  <strong>
                                    {report.created_time
                                      ? new Date(report.created_time).toLocaleDateString('en-US', {
                                          weekday: 'short',
                                          year: 'numeric',
                                          month: 'short',
                                          day: '2-digit',
                                          timeZone: 'America/New_York'
                                        })
                                      : "N/A"}
                                    {" at "}
                                    {report.created_time
                                      ? new Date(report.created_time).toLocaleTimeString('en-US', {
                                          hour: '2-digit',
                                          minute: '2-digit',
                                          hour12: true,
                                          timeZone: 'America/New_York'
                                        })
                                      : "N/A"}
                                  </strong>
                                  <button
                                    className="download-pdf-btn"
                                    style={{ marginLeft: 12 }}
                                    onClick={e => {
                                      e.stopPropagation();
                                      downloadReportPDF(report);
                                    }}
                                  >
                                    Download PDF
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                      {showReports && selectedReport && (
                        <div className="my-report-detail">
                          <button className="my-reports-back-btn" onClick={() => setSelectedReport(null)}>
                            ← Back to My Reports
                          </button>
                          {/* Download PDF button for selected report */}
                          <button
                            className="download-pdf-btn"
                            style={{ marginLeft: 12, marginBottom: 16 }}
                            onClick={() => downloadReportPDF(selectedReport)}
                          >
                            Download PDF
                          </button>
                          <div className="my-report-detail-header">
                            <div className="my-report-detail-date">
                              Report sent on: {selectedReport.created_time
                                ? new Date(selectedReport.created_time).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'short',
                                    day: '2-digit',
                                    timeZone: 'America/New_York'
                                  })
                                : "N/A"}
                              {" at "}
                              {selectedReport.created_time
                                ? new Date(selectedReport.created_time).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true,
                                    timeZone: 'America/New_York'
                                  })
                                : "N/A"}
                            </div>
                          </div>
                          <div className="my-report-section">
                            <div className="my-report-section-title">Highlights:</div>
                            <ul className="my-report-section-list">
                              {selectedReport.answers?.highlights?.map((h, i) => <li key={i}>{h}</li>)}
                            </ul>
                          </div>
                          <div className="my-report-section">
                            <div className="my-report-section-title">Future Highlights:</div>
                            <ul className="my-report-section-list">
                              {selectedReport.answers?.futureHighlights?.map((fh, i) => <li key={i}>{fh}</li>)}
                            </ul>
                          </div>
                          <div className="my-report-section">
                            <div className="my-report-section-title">Support Needed:</div>
                            <div className="my-report-section-content">{selectedReport.answers?.supportNeeded || "N/A"}</div>
                          </div>
                          <div className="my-report-section">
                            <div className="my-report-section-title">Idea:</div>
                            <div className="my-report-section-content">{selectedReport.answers?.idea || "N/A"}</div>
                          </div>
                          <div className="my-report-section">
                            <div className="my-report-section-title">Screenshots:</div>
                            <ul className="my-report-section-list">
                              {selectedReport.answers?.screenshots?.length
                                ? selectedReport.answers.screenshots.map((s, i) => <li key={i}><a href={s} target="_blank" rel="noopener noreferrer">Screenshot {i + 1}</a></li>)
                                : <li>None</li>
                              }
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                    <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-start' }}>
                      <div
                        onClick={openInternDashboard}
                        style={{
                          cursor: 'pointer',
                          width: '100%',
                          maxWidth: 300,
                          minHeight: 180,
                          background: 'rgba(255,255,255,0.2)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          borderRadius: 16,
                          padding: '24px 16px',
                          boxShadow: '0 6px 24px rgba(0,0,0,0.25)',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{
                              width: 40,
                              height: 40,
                              borderRadius: 9999,
                              background: 'linear-gradient(135deg, #60A5FA, #8B5CF6)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800
                            }}>
                              {(internshipSummary?.user_name || firstname || 'U').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>
                                {internshipSummary?.user_name || firstname}
                              </div>
                              <div style={{ fontSize: 13, color: '#DDD6FE' }}>
                                Manager: {internshipSummary?.manager_name || '—'}
                              </div>
                            </div>
                          </div>
                          <div style={{ fontSize: 18, opacity: 0.8 }}>›</div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <StarIcon size={18} color="#FBBF24" fill="#FBBF24" />
                            <span style={{ fontWeight: 700, color: '#FDE68A' }}>
                              {internshipSummary?.stars ?? stars ?? 0}
                            </span>
                          </div>
                          <div style={{ fontSize: 13, color: '#DDD6FE' }}>
                            {(internshipSummary?.reports_count ?? reports.length ?? 0)} reports
                          </div>
                        </div>

                        <button
                          style={{
                            width: '100%',
                            marginTop: 'auto',
                            background: 'linear-gradient(90deg, #8B5CF6, #EC4899)',
                            color: '#fff',
                            fontWeight: 700,
                            padding: '10px 14px',
                            borderRadius: 10,
                            border: '1px solid rgba(255,255,255,0.2)'
                          }}
                        >
                          View My Internship Summary
                        </button>
                      </div>
                    </div>
                    <div className='summary-buttons flex-row'>
                        <button className='save-button' onClick={handleLogout}>Log Out</button>
                    </div>
                </div>
            </div>
            {showInternDashboard && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 1000,
                    backgroundColor: '#200043',
                    color: '#fff',
                    overflowY: 'auto'
                }}>
                    <div style={{ position: 'relative', maxWidth: 980, margin: '0 auto', padding: 36 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                            <div style={{ fontWeight: 800, lineHeight: 1 }}>
                                <div style={{ fontSize: 22 }}>career</div>
                                <div style={{ fontSize: 22 }}>star</div>
                                <button onClick={closeInternDashboard} style={{
                                    marginTop: 30,
                                    background: 'rgba(255,255,255,0.12)',
                                    border: '1px solid rgba(255,255,255,0.25)',
                                    borderRadius: 8,
                                    padding: '8px 12px',
                                    color: '#fff',
                                    cursor: 'pointer'
                                }}>← Back to Profile</button>
                            </div>
                            <div style={{ textAlign: 'right', marginLeft: 'auto' }}>
                                <div style={{ fontSize: 36, fontWeight: 800 }}>{(internshipSummary && internshipSummary.user_name) || firstname || ''}</div>
                                <div style={{ fontSize: 18, color: '#C4B5FD' }}>Manager: {(internshipSummary && internshipSummary.manager_name) || '—'}</div>
                            </div>
                        </div>

                        {internDashboardView === 'summary' && (
                            <div />
                        )}

                        {internDashboardView === 'report' && (
                            <div>
                                <div style={{ height: 8 }} />

                                <div style={{ background: '#fff', color: '#111827', borderRadius: 12, padding: '29px 18px', marginBottom: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.12)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <div style={{ fontSize: 23, marginRight: 12 }}>⭐</div>
                                        <div style={{ fontSize: 23, fontWeight: 800 }}>Outstanding Work!</div>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginBottom: 24 }}>
                                    <div style={{ background: '#fff', color: '#111827', borderRadius: 12, padding: '27px 16px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 9999, background: '#FEF3C7', color: '#92400E', marginBottom: 8 }}>
                                            <StarIcon size={22} />
                                        </div>
                                        <div style={{ fontSize: 33, fontWeight: 800, marginBottom: 7 }}>{(internshipSummary && (internshipSummary.stars ?? 0)) || 0}</div>
                                        <div style={{ color: '#4B5563', fontSize: 14 }}>Stars Earned</div>
                                    </div>
                                    <div style={{ background: '#fff', color: '#111827', borderRadius: 12, padding: '27px 16px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 9999, background: '#DCFCE7', color: '#14532D', marginBottom: 8 }}>
                                            <TrendingUpIcon size={22} />
                                        </div>
                                        <div style={{ fontSize: 33, fontWeight: 800, marginBottom: 7 }}>{((internshipSummary && Array.isArray(internshipSummary.highlights)) ? internshipSummary.highlights.length : 0)}</div>
                                        <div style={{ color: '#4B5563', fontSize: 14 }}>Work Highlights</div>
                                    </div>
                                    <div style={{ background: '#fff', color: '#111827', borderRadius: 12, padding: '27px 16px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 9999, background: '#E0E7FF', color: '#3730A3', marginBottom: 8 }}>
                                            <CheckCircleIcon size={22} />
                                        </div>
                                        <div style={{ fontSize: 33, fontWeight: 800, marginBottom: 7 }}>{(internshipSummary && (internshipSummary.reports_count ?? 0)) || 0}</div>
                                        <div style={{ color: '#4B5563', fontSize: 14 }}>Reports Submitted</div>
                                    </div>
                                </div>

                                <div style={{ background: '#fff', color: '#111827', borderRadius: 12, padding: '33px 22px', marginBottom: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.10)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 25, fontWeight: 800, marginBottom: 20 }}>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 9999, background: '#D1FAE5', color: '#065F46' }}>
                                            <AwardIcon size={20} />
                                        </div>
                                        Summer Accomplishments
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}>
                                        {(((internshipSummary && Array.isArray(internshipSummary.highlights)) ? internshipSummary.highlights : [])).map((h, idx) => (
                                            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 18, background: '#ECFDF5', borderRadius: 10, border: '1px solid #A7F3D0' }}>
                                                <span style={{ color: '#059669', marginTop: 1, fontSize: 18 }}>✔️</span>
                                                <p style={{ margin: 0, color: '#374151', fontSize: 18, lineHeight: 1.6 }}>{h}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ background: '#fff', color: '#111827', borderRadius: 12, padding: '33px 22px', marginBottom: 28, boxShadow: '0 2px 10px rgba(0,0,0,0.10)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 25, fontWeight: 800, marginBottom: 20 }}>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 9999, background: '#DBEAFE', color: '#1E3A8A' }}>
                                            <CodeIcon size={20} />
                                        </div>
                                        Top Technologies / Skills
                                    </div>
                                    <div style={{
                                        background: 'linear-gradient(135deg, rgba(59,130,246,0.10), rgba(147,51,234,0.10))',
                                        borderRadius: 12,
                                        padding: '33px 22px',
                                        minHeight: 260
                                    }}>
                                        {(() => {
                                            const techs = (((internshipSummary && Array.isArray(internshipSummary.technologies)) ? internshipSummary.technologies : [])).slice(0, 4);
                                            const row1 = techs.slice(0, 2);
                                            const row2 = techs.slice(2, 4);
                                            const renderChip = (t, rankIdx, isFirstRow) => {
                                                const name = typeof t === 'string' ? t : (t && t.name) ? t.name : '';
                                                const count = typeof t === 'object' && t && t.count ? Number(t.count) : 1;
                                                const base = Math.max(22, Math.min(60, count * 7)) + 3;
                                                let multiplier = 1;
                                                if (rankIdx === 0) multiplier = 1.6; else if (rankIdx === 1) multiplier = 1.4; // second in row is 20% smaller
                                                const displaySize = Math.round(base * multiplier);
                                                let { bg, color } = getTechStyle(name);
                                                if (isFirstRow && rankIdx === 0) {
                                                    bg = '#DBEAFE';
                                                    color = '#1E3A8A';
                                                }
                                                return (
                                                    <div key={`${name}-${rankIdx}`} style={{
                                                        background: bg,
                                                        color: color,
                                                        padding: '17px 18px',
                                                        borderRadius: 999,
                                                        fontWeight: 800,
                                                        fontSize: displaySize,
                                                        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)'
                                                    }}>{name}</div>
                                                );
                                            };
                                            return (
                                                <>
                                                    <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
                                                        {row1.map((t, i) => renderChip(t, i, true))}
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 12 }}>
                                                        {row2.map((t, i) => renderChip(t, i, false))}
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>

                                <div style={{ textAlign: 'center', padding: '24px 0', borderTop: '1px solid rgba(255,255,255,0.20)' }}>
                                    <div style={{ color: '#E9D5FF', marginBottom: 6 }}>CareerStar • Summer 2025 Internship Program</div>
                                    <div style={{ color: '#C4B5FD', fontSize: 12 }}>Questions? Message us hello@careerstar.co</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {showAvatarModal && (
                <div className='avatar-modal'>
                    <div className='avatar-modal-content'>
                        <span className="close material-icons" onClick={() => setShowavatarModal(false)}>close</span>
                        <p>Choose an avatar</p>
                        <div className='avatar-list'>
                            {avatars.map((avatar, index) => (
                                <img
                                    key={index}
                                    src={require(`../../assets/images/avatars/${avatar}.png`)}
                                    alt="Avatar"
                                    onClick={() => handleProfilePictureClick(avatar)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Profile;