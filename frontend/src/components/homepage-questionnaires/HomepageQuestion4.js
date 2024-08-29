import React from 'react';

function HomepageQuestion4({ onOptionSelect }) {
    const handleOptionSelect = (option) => {
        onOptionSelect(option);
    };

    return (
        <div className='home-page-question'>
            <h2>What do you need help with to reach that goal?</h2>
            <div className='home-page-question-choice' onClick={() => handleOptionSelect('roadmap')}>
                <p>Build a career roadmap - I need clarity!</p>
            </div>
            <div className='home-page-question-choice' onClick={() => handleOptionSelect('activities')}>
                <p>Do recommended activities - I need to get going!</p>
            </div>
        </div>
    );
}

export default HomepageQuestion4;