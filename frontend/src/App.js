import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import 'font-awesome/css/font-awesome.min.css';


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
import JADUDetailsForm from './components/JADUDetailsForm';
import ParkingRequirementsForm from './components/ParkingRequirementsForm';
import PropertyDetails from './components/PropertyDetails';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import About from './components/About';
import UserPropertyDetails from './components/UserPropertyDetails';

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
        <Route path="/jadu-details" element={<JADUDetailsForm />} />
        <Route path="/parking-requirements" element={<ParkingRequirementsForm />} />
        <Route path="/property-details" element={<PropertyDetails />} />
        <Route path="/user-property-details" element={<UserPropertyDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
