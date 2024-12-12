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
    parking_spaces: '',
    eligible_for_bonus: false, // New field with default value
    bonus_type: '', // New field
    bonus_percentage: '' // New field
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateForm = () => {
    if (!formData.parking_spaces) {
      toast.error('Parking Spaces is a required field.');
      return false;
    }

    if (formData.eligible_for_bonus && (!formData.bonus_type || !formData.bonus_percentage)) {
      toast.error('If eligible for bonus, both Bonus Type and Bonus Percentage are required.');
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
        <div className="form-group">
          <label htmlFor="parking_spaces" className="input-label">Parking Spaces</label>
          <input
            type="number"
            name="parking_spaces"
            id="parking_spaces"
            value={formData.parking_spaces}
            onChange={handleChange}
            placeholder="Parking Spaces"
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="eligible_for_bonus"
              checked={formData.eligible_for_bonus}
              onChange={handleChange}
              id="eligible_for_bonus"
            />
            Eligible for Bonus
          </label>
        </div>

        {formData.eligible_for_bonus && (
          <>
            <div className="form-group">
              <label htmlFor="bonus_type" className="input-label">Bonus Type</label>
              <input
                type="text"
                name="bonus_type"
                id="bonus_type"
                value={formData.bonus_type}
                onChange={handleChange}
                placeholder="Bonus Type (e.g., Very Low Income, Senior Housing)"
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label htmlFor="bonus_percentage" className="input-label">Bonus Percentage (%)</label>
              <input
                type="number"
                name="bonus_percentage"
                id="bonus_percentage"
                value={formData.bonus_percentage}
                onChange={handleChange}
                placeholder="Bonus Percentage (%)"
                className="input-field"
              />
            </div>
          </>
        )}

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
