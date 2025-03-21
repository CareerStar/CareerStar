import React, { useState } from 'react';
import downArrow from '../../assets/images/down-arrow-roadmap.png';
import upArrow from '../../assets/images/up-arrow-roadmap.png';

function CanvaSlidesPlugin({ activityName, url }) {
    const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);

    const toggleDescriptionVisibility = () => {
        setIsDescriptionVisible(!isDescriptionVisible);
    };

    const containerStyle = {
        position: "relative",
        width: "100%",
        paddingTop: "56.25%",
        boxShadow: "0 2px 8px 0 rgba(63,69,81,0.16)",
        borderRadius: "8px",
        overflow: "hidden"
      };
    
      const iframeStyle = {
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        border: "none"
      };
    
      const linkStyle = {
        display: "block",
        textAlign: "center",
        color: "#1a73e8",
        marginTop: "16px",
        textDecoration: "none"
      };

    return (
        <div>
            <div className='roadmap-sub-phase flex-row'>
                <div className='roadmap-phase-card'>
                    <div className='module-title'>
                        <p className='roadmap-activity-title'>Workshop presentation</p>
                    </div>
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
                            <div style={containerStyle}>
                                <iframe
                                    loading="lazy"
                                    style={iframeStyle}
                                    src={url}
                                    allowFullScreen
                                    title="Canva Embed"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CanvaSlidesPlugin;