import React from 'react';
import PropTypes from 'prop-types';

const ComplaintsTable = ({ complaints }) => (
  <table className="admin-table">
    <thead>
      <tr>
        <th>Complaint ID</th>
        <th>Customer</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {complaints.length > 0 ? (
        complaints.map(complaint => (
          <tr key={complaint._id}>
            <td>#{complaint._id}</td>
            <td>{complaint.name}</td>
            <td>
              <span className={`status-badge ${complaint.status.toLowerCase()}`}>
                {complaint.status}
              </span>
            </td>
            <td>
              <button className="btn btn-sm btn-primary">
                View Details
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="4">No complaints found</td>
        </tr>
      )}
    </tbody>
  </table>
);

ComplaintsTable.propTypes = {
  complaints: PropTypes.array.isRequired
};

export default ComplaintsTable;
