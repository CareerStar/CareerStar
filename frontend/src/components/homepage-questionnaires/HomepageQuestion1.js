import React, {useState} from 'react';

function HomepageQuestion1({onChange}) {
    const [selectedOption, setSelectedOption] = useState('');

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
        onChange(event.target.value);
    };

    return (
        <div className='home-page-question'>
            <h2>This describes me best...</h2>
            <div className=''>
                <select id="options" className='home-page-question-dropdown-menu' value={selectedOption} onChange={handleChange}>
                    <option value="" disabled>Select an option</option>
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                </select>
            </div>
        </div>
    );
}

export default HomepageQuestion1;