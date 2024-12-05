import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function withAuth(WrappedComponent) {
    return function AuthWrapper(props) {
        const navigate = useNavigate();

        useEffect(() => {
            const checkAuth = async () => {
                const accessToken = localStorage.getItem('access_token');
                const refreshToken = localStorage.getItem('refresh_token');
                const loginTimestamp = localStorage.getItem('login_timestamp');

                if (!accessToken || !refreshToken || !loginTimestamp) {
                    navigate('/login');
                    return;
                }

                const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
                if (parseInt(loginTimestamp) < oneWeekAgo) {
                    localStorage.clear();
                    navigate('/login');
                    return;
                }

                try {
                    const response = await fetch('https://ec2-34-227-29-26.compute-1.amazonaws.com:5000/protected', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });

                    if (!response.ok) {
                        const refreshResponse = await fetch('https://ec2-34-227-29-26.compute-1.amazonaws.com:5000/refresh', {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${refreshToken}`
                            }
                        });

                        if (refreshResponse.ok) {
                            const { access_token } = await refreshResponse.json();
                            localStorage.setItem('access_token', access_token);
                        } else {
                            throw new Error('Token refresh failed');
                        }
                    }
                } catch (error) {
                    localStorage.clear();
                    navigate('/login');
                }
            };

            checkAuth();
        }, [navigate]);

        return <WrappedComponent />;
    };
}

export default withAuth;