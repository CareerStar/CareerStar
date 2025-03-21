import React, { useState } from 'react';
import downArrow from '../../assets/images/down-arrow-roadmap.png';
import upArrow from '../../assets/images/up-arrow-roadmap.png';

function MentimeterPlugin({ activityName, url }) {
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
                            <div style={{ position: 'relative', paddingBottom: '56.25%', paddingTop: '35px', height: '0', overflow: 'hidden' }}>
                                <iframe
                                    sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
                                    allowFullScreen
                                    allowTransparency
                                    src={url}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                    }}
                                    width="420"
                                    height="315"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MentimeterPlugin;