import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './UserSidebar';
import { toast, ToastContainer } from 'react-toastify'; // Importing Toastify components
import 'react-toastify/dist/ReactToastify.css'; // Importing Toastify styles
import Properties from './PropertiesForm';
import ViewRules from './ViewRules'; // Importing ViewRules component
import UserSearch from './UserSearch';
import ZoningRules from './ZoningRules';

const Dashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState('');
  const navigate = useNavigate();

  // Handle the selection of a menu item
  const handleMenuClick = (menu) => {
    setSelectedMenu(menu); // Set the selected menu
    if (menu === 'logout') {
      handleLogout(); // If logout is clicked, handle logout
    }
  };

  // Logout logic
  const handleLogout = () => {
    // Clear user session
    localStorage.removeItem('authToken');
    
    // Display toast notification
    toast.success('You have been logged out successfully.');

    // Redirect to login page after a short delay (optional, to allow the toast to appear)
    setTimeout(() => {
      navigate('/login');
    }, 2000); // Adjust the timeout as needed (in ms)
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar component for menu */}
      <Sidebar onMenuClick={handleMenuClick} />

      <div style={{ flex: 1, padding: '20px' }}>
        {/* If no menu is selected, display a welcome message */}
        {!selectedMenu && <UserSearch />}

        {/* Render the selected component based on the selected menu */}
        {selectedMenu === 'zoningData' && <Properties />}
        {selectedMenu === 'viewRules' && <ViewRules />} {/* ViewRules component */}
        {selectedMenu === 'zoningRules' && <ZoningRules />} {/* New Zoning Rules page */}
      </div>

      {/* Toastify container to display toast messages */}
      <ToastContainer />
    </div>
  );
};
export default Dashboard;
