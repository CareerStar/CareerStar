import React from 'react';
import Activity1 from './Activity1';
import Activity2 from './Activity2';
import Activity3 from './Activity3';

function ActivityAggregator({activity}) {

    const ActivityComponent = {
        1: <Activity1 />,
        2: <Activity2 />,
        3: <Activity3 />,
    };

    return (
        <div>
            {ActivityComponent[activity] || <Activity1 />}
        </div>
    );
}

export default ActivityAggregator;