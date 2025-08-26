import { useState } from "react";
import flippableCardFront from "../../../assets/images/activities/flippable-card-front.png";
import flippableCardBack from "../../../assets/images/activities/flippable-card-back.png";

export default function FlippableCard({ abbreviation, fullForm, duty }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="card-container" onClick={() => setIsFlipped(!isFlipped)}>
      <div className={`card ${isFlipped ? 'flipped' : ''}`}>
        {/* Front Side */}
        <div className="card-front" style={{ backgroundImage: `url(${flippableCardFront})` }}>
          <p className="card-text">{abbreviation}</p>
        </div>

        {/* Back Side */}
        <div className="card-back" style={{ backgroundImage: `url(${flippableCardBack})` }}>
          <p className="card-title">{fullForm}</p>
          <p className="card-duty">{duty}</p>
        </div>
      </div>
    </div>
  );
}
