import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ZoningDataForm.css';
import './Error.css';

const PropertiesForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    address: '',
    apn: '',
    pincode: '',
    zoning: '',
    plot_area_sqft: '',
    height_limit_ft: '',
    depth_ft: '',
    width_ft: '',
    building_sqft: '', // Added field
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      axios.post('http://localhost:5000/api/properties', formData)
        .then(response => {
          console.log(response.data);
          // Store the property_id in localStorage or state for next forms
          localStorage.setItem('property_id', response.data.property_id);
          navigate('/setbacks');
        })
        .catch(error => {
          console.error('There was an error submitting the property data:', error);
        });
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Properties Details</h2>
      <form onSubmit={(e) => e.preventDefault()} className="property-form">
        <div className="form-group">
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            className="input-field"
          />
          {errors.address && <span className="error-text">{errors.address}</span>}
        </div>
        <div className="form-group">
          <input
            type="text"
            name="apn"
            value={formData.apn}
            onChange={handleChange}
            placeholder="APN"
            className="input-field"
          />
          {errors.apn && <span className="error-text">{errors.apn}</span>}
        </div>
        <div className="form-group">
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            placeholder="Pincode"
            className="input-field"
          />
          {errors.pincode && <span className="error-text">{errors.pincode}</span>}
        </div>
        <div className="form-group">
          <input
            type="text"
            name="zoning"
            value={formData.zoning}
            onChange={handleChange}
            placeholder="Zoning"
            className="input-field"
          />
          {errors.zoning && <span className="error-text">{errors.zoning}</span>}
        </div>
        <div className="form-group">
          <input
            type="number"
            name="plot_area_sqft"
            value={formData.plot_area_sqft}
            onChange={handleChange}
            placeholder="Plot Area (sqft)"
            className="input-field"
          />
          {errors.plot_area_sqft && <span className="error-text">{errors.plot_area_sqft}</span>}
        </div>
        <div className="form-group">
          <input
            type="number"
            name="height_limit_ft"
            value={formData.height_limit_ft}
            onChange={handleChange}
            placeholder="Height Limit (ft)"
            className="input-field"
          />
          {errors.height_limit_ft && <span className="error-text">{errors.height_limit_ft}</span>}
        </div>
        <div className="form-group">
          <input
            type="number"
            name="depth_ft"
            value={formData.depth_ft}
            onChange={handleChange}
            placeholder="Depth (ft)"
            className="input-field"
          />
          {errors.depth_ft && <span className="error-text">{errors.depth_ft}</span>}
        </div>
        <div className="form-group">
          <input
            type="number"
            name="width_ft"
            value={formData.width_ft}
            onChange={handleChange}
            placeholder="Width (ft)"
            className="input-field"
          />
          {errors.width_ft && <span className="error-text">{errors.width_ft}</span>}
        </div>
        <div className="form-group">
          <input
            type="number"
            name="building_sqft" // Added field
            value={formData.building_sqft}
            onChange={handleChange}
            placeholder="Building Area (sqft)"
            className="input-field"
          />
          {errors.building_sqft && <span className="error-text">{errors.building_sqft}</span>}
        </div>
        <button type="button" onClick={handleSubmit} className="submit-button">Next</button>
      </form>
    </div>
  );
};

export default PropertiesForm;
