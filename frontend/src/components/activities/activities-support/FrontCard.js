import { useState } from "react";
import cardFront from "../../../assets/images/activities/front.png";
import cardBack from "../../../assets/images/activities/back.png";

export default function FlippableCard({ abbreviation, onSelect, title, desc }) {
  const [isSelected, setIsSelected] = useState(false);

  const handleCardClick = () => {
    setIsSelected(!isSelected);
    if (onSelect) onSelect(abbreviation);
  };

  return (
<div 
  className={`card-container ${isSelected ? "selected" : ""}`}
  onClick={handleCardClick}
>
  <div 
    className="card-back-game"
    style={{ backgroundImage: `url(${cardBack})` }}
  >
    <div className="card-content-game">
      <p className="card-text">{abbreviation}</p>
      {title && <p className="card-title">{title}</p>}
      {desc && <p className="card-duty">{desc}</p>}
    </div>
  </div>
</div>

  );
}
