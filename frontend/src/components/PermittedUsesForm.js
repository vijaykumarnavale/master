import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ZoningDataForm.css';
import './Error.css';

const PermittedUsesForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    property_id: localStorage.getItem('property_id'),
    use_type: '',
    max_height_ft: '',
    additional_notes: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.use_type) newErrors.use_type = 'Use Type is required.';
    if (!formData.max_height_ft) newErrors.max_height_ft = 'Max Height is required.';
    if (!formData.additional_notes) newErrors.additional_notes = 'Additional Notes are required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    axios.post('http://localhost:5000/api/permitted-uses', formData)
      .then(response => {
        console.log(response.data);
        navigate('/adu-details');
      })
      .catch(error => {
        console.error('Error submitting permitted uses data:', error);
      });
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Permitted Uses Details</h2>
      <form onSubmit={(e) => e.preventDefault()} className="property-form">
        <div className="form-group">
          <input 
            type="text" 
            name="use_type" 
            value={formData.use_type} 
            onChange={handleChange} 
            placeholder="Use Type" 
            className="input-field"
          />
          {errors.use_type && <span className="error-text">{errors.use_type}</span>}
        </div>
        <div className="form-group">
          <input 
            type="number" 
            name="max_height_ft" 
            value={formData.max_height_ft} 
            onChange={handleChange} 
            placeholder="Max Height (ft)" 
            className="input-field"
          />
          {errors.max_height_ft && <span className="error-text">{errors.max_height_ft}</span>}
        </div>
        <div className="form-group">
          <textarea 
            name="additional_notes" 
            value={formData.additional_notes} 
            onChange={handleChange} 
            placeholder="Additional Notes" 
            className="textarea-field"
          />
          {errors.additional_notes && <span className="error-text">{errors.additional_notes}</span>}
        </div>
        <button type="button" onClick={handleSubmit} className="submit-button">
          Next
        </button>
      </form>
    </div>
  );
};

export default PermittedUsesForm;
