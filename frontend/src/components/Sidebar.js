import React from 'react';
import './Sidebar.css'; // Create this CSS file for styling

const Sidebar = ({ onMenuClick }) => {
  return (
    <div className="sidebar">
      <h3>Admin Dashboard</h3>
      <ul className="menu">
        <li onClick={() => onMenuClick('userRegistration')}>Add New User</li>
        <li onClick={() => onMenuClick('allUsers')}>All Users</li>
        <li onClick={() => onMenuClick('architecturalPlan')}>Architectural Plan</li>
        <li onClick={() => onMenuClick('mepInformation')}>MEP Information</li>
        <li onClick={() => onMenuClick('viewAutoCADDesign')}>View AutoCAD Design</li>
        <li onClick={() => onMenuClick('logout')}>Logout</li>
      </ul>
    </div>
  );
};

export default Sidebar;
