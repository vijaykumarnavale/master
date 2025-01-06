import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SetbacksForm.css';
import './Error.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import Font Awesome
import { faArrowRight, faRuler } from '@fortawesome/free-solid-svg-icons'; // Import icons

const SetbacksForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    property_id: localStorage.getItem('property_id'),
    front_ft: '',
    back_ft: '',
    side_ft: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.front_ft) newErrors.front_ft = 'Front setback is required.';
    if (!formData.back_ft) newErrors.back_ft = 'Back setback is required.';
    if (!formData.side_ft) newErrors.side_ft = 'Side setback is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    setIsSubmitting(true); // Disable the submit button when submitting

    // Use the URL from the .env file
    const apiUrl = process.env.REACT_APP_NODE_API_URL;

    axios.post(`${apiUrl}/api/setbacks`, formData)
      .then(response => {
        console.log(response.data);
        navigate('/permitted-uses');
      })
      .catch(error => {
        console.error('Error submitting setbacks data:', error);
      })
      .finally(() => {
        setIsSubmitting(false); // Re-enable the button after submission
      });
  };

  return (
    <div className="setbacks-form-container">
      <h2 className="setbacks-form-title">Setbacks Details</h2>
      <form onSubmit={(e) => e.preventDefault()} className="setbacks-property-form">
        {/* Front Setback */}
        <div className="setbacks-form-group">
          <label htmlFor="front_ft" className="setbacks-input-label">
            Front Setback (ft) <span className="red-asterisk">*</span>
          </label>
          <div className="input-icon-container">
            <FontAwesomeIcon icon={faRuler} className="input-icon" />
            <input
              type="number"
              name="front_ft"
              id="front_ft"
              value={formData.front_ft}
              onChange={handleChange}
              className="setbacks-input-field"
            />
          </div>
          {errors.front_ft && <span className="setbacks-error-text">{errors.front_ft}</span>}
        </div>

        {/* Back Setback */}
        <div className="setbacks-form-group">
          <label htmlFor="back_ft" className="setbacks-input-label">
            Back Setback (ft) <span className="red-asterisk">*</span>
          </label>
          <div className="input-icon-container">
            <FontAwesomeIcon icon={faRuler} className="input-icon" />
            <input
              type="number"
              name="back_ft"
              id="back_ft"
              value={formData.back_ft}
              onChange={handleChange}
              className="setbacks-input-field"
            />
          </div>
          {errors.back_ft && <span className="setbacks-error-text">{errors.back_ft}</span>}
        </div>

        {/* Side Setback */}
        <div className="setbacks-form-group">
          <label htmlFor="side_ft" className="setbacks-input-label">
            Side Setback (ft) <span className="red-asterisk">*</span>
          </label>
          <div className="input-icon-container">
            <FontAwesomeIcon icon={faRuler} className="input-icon" />
            <input
              type="number"
              name="side_ft"
              id="side_ft"
              value={formData.side_ft}
              onChange={handleChange}
              className="setbacks-input-field"
            />
          </div>
          {errors.side_ft && <span className="setbacks-error-text">{errors.side_ft}</span>}
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="setbacks-submit-button"
        >
          {isSubmitting ? 'Submitting...' : (
            <>
              Next
              <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: '8px' }} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SetbacksForm;
