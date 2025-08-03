import React, { useEffect, useState } from "react";
import axios from "axios";
import '../../App.css';
import jsPDF from 'jspdf';

// Helper to break long lines for PDF
const breakLongLines = (text, maxLen = 80) => {
  if (!text) return '';
  return text
    .split('\n')
    .map(line => {
      if (line.length <= maxLen) return line;
      const words = line.split(' ');
      let result = '';
      let current = '';
      for (const word of words) {
        if ((current + ' ' + word).trim().length > maxLen) {
          result += current.trim() + '\n';
          current = word + ' ';
        } else {
          current += word + ' ';
        }
      }
      result += current.trim();
      return result;
    })
    .join('\n');
};

const downloadReportPDF = async (report) => {
  const pdf = new jsPDF();
  let y = 20;
  const reportDate = report.created_time
    ? new Date(report.created_time).toLocaleDateString()
    : '';
  // Title
  pdf.setFontSize(18);
  pdf.setFont(undefined, 'bold');
  pdf.text(`Weekly Progress Report - ${reportDate}`, 20, y);
  y += 12;
  // Add sender's name
  pdf.setFontSize(12);
  pdf.setFont(undefined, 'normal');
  pdf.text(`Report from: ${report.student_name || 'N/A'}`, 20, y);
  y += 10;
  // Add recipient info 
  pdf.setFontSize(12);
  pdf.setFont(undefined, 'normal');
  pdf.text(`To: ${report.manager_email || 'N/A'}`, 20, y);
  y += 10;
  // Support Needed
  pdf.setFontSize(14);
  pdf.setFont(undefined, 'bold');
  pdf.text('Support Needed', 20, y);
  y += 8;
  pdf.setFont(undefined, 'normal');
  pdf.setFontSize(10);
  const supportLines = pdf.splitTextToSize(breakLongLines(report.answers?.supportNeeded || '').replace(/<br\/>/g, '\n'), 170);
  pdf.text(supportLines, 20, y);
  y += supportLines.length * 5 + 4;
  // Work Delivery Highlights
  pdf.setFontSize(14);
  pdf.setFont(undefined, 'bold');
  pdf.text('Work Delivery Highlights', 20, y);
  y += 8;
  pdf.setFont(undefined, 'normal');
  pdf.setFontSize(10);
  (report.answers?.highlights || []).forEach((h, i) => {
    if (h) {
      const lines = pdf.splitTextToSize(`${i + 1}. ${breakLongLines(h).replace(/<br\/>/g, '\n')}`, 170);
      pdf.text(lines, 20, y);
      y += lines.length * 5;
    }
  });
  y += 4;
  // Next Week's Focus
  pdf.setFontSize(14);
  pdf.setFont(undefined, 'bold');
  pdf.text("Next Week's Focus", 20, y);
  y += 8;
  pdf.setFont(undefined, 'normal');
  pdf.setFontSize(10);
  (report.answers?.futureHighlights || []).forEach((h, i) => {
    if (h) {
      const lines = pdf.splitTextToSize(`${i + 1}. ${breakLongLines(h).replace(/<br\/>/g, '\n')}`, 170);
      pdf.text(lines, 20, y);
      y += lines.length * 5;
    }
  });
  y += 4;
  // Idea/Initiative
  pdf.setFontSize(14);
  pdf.setFont(undefined, 'bold');
  pdf.text('Idea/Initiative', 20, y);
  y += 8;
  pdf.setFont(undefined, 'normal');
  pdf.setFontSize(10);
  const ideaLines = pdf.splitTextToSize(breakLongLines(report.answers?.idea || '').replace(/<br\/>/g, '\n'), 170);
  pdf.text(ideaLines, 20, y);
  y += ideaLines.length * 5;
  // Screenshots
  if (report.answers?.screenshots && report.answers.screenshots.length > 0) {
    const maxScreenshots = 5;
    const screenshotsToInclude = report.answers.screenshots.slice(0, maxScreenshots);
    if (y > 250) {
      pdf.addPage();
      y = 20;
    }
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.text('Screenshots:', 20, y);
    y += 15;
    for (let i = 0; i < screenshotsToInclude.length; i++) {
      const screenshot = screenshotsToInclude[i];
      if (y > 200) {
        pdf.addPage();
        y = 20;
      }
      try {
        const img = new window.Image();
        img.src = screenshot;
        await new Promise((res) => img.onload = res);
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const resizedBase64 = canvas.toDataURL('image/jpeg', 0.6);
        pdf.addImage(resizedBase64, 'JPEG', 20, y, 120, 90);
        y += 100;
      } catch (error) {
        // Handle error
      }
    }
    if (report.answers.screenshots.length > maxScreenshots) {
      pdf.text(`Note: Only first ${maxScreenshots} screenshots included due to size limits.`, 20, y);
    }
  }
  pdf.save(`Weekly_Report_${reportDate}.pdf`);
};

const AdminManagerReports = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [allReports, setAllReports] = useState([]); // All reports for 'All Reports' column
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingReports, setLoadingReports] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  // Date filter state for All Reports
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');
  const [filteredAllReports, setFilteredAllReports] = useState([]);
  const [cohortFilter, setCohortFilter] = useState('');
  const [showUsersList, setShowUsersList] = useState(false);

  //const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

  // Fetch users who sent reports
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const res = await axios.get(`https://api.careerstar.co/admin/reports/users`);
        setUsers(res.data);
      } catch (err) {
        alert("Failed to fetch users");
      }
      setLoadingUsers(false);
    };
    fetchUsers();
  }, []);

  // Fetch all reports for 'All Reports' column
  useEffect(() => {
    axios.get('https://api.careerstar.co/admin/api/reports')
      .then(res => setAllReports(res.data))
      .catch(err => console.error(err));
  }, []);

  // Filter all reports by date range
  useEffect(() => {
    let filtered = allReports;
    if (filterFrom || filterTo) {
      const fromDate = filterFrom ? new Date(filterFrom) : null;
      const toDate = filterTo ? new Date(filterTo) : null;
      filtered = filtered.filter(r => {
        const created = new Date(r.created_time);
        if (fromDate && created < fromDate) return false;
        if (toDate && created > toDate) return false;
        return true;
      });
    }
    if (cohortFilter) {
      filtered = filtered.filter(r =>
        (r.user_cohort || '').toLowerCase().includes(cohortFilter.toLowerCase())
      );
    }
    setFilteredAllReports(filtered);
  }, [allReports, filterFrom, filterTo, cohortFilter]);

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
    <div className="admin-reports-flex-container" >
      
      {/* All Reports Column */}
      <div>
        <div className="admin-report-list">
          <h2>All Reports</h2>
          {/* Date filter UI */}
          <div className="filter-header">
            <label>
              From:
              <input
                type="date"
                value={filterFrom}
                onChange={e => setFilterFrom(e.target.value)}
                style={{ marginLeft: 4 }}
              />
            </label>
            <label>
              To:
              <input
                type="date"
                value={filterTo}
                onChange={e => setFilterTo(e.target.value)}
                style={{ marginLeft: 4 }}
              />
            </label>
            <label style={{ marginLeft: 8 }}>
              Cohort:
              <input
                type="text"
                value={cohortFilter}
                onChange={e => setCohortFilter(e.target.value)}
                placeholder="Filter by cohort"
                style={{ marginLeft: 4 }}
              />
            </label>
            <button
              className="filter-btn"
              onClick={() => {}}
            >
              Filter
            </button>
            <button
              className="clear-filter-btn"
              onClick={() => { setFilterFrom(''); setFilterTo(''); setCohortFilter(''); }}
            >
              Clear Filter
            </button>
          </div>
          <div className="all-reports-header">
            <button
              className="show-users-btn"
              onClick={() => setShowUsersList((prev) => !prev)}
            >
              {showUsersList ? "Hide Users Who Sent Reports" : "Show Users Who Sent Reports"}
            </button>
          </div>
          {showUsersList && (
            <div style={{ flex: 1 }}>
            <div className="admin-user-list">
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
          </div>
          )}
          {(filterFrom && filterTo) ? (
            <>
              <div className="all-reports-count" style={{ fontWeight: 600, marginBottom: 12 }}>
                {filteredAllReports.length} report{filteredAllReports.length !== 1 ? 's' : ''} found in this date range
              </div>
              {filteredAllReports.length === 0 ? (
                <p className="date-range-prompt">No reports found in this date range.</p>
              ) : (
                <div className="admin-report-cards-container">
                  {filteredAllReports.map((report) => (
                    <div
                      key={report.id}
                      className={`admin-report-card${selectedReport && selectedReport.id === report.id ? ' selected' : ''}`}
                      onClick={() => {
                        setSelectedUser(null);
                        setSelectedReport(report);
                      }}
                    >
                      <div className="admin-report-username" style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
                        {report.student_name || report.firstname || 'Unknown User'}
                      </div>
                      <div className="admin-report-card-date">
                        Report sent on:
                        {report.created_time
                          ? new Date(report.created_time).toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: '2-digit',
                              timeZone: 'America/New_York'
                            })
                          : "N/A"
                        }
                        {" at "}
                        {report.created_time
                          ? new Date(report.created_time).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                              hour12: true,
                              timeZone: 'America/New_York'
                            })
                          : "N/A"
                        }
                      </div>
                      <div className="admin-report-card-preview">Click to view full report</div>
                      <div>Cohort: {report.user_cohort || 'N/A'}</div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="date-range-prompt">Please select a date range to view reports.</p>
          )}
        </div>
      </div>
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
                const aDateTime = new Date(a.created_time);
                const bDateTime = new Date(b.created_time);
                return bDateTime - aDateTime; // Ascending: oldest first
              }).map((report) => (
                <div
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className="admin-report-card"
                >
                  <div className="admin-report-card-date">
                    Report sent on:
                    {report.created_time
                      ? new Date(report.created_time).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit',
                        timeZone: 'America/New_York'
                      })
                      : "N/A"
                    }
                    {" at "}
                    {report.created_time
                      ? new Date(report.created_time).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true,
                        timeZone: 'America/New_York'
                      })
                      : "N/A"
                    }
                  </div>
                  <div className="admin-report-card-preview">Click to view full report</div>
                  <div>Cohort: {report.user_cohort || 'N/A'}</div>
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
          {/* Download PDF button for selected report */}
          <button
            className="download-pdf-btn"
            style={{ marginLeft: 12, marginBottom: 16 }}
            onClick={() => downloadReportPDF(selectedReport)}
          >
            Download PDF
          </button>
          <div className="admin-report-detail-date">
            Report sent on:
            {selectedReport.created_time
              ? new Date(selectedReport.created_time).toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                timeZone: 'America/New_York'
              })
              : "N/A"}
            {" at "}
            {selectedReport.created_time
              ? new Date(selectedReport.created_time).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
                timeZone: 'America/New_York'
              })
              : "N/A"}
          </div>
          <div className="admin-report-meta">
            <div><strong>User Name:</strong> {selectedReport.student_name || "N/A"}</div>
            <div><strong>Manager Name:</strong> {selectedReport.manager_name || "N/A"}</div>
            <div><strong>Manager Email:</strong> {selectedReport.manager_email || "N/A"}</div>
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
                ? selectedReport.answers.screenshots.map((s, i) => <li key={i}><a href={s} target="_blank" rel="noopener noreferrer">Screenshot {i + 1}</a></li>)
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