import React from 'react';

function HomepageChoiceQuestion({ onOptionSelect }) {
    const handleOptionSelect = (option) => {
        onOptionSelect(option);
    };

    return (
        <div className='home-page-question'>
            <h2>What do you need help with to reach that goal?</h2>
            <div className='home-page-question-choice' onClick={() => handleOptionSelect('roadmap')}>
                <p>Help me build a career roadmap - I need clarity!</p>
            </div>
            <div className='home-page-question-choice' onClick={() => handleOptionSelect('activities')}>
                <p>Recommended activities - I need to get going!</p>
            </div>
        </div>
    );
}

export default HomepageChoiceQuestion;