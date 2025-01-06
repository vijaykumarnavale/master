import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './PermittedUses.css'; // Update the CSS file name
import './Error.css';

// Utility function to format field names
const formatFieldName = (field) => {
  return field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
};

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
    
    const apiUrl = process.env.REACT_APP_NODE_API_URL; // Use the environment variable

    axios.post(`${apiUrl}/api/permitted-uses`, formData)
      .then(() => {
        toast.success('Permitted uses submitted successfully!');
        navigate('/adu-details');
      })
      .catch(error => {
        console.error('Error submitting zoning details:', error);
        toast.error('Failed to submit permitted uses.');
      });
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
    <div className="lot-form-container">
      <h2 className="lot-form-title">Permitted Uses Details</h2>
      <form onSubmit={(e) => e.preventDefault()} className="lot-property-form">
        {formData.uses.map((use, index) => (
          <div key={index} className="lot-use-form-group">
            <div className="lot-form-row">
              {Object.keys(use).map((field, i) => (
                <div className={`lot-form-group ${i % 2 === 0 ? 'half-width' : 'half-width-second'}`} key={field}>
                  <label htmlFor={`${field}_${index}`} className="lot-form-label">
                    {formatFieldName(field)}
                  </label>
                  {field === 'use_type' ? (
                    <select
                      id={`${field}_${index}`}
                      name={field}
                      value={use[field]}
                      onChange={(e) => handleChange(e, index)}
                      className="lot-input-field"
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
                      className="lot-input-field"
                      placeholder={formatFieldName(field)}
                    />
                  )}
                  {errors[`${field}_${index}`] && (
                    <span className="lot-error-text">{errors[`${field}_${index}`]}</span>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => handleRemoveUse(index)}
              className="lot-remove-use-button"
            >
              <i className="fa fa-trash" style={{ marginRight: '8px' }}></i>Remove This Use
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddUse} className="lot-add-use-button">
          <i className="fa fa-plus" style={{ marginRight: '8px' }}></i>Add Another Use
        </button>
        <button type="button" onClick={handleSubmit} className="lot-submit-button">
          <span>Next</span> <i className="fa fa-arrow-right" style={{ marginLeft: '8px' }}></i>
        </button>
      </form>
    </div>
  );
};

export default PermittedUsesForm;
