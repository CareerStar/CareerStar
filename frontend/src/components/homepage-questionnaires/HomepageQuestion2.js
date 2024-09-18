import React, { useState } from 'react';

function HomepageQuestion2({onChange}) {
    const [selectedOption, setSelectedOption] = useState('');

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
        onChange(event.target.value);
    };

    return (
        <div className='home-page-question'>
            <h2>Describe your current situation</h2>
            <p>Write in one sentence</p>
            <input 
                type='text' 
                placeholder="Currently, I'm a recent grad looking for new roles" 
                onChange={handleChange}
            />
        </div>
    );
}

export default HomepageQuestion2;