import React, { useEffect, useState } from "react";
import axios from "axios";
import '../../App.css';

const AdminManagerReports = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingReports, setLoadingReports] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  //const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

  // Fetch users who sent reports
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const res = await axios.get(`https://api.careerstar.co/admin/reports/users`);
        setUsers(res.data);
        console.log(res.data);
      } catch (err) {
        alert("Failed to fetch users");
      }
      setLoadingUsers(false);
    };
    fetchUsers();
  }, []);

  // Fetch reports for selected user
  const handleUserClick = async (user) => {
    try {
      const res = await axios.get(`https://api.careerstar.co/admin/reports/user/${user.userid}`);
      setReports(res.data);
    } catch (err) {
      alert("Failed to fetch reports");
      setReports([]);
    }
    setLoadingReports(false); 
  };

  return (
    <div className="admin-reports-flex-container">
      {/* User List */}
      {!selectedUser ? (
        <div className="admin-user-list">
          <h2>Users Who Sent Reports</h2>
          {loadingUsers ? (
            <p>Loading users...</p>
          ) : (
            <ul className="admin-user-list-ul">
              {users.map((user) => (
                <li key={user.userid} className="admin-user-list-li">
                  <div
                    onClick={() => {
                      setSelectedUser(user);
                      setLoadingReports(true);
                      axios.get(`https://api.careerstar.co/admin/reports/user/${user.userid}`)
                        .then(res => setReports(res.data))
                        .catch(() => setReports([]))
                        .finally(() => setLoadingReports(false));
                    }}
                    className="admin-user-card"
                  >
                    {user.firstname}
                    <div className="admin-user-last-report">
                      Last report: 
                      {user.lastReport
                        ? new Date(user.lastReport).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: '2-digit', 
                            timeZone: 'America/New_York' 
                          })
                        : "N/A"}
                      {" at "}
                      {user.lastReport
                        ? new Date(user.lastReport).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit', 
                            second: '2-digit', 
                            hour12: true, 
                            timeZone: 'America/New_York' 
                          })
                        : "N/A"}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      {/* Reports List - User's Reports as Cards */}
      {selectedUser && !selectedReport && (
        <div className="admin-report-list">
          <button
            onClick={() => { setSelectedUser(null); setReports([]); }}
            className="admin-back-btn"
          >
            ← Back to user list
          </button>
          <h2 className="admin-report-list-title">
            Reports for <span className="admin-report-list-username">{selectedUser.firstname}</span>
          </h2>
          {loadingReports ? (
            <p>Loading reports...</p>
          ) : reports.length === 0 ? (
            <p>No reports found for this user.</p>
          ) : (
            <div className="admin-report-cards-container">
              {[...reports].sort((a, b) => {
                const aDateTime = new Date(`${a.report_date}T${a.created_time}`);
                const bDateTime = new Date(`${b.report_date}T${b.created_time}`);
                return bDateTime - aDateTime;
              }).map((report) => (
                <div
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className="admin-report-card"
                >
                  <div className="admin-report-card-date">
                    Report sent on: 
                    {report.report_date
                      ? new Date(report.report_date).toLocaleDateString('en-GB', { weekday: 'short', year: 'numeric', month: 'short', day: '2-digit' })
                      : "N/A"}
                    {" at "}
                    {report.time || "N/A"}
                  </div>
                  <div className="admin-report-card-preview">Click to view full report</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Single Report Full View */}
      {selectedReport && (
        <div className="admin-report-detail">
          <button
            onClick={() => setSelectedReport(null)}
            className="admin-back-btn"
          >
            ← Back to reports list
          </button>
          <div className="admin-report-detail-header">
            <div className="admin-report-detail-date">
              Report sent on: 
              {selectedReport.report_date
                ? new Date(selectedReport.report_date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: '2-digit' })
                : "N/A"}
              {" at "}
              {selectedReport.time || "N/A"}
            </div>
          </div>
          <div className="admin-report-section">
            <div className="admin-report-section-title">Highlights:</div>
            <ul className="admin-report-section-list">
              {selectedReport.answers?.highlights?.map((h, i) => <li key={i} className="admin-report-section-list-item">{h}</li>)}
            </ul>
          </div>
          <div className="admin-report-section">
            <div className="admin-report-section-title">Future Highlights:</div>
            <ul className="admin-report-section-list">
              {selectedReport.answers?.futureHighlights?.map((fh, i) => <li key={i} className="admin-report-section-list-item">{fh}</li>)}
            </ul>
          </div>
          <div className="admin-report-section">
            <div className="admin-report-section-title">Support Needed:</div>
            <div className="admin-report-section-content">{selectedReport.answers?.supportNeeded || "N/A"}</div>
          </div>
          <div className="admin-report-section">
            <div className="admin-report-section-title">Idea:</div>
            <div className="admin-report-section-content">{selectedReport.answers?.idea || "N/A"}</div>
          </div>
          <div className="admin-report-section">
            <div className="admin-report-section-title">Screenshots:</div>
            <ul className="admin-report-section-list">
              {selectedReport.answers?.screenshots?.length
                ? selectedReport.answers.screenshots.map((s, i) => <li key={i}><a href={s} target="_blank" rel="noopener noreferrer">Screenshot {i+1}</a></li>)
                : <li>None</li>
              }
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagerReports; 