import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './PermittedUses.css';
import './Error.css';

const formatFieldName = (field) => field.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const getInputType = (field) => 
  field.includes('sqft') || field.includes('ft') || field.includes('spaces') ? 'number' : 'text';

const PermittedUsesForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    property_id: localStorage.getItem('property_id'),
    uses: [
      {
        use_type: '',
        lot_area_sqft: '',
        lot_width_ft: '',
        lot_depth_ft: '',
        setback_front_ft: '',
        setback_back_ft: '',
        setback_side_ft: '',
        max_height_ft: '',
        parking_spaces_required: '',
      },
    ],
  });

  const validateForm = () => {
    let isValid = true;
    const validationErrors = [];

    if (!formData.property_id) {
      isValid = false;
      validationErrors.push('Property ID is missing.');
    }

    formData.uses.forEach((use, index) => {
      if (!use.use_type) {
        isValid = false;
        validationErrors.push(`Use type is missing for entry ${index + 1}.`);
      }
    });

    if (!isValid) {
      validationErrors.forEach((error) => toast.error(error));
    }

    return isValid;
  };

  const sanitizeData = (data) => {
    return data.map((use) => {
      const sanitizedUse = {};
      Object.keys(use).forEach((key) => {
        sanitizedUse[key] = use[key] === '' ? null : use[key];
      });
      return sanitizedUse;
    });
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedUses = [...formData.uses];
    updatedUses[index][name] = value;
    setFormData({ ...formData, uses: updatedUses });
  };

  const handleAddUse = () => {
    setFormData({
      ...formData,
      uses: [
        ...formData.uses,
        {
          use_type: '',
          lot_area_sqft: '',
          lot_width_ft: '',
          lot_depth_ft: '',
          setback_front_ft: '',
          setback_back_ft: '',
          setback_side_ft: '',
          max_height_ft: '',
          parking_spaces_required: '',
        },
      ],
    });
  };

  const handleRemoveUse = (index) => {
    const updatedUses = formData.uses.filter((_, i) => i !== index);
    setFormData({ ...formData, uses: updatedUses });
    toast.info('Use entry removed successfully.');
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const sanitizedUses = sanitizeData(formData.uses);
    const apiUrl = process.env.REACT_APP_NODE_API_URL;

    axios
      .post(`${apiUrl}/api/permitted-uses`, {
        property_id: formData.property_id,
        uses: sanitizedUses,
      })
      .then(() => {
        toast.success('Permitted uses submitted successfully!');
        navigate('/adu-details');
      })
      .catch((error) => {
        console.error('Error submitting permitted uses:', error);
        toast.error('Failed to submit permitted uses.');
      });
  };

  const useTypeOptions = [
    'Townhouse',
    'Condominiums',
    'One-Family Dwellings',
    'Senior Citizen Units',
    'Garages',
    'Unenclosed Parking',
    'Accessory Buildings',
    'Group Homes',
    'Greenhouses/Gardens',
    'Transitional Uses',
    'Public Parks',
    'Same as R-1 Zone',
    'Single-Family Homes',
    'Multi-Family Housing',
    'Religious Facilities',
    'Transitional Uses (Specific Conditions Apply)',
    'Uses from R-1 and R-2 Zones',
    'Multiple-Unit Dwellings',
    'Boarding or Lodging Houses',
    'Daycare or Nursery Schools',
    'Small Group Homes',
    'Large Group Homes or Orphanages',
    'Older Convalescent Homes',
    'Parking Spaces',
    'Adult Schools',
    'Private Schools',
    'Uses from Other Zones',
    'Multiple Unit Dwellings',
    'Nursery Schools',
    'Group Homes & Care Facilities',
    'Convalescent Homes',
    'Parking Rules',
    'Parking Space',
    'Retail Stores',
    'Financial Institutions',
    'Offices',
    'Restaurants',
    'Entertainment',
    'Liquor Sales',
    'Service Shops',
    'Hotels',
    'Educational Uses',
    'Unique Uses',
    'Parking',
    'Retail Sales (Enclosed Buildings)',
    'Professional Services',
    'Beauty Services',
    'Other Businesses',
    'Car-Related Services',
    'Prohibited or Limited Businesses',
    'Outdoor or Non-Enclosed Uses',
    'Uses Allowed in C-2 Zone',
    'Retail & Wholesale Sales',
    'Automobile Sales & Servicing',
    'Car Rental & Leasing',
    'Frozen Food Facilities',
    'Hotels/Motels',
    'Plant Nurseries',
    'Pawn Shops',
    'Veterinary Offices',
    'Auction Houses',
    'Trade Schools',
    'Light Manufacturing',
    'Storage Yards',
    'Accessory Uses',
    'Mortuaries',
    'Self-Storage Facilities',
    'Commercial Uses',
    'Manufacturing',
    'Specific Facilities',
    'Housing',
    'Other Uses',
    'All Uses Permitted in M-1 Zone',
    'Industrial and Heavy Manufacturing Activities'
  ];
  

  return (
    <div className="lot-form-container">
      <h2 className="lot-form-title">Permitted Uses Details</h2>
      <form onSubmit={(e) => e.preventDefault()} className="lot-property-form">
        {formData.uses.map((use, index) => (
          <div key={index} className="lot-use-form-group">
            <div className="lot-form-row">
              {Object.keys(use).map((field) => (
                <div
                  className={`lot-form-group ${field === 'use_type' ? 'full-width' : 'half-width'}`}
                  key={field}
                >
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
                      <option value="" disabled>
                        Select Use Type
                      </option>
                      {useTypeOptions.map((option, idx) => (
                        <option key={idx} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={getInputType(field)}
                      id={`${field}_${index}`}
                      name={field}
                      value={use[field]}
                      onChange={(e) => handleChange(e, index)}
                      className="lot-input-field"
                      placeholder={formatFieldName(field)}
                    />
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
