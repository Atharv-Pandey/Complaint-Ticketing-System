import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JuniorEngineer = ({ initialData }) => {
  const [complaints, setComplaints] = useState(initialData.complaints || []);
  const [stats, setStats] = useState({
    assignedCount: initialData.assignedCount || 0,
    inProgressCount: initialData.inProgressCount || 0,
    resolvedCount: initialData.resolvedCount || 0
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // Initialize comment visibility
    complaints.forEach(complaint => {
      const select = document.getElementById(`status-select-${complaint._id}`);
      const commentContainer = document.getElementById(`comment-container-${complaint._id}`);
      if (select && commentContainer) {
        commentContainer.style.display = select.value === 'Rejected' ? 'block' : 'none';
      }
    });
  }, [complaints]);

  const handleStatusChange = async (complaintId, status, comment = '') => {
    try {
      const response = await axios.post('/update-status', {
        complaintId,
        status,
        comment
      });
      
      setMessage({ type: 'success', text: 'Complaint status updated successfully' });
      
      // Update local state
      const updatedComplaints = complaints.map(c => 
        c._id === complaintId ? { ...c, status } : c
      );
      setComplaints(updatedComplaints);
      
      // Update stats
      const newStats = {
        assignedCount: stats.assignedCount,
        inProgressCount: updatedComplaints.filter(c => c.status === 'In Progress').length,
        resolvedCount: updatedComplaints.filter(c => c.status === 'Resolved').length
      };
      setStats(newStats);

    } catch (error) {
      setMessage({ type: 'error', text: 'Error updating complaint status' });
    }
  };

  return (
    <div className="container">
      {/* Flash Message */}
      {message && (
        <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'}`}>
          {message.text}
        </div>
      )}

      {/* Greeting Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome back, <span className="text-orange">{initialData.user.name}</span>!</h1>
          <p className="hero-text">Here's your current workload overview</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid" style={{ marginBottom: 'var(--space-xl)' }}>
        <StatCard 
          icon="clipboard-list" 
          count={stats.assignedCount} 
          label="Assigned Complaints" 
          type="pending"
        />
        <StatCard 
          icon="tools" 
          count={stats.inProgressCount} 
          label="In Progress" 
          type="in-progress"
        />
        <StatCard 
          icon="check-circle" 
          count={stats.resolvedCount} 
          label="Resolved" 
          type="resolved"
        />
      </div>

      {/* Complaints Table */}
      <div className="admin-card">
        <div className="card-header">
          <h2><i className="fas fa-list"></i> Your Assigned Complaints</h2>
        </div>
        <div className="table-responsive">
          <ComplaintsTable 
            complaints={complaints} 
            onStatusChange={handleStatusChange} 
          />
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, count, label, type }) => (
  <div className={`stat-card ${type}`}>
    <div className={`stat-icon ${type}`}>
      <i className={`fas fa-${icon}`}></i>
    </div>
    <div className="stat-info">
      <h3>{count}</h3>
      <p>{label}</p>
    </div>
  </div>
);

// Complaints Table Component
const ComplaintsTable = ({ complaints, onStatusChange }) => {
  const handleChange = (complaintId, e) => {
    const status = e.target.value;
    const comment = e.target.form.querySelector('input[name="comment"]')?.value || '';
    onStatusChange(complaintId, status, comment);
  };

  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Complaint ID</th>
          <th>Customer</th>
          <th>Contact</th>
          <th>Description</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {complaints.length > 0 ? (
          complaints.map(complaint => (
            <ComplaintRow 
              key={complaint._id} 
              complaint={complaint} 
              onChange={handleChange} 
            />
          ))
        ) : (
          <tr>
            <td colSpan="6" className="text-center">No complaints assigned to you</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

// Complaint Row Component
const ComplaintRow = ({ complaint, onChange }) => {
  const [showComment, setShowComment] = useState(complaint.status === 'Rejected');

  return (
    <tr>
      <td className="complaint-id">#{complaint._id}</td>
      <td>{complaint.name}</td>
      <td>
        <a href={`tel:${complaint.contact}`} className="contact-link">
          <i className="fas fa-phone-alt"></i> {complaint.contact}
        </a>
      </td>
      <td className="truncate">{complaint.desc.substring(0, 40)}{complaint.desc.length > 40 ? '...' : ''}</td>
      <td>
        <span className={`status-badge ${complaint.status.toLowerCase()}`}>
          {complaint.status}
        </span>
      </td>
      <td className="actions">
        <form className="status-form">
          <input type="hidden" name="complaintId" value={complaint._id} />
          <div className="form-group">
            <select 
              name="status" 
              className="form-control"
              defaultValue={complaint.status}
              onChange={(e) => {
                setShowComment(e.target.value === 'Rejected');
                onChange(complaint._id, e);
              }}
            >
              <option value="Submitted">Submitted</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
            {showComment && (
              <div className="mt-2">
                <input 
                  type="text" 
                  name="comment" 
                  className="form-control" 
                  placeholder="Reason for rejection"
                  required
                />
              </div>
            )}
          </div>
          <button type="submit" className="btn btn-primary btn-sm mt-2">
            <i className="fas fa-save"></i> Update
          </button>
        </form>
      </td>
    </tr>
  );
};

export default JuniorEngineer;
