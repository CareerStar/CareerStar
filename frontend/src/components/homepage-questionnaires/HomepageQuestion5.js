import React, { useState } from 'react';

function HomepageQuestion5() {
    const [selectedOptions, setSelectedOptions] = useState([]);

    const handleChange = (event) => {
        const value = event.target.value;
        if (selectedOptions.includes(value)) {
            setSelectedOptions(selectedOptions.filter(option => option !== value));
        } else {
            setSelectedOptions([...selectedOptions, value]);
        }
    };

    return (
        <div className='home-page-question'>
            <h2>Which areas do  you need help with most right now?</h2>
            <div className='home-page-question-description'>
                <p>This way we can tailor recommendations/activities for you.</p>
                <p>Don't worry, you can change your preferences later.</p>
            </div>
            <div className='home-page-question-checkbox-group'>
                <label>
                    <input
                        type="checkbox"
                        value="Define and articulate my career goals"
                        checked={selectedOptions.includes('Define and articulate my career goals')}
                        onChange={handleChange}
                    />
                    <p>Define and articulate my career goals</p>
                </label>
                <label>
                    <input
                        type="checkbox"
                        value="Create standout resume and job application"
                        checked={selectedOptions.includes('Create standout resume and job application')}
                        onChange={handleChange}
                    />
                    <p>Create standout resume and job application</p>
                </label>
                <label>
                    <input
                        type="checkbox"
                        value="Discover industry relevant/job search resources"
                        checked={selectedOptions.includes('Discover industry relevant/job search resources')}
                        onChange={handleChange}
                    />
                    <p>Discover industry relevant/job search resources</p>
                </label>
                <label>
                    <input
                        type="checkbox"
                        value="Find key industry events "
                        checked={selectedOptions.includes('Find key industry events ')}
                        onChange={handleChange}
                    />
                    <p>Find key industry events</p>
                </label>
                <label>
                    <input
                        type="checkbox"
                        value="Collaborate with like-minded people"
                        checked={selectedOptions.includes('Collaborate with like-minded people')}
                        onChange={handleChange}
                    />
                    <p>Collaborate with like-minded people</p>
                </label>
            </div>
        </div>
    );
}

export default HomepageQuestion5;
