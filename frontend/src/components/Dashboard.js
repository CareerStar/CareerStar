import React, {useState, useEffect} from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import DashboardContent from './DashboardContent';

function Dashboard() {

    const location = useLocation();
    const [firstname, setFirstname] = useState(location.state?.firstname || '');
    const [userId, setUserId] = useState(location.state?.userId || '');
    const [userDetails, setUserDetails] = useState({});
    const [selectedPage, setSelectedPage] = useState('Home');
    const [onboarded, setOnboarded] = useState(false);
    const pages = ['Home', 'Profile', 'Roadmap', 'Events', 'Network','Support'];

    const fetchUserDetails = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/user/${userId}`);
            // const response = await fetch(`http://localhost:8080/users/${userId}`);
            const data = await response.json();
            if (response.ok) {
                setUserDetails(data);
                console.log('User details:', data);
            } else {
                console.error('Error fetching user details:', data);
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }

        try {
            const response = await fetch(`http://127.0.0.1:5000/onboarding/${userId}`);
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

    const handlePageChange = (page) => {
        setSelectedPage(page);
        fetchUserDetails();
    }
    return (
        <div className='dashboard'>
            <Header userName={firstname} starCount={userDetails.stars} />
            <div className='dashboard-container'>
                <Sidebar pages={pages} onSelectPage={setSelectedPage} selectedPage={selectedPage} onboarded={onboarded}/>
                <div className='content'>
                    <DashboardContent selectedPage={selectedPage} onComplete={(page) => handlePageChange(page)} userId={userId}/>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;