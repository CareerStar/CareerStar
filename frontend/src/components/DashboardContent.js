import React from 'react';
import Home from './Home';

function DashboardContent({selectedPage}) {
    const renderPage = () => {
        switch (selectedPage) {
            case 'Home':
                return <Home />;
            // case 'Profile':
            //     return <Profile />;
            // case 'Roadmap':
            //     return <Roadmap />;
            // case 'Events':
            //     return <Events />;
            // case 'Network':
            //     return <Network />;
            // case 'Support':
            //     return <Support />;
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