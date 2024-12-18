import React from 'react';
import './Sidebar.css'; // Ensure this CSS file styles your sidebar

const Sidebar = ({ onMenuClick }) => {
  return (
    <div className="sidebar">
      <h3>User Dashboard</h3>
      <ul className="menu">
        <li onClick={() => onMenuClick('zoningData')}>Zoning Data</li> {/* New Menu Item */}
        <li onClick={() => onMenuClick('viewRules')}>View Rules</li> {/* View Rules Menu Item */}
        <li onClick={() => onMenuClick('logout')}>Logout</li>
      </ul>
    </div>
  );
};

export default Sidebar;
