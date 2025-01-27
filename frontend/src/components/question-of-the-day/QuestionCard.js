import React, { useState } from 'react';

function QuestionCard({ question, answer, id }) {
    const [isFlipped, setIsFlipped] = useState(false);

    const toggleFlip = () => {
        setIsFlipped((prev) => !prev);
    };

    return (
        <div
            className={`qod-card ${isFlipped ? "flipped" : ""} id-${id}`}
            onClick={toggleFlip}
            title="Click to flip the card">
            <div className="qod-card-inner">
                <div className="qod-card-front">
                    <h3>{question}</h3>
                </div>
                <div className="qod-card-back">
                    <p>{answer}</p>
                </div>
            </div>
        </div>
    );
};

export default QuestionCard;