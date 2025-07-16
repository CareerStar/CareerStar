import React, { useEffect, useState, useRef } from 'react';
import editIcon from '../../assets/images/edit-icon.png';
import RoadmapActivityBar from '../../components/dashboard-content-pages/RoadmapActivityBar';
import TopActivityCard from '../../components/TopActivityCard';

function Roadmap({ userId, activityName }) {
    const [currentSituation, setCurrentSituation] = useState('I’m a recent grad');
    const [goal, setGoal] = useState('To get my first full-time role as a software engineer');
    const [isEditingCurrentSituation, setIsEditingCurrentSituation] = useState(false);
    const [isEditingGoal, setIsEditingGoal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);
    const inputGoalRef = useRef(null);
    const inputSituationRef = useRef(null);
    const [activityStatuses, setActivityStatuses] = useState({});

    useEffect(() => {
        const fetchUserDetails = async () => {
            setLoading(true);
            try {
                const response = await fetch(`https://api.careerstar.co/onboarding/${userId}`);
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

            try {
                const response = await fetch(`https://api.careerstar.co/roadmapactivity/${userId}`);
                const data = await response.json();
                if (response.ok) {
                    setActivityStatuses(data);
                } else {
                    console.error('Error fetching Activity Status details:', data);
                }
            } catch (error) {
                console.error('Error fetching Activity Status details:', error);
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
            const response = await fetch(`https://api.careerstar.co/update_onboarding/${userId}`, {
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
            {/* <p className='roadmap-title'>My Roadmap</p> */}
            {/* <div className='roadmap-goals-container flex-row'>
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
            </div> */}

            <div className='roadmap-phases-container'>
                    <p className='roadmap-phase-title'>Your Activities</p>
                    <div className='top-activities-container'>
                    <TopActivityCard
                    activityId={1}
                    activityTitle='Reaching Out To More Than Recruiters'
                    activityDescription='Description here'
                    activityTags={['Networking']}
                    activityStarCount={7}
                    activityTime='20 min'
                    moduleId={1}
                    isReady={true}
                    completed={!!activityStatuses?.[1]}
                    />

                    <TopActivityCard
                    activityId={3}
                    activityTitle='Better Cold Call LinkedIn Messages'
                    activityDescription='Description here'
                    activityTags={['LinkedIn', 'Outreach']}
                    activityStarCount={7}
                    activityTime='20 min'
                    moduleId={1}
                    isReady={true}
                    completed={!!activityStatuses?.[3]}
                    />

                    <TopActivityCard
                    activityId={2}
                    activityTitle='Career Acronym Challenge'
                    activityDescription='Description here'
                    activityTags={['Career']}
                    activityStarCount={7}
                    activityTime='20 min'
                    moduleId={1}
                    isReady={true}
                    completed={!!activityStatuses?.[2]}
                    />

                    <TopActivityCard
                    activityId={14}
                    activityTitle='Mock Interview Jeopardy'
                    activityDescription='Description here'
                    activityTags={['Interview', 'Practice']}
                    activityStarCount={10}
                    activityTime='20 min'
                    moduleId={1}
                    isReady={true}
                    completed={!!activityStatuses?.[14]}
                    />

                    <TopActivityCard
                    activityId={9}
                    activityTitle='Networking Made Easy: Finding Your Events'
                    activityDescription='Description here'
                    activityTags={['Networking', 'Events']}
                    activityStarCount={7}
                    activityTime='20 min'
                    moduleId={1}
                    isReady={true}
                    completed={!!activityStatuses?.[9]}
                    />

                    <TopActivityCard
                    activityId={5}
                    activityTitle='Let’s Network Before We Network'
                    activityDescription='Description here'
                    activityTags={['Networking']}
                    activityStarCount={7}
                    activityTime='20 min'
                    moduleId={1}
                    isReady={true}
                    completed={!!activityStatuses?.[5]}
                    />

                    <TopActivityCard
                    activityId={8}
                    activityTitle='Presenting Your Portfolio'
                    activityDescription='Description here'
                    activityTags={['Portfolio', 'Presentation']}
                    activityStarCount={10}
                    activityTime='20 min'
                    moduleId={1}
                    isReady={true}
                    completed={!!activityStatuses?.[8]}
                    />

                    <TopActivityCard
                    activityId={11}
                    activityTitle='Unlock Your Volunteer Superpowers!'
                    activityDescription='Description here'
                    activityTags={['Volunteer']}
                    activityStarCount={8}
                    activityTime='20 min'
                    moduleId={1}
                    isReady={true}
                    completed={!!activityStatuses?.[11]}
                    />

                    <TopActivityCard
                    activityId={7}
                    activityTitle='The Dreaded Salary Talk'
                    activityDescription='Description here'
                    activityTags={['Salary', 'Negotiation']}
                    activityStarCount={7}
                    activityTime='20 min'
                    moduleId={1}
                    isReady={true}
                    completed={!!activityStatuses?.[7]}
                    />

                    <TopActivityCard
                    activityId={10}
                    activityTitle='The 10% Coffee Challenge'
                    activityDescription='Description here'
                    activityTags={['Networking', 'Coffee']}
                    activityStarCount={10}
                    activityTime='20 min'
                    moduleId={1}
                    isReady={true}
                    completed={!!activityStatuses?.[10]}
                    />

                    <TopActivityCard
                    activityId={13}
                    activityTitle='3-2-1 + Report: Stand Out During Your Internship'
                    activityDescription='A great way to show your skills and get noticed by your team.'
                    activityTags={['Internship', 'Report']}
                    activityStarCount={10}
                    activityTime='20 min'
                    moduleId={1}
                    isReady={true}
                    completed={!!activityStatuses?.[13]}
                    />
                </div>
            </div>
        </div>
    );
}

export default Roadmap;