import React, {useState, useEffect} from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import Header from '../Header';
import Sidebar from '../Sidebar';
import DashboardContent from '../DashboardContent';

const AdminDashboard = () => {
    const location = useLocation();
    const [userId, setUserId] = useState(location.state?.userId || '');
    const [selectedPage, setSelectedPage] = useState('AdminActivities');
    const [onboarded, setOnboarded] = useState(false);
    const pages = ['AdminActivities'];

    const handlePageChange = (page) => {
        setSelectedPage(page);
    }
    return (
        <div className='dashboard'>
            <Header userName={'Admin'}/>
            <div className='dashboard-container'>
                <Sidebar pages={pages} onSelectPage={setSelectedPage} selectedPage={selectedPage} onboarded={onboarded}/>
                <div className='content'>
                    <DashboardContent selectedPage={selectedPage} onComplete={(page) => handlePageChange(page)} userId={userId}/>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;