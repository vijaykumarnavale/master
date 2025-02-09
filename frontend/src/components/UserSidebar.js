import React from 'react';
import './Sidebar.css'; // Ensure this CSS file styles your sidebar
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import Font Awesome
import { faMapSigns, faListAlt, faGavel, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; // Import the icons

const Sidebar = ({ onMenuClick }) => {
  return (
    <div className="sidebar">
      <h3>User Dashboard</h3>
      <ul className="menu">
        <li onClick={() => onMenuClick('zoningData')} className="menu-item">
          <FontAwesomeIcon icon={faMapSigns} style={{ marginRight: '8px' }} />
          Data Entry
        </li>
        <li onClick={() => onMenuClick('viewRules')} className="menu-item">
          <FontAwesomeIcon icon={faListAlt} style={{ marginRight: '8px' }} />
          View Rules
        </li>
        <li onClick={() => onMenuClick('zoningRules')} className="menu-item">
          <FontAwesomeIcon icon={faGavel} style={{ marginRight: '8px' }} />
          Zoning Rules
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
