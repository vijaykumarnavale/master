import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import AdminDashboard from './components/AdminDashboard';
import Home from './components/Home';
import Navbar from './components/Navbar';
import UserDashboard from './components/UserDashboard';
import Login from './pages/Login';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Signup from './pages/Signup';

import PropertiesForm from './components/PropertiesForm';
import SetbacksForm from './components/SetbacksForm';
import PermittedUsesForm from './components/PermittedUsesForm';
import ADUDetailsForm from './components/ADUDetailsForm';
import ParkingRequirementsForm from './components/ParkingRequirementsForm';
import PropertyDetails from './components/PropertyDetails';

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/properties" element={<PropertiesForm />} />
        <Route path="/setbacks" element={<SetbacksForm />} />
        <Route path="/permitted-uses" element={<PermittedUsesForm />} />
        <Route path="/adu-details" element={<ADUDetailsForm />} />
        <Route path="/parking-requirements" element={<ParkingRequirementsForm />} />
        <Route path="/property-details" element={<PropertyDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
