import React from 'react';
import PropTypes from 'prop-types';

const DashboardHeader = ({ user }) => (
  <header className="dashboard-header">
    <h1>Welcome back, <span className="text-orange">{user.name}</span>!</h1>
    <p className="subtitle">Engineering Dashboard</p>
  </header>
);

DashboardHeader.propTypes = {
  user: PropTypes.object.isRequired
};

export default DashboardHeader;
