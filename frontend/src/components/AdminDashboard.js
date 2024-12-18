import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Signup from '../pages/Signup';
import AllUsers from './AllUsers'; 
import Popup from './Popup';
import ArchitecturalPlan from './ArchitecturalPlan'; 
import MEPInformation from './MEPInformation'; 
import ViewAutoCADDesign from './ViewAutoCADDesign'; 
// import RulesAndRegulations from './RulesAndRegulations'; 
import AddRule from './AddRule'; 
import ViewRules from './ViewRules'; 
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import Search from './Search';

const Dashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState('');
  const [showPopup, setShowPopup] = useState(false); 
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
    localStorage.removeItem('authToken');
    setShowPopup(true);
    toast.success('You have been logged out successfully.'); 
  };

  const closePopup = () => {
    setShowPopup(false);
    navigate('/login'); 
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
        {!selectedMenu && !showPopup && (
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
