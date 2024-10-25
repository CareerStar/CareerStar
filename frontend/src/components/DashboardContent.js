import React from 'react';
import Home from './dashboard-content-pages/Home';
import Profile from './dashboard-content-pages/Profile';
import Roadmap from './dashboard-content-pages/Roadmap';
import Events from './dashboard-content-pages/Events';
import Network from './dashboard-content-pages/Network';
import Support from './dashboard-content-pages/Support';
import AdminActivities from './admin/AdminActivities';
import LinkedIn from './admin/LinkedIn';

function DashboardContent({selectedPage, onComplete, userId}) {
    const renderPage = () => {
        switch (selectedPage) {
            case 'Home':
                return <Home onComplete={onComplete} userId={userId}/>;
            case 'Profile':
                return <Profile userId={userId}/>;
            case 'Roadmap':
                return <Roadmap userId={userId}/>;
            case 'Events':
                return <Events />;
            case 'Network':
                return <Network />;
            case 'Support':
                return <Support />;
            case 'AdminActivities':
                return <AdminActivities />;
            case 'LinkedIn':
                return <LinkedIn />;
            default:
                return <Home />;
        }
    }
    return (
        <div className='dashboard-content'>
            {renderPage()}
        </div>
    );
}

export default DashboardContent;