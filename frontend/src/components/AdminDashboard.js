import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Signup from '../pages/Signup';
import AllUsers from './AllUsers'; 
import ArchitecturalPlan from './ArchitecturalPlan'; 
import MEPInformation from './MEPInformation'; 
import ViewAutoCADDesign from './ViewAutoCADDesign'; 
import AddRule from './AddRule'; 
import ViewRules from './ViewRules'; 
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import Search from './Search';

const Dashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState('');
  const navigate = useNavigate();

  const handleMenuClick = (menu) => {
    if (menu === 'rulesAndRegulations') {
      setSelectedMenu(menu);
    } else if (menu === 'logout') {
      handleLogout();
    } else {
      setSelectedMenu(menu);
    }
  };

  const handleLogout = () => {
    // Remove auth token from localStorage
    localStorage.removeItem('authToken');

    // Show success toast
    toast.success('You have been logged out successfully.');

    // Redirect to login page after a short delay to allow toast message to appear
    setTimeout(() => {
      navigate('/login'); // Redirecting to login
    }, 2000); // 2 seconds delay to show the success toast
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar onMenuClick={handleMenuClick} />
      <div style={{ flex: 1, padding: '20px' }}>
        {/* Conditional rendering for selected menu */}
        {selectedMenu === 'userRegistration' && <Signup />}
        {selectedMenu === 'allUsers' && <AllUsers />} 
        {selectedMenu === 'architecturalPlan' && <ArchitecturalPlan />} 
        {selectedMenu === 'mepInformation' && <MEPInformation />} 
        {selectedMenu === 'viewAutoCADDesign' && <ViewAutoCADDesign />} 
        {selectedMenu === 'rulesAndRegulations' && (
          <div>
            <h2>Rules and Regulations</h2>
            <ul className="submenu">
              <li onClick={() => setSelectedMenu('addRule')}>Add Rule</li>
              <li onClick={() => setSelectedMenu('viewRules')}>View Rules</li>
            </ul>
          </div>
        )}
        {selectedMenu === 'addRule' && <AddRule />} 
        {selectedMenu === 'viewRules' && <ViewRules />} 
        {!selectedMenu && (
          <>
            <h1>Welcome to the Dashboard</h1>
            <Search />
          </>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default Dashboard;
