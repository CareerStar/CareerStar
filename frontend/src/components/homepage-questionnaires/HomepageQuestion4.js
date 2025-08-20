import React, { useState, useEffect } from 'react';
import axios from 'axios';

function HomepageQuestion4({ onChangeDegree, onChangeMajor, onChangeUniversity }) {
    const [universityDetails, setUniversityDetails] = useState([]);
    const [selectedUniversity, setSelectedUniversity] = useState('');
    const [selectedDegree, setSelectedDegree] = useState('');
    const [selectedMajor, setSelectedMajor] = useState('');

    useEffect(() => {
        const fetchuniversityDetails = async () => {
            try {
                const response = await axios.get('https://api.careerstar.co/universities');
                if (response.data) {
                    setUniversityDetails(response.data);  // Assuming the response is an array of university names
                }
            } catch (error) {
                console.error('Error fetching university names', error);
            }
        };
    
        fetchuniversityDetails();
    }, []);

    const handleChangeDegree = (event) => {
        setSelectedDegree(event.target.value);
        onChangeDegree(event.target.value);
    };

    const handleChangeMajor = (event) => {
        setSelectedMajor(event.target.value);
        onChangeMajor(event.target.value);
    };

    const handleChangeUniversity = (event) => {
        setSelectedUniversity(event.target.value);
        onChangeUniversity(event.target.value);
        console.log('Selected University:', event.target.value);
    };

    return (
        <div className='home-page-question'>
{/* 
            <h2>Choose your University</h2>

            <div>
                <select
                    id="university-select"
                    className="home-page-question-dropdown-menu"
                    value={selectedUniversity}
                    onChange={handleChangeUniversity}
                >
                    <option value="" disabled>
                        Choose your university
                    </option>
                    {universityDetails.map((university) => (
                        <option key={university.universityId} value={university.universityId}>
                            {university.name}
                        </option>
                    ))}
                </select>
            </div> */}

            <h2>Choose your Degree</h2>

            <div>
                <select id="options" className='home-page-question-dropdown-menu' value={selectedDegree} onChange={handleChangeDegree}>
                    <option value="" disabled>Choose your degree</option>
                    <option value="Associate">Associate</option>
                    <option value="Bachelor's">Bachelor's</option>
                    <option value="Master's">Master's</option>
                    <option value="Doctorate (Ph.D.)">Doctorate (Ph.D.)</option>
                    <option value="Doctor of Medicine (M.D.)">Doctor of Medicine (M.D.)</option>
                    <option value="Doctor of Dental Surgery (D.D.S.)">Doctor of Dental Surgery (D.D.S.)</option>
                    <option value="Doctor of Pharmacy (Pharm.D.)">Doctor of Pharmacy (Pharm.D.)</option>
                    <option value="Doctor of Veterinary Medicine (D.V.M.)">Doctor of Veterinary Medicine (D.V.M.)</option>
                    <option value="Doctor of Education (Ed.D.)">Doctor of Education (Ed.D.)</option>
                    <option value="Doctorate of Physcial Therapy">Doctorate of Physcial Therapy (D.P.T)</option>
                    <option value="Juris Doctor (J.D.)">Juris Doctor (J.D.)</option>
                    <option value="Doctor of Engineering (D.Eng.)">Doctor of Engineering (D.Eng.)</option>
                    <option value="Postdoctoral">Postdoctoral</option>
                    <option value="Professional Certification">Professional Certification</option>
                    <option value="Technical Diploma">Technical Diploma</option>
                </select>
            </div>

            <h2>Choose your Major</h2>
            <div className=''>
                <select id="options" className='home-page-question-dropdown-menu' value={selectedMajor} onChange={handleChangeMajor}>
                    <option value="" disabled>Choose your major</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Architecture">Architecture</option>
                    <option value="Journalism">Journalism</option>
                    <option value="Bio Chemistry">Bio Chemistry</option>
                    <option value="Pharmacy">Pharmacy</option>
                    <option value="Nursing">Nursing</option>
                    <option value="Economics">Economics</option>
                    <option value="Business Administration">Business Administration</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Psychology">Psychology</option>
                    <option value="Physical Therapy">Physical Therapy</option>
                    <option value="Sociology">Sociology</option>
                    <option value="History">History</option>
                    <option value="English">English</option>
                    <option value="Political Science">Political Science</option>
                    <option value="Environmental Science">Environmental Science</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Statistics">Statistics</option>
                    <option value="Public Health">Public Health</option>
                </select>
            </div>
        </div>
    );
}

export default HomepageQuestion4;