import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NewPropertiesForm.css';  
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
    building_sqft: '',
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
          localStorage.setItem('property_id', response.data.property_id);
          navigate('/setbacks');
        })
        .catch(error => {
          console.error('There was an error submitting the property data:', error);
        });
    }
  };

  return (
    <div className="new-form-container">
      <h2 className="new-form-title">Properties Details</h2>
      <form onSubmit={(e) => e.preventDefault()} className="new-property-form">
        <div className="new-form-row">
          <div className="new-form-group">
            <label htmlFor="address" className="new-form-label">Address <span className="red-asterisk">*</span></label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="new-input-field"
            />
            {errors.address && <span className="new-error-text">{errors.address}</span>}
          </div>

          <div className="new-form-group">
            <label htmlFor="apn" className="new-form-label">APN <span className="red-asterisk">*</span></label>
            <input
              type="text"
              id="apn"
              name="apn"
              value={formData.apn}
              onChange={handleChange}
              placeholder="APN"
              className="new-input-field"
            />
            {errors.apn && <span className="new-error-text">{errors.apn}</span>}
          </div>
        </div>

        <div className="new-form-row">
          <div className="new-form-group">
            <label htmlFor="pincode" className="new-form-label">Pincode <span className="red-asterisk">*</span></label>
            <input
              type="text"
              id="pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="Pincode"
              className="new-input-field"
            />
            {errors.pincode && <span className="new-error-text">{errors.pincode}</span>}
          </div>

          <div className="new-form-group">
            <label htmlFor="zoning" className="new-form-label">Zoning <span className="red-asterisk">*</span></label>
            <input
              type="text"
              id="zoning"
              name="zoning"
              value={formData.zoning}
              onChange={handleChange}
              placeholder="Zoning"
              className="new-input-field"
            />
            {errors.zoning && <span className="new-error-text">{errors.zoning}</span>}
          </div>
        </div>

        <div className="new-form-row">
          <div className="new-form-group">
            <label htmlFor="plot_area_sqft" className="new-form-label">Plot Area (sqft) <span className="red-asterisk">*</span></label>
            <input
              type="number"
              id="plot_area_sqft"
              name="plot_area_sqft"
              value={formData.plot_area_sqft}
              onChange={handleChange}
              placeholder="Plot Area (sqft)"
              className="new-input-field"
            />
            {errors.plot_area_sqft && <span className="new-error-text">{errors.plot_area_sqft}</span>}
          </div>

          <div className="new-form-group">
            <label htmlFor="height_limit_ft" className="new-form-label">Height Limit (ft) <span className="red-asterisk">*</span></label>
            <input
              type="number"
              id="height_limit_ft"
              name="height_limit_ft"
              value={formData.height_limit_ft}
              onChange={handleChange}
              placeholder="Height Limit (ft)"
              className="new-input-field"
            />
            {errors.height_limit_ft && <span className="new-error-text">{errors.height_limit_ft}</span>}
          </div>
        </div>

        <div className="new-form-row">
          <div className="new-form-group">
            <label htmlFor="depth_ft" className="new-form-label">Depth (ft) <span className="red-asterisk">*</span></label>
            <input
              type="number"
              id="depth_ft"
              name="depth_ft"
              value={formData.depth_ft}
              onChange={handleChange}
              placeholder="Depth (ft)"
              className="new-input-field"
            />
            {errors.depth_ft && <span className="new-error-text">{errors.depth_ft}</span>}
          </div>

          <div className="new-form-group">
            <label htmlFor="width_ft" className="new-form-label">Width (ft) <span className="red-asterisk">*</span></label>
            <input
              type="number"
              id="width_ft"
              name="width_ft"
              value={formData.width_ft}
              onChange={handleChange}
              placeholder="Width (ft)"
              className="new-input-field"
            />
            {errors.width_ft && <span className="new-error-text">{errors.width_ft}</span>}
          </div>
        </div>

        <div className="new-form-row">
          <div className="new-form-group">
            <label htmlFor="building_sqft" className="new-form-label">Building Area (sqft) <span className="red-asterisk">*</span></label>
            <input
              type="number"
              id="building_sqft"
              name="building_sqft"
              value={formData.building_sqft}
              onChange={handleChange}
              placeholder="Building Area (sqft)"
              className="new-input-field"
            />
            {errors.building_sqft && <span className="new-error-text">{errors.building_sqft}</span>}
          </div>
        </div>

        <button type="button" onClick={handleSubmit} className="new-submit-button">Next</button>
      </form>
    </div>
  );
};

export default PropertiesForm;
