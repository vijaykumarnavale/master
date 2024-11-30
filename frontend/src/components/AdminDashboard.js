import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Signup from '../pages/Signup';
import AllUsers from './AllUsers'; // Import All Users component
import Popup from './Popup';
import ArchitecturalPlan from './ArchitecturalPlan'; // Import Architectural Plan component
import MEPInformation from './MEPInformation'; // Import MEP Information component
import ViewAutoCADDesign from './ViewAutoCADDesign'; // Import View AutoCAD Design component
import { ToastContainer, toast } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the default styles for Toastify
import Search from './Search';

const Dashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState('');
  const [showPopup, setShowPopup] = useState(false); // Track popup visibility
  const navigate = useNavigate();

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
    if (menu === 'logout') {
      handleLogout();
    }
  };

  const handleLogout = () => {
    // Clear user session
    localStorage.removeItem('authToken');
    // Show the popup
    setShowPopup(true);
    // Display the toast notification
    toast.success('You have been logged out successfully.'); // Success message on logout
  };

  const closePopup = () => {
    setShowPopup(false);
    navigate('/login'); // Redirect to login page
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar onMenuClick={handleMenuClick} />
      <div style={{ flex: 1, padding: '20px' }}>
        {showPopup && (
          <Popup
            message="You have been logged out successfully."
            onClose={closePopup}
          />
        )}
        {selectedMenu === 'userRegistration' && <Signup />}
        {selectedMenu === 'allUsers' && <AllUsers />} {/* Render All Users */}
        {selectedMenu === 'architecturalPlan' && <ArchitecturalPlan />} {/* Architectural Plan */}
        {selectedMenu === 'mepInformation' && <MEPInformation />} {/* MEP Information */}
        {selectedMenu === 'viewAutoCADDesign' && <ViewAutoCADDesign />} {/* View AutoCAD Design */}
        {!selectedMenu && !showPopup && <><h1>Welcome to the Dashboard</h1><Search/></>}
      </div>

      {/* ToastContainer to display the toast messages */}
      <ToastContainer />
    </div>
  );
};

export default Dashboard;
