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
        sanitizedRow[key] = row[key] === '' ? null : row[key]; // Replace empty strings with null
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
      navigate('/jadu-details'); // Navigate to jadu-details page
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
              <select
                name="adu_type"
                value={row.adu_type}
                onChange={(e) => handleInputChange(index, e)}
                className="adu-input-field"
              >
                <option value="">Select ADU Type</option>
                <option value="Attached">Attached</option>
                <option value="Detached">Detached</option>
              </select>
              <input
                type="number"
                name="adu_count"
                value={row.adu_count}
                onChange={(e) => handleInputChange(index, e)}
                placeholder="Number of ADUs"
                className="adu-input-field"
              />
              <input
                type="number"
                name="adu_max_sqft"
                value={row.adu_max_sqft}
                onChange={(e) => handleInputChange(index, e)}
                placeholder="Max ADU Size (sqft)"
                className="adu-input-field"
              />
              <input
                type="number"
                name="height"
                value={row.height}
                onChange={(e) => handleInputChange(index, e)}
                placeholder="Height (ft)"
                className="adu-input-field"
              />
              <input
                type="number"
                name="length"
                value={row.length}
                onChange={(e) => handleInputChange(index, e)}
                placeholder="Length (ft)"
                className="adu-input-field"
              />
              <input
                type="number"
                name="breadth"
                value={row.breadth}
                onChange={(e) => handleInputChange(index, e)}
                placeholder="Breadth (ft)"
                className="adu-input-field"
              />
              <input
                type="number"
                name="setbacks_front_back"
                value={row.setbacks_front_back}
                onChange={(e) => handleInputChange(index, e)}
                placeholder="Setbacks (Front/Back)"
                className="adu-input-field"
              />
              <input
                type="number"
                name="side_yards"
                value={row.side_yards}
                onChange={(e) => handleInputChange(index, e)}
                placeholder="Side Yards"
                className="adu-input-field"
              />
              <input
                type="number"
                name="no_of_units"
                value={row.no_of_units}
                onChange={(e) => handleInputChange(index, e)}
                placeholder="Number of Units"
                className="adu-input-field"
              />
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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default ADUDetailsForm;
