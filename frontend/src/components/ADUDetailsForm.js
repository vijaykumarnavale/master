import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ZoningDataForm.css';
import './Error.css';

const ADUDetailsForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    property_id: localStorage.getItem('property_id'),
    adu_type: '',
    adu_count: '',
    adu_max_sqft: ''
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    axios.post('http://localhost:5000/api/adu-details', formData)
      .then(response => {
        console.log(response.data);
        navigate('/parking-requirements');
      })
      .catch(error => {
        console.error('Error submitting ADU details data:', error);
      });
  };

  return (
    <div className="form-container">
      <h2 className="form-title">ADU Details</h2>
      <form onSubmit={(e) => e.preventDefault()} className="property-form">
        <div className="form-group">
          <select
            name="adu_type"
            value={formData.adu_type}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Select ADU Type</option>
            <option value="Attached">Attached</option>
            <option value="Detached">Detached</option>
          </select>
          {errors.adu_type && <span className="error-text">{errors.adu_type}</span>}
        </div>
        <div className="form-group">
          <input
            type="number"
            name="adu_count"
            value={formData.adu_count}
            onChange={handleChange}
            placeholder="Number of ADUs"
            className="input-field"
          />
          {errors.adu_count && <span className="error-text">{errors.adu_count}</span>}
        </div>
        <div className="form-group">
          <input
            type="number"
            name="adu_max_sqft"
            value={formData.adu_max_sqft}
            onChange={handleChange}
            placeholder="Max ADU Size (sqft)"
            className="input-field"
          />
          {errors.adu_max_sqft && <span className="error-text">{errors.adu_max_sqft}</span>}
        </div>
        <button type="button" onClick={handleSubmit} className="submit-button">
          Next
        </button>
      </form>
    </div>
  );
};

export default ADUDetailsForm;
