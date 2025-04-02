import React from 'react';
import PropTypes from 'prop-types';

const AdminDashboard = ({ user }) => {
  const stats = [
    { icon: 'clock', count: 8, label: 'Pending', variant: 'pending' },
    { icon: 'tools', count: 15, label: 'In Progress', variant: 'in-progress' },
    { icon: 'check-circle', count: 32, label: 'Resolved', variant: 'resolved' },
    { icon: 'users-cog', count: 5, label: 'Engineers', variant: 'engineers' }
  ];

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>
          <i className="fas fa-user-shield"></i> Admin Dashboard
        </h1>
        <p className="admin-subtitle">Welcome back, {user.name}</p>
      </header>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className={`stat-icon ${stat.variant}`}>
              <i className={`fas fa-${stat.icon}`}></i>
            </div>
            <div className="stat-info">
              <h3>{stat.count}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <div className="card-header">
          <h2><i className="fas fa-list"></i> All Complaints</h2>
          <div className="table-controls">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="Search complaints..." />
            </div>
          </div>
        </div>
        
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Contact</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map(complaint => (
                <tr key={complaint._id}>
                  <td>{complaint._id}</td>
                  <td>{complaint.name}</td>
                  <td>
                    <a href={`tel:${complaint.contact}`} className="contact-link">
                      <i className="fas fa-phone-alt"></i> {complaint.contact}
                    </a>
                  </td>
                  <td className="truncate">{complaint.desc}</td>
                  <td>
                    <span className={`status-badge ${complaint.status.toLowerCase()}`}>
                      {complaint.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

AdminDashboard.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired
  }).isRequired
};

export default AdminDashboard;
