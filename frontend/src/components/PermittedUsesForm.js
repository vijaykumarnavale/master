import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ZoningDataForm.css';
import './Error.css';
import './PermittedUses.css';

const PermittedUsesForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    property_id: localStorage.getItem('property_id'),
    uses: [{
      zoning_type: '',
      use_type: '',
      lot_area_sqft: '',
      lot_width_ft: '',
      lot_depth_ft: '',
      setback_front_ft: '',
      setback_back_ft: '',
      setback_side_ft: '',
      max_height_ft: '',
      floor_area_ratio: '',
      density_units_per_lot: '',
      parking_spaces_required: '',
      open_space_sqft: ''
    }]
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedUses = [...formData.uses];
    updatedUses[index][name] = value;
    setFormData({ ...formData, uses: updatedUses });
  };

  const handleAddUse = () => {
    setFormData({
      ...formData,
      uses: [...formData.uses, {
        zoning_type: '',
        use_type: '',
        lot_area_sqft: '',
        lot_width_ft: '',
        lot_depth_ft: '',
        setback_front_ft: '',
        setback_back_ft: '',
        setback_side_ft: '',
        max_height_ft: '',
        floor_area_ratio: '',
        density_units_per_lot: '',
        parking_spaces_required: '',
        open_space_sqft: ''
      }]
    });
  };

  const handleRemoveUse = (index) => {
    const updatedUses = formData.uses.filter((_, i) => i !== index);
    setFormData({ ...formData, uses: updatedUses });
    toast.info('Use entry removed successfully.');
  };

  const validateForm = () => {
    const newErrors = {};
    formData.uses.forEach((use, index) => {
      if (!use.zoning_type) newErrors[`zoning_type_${index}`] = "Zoning type is required.";
      if (!use.use_type) newErrors[`use_type_${index}`] = "Use type is required.";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    axios.post('http://localhost:5000/api/permitted-uses', formData)
      .then(() => navigate('/adu-details'))
      .catch(error => console.error('Error submitting zoning details:', error));
  };

  const useTypeOptions = [
    'Townhouses',
    'Condominiums',
    'Affordable Housing',
    'Assisted Living',
    'Single-Family Residences',
    'Accessory Private Garages',
    'Unenclosed Parking',
    'Public Parks',
    'Detached Accessory Building',
    'Senior Citizen Accessory Units'
  ];

  return (
    <div className="form-container">
      <h2 className="form-title">Lot Zoning Details</h2>
      <form onSubmit={(e) => e.preventDefault()} className="property-form">
        {formData.uses.map((use, index) => (
          <div key={index} className="use-form-group">
            {Object.keys(use).map((field) => (
              <div className="form-group" key={field}>
                <label htmlFor={`${field}_${index}`} className="form-label">
                  {field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </label>
                {field === 'use_type' ? (
                  <select
                    id={`${field}_${index}`}
                    name={field}
                    value={use[field]}
                    onChange={(e) => handleChange(e, index)}
                    className="input-field"
                  >
                    <option value="" disabled>Select Use Type</option>
                    {useTypeOptions.map((option, idx) => (
                      <option key={idx} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.includes('sqft') || field.includes('ft') || field.includes('units') || field.includes('spaces') ? 'number' : 'text'}
                    id={`${field}_${index}`}
                    name={field}
                    value={use[field]}
                    onChange={(e) => handleChange(e, index)}
                    className="input-field"
                  />
                )}
                {errors[`${field}_${index}`] && (
                  <span className="error-text">{errors[`${field}_${index}`]}</span>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleRemoveUse(index)}
              className="remove-use-button"
            >
              Remove This Use
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddUse} className="add-use-button">
          Add Another Use
        </button>
        <button type="button" onClick={handleSubmit} className="submit-button">
          Next
        </button>
      </form>
    </div>
  );
};

export default PermittedUsesForm;
