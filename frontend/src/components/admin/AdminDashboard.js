import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import Header from '../Header';
import Sidebar from '../Sidebar';
import DashboardContent from '../DashboardContent';

const AdminDashboard = () => {
    const location = useLocation();
    const [userId, setUserId] = useState(location.state?.userId || '');
    const [selectedPage, setSelectedPage] = useState('Adminevents');
    const [onboarded, setOnboarded] = useState(true);
    const pages = ['AdminEvents', 'LinkedIn', 'Users', 'Activity Management', 'Manager Reports'];
    const validPages = ['Home', 'Adminevents', 'Profile', 'Roadmap', 'Events', 'Network', 'Support', 'Activity', 'Resumeguide', 'Workshops', 'Leaderboard', 'Linkedin', 'Users', 'Activitymanagement', 'Managerreports'];

    useEffect(() => {
        console.log('AdminDashboard useEffect');
        const pathParts = location.pathname.split('/');
        const page = pathParts[pathParts.length - 1];
        const normalizedPage = page ? page.charAt(0).toUpperCase() + page.slice(1) : null;

        if (validPages.includes(normalizedPage)) {
            setSelectedPage(normalizedPage);
        } else {
            setSelectedPage('Adminevents');
        }
    }, [location.pathname]);

    const handlePageChange = (page) => {
        setSelectedPage(page);
    }
    return (
        <div className='dashboard'>
            <Header userName={'Admin'} />
            <div className='dashboard-container'>
                <Sidebar pages={pages} selectedPage={selectedPage} onboarded={onboarded} isAdmin={true} />
                <div className='content'>
                <DashboardContent selectedPage={selectedPage} onComplete={(page) => handlePageChange(page)} userId={userId} />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;