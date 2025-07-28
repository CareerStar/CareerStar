import React from 'react';
import Activity1 from './Activity1';
import Activity2 from './Activity2';
import Activity3 from './Activity3';
import Activity4 from './Activity4';
import Activity5 from './Activity5';
import Activity6 from './Activity6';
import Activity7 from './Activity7';
import Activity8 from './Activity8';
import Activity9 from './Activity9';
import Activity11 from './Activity11';
import Activity10 from './Activity10';
import Activity13 from './Activity13';
import Activity14 from './Activity14';
import Activity15 from './Activity15';
import Activity16 from './Activity16';

function ActivityAggregator({activity}) {

    const ActivityComponent = {
        1: <Activity1 />,
        2: <Activity2 />,
        3: <Activity3 />,
        4: <Activity4 />,
        5: <Activity5 />,
        6: <Activity6 />,
        7: <Activity7 />,
        8: <Activity8 />,
        9: <Activity9 />,
        10: <Activity10 />,
        11: <Activity11 />,
        13: <Activity13 />,
        14: <Activity14 />,
        15: <Activity15 />,
        16: <Activity16 />,
    };

    return (
        <div>
            {ActivityComponent[activity] || <Activity1 />}
        </div>
    );
}

export default ActivityAggregator;