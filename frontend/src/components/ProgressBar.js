import React from 'react';

function ProgressBar({ currentStep, totalSteps }) {
    const progress = (currentStep / totalSteps) * 100;

    return (
        <div className='main-progress-container'>
            <div className="progress-container">
                <div className="progress-bar" style={{ width: `${progress}%` }} />
            </div>
            <p className="progress-text">{currentStep} of {totalSteps}</p>
        </div>
    );
}

export default ProgressBar;