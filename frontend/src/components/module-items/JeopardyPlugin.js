import React, { useState } from 'react';
import downArrow from '../../assets/images/down-arrow-roadmap.png';
import upArrow from '../../assets/images/up-arrow-roadmap.png';

function JeopardyPlugin({ activityName, url }) {
    const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);

    const toggleDescriptionVisibility = () => {
        setIsDescriptionVisible(!isDescriptionVisible);
    };

    return (
        <div>
            <div className='roadmap-sub-phase flex-row'>
                <div className='roadmap-phase-card'>
                    <p className='roadmap-activity-title'>{activityName}</p>
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
            </div>
            {isDescriptionVisible && (
                <div className='activity-description-container'>
                    <div className='activity-description-content'>
                        <div className='activity-box flex-col'>
                            <div className='jeopardy-game-container'>
                                <iframe
                                    src={url}
                                    frameBorder="0"
                                    width="100%"
                                    height="500"
                                    title="Jeopardy Game"
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
                    </div>
                </div>
            )}
        </div>
    );
}

export default JeopardyPlugin;