import React from 'react';
import './Sidebar.css'; // Create this CSS file for styling

const Sidebar = ({ onMenuClick }) => {
  return (
    <div className="sidebar">
      <h3>User Dashboard</h3>
      <ul className="menu">
      <li onClick={() => onMenuClick('zoningData')}>Zoning Data</li> {/* New Menu Item */}
        <li onClick={() => onMenuClick('logout')}>Logout</li>
      </ul>
    </div>
  );
};

export default Sidebar;
