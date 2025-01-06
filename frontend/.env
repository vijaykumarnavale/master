import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify components
import 'react-toastify/dist/ReactToastify.css'; // Import the Toastify CSS
import './ParkingRequirementsForm.css'; // Update the CSS file name
import './Error.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import Font Awesome
import { faCheck, faParking, faInfoCircle } from '@fortawesome/free-solid-svg-icons'; // Import required icons

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
    axios.post(`${process.env.REACT_APP_NODE_API_URL}/api/parking-requirements`, formData)
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
    <div className="parking-form-container">
      <h2 className="parking-form-title">Parking Requirements Details</h2>
      <form onSubmit={(e) => e.preventDefault()} className="parking-property-form">
        
        <div className="parking-form-group">
          <label htmlFor="parking_spaces" className="parking-form-label">Parking Spaces <span className="red-asterisk">*</span></label>
          <div className="input-with-icon">
            <FontAwesomeIcon icon={faParking} className="input-icon" />
            <input
              type="number"
              name="parking_spaces"
              id="parking_spaces"
              value={formData.parking_spaces}
              onChange={handleChange}
              placeholder="Parking Spaces"
              className="parking-input-field"
            />
          </div>
        </div>

        <div className="parking-form-group">
          <div className="parking-checkbox-container">
            <input
              type="checkbox"
              name="eligible_for_bonus"
              checked={formData.eligible_for_bonus}
              onChange={handleChange}
              id="eligible_for_bonus"
            />
            <label htmlFor="eligible_for_bonus" className="parking-checkbox-label">Eligible for Bonus</label>
          </div>
        </div>

        {formData.eligible_for_bonus && (
          <>
            <div className="parking-form-group">
              <label htmlFor="bonus_type" className="parking-form-label">Bonus Type <span className="red-asterisk">*</span></label>
              <div className="input-with-icon">
                <FontAwesomeIcon icon={faInfoCircle} className="input-icon" />
                <input
                  type="text"
                  name="bonus_type"
                  id="bonus_type"
                  value={formData.bonus_type}
                  onChange={handleChange}
                  placeholder="Bonus Type (e.g., Very Low Income, Senior Housing)"
                  className="parking-input-field"
                />
              </div>
            </div>

            <div className="parking-form-group">
              <label htmlFor="bonus_percentage" className="parking-form-label">Bonus Percentage (%) <span className="red-asterisk">*</span></label>
              <div className="input-with-icon">
                <FontAwesomeIcon icon={faInfoCircle} className="input-icon" />
                <input
                  type="number"
                  name="bonus_percentage"
                  id="bonus_percentage"
                  value={formData.bonus_percentage}
                  onChange={handleChange}
                  placeholder="Bonus Percentage (%)"
                  className="parking-input-field"
                />
              </div>
            </div>
          </>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="parking-submit-button"
        >
          {isSubmitting ? 'Submitting...' : (
            <>
              Submit
              <FontAwesomeIcon icon={faCheck} style={{ marginLeft: '8px' }} />
            </>
          )}
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
