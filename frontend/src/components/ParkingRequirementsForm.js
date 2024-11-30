import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify components
import 'react-toastify/dist/ReactToastify.css'; // Import the Toastify CSS
import './ZoningDataForm.css'; // Reuse the same CSS file for styling
import './Error.css';

const ParkingRequirementsForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    property_id: localStorage.getItem('property_id'), // assuming this value is set earlier
    parking_spaces: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.parking_spaces) {
      toast.error('Parking Spaces is a required field.');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    setIsSubmitting(true); // Disable button when submitting
    axios.post('http://localhost:5000/api/parking-requirements', formData)
      .then(response => {
        toast.success('Form submitted successfully!');
        // Redirect to dashboard after a 5-second delay
        setTimeout(() => {
          navigate('/user-dashboard');
        }, 4000); // 4000ms = 4 seconds
      })
      .catch(error => {
        toast.error('Error submitting the form. Please try again.');
      })
      .finally(() => {
        setIsSubmitting(false); // Re-enable button after submission
      });
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Parking Requirements Details</h2>
      <form onSubmit={(e) => e.preventDefault()} className="property-form">
        <input
          type="number"
          name="parking_spaces"
          value={formData.parking_spaces}
          onChange={handleChange}
          placeholder="Parking Spaces"
          className="input-field"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="submit-button"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      {/* Add the ToastContainer to display the toast messages */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default ParkingRequirementsForm;
