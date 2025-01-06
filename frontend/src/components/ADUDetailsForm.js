import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ADUDetailsForm.css';
import './Error.css';
import { FaArrowRight, FaHome, FaUsers, FaCompressArrowsAlt, FaBuilding, FaWarehouse } from 'react-icons/fa';  // Import React Icons for fields

const ADUDetailsForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    property_id: localStorage.getItem('property_id'),
    adu_type: '',
    adu_count: '',
    adu_max_sqft: '',
    jadu_count: '', // New field
    jadu_max_sqf: '' // New field
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.adu_type) newErrors.adu_type = 'ADU Type is required.';
    if (!formData.adu_count) newErrors.adu_count = 'Number of ADUs is required.';
    if (!formData.adu_max_sqft) newErrors.adu_max_sqft = 'Max ADU Size is required.';
    if (!formData.jadu_count) newErrors.jadu_count = 'Number of JADUs is required.'; // New validation
    if (!formData.jadu_max_sqf) newErrors.jadu_max_sqf = 'Max JADU Size is required.'; // New validation
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    axios.post(`${process.env.REACT_APP_NODE_API_URL}/api/adu-details`, formData)
      .then(response => {
        console.log(response.data);
        navigate('/parking-requirements');
      })
      .catch(error => {
        console.error('Error submitting ADU details data:', error);
      });
  };

  return (
    <div className="adu-form-container">
      <h2 className="adu-form-title">ADU Details</h2>
      <form onSubmit={(e) => e.preventDefault()} className="adu-property-form">
        {/* ADU Type Field */}
        <div className="adu-form-group">
          <label htmlFor="adu_type" className="adu-form-label">ADU Type <span className="red-asterisk">*</span></label>
          <div className="adu-input-container">
            <FaHome className="adu-input-icon" />
            <select
              name="adu_type"
              id="adu_type"
              value={formData.adu_type}
              onChange={handleChange}
              className="adu-input-field"
            >
              <option value="">Select ADU Type</option>
              <option value="Attached">Attached</option>
              <option value="Detached">Detached</option>
            </select>
          </div>
          {errors.adu_type && <span className="adu-error-text">{errors.adu_type}</span>}
        </div>

        {/* ADU Count Field */}
        <div className="adu-form-group">
          <label htmlFor="adu_count" className="adu-form-label">Number of ADUs <span className="red-asterisk">*</span></label>
          <div className="adu-input-container">
            <FaUsers className="adu-input-icon" />
            <input
              type="number"
              name="adu_count"
              id="adu_count"
              value={formData.adu_count}
              onChange={handleChange}
              placeholder="Number of ADUs"
              className="adu-input-field"
            />
          </div>
          {errors.adu_count && <span className="adu-error-text">{errors.adu_count}</span>}
        </div>

        {/* Max ADU Size Field */}
        <div className="adu-form-group">
          <label htmlFor="adu_max_sqft" className="adu-form-label">Max ADU Size (sqft) <span className="red-asterisk">*</span></label>
          <div className="adu-input-container">
            <FaCompressArrowsAlt className="adu-input-icon" />
            <input
              type="number"
              name="adu_max_sqft"
              id="adu_max_sqft"
              value={formData.adu_max_sqft}
              onChange={handleChange}
              placeholder="Max ADU Size (sqft)"
              className="adu-input-field"
            />
          </div>
          {errors.adu_max_sqft && <span className="adu-error-text">{errors.adu_max_sqft}</span>}
        </div>

        {/* JADU Count Field */}
        <div className="adu-form-group">
          <label htmlFor="jadu_count" className="adu-form-label">Number of JADUs <span className="red-asterisk">*</span></label>
          <div className="adu-input-container">
            <FaBuilding className="adu-input-icon" />
            <input
              type="number"
              name="jadu_count" // New field
              id="jadu_count"
              value={formData.jadu_count}
              onChange={handleChange}
              placeholder="Number of JADUs"
              className="adu-input-field"
            />
          </div>
          {errors.jadu_count && <span className="adu-error-text">{errors.jadu_count}</span>}
        </div>

        {/* Max JADU Size Field */}
        <div className="adu-form-group">
          <label htmlFor="jadu_max_sqf" className="adu-form-label">Max JADU Size (sqft) <span className="red-asterisk">*</span></label>
          <div className="adu-input-container">
            <FaWarehouse className="adu-input-icon" />
            <input
              type="number"
              name="jadu_max_sqf" // New field
              id="jadu_max_sqf"
              value={formData.jadu_max_sqf}
              onChange={handleChange}
              placeholder="Max JADU Size (sqft)"
              className="adu-input-field"
            />
          </div>
          {errors.jadu_max_sqf && <span className="adu-error-text">{errors.jadu_max_sqf}</span>}
        </div>

        <button type="button" onClick={handleSubmit} className="adu-submit-button">
          <FaArrowRight style={{ marginRight: '8px' }} />  {/* Right arrow icon */}
          Next
        </button>
      </form>
    </div>
  );
};

export default ADUDetailsForm;
