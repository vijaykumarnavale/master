import { faCheck, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    setRows(rows.filter((_, i) => i !== index));
  };

  const sanitizeData = (data) =>
    data.map((row) =>
      Object.fromEntries(Object.entries(row).map(([key, value]) => [key, value === '' ? null : value]))
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_NODE_API_URL}/api/jadu-details`, {
        jaduDetails: sanitizeData(rows),
      });
      toast.success('Form submitted successfully!');
      console.log('API Response:', response.data);

      setTimeout(() => navigate('/user-dashboard'), 3500);
    } catch (error) {
      toast.error('Error submitting the form. Please try again.');
      console.error('API Error:', error.response?.data || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields = [
    { name: 'jadu_type', type: 'select', options: ['Attached', 'Detached'], placeholder: 'JADU Type' },
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
    <div className="max-w-4xl mx-auto my-8 p-6 bg-gray-50 rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">JADU Details</h2>
      <form onSubmit={handleSubmit}>
        {rows.map((row, index) => (
          <div key={index} className="bg-white border border-gray-300 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formFields.map((field) => (
                <div key={field.name}>
                  <label className="block font-semibold text-gray-700 text-sm mb-2">
                    {field.placeholder}
                  </label>
                  {field.type === 'select' ? (
                    <select
                      name={field.name}
                      value={row[field.name]}
                      onChange={(e) => handleInputChange(index, e)}
                      className="border border-gray-300 rounded p-2 w-full"
                    >
                      <option value="">{field.placeholder}</option>
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
                      placeholder={field.placeholder}
                      className="border border-gray-300 rounded p-2 w-full"
                      min={field.type === 'number' ? 0 : undefined}
                    />
                  )}
                </div>
              ))}
            </div>
            {rows.length > 1 && (
              <button
                type="button"
                className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                onClick={() => removeRow(index)}
              >
                <FontAwesomeIcon icon={faTrash} /> Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded mr-4"
          onClick={addRow}
        >
          <FontAwesomeIcon icon={faPlus} /> Add Another
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'} <FontAwesomeIcon icon={faCheck} />
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

export default JADUDetailsForm;