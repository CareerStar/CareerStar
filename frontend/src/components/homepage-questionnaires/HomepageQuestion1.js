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
                    <option value="Early Career Adventurer">Early Career Adventurer: I’m just starting out and ready to conquer the professional world!</option>
                    <option value="Mid-Career Navigator">Mid-Career Navigator: I’ve been around the block and am steering my career towards new horizons.</option>
                    <option value="Seasoned Pro">Seasoned Pro: I’ve got wisdom and experience, looking for the next big challenge or way to give back.</option>
                    <option value="Career Transition Explorer">Career Transition Explorer: I’m switching lanes and navigating my way to a new career path.</option>
                </select>
            </div>
        </div>
    );
}

export default HomepageQuestion1;