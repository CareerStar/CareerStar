import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Header from './Header';
import Sidebar from './Sidebar';
import DashboardContent from './DashboardContent';
import StarField from './StarField';
import { apiUrl } from '../utils/api';

function Dashboard() {

    const location = useLocation();
    const dispatch = useDispatch();
    const [firstname, setFirstname] = useState(location.state?.firstname || localStorage.getItem('firstname') || '');
    const [userId, setUserId] = useState(location.state?.userId || localStorage.getItem('userId') || '');
    const [userDetails, setUserDetails] = useState({});
    const [selectedPage, setSelectedPage] = useState('Home');
    const validPages = ['Home', 'Profile', 'Activities', 'Events', 'Network', 'Support', 'Activity', 'Resumeguide', 'Workshops', 'Leaderboard'];
    useEffect(() => {
        const pathParts = location.pathname.split('/');
        const page = pathParts.length > 3
            ? pathParts[pathParts.length - 2]
            : pathParts[pathParts.length - 1];

        const normalizedPage = page ? page.charAt(0).toUpperCase() + page.slice(1) : null;

        if (validPages.includes(normalizedPage)) {
            setSelectedPage(normalizedPage);
        } else {
            setSelectedPage(localStorage.getItem('selectedPage') || 'Home');
        }
    }, [location.pathname]);
    const activityName = location.pathname.split('/')[3];
    const [onboarded, setOnboarded] = useState(false);
    const pages = ['Home', 'Profile', 'Activities', 'Leaderboard', 'Resume Guide']; //, 'Workshops'

    const fetchUserDetails = async () => {
        try {
            const response = await fetch(apiUrl(`/user/${userId}`));
            // const response = await fetch(`http://localhost:8080/users/${userId}`);
            const data = await response.json();
            if (response.ok) {
                setUserDetails(data);
                dispatch({ type: "SET_STAR_COUNT", payload: data.stars });
            } else {
                console.error('Error fetching user details:', data);
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }

        try {
            const response = await fetch(apiUrl(`/onboarding/${userId}`));
            // const response = await fetch(`http://localhost:8080/onboarding/${userId}`);
            const data = await response.json();
            if (response.ok) {
                if (data.onboarded) {
                    setOnboarded(true);
                }
            }
        } catch (error) {
            console.error('Error fetching user onboarding details:', error);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchUserDetails();
        }
    }, [userId]);

    useEffect(() => {
        localStorage.setItem('selectedPage', selectedPage);
    }, [selectedPage]);

    const handlePageChange = (page) => {
        setSelectedPage(page);
        fetchUserDetails();
    }

     /* Cheking Mobile Screen*/
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);

        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    if (isMobile) {
        return (
            <div className='main-page'>
                <div className='main-page-contnent'>
                    <div className='main-page-header'>
                        <h1>Thank you for Signing up</h1>
                        <p>This app is currently available only on desktop. You can use the same credentials to log in on your desktop. Mobile access is coming soon! </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='dashboard'>
            <Header userName={firstname} />
            <StarField />            
            <div className='dashboard-container'>
                <Sidebar pages={pages} selectedPage={selectedPage} onboarded={onboarded} />
                <div className='content'>
                    <DashboardContent selectedPage={selectedPage} activityName={activityName} onComplete={(page) => handlePageChange(page)} userId={userId} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
