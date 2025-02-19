import React from "react";
import { useNavigate } from "react-router-dom";
import homeIcon from '../assets/images/home-icon.png';
import profileIcon from '../assets/images/profile-icon.png';
import roadmapIcon from '../assets/images/roadmap-icon.png';
import supportIcon from '../assets/images/support-icon.png';
import networkIcon from '../assets/images/network-icon.png';
import eventsIcon from '../assets/images/events-icon.png';

function Sidebar({pages, selectedPage, onboarded}) {
    const navigate = useNavigate();
    const getIcon = (page) => {
        switch(page) {
            case 'Home':
                return homeIcon;
            case 'Profile':
                return profileIcon;
            case 'Roadmap':
                return roadmapIcon;
            case 'Support':
                return supportIcon;
            case 'Network':
                return networkIcon;
            case 'Events':
                return eventsIcon;
            case 'AdminEvents':
                return eventsIcon;
            case 'LinkedIn':
                return eventsIcon;
            case 'Resume Coach':
                return supportIcon;
            default:
                return <i className="fas fa-tachometer-alt"></i>;
        }
    }

    const handleClick = (page) => {
        if (onboarded || page === 'Home') {
            navigate(`/dashboard/${page.replace(/\s+/g, '').toLowerCase()}`);
        }
    }

    return (
        <div className="sidebar">
            <ul>
                {pages.map((page, index) => (
                    <li 
                        key={index} 
                        onClick={() => handleClick(page)}
                        className={selectedPage === page ? 'selected' : onboarded || page === 'Home' ? '' : 'disabled'}
                    >
                        <img src={getIcon(page)} alt={page} />
                        <p>{page}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Sidebar;