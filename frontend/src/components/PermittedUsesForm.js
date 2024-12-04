import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ZoningDataForm.css';
import './Error.css';
import './PermittedUses.css';

const PermittedUsesForm = () => {
  const navigate = useNavigate();
  
  // Initializing an array of use types and additional notes
  const [formData, setFormData] = useState({
    property_id: localStorage.getItem('property_id'),
    uses: [{ use_type: '', max_height_ft: '', additional_notes: '' }]
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
      uses: [...formData.uses, { use_type: '', max_height_ft: '', additional_notes: '' }]
    });
  };

  const handleRemoveUse = (index) => {
    const updatedUses = formData.uses.filter((_, i) => i !== index);
    setFormData({ ...formData, uses: updatedUses });
  };

  const validateForm = () => {
    const newErrors = {};
    const { uses } = formData;

    uses.forEach((use, index) => {
      if (!use.use_type) newErrors[`use_type_${index}`] = 'Use Type is required.';
      if (!use.max_height_ft) newErrors[`max_height_ft_${index}`] = 'Max Height is required.';
      if (!use.additional_notes) newErrors[`additional_notes_${index}`] = 'Additional Notes are required.';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    axios.post('http://localhost:5000/api/permitted-uses', formData)
      .then((response) => {
        console.log(response.data);
        navigate('/adu-details');
      })
      .catch((error) => {
        console.error('Error submitting permitted uses data:', error);
      });
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Permitted Uses Details</h2>
      <form onSubmit={(e) => e.preventDefault()} className="property-form">
        {formData.uses.map((use, index) => (
          <div key={index} className="use-form-group">
            <div className="form-group">
              <select
                name="use_type"
                value={use.use_type}
                onChange={(e) => handleChange(e, index)}
                className="input-field"
              >
                <option value="" disabled>Select Use Type</option>
                <option value="Townhouses">Townhouses</option>
                <option value="Condominiums">Condominiums</option>
                <option value="Affordable Housing">Affordable Housing</option>
                <option value="Assisted Living">Assisted Living</option>
                <option value="Single-Family Residences">Single-Family Residences</option>
                <option value="Accessory Private Garages">Accessory Private Garages</option>
                <option value="Unenclosed Parking">Unenclosed Parking</option>
                <option value="Public Parks">Public Parks</option>
                <option value="Detached Accessory Building">Detached Accessory Building</option>
                <option value="Senior Citizen Accessory Units">Senior Citizen Accessory Units</option>
              </select>
              {errors[`use_type_${index}`] && <span className="error-text">{errors[`use_type_${index}`]}</span>}
            </div>
            <div className="form-group">
              <input
                type="number"
                name="max_height_ft"
                value={use.max_height_ft}
                onChange={(e) => handleChange(e, index)}
                placeholder="Max Height (ft)"
                className="input-field"
              />
              {errors[`max_height_ft_${index}`] && <span className="error-text">{errors[`max_height_ft_${index}`]}</span>}
            </div>
            <div className="form-group">
              <textarea
                name="additional_notes"
                value={use.additional_notes}
                onChange={(e) => handleChange(e, index)}
                placeholder="Additional Notes"
                className="textarea-field"
              />
              {errors[`additional_notes_${index}`] && <span className="error-text">{errors[`additional_notes_${index}`]}</span>}
            </div>
            <button type="button" onClick={() => handleRemoveUse(index)} className="remove-use-button">
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
