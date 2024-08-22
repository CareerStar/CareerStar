import React from 'react';

function ProgressBar({ currentStep }) {
    const progress = (currentStep / 3) * 100;

    return (
        <div className='main-progress-container'>
            <div className="progress-container">
                <div className="progress-bar" style={{ width: `${progress}%` }} />
            </div>
            <p className="progress-text">{currentStep} of 3</p>
        </div>
    );
}

export default ProgressBar;