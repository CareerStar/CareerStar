import React, { useState } from 'react';

function HomepageQuestion5({onActivityChoicesSelect}) {
    const [selectedOptions, setSelectedOptions] = useState([]);

    const optionMap = {
        "Define and articulate my career goals": "Career",
        "Create standout resume and job application": "Resume",
        "Discover industry relevant/job search resources": "Job",
        "Find key industry events": "Events",
        "Collaborate with like-minded people": "Collaborate"
    };

    const handleChange = (event) => {
        const fullValue = event.target.value;
        const shortValue = optionMap[fullValue];

        if (selectedOptions.includes(shortValue)) {
            const updatedOptions = selectedOptions.filter(option => option !== shortValue);
            setSelectedOptions(updatedOptions);
            onActivityChoicesSelect(updatedOptions);
        } else {
            const updatedOptions = [...selectedOptions, shortValue];
            setSelectedOptions(updatedOptions);
            onActivityChoicesSelect(updatedOptions);
        }
    };

    return (
        <div className='home-page-question home-page-question-choice-div'>
            <h2>Which areas do you need help with most right now?</h2>
            <div className='home-page-question-description'>
                <p>This way we can tailor recommendations/activities for you.</p>
                <p>Don't worry, you can change your preferences later.</p>
            </div>
            <div className='home-page-question-checkbox-group'>
                <label>
                    <input
                        type="checkbox"
                        value="Define and articulate my career goals"
                        checked={selectedOptions.includes('Career')}
                        onChange={handleChange}
                    />
                    <p>Define and articulate my career goals</p>
                </label>
                <label>
                    <input
                        type="checkbox"
                        value="Create standout resume and job application"
                        checked={selectedOptions.includes('Resume')}
                        onChange={handleChange}
                    />
                    <p>Create standout resume and job application</p>
                </label>
                <label>
                    <input
                        type="checkbox"
                        value="Discover industry relevant/job search resources"
                        checked={selectedOptions.includes('Job')}
                        onChange={handleChange}
                    />
                    <p>Discover industry relevant/job search resources</p>
                </label>
                <label>
                    <input
                        type="checkbox"
                        value="Find key industry events"
                        checked={selectedOptions.includes('Events')}
                        onChange={handleChange}
                    />
                    <p>Find key industry events</p>
                </label>
                <label>
                    <input
                        type="checkbox"
                        value="Collaborate with like-minded people"
                        checked={selectedOptions.includes('Collaborate')}
                        onChange={handleChange}
                    />
                    <p>Collaborate with like-minded people</p>
                </label>
            </div>
        </div>
    );
}

export default HomepageQuestion5;