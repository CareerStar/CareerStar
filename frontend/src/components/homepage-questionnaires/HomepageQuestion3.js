import React, { useState } from 'react';

function HomepageQuestion3({onChange}) {
    const [selectedOption, setSelectedOption] = useState('');

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
        onChange(event.target.value);
    };

    return (
        <div className='home-page-question'>
            <h2>What's your dream job?</h2>
            {/* <p>Write in one sentence</p> */}
            <input 
                type='text' 
                placeholder="Chief Technology Officer" 
                onChange={handleChange}
            />
        </div>
    );
}

export default HomepageQuestion3;