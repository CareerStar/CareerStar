import React, { useMemo, useEffect, useState } from 'react';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';
import axios from "axios";
import { apiUrl } from '../../utils/api';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showAllUsers, setShowAllUsers] = useState(false);
    const [showUsersList, setShowUsersList] = useState(true);
    const [timeFilter, setTimeFilter] = useState('all-time'); // 'all-time' or 'weekly'

    useEffect(() => {
        const fetchTopUsers = async () => {
            setLoading(true);
            try {
                const endpoint = timeFilter === 'weekly' ? '/top-users-weekly' : '/top-users';
                const response = await axios.get(apiUrl(endpoint));
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
    }, [timeFilter]);

    const rankedUsers = useMemo(() => {
        return users
            .sort((a, b) => b.stars - a.stars)
            .map((user, index) => ({
                ...user,
                rank: index + 1
            }));
    }, [users]);

    const renderTopThree = () => {
        const topThree = rankedUsers.slice(0, 3);
        
        return (
            <div style={{ 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'end',
                gap: '8px',
                marginBottom: '24px',
                padding: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                backdropFilter: 'blur(8px)',
                minHeight: '200px',
                flexWrap: 'wrap'
            }}>
                {topThree.map((user, index) => {
                    const isFirst = index === 0;
                    const isSecond = index === 1; 
                    const starColor = index === 0 ? '#8B5CF6' : index === 1 ? '#F97316' : '#EAB308';
                    const height = isFirst ? '180px' : isSecond ? '150px' : '120px';
                    const starSize = isFirst ? 48 : 36;

                    return (
                        <div
                            key={user.firstname}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                width: window.innerWidth < 768 ? '80px' : '100px',
                                height: window.innerWidth < 768 ? 
                                    (isFirst ? '150px' : isSecond ? '120px' : '100px') : height,
                                background: isFirst 
                                    ? 'linear-gradient(135deg, #DDD6FE 0%, #C4B5FD 100%)'
                                    : isSecond 
                                        ? 'linear-gradient(135deg, #FED7AA 0%, #FDBA74 100%)'
                                        : 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                                borderRadius: '8px',
                                padding: '12px 8px',
                                position: 'relative',
                                border: isFirst ? '2px solid #8B5CF6' : isSecond ? '2px solid #F97316' : '2px solid #EAB308',
                                transition: 'transform 0.2s ease, width 0.2s ease, height 0.2s ease',
                                minWidth: '80px'
                            }}
                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        >
                            <div style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '8px',
                                backgroundColor: starColor,
                                color: 'white',
                                borderRadius: '50%',
                                width: '24px',
                                height: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                fontWeight: 'bold'
                            }}>
                                {user.rank}
                            </div>
                            
                            <div style={{ position: 'relative', marginBottom: '8px', marginTop: '16px' }}>
                                <Star
                                    size={starSize}
                                    fill={index === 0 ? '#4C1D95' : index === 1 ? '#9A3412' : '#713F12'}
                                    color={index === 0 ? '#4C1D95' : index === 1 ? '#9A3412' : '#713F12'}
                                    style={{ position: 'absolute', top: '2px', left: '2px' }}
                                />
                                <Star
                                    size={starSize}
                                    fill={index === 0 ? '#6B21A8' : index === 1 ? '#C2410C' : '#A16207'}
                                    color={index === 0 ? '#6B21A8' : index === 1 ? '#C2410C' : '#A16207'}
                                    style={{ position: 'absolute', top: '1px', left: '1px' }}
                                />
                                <Star
                                    size={starSize}
                                    fill={starColor}
                                    color={starColor}
                                    style={{ position: 'relative', zIndex: 3 }}
                                />
                            </div>
                            
                            <span style={{
                                fontSize: isFirst ? '16px' : '14px',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                marginBottom: '8px',
                                color: '#333'
                            }}>
                                {user.firstname}
                            </span>
                            
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                gap: '4px',
                                backgroundColor: 'rgba(255,255,255,0.7)',
                                padding: '4px 8px',
                                borderRadius: '12px'
                            }}>
                                <div style={{ position: 'relative' }}>
                                    <Star
                                        size={16}
                                        fill={index === 0 ? '#4C1D95' : index === 1 ? '#9A3412' : '#713F12'}
                                        color={index === 0 ? '#4C1D95' : index === 1 ? '#9A3412' : '#713F12'}
                                        style={{ position: 'absolute', top: '1px', left: '1px' }}
                                    />
                                    <Star
                                        size={16}
                                        fill={starColor}
                                        color={starColor}
                                        style={{ position: 'relative', zIndex: 2 }}
                                    />
                                </div>
                                <span style={{ 
                                    fontSize: isFirst ? '14px' : '12px',
                                    fontWeight: '600',
                                    color: '#333'
                                }}>
                                    {user.stars}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderRemainingUsers = () => {
        const remainingUsers = rankedUsers.slice(3);
        const displayUsers = showAllUsers ? remainingUsers : remainingUsers.slice(0, 5);
        
        if (remainingUsers.length === 0) return null;

        return (
            <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                backdropFilter: 'blur(8px)',
                overflow: 'hidden'
            }}>
                <div style={{
                    padding: '16px',
                    borderBottom: '1px solid #e9ecef',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <h3 
                        onClick={() => setShowUsersList(!showUsersList)}
                        style={{
                            margin: 0,
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color: '#333',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            transition: 'color 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.color = '#666'}
                        onMouseLeave={(e) => e.target.style.color = '#333'}
                    >
                        <div style={{ position: 'relative' }}>
                            <Star
                                size={20}
                                fill="#4C1D95"
                                color="#4C1D95"
                                style={{ position: 'absolute', top: '2px', left: '2px' }}
                            />
                            <Star
                                size={20}
                                fill="#6B21A8"
                                color="#6B21A8"
                                style={{ position: 'absolute', top: '1px', left: '1px' }}
                            />
                            <Star
                                size={20}
                                fill="#8B5CF6"
                                color="#8B5CF6"
                                style={{ position: 'relative', zIndex: 3 }}
                            />
                        </div>
                        All Users
                        {showUsersList ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </h3>
                    {remainingUsers.length > 5 && showUsersList && !showAllUsers && (
                        <button
                            onClick={() => setShowAllUsers(true)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#666',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '14px',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                transition: 'background-color 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                            Show All ({remainingUsers.length})
                            <ChevronDown size={16} />
                        </button>
                    )}
                </div>
                
                {showUsersList && (
                    <div style={{ maxHeight: showAllUsers ? 'none' : '300px', overflow: 'auto' }}>
                        {displayUsers.map((user, index) => (
                        <div
                            key={user.firstname}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '12px 16px',
                                borderBottom: index < displayUsers.length - 1 ? '1px solid #f1f3f5' : 'none',
                                transition: 'background-color 0.2s ease',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{
                                    color: '#666',
                                    fontWeight: '600',
                                    minWidth: '24px',
                                    textAlign: 'center',
                                    fontSize: '14px'
                                }}>
                                    {user.rank}.
                                </span>
                                <span style={{
                                    fontWeight: '500',
                                    color: '#333',
                                    fontSize: '15px'
                                }}>
                                    {user.firstname}
                                </span>
                            </div>
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                gap: '4px',
                                backgroundColor: '#fff9c4',
                                padding: '4px 8px',
                                borderRadius: '12px'
                            }}>
                                <div style={{ position: 'relative' }}>
                                    <Star
                                        size={16}
                                        fill="#B45309"
                                        color="#B45309"
                                        style={{ position: 'absolute', top: '1px', left: '1px' }}
                                    />
                                    <Star
                                        size={16}
                                        fill="#FFD700"
                                        color="#FFD700"
                                        style={{ position: 'relative', zIndex: 2 }}
                                    />
                                </div>
                                <span style={{
                                    fontWeight: '600',
                                    color: '#333',
                                    fontSize: '14px'
                                }}>
                                    {user.stars}
                                </span>
                            </div>
                        </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            padding: window.innerWidth < 768 ? '12px' : '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            maxWidth: '1200px',
            margin: '0 auto',
            boxSizing: 'border-box'
        }}>
            {loading && (
                <div className="spinner-overlay">
                    <div className="spinner"></div>
                </div>
            )}
            
            <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                border: '1px solid rgba(233, 236, 239, 0.5)',
                backdropFilter: 'blur(10px)'
            }}>
                <h2 style={{
                    fontSize: window.innerWidth < 768 ? '24px' : '28px',
                    fontFamily: 'Sora',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    margin: '0 0 16px 0',
                    color: '#333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    flexWrap: 'wrap'
                }}>
                    Leaderboard
                </h2>
                
                {/* Toggle for Weekly vs All-time */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '24px'
                }}>
                    <div style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: '25px',
                        padding: '4px',
                        display: 'flex',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        border: '1px solid rgba(139, 92, 246, 0.2)'
                    }}>
                        <button
                            onClick={() => setTimeFilter('weekly')}
                            style={{
                                backgroundColor: timeFilter === 'weekly' ? '#8B5CF6' : 'transparent',
                                color: timeFilter === 'weekly' ? 'white' : '#666',
                                border: 'none',
                                borderRadius: '20px',
                                padding: '8px 20px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                fontFamily: 'Sora'
                            }}
                        >
                            Weekly
                        </button>
                        <button
                            onClick={() => setTimeFilter('all-time')}
                            style={{
                                backgroundColor: timeFilter === 'all-time' ? '#8B5CF6' : 'transparent',
                                color: timeFilter === 'all-time' ? 'white' : '#666',
                                border: 'none',
                                borderRadius: '20px',
                                padding: '8px 20px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                fontFamily: 'Sora'
                            }}
                        >
                            All-time
                        </button>
                    </div>
                </div>
                
                <div style={{
                    display: 'grid',
                    gap: '24px',
                    gridTemplateColumns: '1fr',
                    '@media (min-width: 768px)': {
                        gridTemplateColumns: '1fr'
                    }
                }}>
                    {rankedUsers.length > 0 && renderTopThree()}
                    {renderRemainingUsers()}
                </div>
            </div>

            {error && (
                <div style={{
                    backgroundColor: '#fee',
                    color: '#c33',
                    padding: '16px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    border: '1px solid #fcc'
                }}>
                    {error}
                </div>
            )}
            
            <style jsx>{`
                @media (max-width: 768px) {
                    .leaderboard-container {
                        padding: 16px !important;
                    }
                    .top-three-container {
                        flex-direction: column !important;
                        align-items: center !important;
                        gap: 12px !important;
                    }
                    .top-three-item {
                        width: 80px !important;
                        height: auto !important;
                    }
                }
                @media (max-width: 480px) {
                    .leaderboard-container {
                        padding: 12px !important;
                    }
                    .leaderboard-title {
                        font-size: 24px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Leaderboard;
