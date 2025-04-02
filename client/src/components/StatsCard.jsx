import React from 'react';
import PropTypes from 'prop-types';

const StatsCard = ({ icon, count, label, variant }) => (
  <div className={`stat-card ${variant}`}>
    <div className={`stat-icon ${variant}`}>
      <i className={`fas fa-${icon}`}></i>
    </div>
    <div className="stat-info">
      <h3>{count}</h3>
      <p>{label}</p>
    </div>
  </div>
);

StatsCard.propTypes = {
  icon: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['pending', 'in-progress', 'resolved'])
};

export default StatsCard;
