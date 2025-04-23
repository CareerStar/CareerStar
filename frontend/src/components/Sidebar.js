import React from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Folder, Cast} from "lucide-react";
import homeIcon from "../assets/images/home-icon.png";
import profileIcon from "../assets/images/profile-icon.png";
import roadmapIcon from "../assets/images/roadmap-icon.png";
import supportIcon from "../assets/images/support-icon.png";
import networkIcon from "../assets/images/network-icon.png";
import eventsIcon from "../assets/images/events-icon.png";

function Sidebar({ pages, selectedPage, onboarded, isAdmin = false }) {
    const navigate = useNavigate();

    const iconMap = {
        Home: homeIcon,
        Profile: profileIcon,
        Roadmap: roadmapIcon,
        Support: supportIcon,
        Network: networkIcon,
        Events: eventsIcon,
        AdminEvents: eventsIcon,
        LinkedIn: eventsIcon,
        "Resume Coach": supportIcon,
        Modules: <Cast size={24} color="black" />,
        Leaderboard: <Trophy size={24} color="black" />,
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