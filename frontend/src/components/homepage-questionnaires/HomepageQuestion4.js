import React, { useState } from 'react';

function HomepageQuestion4() {
    const [selectedOption, setSelectedOption] = useState('');

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
    };

    return (
        <div className='home-page-question'>
            <h2>What do you need help with to reach that goal?</h2>
            <div className='home-page-question-choice'>
                <p>Build a career roadmap - I need clarity!</p>
            </div>
            <div className='home-page-question-choice'>
                <p>Do recommended activities - I need to get going!</p>
            </div>
        </div>
    );
}

export default HomepageQuestion4;