import React from 'react';
import PropTypes from 'prop-types';

const UserDashboard = ({ user }) => {
  return (
    <div className="user-home">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome, <span className="text-orange">{user.name}</span>!</h1>
          <p className="hero-text">
            {complaints.length > 0 
              ? 'Here are your recent complaints' 
              : 'You have no active complaints'}
          </p>
          <button className="btn btn-primary">
            <i className="fas fa-plus-circle"></i> New Complaint
          </button>
        </div>
      </div>

      {complaints.length > 0 ? (
        <div className="complaints-list">
          <h2>Your Complaints</h2>
          {complaints.map(complaint => (
            <div key={complaint._id} className="complaint-item">
              <div className="complaint-header">
                <span className="complaint-id">#{complaint._id}</span>
                <span className="complaint-date">
                  {complaint.createdAt.toLocaleDateString()}
                </span>
              </div>
              <p className="complaint-desc">{complaint.desc}</p>
              <div className="complaint-footer">
                <span className={`status-badge ${complaint.status.toLowerCase()}`}>
                  {complaint.status}
                </span>
                <button className="btn btn-outline">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <i className="far fa-clipboard"></i>
          </div>
          <h3>No Complaints Yet</h3>
          <button className="btn btn-primary">
            Create Your First Complaint
          </button>
        </div>
      )}
    </div>
  );
};

UserDashboard.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired
  }).isRequired
};

export default UserDashboard;
