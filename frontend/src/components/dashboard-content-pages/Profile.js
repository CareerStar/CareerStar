import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import star from '../../assets/images/star-yellow.png';
import axios from 'axios';

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
                    <div className='summary-buttons flex-row'>
                        <button className='save-button' onClick={handleLogout}>Log Out</button>
                    </div>
                </div>
            </div>
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