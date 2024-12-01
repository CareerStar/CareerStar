import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import editIcon from '../../assets/images/edit-icon.png';
import starEmpty from '../../assets/images/star-empty.png';
import downArrow from '../../assets/images/down-arrow-roadmap.png';
import upArrow from '../../assets/images/up-arrow-roadmap.png';
import hotTip1 from '../../assets/images/roadmap-activities/hot-tip-1.webp';
import RoadmapActivity11 from '../roadmap-activities/RoadmapActivity11';
import RoadmapActivity12 from '../roadmap-activities/RoadmapActivity12';
import RoadmapActivity13 from '../roadmap-activities/RoadmapActivity13';
import RoadmapActivity2 from '../roadmap-activities/RoadmapActivity2';
import RoadmapActivity3 from '../roadmap-activities/RoadmapActivity3';
import RoadmapActivity4 from '../roadmap-activities/RoadmapActivity4';
import RoadmapActivity5 from '../roadmap-activities/RoadmapActivity5';
import RoadmapActivity21 from '../roadmap-activities/RoadmapActivity21';
import RoadmapActivity22 from '../roadmap-activities/RoadmapActivity22';
import RoadmapActivity23 from '../roadmap-activities/RoadmapActivity23';

function Roadmap({ userId }) {
    const [currentSituation, setCurrentSituation] = useState('I’m a recent grad');
    const [goal, setGoal] = useState('To get my first full-time role as a software engineer');
    const [isEditingCurrentSituation, setIsEditingCurrentSituation] = useState(false);
    const [isEditingGoal, setIsEditingGoal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);
    const inputGoalRef = useRef(null);
    const inputSituationRef = useRef(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            setLoading(true);
            try {
                const response = await fetch(`https://ec2-34-227-29-26.compute-1.amazonaws.com:5000/onboarding/${userId}`);
                const data = await response.json();
                if (response.ok) {
                    setCurrentSituation(data.currentSituation);
                    setGoal(data.goal);
                } else {
                    console.error('Error fetching user details:', data);
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

    const saveUserDetails = async () => {
        setLoading(true);
        try {
            const response = await fetch(`https://ec2-34-227-29-26.compute-1.amazonaws.com:5000/update_onboarding/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "currentSituation": currentSituation,
                    "goal": goal
                }),
            });

            if (response.ok) {
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

    const handleCurrentSituationEdit = () => {
        setIsEditingCurrentSituation(true);
        setTimeout(() => {
            if (inputSituationRef.current) {
                inputSituationRef.current.focus();
                inputSituationRef.current.setSelectionRange(currentSituation.length, currentSituation.length);
            }
        }, 0);
    };

    const handleGoalEdit = () => {
        setIsEditingGoal(true);
        setTimeout(() => {
            if (inputGoalRef.current) {
                inputGoalRef.current.focus();
                inputGoalRef.current.setSelectionRange(goal.length, goal.length);
            }
        }, 0);
    };

    const handleSaveCurrentSituation = () => {
        setIsEditingCurrentSituation(false);
        saveUserDetails();
    };

    const handleSaveGoal = () => {
        setIsEditingGoal(false);
        saveUserDetails();
    };

    const handleKeyPress = (event, saveFunction) => {
        if (event.key === 'Enter') {
            saveFunction();
        }
    };

    return (
        <div className='roadmap-container'>
            {loading && (
                <div className="spinner-overlay">
                    <div className="spinner"></div>
                </div>
            )}
            <p className='roadmap-title'>My Roadmap</p>
            <div className='roadmap-goals-container flex-row'>
                <div className='roadmap-goal-card flex-column'>
                    <img src={editIcon} alt='Edit icon' onClick={handleCurrentSituationEdit} />
                    <p className='roadmap-goal-card-heading'>Where you’re at</p>
                    {isEditingCurrentSituation ? (
                        <div>
                            <input
                                ref={inputSituationRef}
                                className='roadmap-goal-card-input'
                                type="text"
                                value={currentSituation}
                                onChange={(e) => setCurrentSituation(e.target.value)}
                                onKeyDown={(event) => handleKeyPress(event, handleSaveCurrentSituation)}
                            />
                            <button onClick={handleSaveCurrentSituation} className='situation-goal-save-button'>Save</button>
                        </div>
                    ) : (
                        <p className='roadmap-goal-card-answer'>{currentSituation}</p>
                    )}
                </div>
                <div className='roadmap-goal-card flex-column'>
                    <img src={editIcon} alt='Edit icon' onClick={handleGoalEdit} />
                    <p className='roadmap-goal-card-heading'>The goal</p>
                    {isEditingGoal ? (
                        <div>
                            <input
                                ref={inputGoalRef}
                                className='roadmap-goal-card-input'
                                type="text"
                                value={goal}
                                onChange={(e) => setGoal(e.target.value)}
                                onKeyDown={(event) => handleKeyPress(event, handleSaveGoal)}
                            />
                            <button onClick={handleSaveGoal} className='situation-goal-save-button'>Save</button>
                        </div>
                    ) : (
                        <p className='roadmap-goal-card-answer'>{goal}</p>
                    )}
                </div>
            </div>

            <div className='roadmap-phases-container'>
                <div className='roadmap-phase flex-column'>
                    <p className='roadmap-phase-title'>Phase 1: Values & Goals</p>
                    <RoadmapActivity11 userId={userId}/>
                    <RoadmapActivity12 userId={userId}/>
                    <RoadmapActivity13 userId={userId}/>
                    <p className='roadmap-phase-title'>Phase 2: Values & Goals</p>
                    <RoadmapActivity21 userId={userId}/>
                    <RoadmapActivity22 userId={userId}/>
                    <RoadmapActivity23 userId={userId}/>
                    {/* <RoadmapActivity2 userId={userId}/>
                    <RoadmapActivity3 userId={userId}/>
                    <RoadmapActivity4 userId={userId}/>
                    <RoadmapActivity5 userId={userId}/> */}
                    {/* <p className='roadmap-phase-title'>Phase 2: Career & Guidance</p> */}
                </div>
            </div>
        </div>
    );
}

export default Roadmap;