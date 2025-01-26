import React from 'react';
import Home from './dashboard-content-pages/Home';
import Profile from './dashboard-content-pages/Profile';
import Roadmap from './dashboard-content-pages/Roadmap';
import EventPage from './dashboard-content-pages/EventPage';
import Network from './dashboard-content-pages/Network';
import Support from './dashboard-content-pages/Support';
import AdminEvents from './admin/AdminEvents';
import LinkedIn from './admin/LinkedIn';
import ActivityAggregator from './activities/ActivityAggregator';

function DashboardContent({ selectedPage, activityName, onComplete, userId }) {
    const renderPage = () => {
        switch (selectedPage) {
            case 'Home':
                return <Home onComplete={onComplete} userId={userId} />;
            case 'Profile':
                return <Profile userId={userId} />;
            case 'Roadmap':
                return <Roadmap userId={userId} />;
            case 'Events':
                return <EventPage />;
            case 'Network':
                return <Network />;
            case 'Support':
                return <Support />;
            case 'Activity':
                return <ActivityAggregator activity={activityName} />;
            case 'AdminEvents':
                return <AdminEvents />;
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