import React, {useState} from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import DashboardContent from './DashboardContent';

function Dashboard() {
    const [selectedPage, setSelectedPage] = useState('Home');
    const pages = ['Home', 'Profile', 'Roadmap', 'Events', 'Network','Support'];
    return (
        <div className='dashboard'>
            <Header userName='Abigail' starCount={3} />
            <div className='dashboard-container'>
                <Sidebar pages={pages} onSelectPage={setSelectedPage} selectedPage={selectedPage} />
                <div className='content'>
                    <DashboardContent selectedPage={selectedPage}/>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;