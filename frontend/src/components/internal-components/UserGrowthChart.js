import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apiUrl } from '../../utils/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const UserGrowthChart = () => {
    const [data, setData] = useState([]);
    const [goal, setGoal] = useState(1000);

    useEffect(() => {
        axios.get(apiUrl('/users/stats'))
            .then(response => {
                const { data, goal_count } = response.data;
                setData(data);
                setGoal(goal_count);
            })
            .catch(error => console.error('Error fetching user stats:', error));
    }, []);

    const EmojiActiveDot = (props) => {
        const { cx, cy } = props;
        return (
            <text x={cx} y={cy} dy={5} textAnchor="middle" fontSize={20}>
                🚀
            </text>
        );
    };

    return (
        <div className="p-4 bg-white rounded shadow"
            style={{ backgroundColor: '#F9F8FF' }}>
            <h2 className="text-xl font-semibold mb-4"
                style={{ fontFamily: 'Sora' }}>User Growth (Target: 1000)</h2>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="total_users"
                        name="Career Stars"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={false}
                        activeDot={<EmojiActiveDot />}
                    />
                </LineChart>
            </ResponsiveContainer>

            <div className="mt-6 px-2 py-4 rounded-lg text-left pl-10">
                <h3 className="text-xl font-semibold mb-2"
                    style={{ fontFamily: 'Sora' }}>📈 Milestones & Achievements</h3>
                <ul className="list-disc pl-6 text-lg text-gray-700 space-y-1"
                    style={{ fontFamily: 'Nunito' }}>
                    <li>🚀 50+ users onboarded in under 3 months</li>
                    <li>💬 100% of users provided positive feedback</li>
                </ul>
            </div>
        </div>
    );
};

export default UserGrowthChart;
