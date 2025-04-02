import React from 'react';
import AdminDashboard from './components/Admin';
import UserDashboard from './components/User';
import JuniorEngineer from './components/JuniorEngineer';

const App = () => {

  const renderDashboard = () => {
    switch(dummyUser.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'jeng':
        return <JuniorEngineer />;
      default:
        return <UserDashboard />;
    }
  };

  return (
    <div className="app-container">
      {renderDashboard()}
    </div>
  );
};

export default App;
