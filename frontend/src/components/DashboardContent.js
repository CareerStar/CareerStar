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
import ResumeGuide from './dashboard-content-pages/ResumeGuide';
import Modules from './dashboard-content-pages/Modules';
import Leaderboard from './dashboard-content-pages/Leaderboard';
import UserManagement from './admin/UserManagement';
import ActivityManagement from './admin/ActivityManagement';
import ManagerReports from './admin/ManagerReports';

function DashboardContent({ selectedPage, activityName, onComplete, userId }) {
    const renderPage = () => {
        switch (selectedPage) {
            case 'Home':
                return <Home onComplete={onComplete} userId={userId} />;
            case 'Profile':
                return <Profile userId={userId} />;
            case 'Activities':
                return <Roadmap userId={userId} />;
            case 'Events':
                return <EventPage userId={userId} />;
            case 'Network':
                return <Network />;
            case 'Support':
                return <Support />;
            case 'Activity':
                return <ActivityAggregator activity={activityName} />;
            case 'Adminevents':
                return <AdminEvents />;
            case 'Linkedin':
                return <LinkedIn />;
            case 'Resumeguide':
                return <ResumeGuide />;
            case 'Workshops':
                return <Modules />;
            case 'Leaderboard':
                return <Leaderboard />;
            case 'Users':
                return <UserManagement />;
            case 'Activitymanagement':
                return <ActivityManagement />;
            case 'Managerreports':
                return <ManagerReports />;
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