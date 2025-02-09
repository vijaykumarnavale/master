import { faCheck, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './JADUDetailsForm.css';

const JADUDetailsForm = () => {
  const [rows, setRows] = useState([
    {
      property_id: localStorage.getItem('property_id') || '',
      jadu_type: '',
      jadu_count: '',
      jadu_max_sqft: '',
      height: '',
      length: '',
      breadth: '',
      setbacks_front_back: '',
      side_yards: '',
      no_of_units: '',
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

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
        jadu_type: '',
        jadu_count: '',
        jadu_max_sqft: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const sanitizedRows = sanitizeData(rows);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_NODE_API_URL}/api/jadu-details`,
        { jaduDetails: sanitizedRows }
      );
      toast.success('Form submitted successfully!');
      console.log('API Response:', response.data);

      setRows([
        {
          property_id: localStorage.getItem('property_id') || '',
          jadu_type: '',
          jadu_count: '',
          jadu_max_sqft: '',
          height: '',
          length: '',
          breadth: '',
          setbacks_front_back: '',
          side_yards: '',
          no_of_units: '',
        },
      ]);

      setTimeout(() => {
        navigate('/user-dashboard');
      }, 3500);
    } catch (error) {
      toast.error('Error submitting the form. Please try again.');
      console.error('API Error:', error.response?.data || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields = [
    { name: 'jadu_type', type: 'select', options: ['Attached', 'Detached'], placeholder: 'Select JADU Type' },
    { name: 'jadu_count', type: 'number', placeholder: 'Number of JADUs' },
    { name: 'jadu_max_sqft', type: 'number', placeholder: 'Max JADU Size (sqft)' },
    { name: 'height', type: 'number', placeholder: 'Height (ft)' },
    { name: 'length', type: 'number', placeholder: 'Length (ft)' },
    { name: 'breadth', type: 'number', placeholder: 'Breadth (ft)' },
    { name: 'setbacks_front_back', type: 'number', placeholder: 'Setbacks (Front/Back)' },
    { name: 'side_yards', type: 'number', placeholder: 'Side Yards' },
    { name: 'no_of_units', type: 'number', placeholder: 'Number of Units' },
  ];

  return (
    <div className="jadu-form-container">
      <h2 className="jadu-form-title">JADU Details</h2>
      <form onSubmit={handleSubmit} className="jadu-property-form">
        {rows.map((row, index) => (
          <div key={index} className="jadu-row">
            <div className="jadu-form-group">
              {formFields.map((field) => (
                <div key={field.name} className="jadu-input-group">
                  <label htmlFor={`${field.name}_${index}`}>{field.placeholder}:</label>
                  {field.type === 'select' ? (
                    <select
                      id={`${field.name}_${index}`}
                      name={field.name}
                      value={row[field.name]}
                      onChange={(e) => handleInputChange(index, e)}
                      className="jadu-input-field"
                    >
                      <option value="">{field.placeholder}</option>
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
                      placeholder={field.placeholder}
                      className="jadu-input-field"
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
        <button type="submit" className="jadu-submit-button" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'} <FontAwesomeIcon icon={faCheck} />
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default JADUDetailsForm;
