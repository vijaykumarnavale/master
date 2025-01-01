import React from 'react';
import './Sidebar.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import Font Awesome
import { faUserPlus, faUsers, faFile, faCogs, faFileAlt, faClipboard, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; // Import the icons for each menu item

const Sidebar = ({ onMenuClick }) => {
  return (
    <div className="sidebar">
      <h3>Admin Dashboard</h3>
      <ul className="menu">
        <li onClick={() => onMenuClick('userRegistration')} className="menu-item">
          <FontAwesomeIcon icon={faUserPlus} style={{ marginRight: '8px' }} />
          Add New User
        </li>
        <li onClick={() => onMenuClick('allUsers')} className="menu-item">
          <FontAwesomeIcon icon={faUsers} style={{ marginRight: '8px' }} />
          All Users
        </li>
        <li onClick={() => onMenuClick('architecturalPlan')} className="menu-item">
          <FontAwesomeIcon icon={faFile} style={{ marginRight: '8px' }} />
          Architectural Plan
        </li>
        <li onClick={() => onMenuClick('mepInformation')} className="menu-item">
          <FontAwesomeIcon icon={faCogs} style={{ marginRight: '8px' }} />
          MEP Information
        </li>
        <li onClick={() => onMenuClick('viewAutoCADDesign')} className="menu-item">
          <FontAwesomeIcon icon={faFileAlt} style={{ marginRight: '8px' }} />
          View AutoCAD Design
        </li>
        <li onClick={() => onMenuClick('addRule')} className="menu-item">
          <FontAwesomeIcon icon={faClipboard} style={{ marginRight: '8px' }} />
          Rules And Regulations
        </li>
        <li onClick={() => onMenuClick('logout')} className="menu-item logout-item">
          <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '8px' }} />
          Logout
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
