import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManagerReports = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userReports, setUserReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // API base URL - use production for now
    const API_BASE_URL = 'https://api.careerstar.co';

    useEffect(() => {
        fetchUsersWithReports();
    }, []);

    const fetchUsersWithReports = async () => {
        try {
            setLoading(true);
            const adminToken = localStorage.getItem('admin_token');
            const response = await axios.get(`${API_BASE_URL}/admin/reports/users`, {
                headers: {
                    'Authorization': `Bearer ${adminToken}`
                }
            });
            setUsers(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to load users with reports');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserReports = async (userId) => {
        try {
            setLoading(true);
            const adminToken = localStorage.getItem('admin_token');
            const response = await axios.get(`${API_BASE_URL}/admin/reports/user/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${adminToken}`
                }
            });
            setUserReports(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching user reports:', err);
            setError('Failed to load user reports');
        } finally {
            setLoading(false);
        }
    };

    const handleUserClick = (user) => {
        setSelectedUser(user);
        fetchUserReports(user.user_id);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const openPdfInNewTab = (pdfContent) => {
        const blob = new Blob([Uint8Array.from(atob(pdfContent), c => c.charCodeAt(0))], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    };

    if (loading && users.length === 0) {
        return (
            <div className="admin-reports-container">
                <h2>Manager Reports</h2>
                <div className="loading">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-reports-container">
                <h2>Manager Reports</h2>
                <div className="error">{error}</div>
                <button onClick={fetchUsersWithReports} className="retry-btn">Retry</button>
            </div>
        );
    }

    return (
        <div className="admin-reports-container">
            <h2>Manager Reports</h2>
            
            <div className="reports-layout">
                {/* Users List */}
                <div className="users-list">
                    <h3>Users with Reports ({users.length})</h3>
                    <div className="users-container">
                        {users.map((user) => (
                            <div
                                key={user.user_id}
                                className={`user-item ${selectedUser?.user_id === user.user_id ? 'selected' : ''}`}
                                onClick={() => handleUserClick(user)}
                            >
                                <div className="user-info">
                                    <div className="user-name">{user.student_name}</div>
                                    <div className="report-count">{user.report_count} report(s)</div>
                                </div>
                                <div className="last-report-date">
                                    Last: {formatDate(user.last_report_date)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reports List */}
                {selectedUser && (
                    <div className="reports-list">
                        <h3>Reports for {selectedUser.student_name}</h3>
                        <div className="reports-container">
                            {userReports.map((report) => (
                                <div key={report.id} className="report-item">
                                    <div className="report-header">
                                        <div className="report-date">
                                            {formatDate(report.created_at)}
                                        </div>
                                        <div className="report-manager">
                                            To: {report.manager_name} ({report.manager_email})
                                        </div>
                                    </div>
                                    
                                    <div className="report-content">
                                        <div className="report-preview">
                                            <h4>Report Preview:</h4>
                                            <div className="preview-text">
                                                {report.report_preview?.substring(0, 200)}...
                                            </div>
                                        </div>
                                        
                                        <div className="report-actions">
                                            <button
                                                onClick={() => openPdfInNewTab(report.pdf_content)}
                                                className="view-pdf-btn"
                                            >
                                                View PDF
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const answers = report.user_answers;
                                                    alert(`
Report Details:
- Highlights: ${answers?.highlights || 'N/A'}
- Future Highlights: ${answers?.future_highlights || 'N/A'}
- Support Needed: ${answers?.support_needed || 'N/A'}
- Ideas: ${answers?.ideas || 'N/A'}
                                                    `);
                                                }}
                                                className="view-details-btn"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {!selectedUser && users.length > 0 && (
                <div className="no-selection">
                    Select a user to view their reports
                </div>
            )}
        </div>
    );
};

export default ManagerReports; 