import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './UserSidebar';
import Popup from './Popup'; // Assuming Popup is a modal for logout confirmation
import Properties from './PropertiesForm';

const Dashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState('');
  const [showPopup, setShowPopup] = useState(false); // Track popup visibility
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
    // Show the popup
    setShowPopup(true);
  };

  // Close the popup and redirect to the login page
  const closePopup = () => {
    setShowPopup(false);
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar component for menu */}
      <Sidebar onMenuClick={handleMenuClick} />

      <div style={{ flex: 1, padding: '20px' }}>
        {/* If the user has logged out, show the Popup */}
        {showPopup && (
          <Popup
            message="You have been logged out successfully."
            onClose={closePopup} // Handle the close button in the Popup
          />
        )}

        {/* If no menu is selected and popup is not showing, display a welcome message */}
        {!selectedMenu && !showPopup && <h1>Welcome to the Dashboard</h1>}
        {selectedMenu === 'zoningData' && <Properties />}
      </div>
    </div>
  );
};

export default Dashboard;
