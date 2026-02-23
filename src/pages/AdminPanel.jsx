import React, { useState, useEffect } from 'react';
import { clearAnalytics, getUsageAnalyticsSummary } from '../utils/analytics';
import './AdminPanel.css';

function AdminPanel() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    completedAssessments: 0,
    activeToday: 0,
    signInsToday: 0,
    pageViewsToday: 0
  });
  const [analytics, setAnalytics] = useState({
    totalEvents: 0,
    assessmentsCompletedToday: 0,
    topPage: 'N/A',
    topAssessment: 'N/A',
    recentEvents: []
  });
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const usersData = JSON.parse(localStorage.getItem('users') || '[]');
    const analyticsSummary = getUsageAnalyticsSummary();
    
    setUsers(usersData);
    setStats({
      totalUsers: usersData.length,
      completedAssessments: analyticsSummary.totalAssessmentCompletions,
      activeToday: analyticsSummary.activeUsersToday,
      signInsToday: analyticsSummary.signInsToday,
      pageViewsToday: analyticsSummary.pageViewsToday
    });
    setAnalytics({
      totalEvents: analyticsSummary.totalEvents,
      assessmentsCompletedToday: analyticsSummary.assessmentsCompletedToday,
      topPage: analyticsSummary.topPage,
      topAssessment: analyticsSummary.topAssessment,
      recentEvents: analyticsSummary.recentEvents
    });
  };

  const handleDeleteUser = (email) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter(u => u.email !== email);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      loadData();
    }
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all user data? This cannot be undone!')) {
      localStorage.removeItem('users');
      localStorage.removeItem('assessmentResults');
      localStorage.removeItem('assessmentHistory');
      clearAnalytics();
      setUsers([]);
      loadData();
      alert('All user and analytics data has been cleared!');
    }
  };

  const formatEventType = (eventType) => {
    return eventType
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="admin-page">
      <div className="page-header admin-header">
        <h1>Admin Panel</h1>
        <p>Manage assessments, users, and career recommendations</p>
      </div>

      <div className="container">
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>Total Users</h3>
              <p className="stat-number">{stats.totalUsers}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>Completed Assessments</h3>
              <p className="stat-number">{stats.completedAssessments}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-info">
              <h3>Active Today</h3>
              <p className="stat-number">{stats.activeToday}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🔐</div>
            <div className="stat-info">
              <h3>Sign-ins Today</h3>
              <p className="stat-number">{stats.signInsToday}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👁️</div>
            <div className="stat-info">
              <h3>Page Views Today</h3>
              <p className="stat-number">{stats.pageViewsToday}</p>
            </div>
          </div>
        </div>

        <div className="admin-tabs">
          <button
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button
            className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
          <button
            className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </div>

        <div className="admin-content">
          {activeTab === 'overview' && (
            <div className="overview-section">
              <div className="info-card">
                <h2>📊 System Overview</h2>
                <p>Welcome to the Career Gateway Admin Panel. Here you can manage users, assessments, and system settings.</p>
                
                <div className="quick-actions">
                  <h3>Quick Actions</h3>
                  <div className="actions-grid">
                    <button className="action-btn" onClick={() => setActiveTab('users')}>
                      <span className="action-icon">👥</span>
                      <span>View Users</span>
                    </button>
                    <button className="action-btn" onClick={loadData}>
                      <span className="action-icon">🔄</span>
                      <span>Refresh Data</span>
                    </button>
                    <button className="action-btn" onClick={() => setActiveTab('settings')}>
                      <span className="action-icon">⚙️</span>
                      <span>Settings</span>
                    </button>
                    <button className="action-btn" onClick={() => setActiveTab('analytics')}>
                      <span className="action-icon">📊</span>
                      <span>Usage Analytics</span>
                    </button>
                  </div>
                </div>

                <div className="analytics-overview-grid">
                  <div className="mini-metric-card">
                    <h4>Top Page</h4>
                    <p>{analytics.topPage}</p>
                  </div>
                  <div className="mini-metric-card">
                    <h4>Top Assessment</h4>
                    <p>{analytics.topAssessment}</p>
                  </div>
                  <div className="mini-metric-card">
                    <h4>Events Captured</h4>
                    <p>{analytics.totalEvents}</p>
                  </div>
                  <div className="mini-metric-card">
                    <h4>Completed Today</h4>
                    <p>{analytics.assessmentsCompletedToday}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="users-section">
              <div className="section-header">
                <h2>Registered Users</h2>
                <button className="btn btn-secondary" onClick={loadData}>
                  Refresh
                </button>
              </div>
              
              {users.length === 0 ? (
                <div className="empty-state">
                  <p>No users registered yet</p>
                </div>
              ) : (
                <div className="users-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Education</th>
                        <th>Phone</th>
                        <th>Registered</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <tr key={index}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.education}</td>
                          <td>{user.phone || 'N/A'}</td>
                          <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                          <td>
                            <button 
                              className="delete-btn"
                              onClick={() => handleDeleteUser(user.email)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-section">
              <h2>System Settings</h2>
              
              <div className="settings-card">
                <h3>⚠️ Danger Zone</h3>
                <p>These actions are irreversible. Please be careful.</p>
                <button className="btn btn-danger" onClick={clearAllData}>
                  Clear All User Data
                </button>
              </div>

              <div className="settings-card">
                <h3>📝 Assessment Management</h3>
                <p>Manage assessment questions and categories</p>
                <button className="btn btn-secondary">
                  Edit Questions (Coming Soon)
                </button>
              </div>

              <div className="settings-card">
                <h3>💼 Career Database</h3>
                <p>Add or modify career information</p>
                <button className="btn btn-secondary">
                  Manage Careers (Coming Soon)
                </button>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="analytics-section">
              <div className="section-header">
                <h2>Usage Performance</h2>
                <button className="btn btn-secondary" onClick={loadData}>
                  Refresh
                </button>
              </div>

              <div className="analytics-overview-grid">
                <div className="mini-metric-card">
                  <h4>Total Events</h4>
                  <p>{analytics.totalEvents}</p>
                </div>
                <div className="mini-metric-card">
                  <h4>Sign-ins Today</h4>
                  <p>{stats.signInsToday}</p>
                </div>
                <div className="mini-metric-card">
                  <h4>Page Views Today</h4>
                  <p>{stats.pageViewsToday}</p>
                </div>
                <div className="mini-metric-card">
                  <h4>Assessments Completed Today</h4>
                  <p>{analytics.assessmentsCompletedToday}</p>
                </div>
              </div>

              <div className="analytics-details-grid">
                <div className="analytics-card">
                  <h3>Most Visited Page</h3>
                  <p>{analytics.topPage}</p>
                </div>
                <div className="analytics-card">
                  <h3>Most Completed Assessment</h3>
                  <p>{analytics.topAssessment}</p>
                </div>
              </div>

              <div className="analytics-card">
                <h3>Recent Activity Log</h3>
                {analytics.recentEvents.length === 0 ? (
                  <p className="analytics-empty">No activity captured yet.</p>
                ) : (
                  <div className="activity-log-list">
                    {analytics.recentEvents.map((event) => (
                      <div key={event.id} className="activity-log-item">
                        <div>
                          <p className="activity-event-type">{formatEventType(event.type)}</p>
                          <p className="activity-event-meta">
                            User: {event.userEmail || 'guest'}
                            {event.path ? ` • Path: ${event.path}` : ''}
                            {event.assessmentType ? ` • Assessment: ${event.assessmentType}` : ''}
                          </p>
                        </div>
                        <span className="activity-time">{new Date(event.timestamp).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;