import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faArrowRight } from '@fortawesome/free-solid-svg-icons';

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
      fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), { property_id: localStorage.getItem('property_id') || '' }),
    ]);
    toast.info('New ADU entry added.');
  };

  const removeRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
    toast.warning('ADU entry removed.');
  };

  const sanitizeData = (data) =>
    data.map((row) =>
      Object.fromEntries(Object.entries(row).map(([key, value]) => [key, value === '' ? null : value]))
    );

  const handleNext = async () => {
    try {
      console.log("Submitting ADU details:", sanitizeData(rows));
      
      await axios.post(`${process.env.REACT_APP_NODE_API_URL}/api/adu-details`, {
        aduDetails: sanitizeData(rows),
      });

      toast.success('ADU details saved successfully!');

      // Navigate after showing toast message
      setTimeout(() => {
        navigate('/jadu-details');
      }, 2000);

    } catch (error) {
      console.error("API Error:", error);
      toast.error('Error saving ADU details. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-gray-50 shadow-xl rounded-xl">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">ADU Details</h2>
      {rows.map((row, index) => (
        <div key={index} className="bg-white border border-gray-300 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fields.map((field) => (
              <div key={field.name} className="flex flex-col">
                <label className="font-semibold mb-1 text-sm text-gray-700">
                  {field.label}
                </label>
                {field.type === 'select' ? (
                  <select
                    name={field.name}
                    value={row[field.name]}
                    onChange={(e) => handleInputChange(index, e)}
                    className="border border-gray-300 rounded p-2"
                  >
                    <option value="">Select {field.label}</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={row[field.name]}
                    onChange={(e) => handleInputChange(index, e)}
                    placeholder={field.label}
                    className="border border-gray-300 rounded p-2"
                    min={field.type === 'number' ? 0 : undefined}
                  />
                )}
              </div>
            ))}
          </div>
          {rows.length > 1 && (
            <button
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              onClick={() => removeRow(index)}
            >
              <FontAwesomeIcon icon={faTrash} /> Remove
            </button>
          )}
        </div>
      ))}
      <button
        className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 mr-4"
        onClick={addRow}
      >
        <FontAwesomeIcon icon={faPlus} /> Add Another
      </button>
      <button
        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        onClick={handleNext}
      >
        Next <FontAwesomeIcon icon={faArrowRight} />
      </button>
    </div>
  );
};

export default ADUDetailsForm;
