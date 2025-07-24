import React from "react";
import { useNavigate } from "react-router-dom";
// <<<<<<< Updated upstream
import { Trophy, Folder, Cast, FileText} from "lucide-react";
// import homeIcon from "../assets/images/home-icon.png";
// import profileIcon from "../assets/images/profile-icon.png";
// import roadmapIcon from "../assets/images/roadmap-icon.png";
// import { Trophy, Folder, Cast} from "lucide-react";
// import homeIcon from "../assets/images/home-icon.png";
import homeIcon from "../assets/images/home-icon-earth.svg";
// import profileIcon from "../assets/images/profile-icon.png";
import profileIcon from "../assets/images/profile-icon-blue.svg";
// import roadmapIcon from "../assets/images/roadmap-icon.png";
import roadmapIcon from "../assets/images/activities-icon-light.svg";
import leaderboardIcon from "../assets/images/leaderboard-icon-moon.svg";

// >>>>>>> Stashed changes
import supportIcon from "../assets/images/support-icon-blue.svg";
import networkIcon from "../assets/images/network-icon.png";
import eventsIcon from "../assets/images/events-icon.png";

function Sidebar({ pages, selectedPage, onboarded, isAdmin = false }) {
    const navigate = useNavigate();

    const iconMap = {
        Home: homeIcon,
        Profile: profileIcon,
        Activities: roadmapIcon,
        Support: supportIcon,
        Network: networkIcon,
        Leaderboard: leaderboardIcon,
        Events: eventsIcon,
        AdminEvents: eventsIcon,
        LinkedIn: eventsIcon,
        "Resume Guide": supportIcon,
        // Workshops: <Cast size={24} color="white" />,
        // Leaderboard: <Trophy size={24} color="black" />,
        Users: <Folder size={24} color="white" />,
        "Activity Management": <Folder size={24} color="black" />,
        "Manager Reports": <FileText size={24} color="black" />,
    };

    const handleClick = (page) => {
        if (isAdmin) {
            navigate(`/admin/dashboard/${page.replace(/\s+/g, "").toLowerCase()}`);
        }
        else if (onboarded || page === "Home") {
            navigate(`/dashboard/${page.replace(/\s+/g, "").toLowerCase()}`);
        }
    };

    return (
        <div className="sidebar">
            <ul>
                {pages.map((page, index) => (
                    <li
                        key={index}
                        onClick={() => handleClick(page)}
                        className={
                            selectedPage === page
                                ? "selected"
                                : onboarded || page === "Home"
                                ? ""
                                : "disabled"
                        }
                    >
                        {typeof iconMap[page] === "string" ? (
                            <img src={iconMap[page]} alt={page} />
                        ) : (
                            iconMap[page]
                        )}
                        <p>{page}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Sidebar;