import React from 'react';

function Jeopardy() {
    return (
        <div className='jeopardy-game-container'>
            <iframe
                src="https://jeopardylabs.com/play/hello-2033?embed=1"
                frameBorder="0"
                width="100%"
                height="500"
                title="Jeopardy Game"
            ></iframe>
            <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://jeopardylabs.com"
                style={{ color: "#8791de", fontSize: "12px" }}
            >
                JeopardyLabs
            </a>
        </div>
    );
};

export default Jeopardy;