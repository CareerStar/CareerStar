import React from 'react';
import Events from '../Events';

function EventPage({ userId }) {
    return (
        <div>
            <Events userId={userId} />
        </div>
    );
};

export default EventPage;