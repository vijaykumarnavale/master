import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import './ADUDetailsForm.css';

const ADUDetailsForm = () => {
  const [rows, setRows] = useState([
    {
      property_id: localStorage.getItem('property_id') || '',
      adu_type: '',
      adu_count: '',
      adu_max_sqft: '',
      height: '',
      length: '',
      breadth: '',
      setbacks_front_back: '',
      side_yards: '',
      no_of_units: '',
    },
  ]);

  const navigate = useNavigate();

  const fields = [
    { name: 'adu_type', label: 'ADU Type', type: 'select', options: ['Attached', 'Detached'] },
    { name: 'adu_count', label: 'Number of ADUs', type: 'number' },
    { name: 'adu_max_sqft', label: 'Max ADU Size (sqft)', type: 'number' },
    { name: 'height', label: 'Height (ft)', type: 'number' },
    { name: 'length', label: 'Length (ft)', type: 'number' },
    { name: 'breadth', label: 'Breadth (ft)', type: 'number' },
    { name: 'setbacks_front_back', label: 'Setbacks (Front/Back)', type: 'number' },
    { name: 'side_yards', label: 'Side Yards', type: 'number' },
    { name: 'no_of_units', label: 'Number of Units', type: 'number' },
  ];

  const handleInputChange = (index, e) => {
    const updatedRows = [...rows];
    updatedRows[index][e.target.name] = e.target.value;
    setRows(updatedRows);
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        property_id: localStorage.getItem('property_id') || '',
        adu_type: '',
        adu_count: '',
        adu_max_sqft: '',
        height: '',
        length: '',
        breadth: '',
        setbacks_front_back: '',
        side_yards: '',
        no_of_units: '',
      },
    ]);
  };

  const removeRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const sanitizeData = (data) => {
    return data.map((row) => {
      const sanitizedRow = {};
      Object.keys(row).forEach((key) => {
        sanitizedRow[key] = row[key] === '' ? null : row[key];
      });
      return sanitizedRow;
    });
  };

  const handleNext = async () => {
    const sanitizedRows = sanitizeData(rows);

    try {
      await axios.post(
        `${process.env.REACT_APP_NODE_API_URL}/api/adu-details`,
        { aduDetails: sanitizedRows }
      );
      toast.success('Details saved successfully!');
      navigate('/jadu-details');
    } catch (error) {
      toast.error('Error saving the details. Please try again.');
      console.error('API Error:', error);
    }
  };

  return (
    <div className="adu-form-container">
      <h2 className="adu-form-title">ADU Details</h2>
      <form className="adu-property-form">
        {rows.map((row, index) => (
          <div key={index} className="adu-row">
            <div className="adu-form-group">
              {fields.map((field) => (
                <div key={field.name} className="adu-input-group">
                  <label htmlFor={`${field.name}_${index}`}>{field.label}:</label>
                  {field.type === 'select' ? (
                    <select
                      id={`${field.name}_${index}`}
                      name={field.name}
                      value={row[field.name]}
                      onChange={(e) => handleInputChange(index, e)}
                      className="adu-input-field"
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={`${field.name}_${index}`}
                      type={field.type}
                      name={field.name}
                      value={row[field.name]}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder={field.label}
                      className="adu-input-field"
                      min={field.type === 'number' ? 0 : undefined}
                    />
                  )}
                </div>
              ))}
              {rows.length > 1 && (
                <button
                  type="button"
                  className="remove-row-button"
                  onClick={() => removeRow(index)}
                >
                  <FontAwesomeIcon icon={faTrash} /> Remove
                </button>
              )}
            </div>
          </div>
        ))}
        <button type="button" className="add-row-button" onClick={addRow}>
          <FontAwesomeIcon icon={faPlus} /> Add Another
        </button>
        <button
          type="button"
          className="adu-next-button"
          onClick={handleNext}
        >
          Next <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default ADUDetailsForm;
