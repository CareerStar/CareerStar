import React, {useState} from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import DashboardContent from './DashboardContent';

function Dashboard() {

    const location = useLocation();
    const [firstname, setFirstname] = useState(location.state?.firstname || '');
    const [selectedPage, setSelectedPage] = useState('Home');
    const pages = ['Home', 'Profile', 'Roadmap', 'Events', 'Network','Support'];

    const handlePageChange = (page) => {
        setSelectedPage(page);
    }
    return (
        <div className='dashboard'>
            <Header userName={firstname} starCount={3} />
            <div className='dashboard-container'>
                <Sidebar pages={pages} onSelectPage={setSelectedPage} selectedPage={selectedPage} />
                <div className='content'>
                    <DashboardContent selectedPage={selectedPage} onComplete={(page) => handlePageChange(page)}/>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;