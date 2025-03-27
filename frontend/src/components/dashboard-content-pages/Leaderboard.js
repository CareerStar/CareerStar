import React, { useMemo, useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import axios from "axios";

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTopUsers = async () => {
            setLoading(true);
            try {
                const response = await axios.get("https://api.careerstar.co/top-users");
                const updatedUsers = response.data.map(user => ({
                    firstname: user.firstname,
                    stars: user.stars
                }));
                setUsers(updatedUsers);
            } catch (err) {
                setError("Failed to fetch users");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTopUsers();
    }, []);

    const rankedUsers = useMemo(() => {
        return users
            .sort((a, b) => b.stars - a.stars)
            .map((user, index) => ({
                ...user,
                rank: index + 1
            }));
    }, [users]);

    const renderTopThree = () => {
        const starColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
        const starSizes = [56, 40, 32];

        return (
            <div className="flex justify-center items-end gap-4 mb-6">
                {[1, 0, 2].map((index) => {
                    const user = rankedUsers[index];
                    const isFirst = index === 0;
                    const starColor = starColors[index];
                    const starSize = starSizes[index];

                    return user ? (
                        <div
                            key={user.firstname}
                            className={`flex flex-col items-center ${isFirst ? 'w-32 h-52' : 'w-24 h-40'} rounded-t-lg p-3`}
                            style={{ background: isFirst ? 'linear-gradient(to bottom, white, #FEF9C3)' : 'linear-gradient(to bottom, white, #FEFCE8)' }}
                        >


                            <Star
                                size={starSize}
                                fill={starColor}
                                color={starColor}
                                className="mb-2"
                            />
                            <span className={`${isFirst ? 'text-lg' : 'text-sm'} font-bold`}>
                                {user.firstname}
                            </span>
                            <div className="flex items-center mt-1">
                                <Star size={isFirst ? 20 : 16} fill={starColor} color={starColor} />
                                <span className={`ml-1 ${isFirst ? 'text-base font-semibold' : 'text-sm'}`}>
                                    {user.stars}
                                </span>
                            </div>
                        </div>
                    ) : null;
                })}
            </div>
        );
    };

    const renderRemainingUsers = () => {
        return (
            <div className="bg-white shadow-md rounded-lg">
                {rankedUsers.slice(3).map((user) => (
                    <div
                        key={user.firstname}
                        className="flex justify-between items-center p-3 border-b hover:bg-gray-50 transition"
                    >
                        <div className="flex items-center">
                            <span className="mr-4 text-gray-500 w-8">{user.rank}.</span>
                            <span className="font-medium">{user.firstname}</span>
                        </div>
                        <div className="flex items-center">
                            <Star size={16} fill="#FFD700" color="#FFD700" className="mr-1" />
                            <span>{user.stars}</span>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div>
            {loading && (
                <div className="spinner-overlay">
                    <div className="spinner"></div>
                </div>
            )}
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-4 mt-10">
                <h2 className="text-2xl font-bold text-center mb-4 flex items-center justify-center">
                    <Star fill="#FFD700" color="#FFD700" className="mr-2" />
                    Leaderboard
                    <Star fill="#FFD700" color="#FFD700" className="ml-2" />
                </h2>
                {renderTopThree()}
                {renderRemainingUsers()}
            </div>
        </div>
    );
};

export default Leaderboard;