import React, { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import starEmpty from '../../assets/images/star-empty.png';
import star from '../../assets/images/star.png';
import downArrow from '../../assets/images/down-arrow-roadmap.png';
import upArrow from '../../assets/images/up-arrow-roadmap.png';

function RoadmapActivity12({ userId }) {
    const dispatch = useDispatch();
    const activityId = 12;
    const [completed, setCompleted] = useState(false);
    const [alreadyCompleted, setAlreadyCompleted] = useState(false);
    const [starCount, setStarCount] = useState(5);
    const [answers, setAnswers] = useState({
        careerGoal: '',
        certification1: '',
        certification2: '',
        timelineForCompletion: '',
    });
    const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`https://ec2-34-227-29-26.compute-1.amazonaws.com:5000/roadmapactivity/${userId}/${activityId}`);
                if (response.data) {
                    setAnswers(response.data[0]);
                    setCompleted(response.data[1]);
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
                roadmapActivityId: 12,
                completed: completed,
                answers: answers,
                stars: starCount,
            };
            const response = await axios.post(`https://ec2-34-227-29-26.compute-1.amazonaws.com:5000/roadmapactivity/${userId}/${activityId}`, payload);
            if (response.status === 200) {
                console.log(response.data.message);
                if (completed) {
                    setCompleted(true);
                }
                if (completed && !alreadyCompleted) {
                    dispatch({ type: "INCREMENT_STAR", payload: starCount });
                }
                toggleDescriptionVisibility();
                // window.location.reload();
            }
        } catch (error) {
            console.error('Error saving answers:', error);
        }
    };

    const toggleDescriptionVisibility = () => {
        setIsDescriptionVisible(!isDescriptionVisible);
    };

    return (

        <div>
            <div className='roadmap-sub-phase flex-row'>
                <div className='roadmap-phase-card'>
                    <input
                        type="checkbox"
                        checked={completed}
                    />
                    <p>Certifications That Count 🏅</p>
                    {isDescriptionVisible ? (
                        <img
                            src={upArrow}
                            alt='Up arrow icon'
                            onClick={() => toggleDescriptionVisibility()}
                            style={{ cursor: 'pointer' }}
                        />
                    ) : (
                        <img
                            src={downArrow}
                            alt='Down arrow icon'
                            onClick={() => toggleDescriptionVisibility()}
                            style={{ cursor: 'pointer' }}
                        />
                    )}
                </div>
                <div className='roadmap-phase-star-count flex-row'>
                    <p>{starCount}</p>
                    {completed ? (
                        <img src={star} alt='Star icon' />
                    ) : (
                        <img src={starEmpty} alt='Star icon' />
                    )}
                </div>
            </div>
            {isDescriptionVisible && (
                <div className='activity-description-container'>
                    <div className='activity-description-content'>
                        <div className='activity-box flex-row'>
                            <div className='activity-emoji'>🔍</div>
                            <div className='flex-col'>
                                <h2>Find Your Perfect Technical Certification</h2>
                                <p>Technical certifications can boost your career prospects, enhance your skills, and increase your earning potential. This activity will guide you through the process of finding the right certification for your career goals!</p>
                            </div>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>In this activity we will:</h2>
                            <ul>
                                <li>Identify your HL career certification goals</li>
                                <li>Research relevant certifications</li>
                                <li>Evaluate certification requirements</li>
                                <li>Create an action plan</li>
                                <li>Look at some CareerStar recommended Certifications for inspiration!</li>
                            </ul>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>1️⃣ Research Relevant Certifications:</h2>
                            <p>Imagine you are creating a role for yourself, without financial limits. What dream job titles speak to you? Some inspiration below!</p>
                            <ul>
                                <li>Define your short-term and long-term career objectives and roles, identify the skills and knowledge gaps you need to fill</li>
                                <li>Use online resources like CompTIA, Microsoft Learn, or Google Career Certificates</li>
                                <li>Check job postings in your desired field for commonly requested certifications</li>
                                <li>Consult with industry professionals or mentors for recommendations </li>
                            </ul>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>2️⃣ Evaluate Certification Requirements: </h2>
                            <ul>
                                <li>Review prerequisites for each certification</li>
                                <li>Assess the time commitment and cost involved</li>
                                <li>Consider the certification's reputation and recognition in your industry</li>
                            </ul>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>🕝 Create an Action Plan:</h2>
                            <ul>
                                <li>Choose 1-2 certifications to pursue</li>
                                <li>Set a timeline for obtaining each certification</li>
                                <li>Identify study resources and materials</li>
                            </ul>
                        </div>
                        <div className='activity-box flex-row'>
                            <h3>🔥 Hot Tip! Many certification providers offer free study materials or practice exams. Take advantage of these resources to prepare effectively!</h3>
                        </div>
                        <div className='activity-box flex-col'>
                            <h2>Your Turn!</h2>
                            <p>Career Goal:</p>
                            <input
                                type="text"
                                name="careerGoal"
                                value={answers.careerGoal}
                                placeholder='Type your career goal here'
                                onChange={(e) => setAnswers({ ...answers, careerGoal: e.target.value })}
                            />
                        </div>
                        <div className='activity-box flex-col'>
                            <p>Chosen Certification 1:</p>
                            <input
                                type="text"
                                name="certification1"
                                value={answers.certification1}
                                placeholder='Type first certification here'
                                onChange={(e) => setAnswers({ ...answers, certification1: e.target.value })}
                            />
                        </div>
                        <div className='activity-box flex-col'>
                            <p>Chosen Certification 2:</p>
                            <input
                                type="text"
                                name="certification2"
                                value={answers.certification2}
                                placeholder='Type second certification here'
                                onChange={(e) => setAnswers({ ...answers, certification1: e.target.value })}
                            />
                        </div>
                        <div className='activity-box flex-col'>
                            <p>Timeline for Completion:</p>
                            <input
                                type="text"
                                name="timelineForCompletion"
                                value={answers.timelineForCompletion}
                                placeholder='Type your timeline here'
                                onChange={(e) => setAnswers({ ...answers, timelineForCompletion: e.target.value })}
                            />
                        </div>
                        <div className='activity-box'>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Certification Name</th>
                                        <th>Source</th>
                                        <th>Cost</th>
                                        <th>More Information</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Certified Information Systems Security Professional (CISSP)</td>
                                        <td>ISC²</td>
                                        <td>$749</td>
                                        <td><a href="https://www.isc2.org/Certifications/CISSP" target="_blank">CISSP Info</a></td>
                                    </tr>
                                    <tr>
                                        <td>Project Management Professional (PMP)</td>
                                        <td>Project Management Institute</td>
                                        <td>$405 for PMI members, $555 for non-members</td>
                                        <td><a href="https://www.pmi.org/certifications/project-management-pmp" target="_blank">PMP Info</a></td>
                                    </tr>
                                    <tr>
                                        <td>Certified Information Systems Auditor (CISA)</td>
                                        <td>ISACA</td>
                                        <td>$575 for members, $760 for non-members</td>
                                        <td><a href="https://www.isaca.org/credentialing/cisa" target="_blank">CISA Info</a></td>
                                    </tr>
                                    <tr>
                                        <td>Certified Ethical Hacker (CEH)</td>
                                        <td>EC-Council</td>
                                        <td>$950 - $1,199</td>
                                        <td><a href="https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/" target="_blank">CEH Info</a></td>
                                    </tr>
                                    <tr>
                                        <td>Salesforce Certified Administrator</td>
                                        <td>Salesforce</td>
                                        <td>$200</td>
                                        <td><a href="https://trailhead.salesforce.com/en/credentials/administrator" target="_blank">Salesforce Admin Info</a></td>
                                    </tr>
                                    <tr>
                                        <td>Google Professional Cloud Architect</td>
                                        <td>Google Cloud</td>
                                        <td>$200</td>
                                        <td><a href="https://cloud.google.com/certification/cloud-architect" target="_blank">Google Cloud Architect Info</a></td>
                                    </tr>
                                    <tr>
                                        <td>Cisco Certified Network Associate (CCNA)</td>
                                        <td>Cisco</td>
                                        <td>$300</td>
                                        <td><a href="https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/associate/ccna.html" target="_blank">CCNA Info</a></td>
                                    </tr>
                                    <tr>
                                        <td>Microsoft Certified: Azure Fundamentals</td>
                                        <td>Microsoft</td>
                                        <td>$99</td>
                                        <td><a href="https://learn.microsoft.com/en-us/certifications/azure-fundamentals/" target="_blank">Azure Fundamentals Info</a></td>
                                    </tr>
                                    <tr>
                                        <td>Power BI Data Analyst Associate</td>
                                        <td>Microsoft</td>
                                        <td>$165</td>
                                        <td><a href="https://learn.microsoft.com/en-us/certifications/power-bi-data-analyst-associate/" target="_blank">Power BI Analyst Info</a></td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>
                        <div className='activity-buttons'>
                            <div className='activity-button-draft' onClick={() => handleSubmit(false)}>Save as Draft</div>
                            <div className='activity-button-save' onClick={() => handleSubmit(true)}>Mark as completed!</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RoadmapActivity12;