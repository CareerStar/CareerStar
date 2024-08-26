import React, {useState} from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

function Dashboard() {
    const [selectedPage, setSelectedPage] = useState('Home');
    const pages = ['Home', 'Profile', 'Roadmap', 'Events', 'Network','Support'];
    return (
        <div className='dashboard'>
            <Header userName='John Doe' starCount={5} />
            <div className='dashboard-container'>
                <Sidebar pages={pages} onSelectPage={setSelectedPage} selectedPage={selectedPage} />
                <div className='content'>
                    <h1>{selectedPage}</h1>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;