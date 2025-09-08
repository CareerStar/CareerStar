import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { apiUrl } from '../../utils/api';
import JeopardyPlugin from '../module-items/JeopardyPlugin';
import likeIcon from '../../assets/images/like-icon.png';
import dislikeIcon from '../../assets/images/dislike-icon.png';

function Activity14() {
    const navigate = useNavigate();
    const location = useLocation();
    const prevPage = location.state?.prevPage;
    const dispatch = useDispatch();
    const userId = localStorage.getItem('userId');
    const activityId = 14;
    const [completed, setCompleted] = useState(false);
    const [alreadyCompleted, setAlreadyCompleted] = useState(false);
    const [starCount, setStarCount] = useState(10);
    const [showLikeDislikePopup, setShowLikeDislikePopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [answers, setAnswers] = useState({
        gameCompleted: false
    });

    const url = 'https://jeopardylabs.com/play/mock-interview-jeopardy-5?embed=1';

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(apiUrl(`/roadmapactivity/${userId}/${activityId}`));
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

    const handleGameComplete = () => {
        setAnswers(prev => ({
            ...prev,
            gameCompleted: true
        }));
        setShowLikeDislikePopup(true);
    };

    const handleBack = () => {
        navigate('/dashboard/home');
    };

    const handleNext = () => {
        setShowLikeDislikePopup(true);
    };

    return (
        <div className='activity-container-right-element'>
            <div className='activity-box flex-col'>
                <div className='jeopardy-game-container'>
                    <iframe
                        src={url}
                        frameBorder="0"
                        width="100%"
                        height="500"
                        title="Jeopardy Game"
                        onLoad={() => {
                            // Add event listener for game completion
                            window.addEventListener('message', (event) => {
                                if (event.data === 'gameComplete') {
                                    handleGameComplete();
                                }
                            });
                        }}
                    ></iframe>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://jeopardylabs.com"
                        style={{ color: "#8791de", fontSize: "12px" }}
                    >
                        JeopardyLabs
                    </a>
                </div>
            </div>

            <div className="activity-navigation-buttons">
                <div className="activity-navigation-back-button" onClick={handleBack}style={{ marginRight: "10px" }}>
                    {"Back to Activity Page"}
                </div>
                <div className="activity-navigation-next-button" onClick={handleNext}>
                    {"Mark as completed"}
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
        </div>
    );
}

export default Activity14;
